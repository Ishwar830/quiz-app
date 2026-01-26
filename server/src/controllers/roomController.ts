import { RequestHandler } from "express";
import { RoomManager } from "../services/RoomManager.ts";
import * as DBQueryHandler from "../services/DBQueryManager.ts";
import { ApiResponse } from "../lib/utils.ts";
import { QuizManager } from "../services/QuizManager.ts";
import type { RoomMember } from "../services/types.d.ts";
import { GameStateManager } from "../services/GameStateManager.ts";
import { SubmissionManager } from "../services/SubmissionManager.ts";
import { MemberManager } from "../services/MemberManager.ts";

export const createRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;
  const quizId = req.query.quizId as string;
  const host: RoomMember = {
    id: user.id,
    name: user.name,
    role: "SPECTATOR",
  };

  const quiz = await DBQueryHandler.getQuizById(quizId);

  if (!quiz) {
    return res.status(400).json(ApiResponse.error("Quiz doesnt exist"));
  }

  await QuizManager.storeQuiz(quiz);
  const quizMeta = await QuizManager.getQuizMeta(quiz.id);

  const room = await RoomManager.createRoom(host, quizMeta!);

  res.json(ApiResponse.success(room));
};

export const joinRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;
  const roomId = req.params.roomId as string;
  const role = req.query.role as "PLAYER" | "SPECTATOR";

  const member: RoomMember = {
    id: user.id,
    name: user.name,
    role,
  };

  try {
    const memberInfo = await RoomManager.joinRoom(roomId, member);
    return res.json(ApiResponse.success(memberInfo));
  } catch (err) {
    return res.status(400).json(ApiResponse.error((err as Error).message));
  }
};

export const getRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;
  const roomId = req.params.roomId as string;
  const gameState = await GameStateManager.getGameState(roomId);
  const userSubmissions = await SubmissionManager.getUserSubmissions(
    roomId,
    user.id,
  );
  const memberInfo = await MemberManager.getMemberInfo(roomId, user.id);

  const resData = {
    gameState,
    memberState: {
      member: memberInfo,
      submissions: userSubmissions,
    },
  };

  return res.json(
    ApiResponse.success(resData),
  );
};
