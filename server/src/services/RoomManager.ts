import redisClient from "../lib/redis.ts";
import { GameStateManager } from "./GameStateManager.ts";
import { MemberManager } from "./MemberManager.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import type { Room, QuizMeta, RoomMember } from "./types.d.ts";

const createRoom = async (host: RoomMember, quizMeta: QuizMeta) => {
  const room: Room = {
    id: generateRoomCode(),
    host,
    quizMeta,
  };

  const key = KeyManager.room(room.id);
  await redisClient.json.set(key, "$", room as any);
  await joinRoom(room.id, host);
  await GameStateManager.initializeGameState(room);
  const generatedRoom = await getRoomInfo(room.id);
  return generatedRoom;
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
