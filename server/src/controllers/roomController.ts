import { RequestHandler } from "express";
import { RoomManager } from "../services/room/RoomManager.ts";
import { QuizRepository } from "../services/db_queries/QuizRepository.ts";
import { ApiResponse } from "../lib/utils.ts";
import type { RoomMember } from "../services/types.d.ts";
import { GameStateManager } from "../services/game/GameStateManager.ts";
import { SubmissionManager } from "../services/game/SubmissionManager.ts";
import { MemberManager } from "../services/room/MemberManager.ts";
import getAIGeneratedQuiz from "../services/quiz/genAI.ts";
import z from "zod";

export const createRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;
  const quizId = req.query.quizId as string;
  const host: RoomMember = {
    id: user.id,
    name: user.name,
    role: "SPECTATOR",
  };

  const quiz = await QuizRepository.getUserQuizById(user.id, quizId);

  if (!quiz) {
    return res.status(404).json(
      ApiResponse.error({
        code: "NOT FOUND",
        message: `Quiz with id: ${quizId} doesn't exist`,
      }),
    );
  }

  const room = await RoomManager.createRoom(host, quiz);

  res.json(ApiResponse.success(room));
};

export const joinRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;
  const roomId = req.params.roomId as string;
  const role = req.query.role as string;

  const parsedRoleResult = z.safeParse(z.enum(["PLAYER", "SPECTATOR"]), role);

  if (parsedRoleResult.error) {
    return res.status(400).json(
      ApiResponse.error({
        code: "VALIDATION ERROR",
        message: "Invalid Role. Valid Roles are 'PLAYER' and 'SPECTATOR'",
      }),
    );
  }

  const member: RoomMember = {
    id: user.id,
    name: user.name,
    role: parsedRoleResult.data,
  };

  const memberInfo = await RoomManager.joinRoom(roomId, member);
  return res.json(ApiResponse.success(memberInfo));
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

  return res.json(ApiResponse.success(resData));
};

export const createAIRoomHandler: RequestHandler = async (req, res) => {
  const user = req.user!;

  const payloadSchema = z.object({
    role: z.enum(["PLAYER", "SPECTATOR"]),
    topics: z.array(z.string().trim().min(1)).min(1),
    questionCount: z.coerce.number().int().min(5).max(20),
    timeLimitSeconds: z.coerce.number().int().min(10).max(60),
  });

  const parsedPayloadResult = z.safeParse(payloadSchema, req.body);

  if (parsedPayloadResult.error) {
    return res.status(400).json(
      ApiResponse.error({
        code: "VALIDATION ERROR",
        message: "Invalid form data",
        details: z.flattenError(parsedPayloadResult.error),
      }),
    );
  }

  const { role, topics, timeLimitSeconds, questionCount } =
    parsedPayloadResult.data;

  const host = {
    id: user.id,
    name: user.name,
    role,
  };

  const quiz = await getAIGeneratedQuiz(
    topics,
    questionCount,
    timeLimitSeconds,
  );

  const room = await RoomManager.createRoom(host, quiz);
  res.json(ApiResponse.success(room));
};
