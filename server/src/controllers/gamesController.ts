import { GameRepository } from "../services/db_queries/GameRepository.ts";
import { RequestHandler } from "express";
import z from "zod";

const getUserGames: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;

  const games = await GameRepository.getGamesByUserId(userId);
  return res.json(games);
};

const getGameDetails: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const gameId = req.params.gameId as string;
  const gameDetails = await GameRepository.getGameDetailsForUser(
    gameId,
    userId,
  );
  return res.json(gameDetails);
};

const getGameLeaderboard: RequestHandler = async (req, res, next) => {
  const gameId = req.params.gameId as string;
  const _page = req.query.page as string;

  try {
    const page = z.parse(z.coerce.number().int().min(1), _page);
    const leaderboard = await GameRepository.getGameRankings(gameId, page);
    return res.json(leaderboard);
  } catch (err) {
    next(err);
  }
};

export const GamesController = {
  getUserGames,
  getGameDetails,
  getGameLeaderboard,
} as const;
