import { nanoid } from "nanoid";
import { db } from "../../db/index.ts";
import {
  games,
  gameSubmissions,
  gameParticipants,
  gameQuestions,
  gameRankings,
} from "../../db/schema/game.ts";
import { GameDataPayload } from "../types.js";
import { and, eq } from "drizzle-orm";

const saveGame = async (gameData: GameDataPayload) => {
  return await db.transaction(async (tx) => {
    const gameId = nanoid();
    const {
      hostId,
      quizTitle,
      quizDescription,
      quizTopics,
      createdAt,
      startedAt,
      endedAt,
    } = gameData;

    const saveGameMeta = tx.insert(games).values({
      id: gameId,
      hostId,
      quizTitle,
      quizDescription,
      quizTopics,
      createdAt,
      startedAt,
      endedAt,
    });

    const saveGameSubmissions = tx.insert(gameSubmissions).values(
      gameData.gameSubmissions.map((gs) => ({
        ...gs,
        gameId,
      })),
    );

    const saveGameQuestions = tx
      .insert(gameQuestions)
      .values(gameData.gameQuestions.map((gq) => ({ ...gq, gameId })));

    const saveGameRankings = tx
      .insert(gameRankings)
      .values(gameData.gameRankings.map((gr) => ({ ...gr, gameId })));

    await Promise.all([
      saveGameMeta,
      saveGameQuestions,
      saveGameSubmissions,
      saveGameRankings,
    ]);

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
  return await db.query.gameRankings.findMany({
    where: eq(gameRankings.gameId, gameId),
    orderBy: gameRankings.rank,
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
