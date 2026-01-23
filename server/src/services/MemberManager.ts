import redisClient from "../lib/redis.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import { RoomManager } from "./RoomManager.ts";
import type { RoomMember } from "./types.d.ts";

const addMember = async (roomId: string, member: RoomMember) => {
  const room = await RoomManager.getRoomInfo(roomId);

  const memberKey = KeyManager.member(room.id, member.id);

  const memberExists = await redisClient.exists(memberKey);

  if (memberExists) {
    const memberInfo = await getMemberInfo(roomId, member.id);
    return memberInfo as RoomMember;
  }

  await redisClient.json.set(memberKey, '$', member as any);
  
  return member;
};

const getMemberInfo = async (roomId: string, userId: string) => {
  const member = await redisClient.json.get(KeyManager.member(roomId, userId));
  return member as unknown as RoomMember | null;
};

export const MemberManager = {
  addMember,
  getMemberInfo,
} as const;
