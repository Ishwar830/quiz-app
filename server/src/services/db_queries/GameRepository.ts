import { nanoid } from "nanoid";
import { db } from "../../db/index.ts";
import {
  games,
  gameSubmissions,
  gameParticipants,
  gameQuestions,
} from "../../db/schema/game.ts";
import { GameDataPayload } from "../types.js";
import { count, eq } from "drizzle-orm";

const saveGame = async (gameData: GameDataPayload) => {
  return await db.transaction(async (tx) => {
    const gameId = nanoid();
    const { questions, rankings, submissions, ...gameMeta } = gameData;

    await tx.insert(games).values({
      id: gameId,
      ...gameMeta,
    });

    if (questions.length) {
      await tx
        .insert(gameQuestions)
        .values(questions.map((gq) => ({ ...gq, gameId })));
    }

    const tasks = [];

    if (submissions.length) {
      tasks.push(
        tx.insert(gameSubmissions).values(
          submissions.map((gs) => ({
            ...gs,
            gameId,
          })),
        ),
      );
    }

    if (rankings.length) {
      tasks.push(
        tx
          .insert(gameParticipants)
          .values(rankings.map((gr) => ({ ...gr, gameId }))),
      );
    }

    await Promise.all(tasks);

    return gameId;
  });
};

const getGamesByHostId = async (hostId: string) => {
  const res = await db.query.games.findMany({
    where: eq(games.hostId, hostId),
    orderBy: (games, { desc }) => desc(games.createdAt),
    with: {
      participants: {
        columns: { id: true },
      },
      submissions: {
        columns: { id: true },
      },
    },
  });

  return res.map((game) => ({
    ...game,
    submissionCount: game.submissions.length,
    participantCount: game.participants.length,
    submissions: undefined,
    participants: undefined,
  }));
};

const getGamesByUserId = async (userId: string) => {
  const res = await db.query.gameParticipants.findMany({
    where: eq(gameParticipants.userId, userId),
    with: {
      game: true,
    },
  });

  const userGames = res.map((t) => ({
    ...t.game,
    rank: t.rank,
    score: t.score,
    hostId: undefined,
  }));

  return userGames;
};

const getFullGameDetails = async (gameId: string) => {
  return await db.query.games.findFirst({
    where: eq(games.id, gameId),
    with: {
      questions: {
        orderBy: (questions, { asc }) => asc(questions.order),
        with: {
          submissions: true,
        },
      },
      participants: {
        orderBy: (participants, { asc }) => asc(participants.rank),
      },
    },
  });
};

const getGameRankings = async (gameId: string, page: number = 1) => {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const dataPromise = db.query.gameParticipants.findMany({
    where: eq(gameParticipants.gameId, gameId),
    orderBy: (gameParticipants, { asc }) => asc(gameParticipants.rank),
    limit: pageSize,
    offset: offset,
    columns: {
      userId: false,
    },
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });

  const countPromise = db
    .select({ value: count() })
    .from(gameParticipants)
    .where(eq(gameParticipants.gameId, gameId));

  const [rankings, totalRes] = await Promise.all([dataPromise, countPromise]);

  const totalCount = totalRes[0]?.value ?? 0;

  return {
    items: rankings.map((r) => ({ ...r, name: r.user.name, user: undefined })),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

const getGameDetailsForUser = async (gameId: string, userId: string) => {
  const gameData = await db.query.games.findFirst({
    where: eq(games.id, gameId),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.order)],
      },
      submissions: {
        where: (submissions, { eq }) => eq(submissions.userId, userId),
      },
      participants: {
        where: (participants, { eq }) => eq(participants.userId, userId),
      },
    },
  });

  if (!gameData) return null;

  return {
    ...gameData,
    userRankInfo: gameData.participants[0] || null,
    participants: undefined,
  };
};

export const GameRepository = {
  saveGame,
  getGameDetailsForUser,
  getGamesByHostId,
  getGamesByUserId,
  getGameRankings,
  getFullGameDetails,
};
