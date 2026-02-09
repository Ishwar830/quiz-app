import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.ts";
import * as RoomController from "../controllers/roomController.ts";

export const roomRouter = Router();

roomRouter.use(authMiddleware);

roomRouter.post("/", RoomController.createRoomHandler);
roomRouter.post("/join/:roomId", RoomController.joinRoomHandler);
roomRouter.get("/:roomId", RoomController.getRoomHandler);
roomRouter.post("/ai", RoomController.createAIRoomHandler);
