import redisClient from "../lib/redis.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import { RoomManager } from "./RoomManager.ts";
import { SubmissionManager } from "./SubmissionManager.ts";
import type { RoomMember } from "./types.d.ts";

const addMember = async (roomId: string, member: RoomMember) => {
  const room = await RoomManager.getRoomInfo(roomId);

  const memberKey = KeyManager.member(room.id, member.id);

  const memberExists = await redisClient.exists(memberKey);

  if (memberExists) {
    const memberInfo = await getMemberInfo(roomId, member.id);
    return memberInfo as RoomMember;
  }

  if (member.role == "PLAYER") member.score = 0;

  await redisClient.hSet(memberKey, member as any);
  await cacheMemberName(roomId, member);
  return member;
};

const getMemberInfo = async (roomId: string, userId: string) => {
  const member = (await redisClient.hGetAll(
    KeyManager.member(roomId, userId),
  )) as unknown as RoomMember | null;
  const score = await SubmissionManager.getMemberScore(roomId, userId);
  if (member) return { ...member, score };
  return member;
};

const incrementMemberScoreBy = async (
  roomId: string,
  userId: string,
  score: number,
) => {
  return await redisClient.hIncrBy(
    KeyManager.member(roomId, userId),
    "score",
    score,
  );
};

const cacheMemberName = async (roomId: string, member: RoomMember) => {
  const cacheKey = KeyManager.memberNames(roomId);
  await redisClient.hSet(cacheKey, member.id, member.name);
};

const getMemberNames = async (roomId: string, userIds: Array<string>) => {
  const names = await redisClient.hmGet(KeyManager.memberNames(roomId), userIds);
  return names;
}

export const MemberManager = {
  addMember,
  getMemberInfo,
  incrementMemberScoreBy,
  getMemberNames
} as const;
