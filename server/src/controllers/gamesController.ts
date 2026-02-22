import { GameRepository } from "../services/db_queries/GameRepository.ts";
import { RequestHandler } from "express";
import z from "zod";
import { ApiResponse } from "../lib/utils.ts";

const getUserGames: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const games = await GameRepository.getGamesByUserId(userId);
  return res.json(ApiResponse.success(games));
};

const getGameDetails: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const gameId = req.params.gameId as string;
  const gameDetails = await GameRepository.getGameDetailsForUser(
    gameId,
    userId,
  );
  return res.json(ApiResponse.success(gameDetails));
};

const getGameLeaderboard: RequestHandler = async (req, res) => {
  const gameId = req.params.gameId as string;
  const page = req.query.page as string;

  const parsedPageResult = z.safeParse(z.coerce.number().int().min(1), page);

  if (parsedPageResult.success) {
    const leaderboard = await GameRepository.getGameRankings(
      gameId,
      parsedPageResult.data,
    );
    return res.json(ApiResponse.success(leaderboard));
  } else {
    return res.status(400).json(
      ApiResponse.error({
        code: "VALIDATION ERROR",
        message: "Invalid page number",
      }),
    );
  }
};

export const GamesController = {
  getUserGames,
  getGameDetails,
  getGameLeaderboard,
} as const;
