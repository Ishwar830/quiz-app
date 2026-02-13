import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.ts";
import { GamesController } from "../controllers/gamesController.ts";

export const gamesRouter = Router();

gamesRouter.use(authMiddleware);

gamesRouter.get("/", GamesController.getUserGames);
gamesRouter.get("/:gameId", GamesController.getGameDetails);
gamesRouter.get("/:gameId/rankings", GamesController.getGameLeaderboard);
