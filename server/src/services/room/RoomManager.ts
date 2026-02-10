import redisClient from "../../lib/redis.ts";
import { GameStateManager } from "../game/GameStateManager.ts";
import { MemberManager } from "../room/MemberManager.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import type { Room, RoomMember, Quiz } from "../types.d.ts";
import { QuestionManager } from "../game/QuestionManager.ts";

const createRoom = async (host: RoomMember, quiz: Quiz) => {
  const { questions, ...restQuizInfo } = quiz;

  const room: Room = {
    id: generateRoomCode(),
    host,
    quizMeta: {
      ...restQuizInfo,
      totalQuestions: questions.length,
    },
  };

  await Promise.all([
    saveRoom(room),
    joinRoom(room.id, host),
    GameStateManager.initializeGameState(room),
    QuestionManager.initializeQuestionList(room.id, quiz.questions),
  ]);

  const generatedRoom = await getRoomInfo(room.id);
  return generatedRoom;
};

const saveRoom = async (room: Room) => {
  return await redisClient.json.set(KeyManager.room(room.id), "$", room as any);
};

const joinRoom = async (roomId: string, member: RoomMember) => {
  return await MemberManager.addMember(roomId, member);
};

const getRoomInfo = async (roomId: string): Promise<Room> => {
  const room = (await redisClient.json.get(
    KeyManager.room(roomId),
  )) as unknown as Room | null;

  if (!room) throw new Error("Room doesn't exist");

  return room;
};

const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const RoomManager = {
  createRoom,
  joinRoom,
  getRoomInfo,
} as const;
