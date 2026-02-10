import redisClient from "../../lib/redis.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import { RoomManager } from "../room/RoomManager.ts";
import { ScoreManager } from "../game/ScoreManager.ts";
import type { RoomMember } from "../types.js";

const addMember = async (roomId: string, member: RoomMember) => {
  const room = await RoomManager.getRoomInfo(roomId);

  const memberKey = KeyManager.member(room.id, member.id);

  const memberExists = await redisClient.exists(memberKey);

  if (memberExists) {
    const memberInfo = await getMemberInfo(roomId, member.id);
    return memberInfo as RoomMember;
  }

  if (member.role == "PLAYER") {
    await Promise.all([
      ScoreManager.updateLeaderboard(roomId, member.id, 0),
      updateRoomPlayerList(roomId, member.id),
    ]);
  }

  await redisClient.hSet(memberKey, member as any);
  await cacheMemberName(roomId, member);
  return member;
};

const getMemberInfo = async (roomId: string, userId: string) => {
  const member = (await redisClient.hGetAll(
    KeyManager.member(roomId, userId),
  )) as unknown as RoomMember | null;
  const score = await ScoreManager.getMemberScore(roomId, userId);
  if (member) return { ...member, score };
  return member;
};

const cacheMemberName = async (roomId: string, member: RoomMember) => {
  const cacheKey = KeyManager.memberNames(roomId);
  await redisClient.hSet(cacheKey, member.id, member.name);
};

const getMemberNamesWithIds = async (
  roomId: string,
  userIds: Array<string>,
) => {
  const names = await redisClient.hmGet(
    KeyManager.memberNames(roomId),
    userIds,
  );
  return names;
};

const updateRoomPlayerList = async (roomId: string, userId: string) => {
  await redisClient.sAdd(KeyManager.players(roomId), userId);
};

const getRoomPlayerList = async (roomId: string) => {
  return await redisClient.sMembers(KeyManager.players(roomId));
};

export const MemberManager = {
  addMember,
  getMemberInfo,
  getMemberNamesWithIds,
  getRoomPlayerList,
} as const;
