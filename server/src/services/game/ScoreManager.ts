import redisClient from "../../lib/redis.ts";
import { MemberManager } from "../room/MemberManager.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import { Submission } from "../types.js";

const updateLeaderboard = async (
  roomId: string,
  userId: string,
  score: number,
) => {
  return await redisClient.zIncrBy(
    KeyManager.leaderboard(roomId),
    score,
    userId,
  );
};

const calculateAndUpdateScore = async (submissionData: Submission) => {
  const { roomId, userId, isCorrect } = submissionData;
  const score = isCorrect ? 10 : 0;
  return await updateLeaderboard(roomId, userId, score);
};

const getMemberScore = async (roomId: string, userId: string) => {
  const score = await redisClient.zScore(
    KeyManager.leaderboard(roomId),
    userId,
  );
  return score ?? 0;
};

const getLeaderboard = async (roomId: string) => {
  const res = await redisClient.zRangeWithScores(
    KeyManager.leaderboard(roomId),
    0,
    -1,
    {
      REV: true,
    },
  );

  if(res.length == 0) return [];

  const playerIds = res.map((r) => r.value);
  const playerNames = await MemberManager.getMemberNamesWithIds(
    roomId,
    playerIds,
  );
  return res.map(({ value: id, score }, index) => ({
    id,
    score,
    rank: index + 1,
    name: playerNames[index] ?? "Random User",
  }));
};

export const ScoreManager = {
  getLeaderboard,
  getMemberScore,
  calculateAndUpdateScore,
  updateLeaderboard,
} as const;
