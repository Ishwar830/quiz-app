import { nanoid } from "nanoid";
import { db } from "../../db/index.ts";
import {
  games,
  gameSubmissions,
  gameParticipants,
  gameQuestions,
} from "../../db/schema/game.ts";
import { GameDataPayload } from "../types.js";
import { and, eq } from "drizzle-orm";

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

const getGameById = async (gameId: string) => {
  return await db.query.games.findFirst({ where: eq(games.id, gameId) });
};

const getGamesByHostId = async (hostId: string) => {
  return await db.query.games.findMany({
    where: eq(games.hostId, hostId),
  });
};

const getGamesByUserId = async (userId: string) => {
  const userGames = await db.query.gameParticipants.findMany({
    where: eq(gameParticipants.id, userId),
    with: {
      game: true,
    },
  });

  return userGames;
};

const getUserGameSubmissions = async (userId: string, gameId: string) => {
  return await db.query.gameSubmissions.findMany({
    where: and(eq(games.id, gameId), eq(gameSubmissions.userId, userId)),
  });
};

const getGameQuestions = async (gameId: string) => {
  return await db.query.gameQuestions.findMany({
    where: eq(gameQuestions.gameId, gameId),
  });
};

const getGameRankings = async (gameId: string) => {
  return await db.query.gameParticipants.findMany({
    where: eq(gameParticipants.gameId, gameId),
    orderBy: gameParticipants.rank,
  });
};

export const GameRepository = {
  saveGame,
  getGameById,
  getGamesByHostId,
  getGamesByUserId,
  getGameQuestions,
  getUserGameSubmissions,
  getGameRankings,
};
