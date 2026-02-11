import { GameRepository } from "../services/db_queries/GameRepository.ts";
import { RequestHandler } from "express";

const getUserGames: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;

  const games = await GameRepository.getGamesByUserId(userId);
  return res.json(games);
};

const getGameDetails: RequestHandler = async (req, res) => {
    const {id: userId} = req.user!;
    const gameId = req.params.gameId as string;
    const gameDetails = await GameRepository.getGameDetailsForUser(gameId, userId);
    return res.json(gameDetails)
}

export const GamesController = {
  getUserGames,
  getGameDetails
} as const;
