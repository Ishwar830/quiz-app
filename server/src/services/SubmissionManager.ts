import redisClient from "../lib/redis.ts";
import { MemberManager } from "./MemberManager.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import type { Submission } from "./types.d.ts";

const submitAnswer = async (submissionData: Submission) => {
  const { roomId, questionId, userId, choiceId } = submissionData;
  const submissionKey = KeyManager.submission(roomId, userId, questionId);

  const hasSubmittedBefore = await redisClient.exists(submissionKey);
  if (!hasSubmittedBefore) {
    const score = await calculateScore(submissionData);
    await Promise.all([
      redisClient.json.set(submissionKey, "$", submissionData as any),
      incrementSubmissionCount(roomId, questionId, choiceId),
      updateLeaderboard(roomId, userId, score),
    ]);
  }

  const updatedScore = await getMemberScore(roomId, userId);

  const submission = (await redisClient.json.get(
    submissionKey,
  )) as unknown as Submission;

  return { ...submission, score: updatedScore };
};

const calculateScore = async (submissionData: Submission) => {
  const { questionId, choiceId } = submissionData;
  const correctChoiceId = await redisClient.get(KeyManager.answer(questionId));
  if (!correctChoiceId) throw new Error("correct choice not found");

  const isCorrect = correctChoiceId === choiceId;
  return isCorrect ? 10 : 0;
};

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
      REV: true
    }
  );

  const userIds = res.map(({ value }) => value);
  const names = await MemberManager.getMemberNames(roomId, userIds);
  return res.map(({ value, score }, index) => ({
    userId: value,
    name: names[index],
    score,
  }));
};

const incrementSubmissionCount = async (
  roomId: string,
  questionId: string,
  optionId: string,
) => {
  await redisClient.hIncrBy(
    KeyManager.submissionCount(roomId, questionId),
    `${optionId}`,
    1,
  );
};

const getUserSubmissions = async (roomId: string, userId: string) => {
  const INDEX_KEY = "idx:submissions";
  const query = `@roomId:(${roomId}) @userId:(${userId})`;

  type QueryResponse = {
    total: number;
    documents: Array<{ id: string; value: Submission }>;
  };

  const { documents } = (await redisClient.ft.search(
    INDEX_KEY,
    query,
  )) as unknown as QueryResponse;

  const userSubmissions: Submission[] = documents.map(({ value }) => value);

  return userSubmissions;
};

const getSubmissionCountForQuestion = async (
  roomId: string,
  questionId: string,
) => {
  const result = await redisClient.hGetAll(
    `submissionCount:${roomId}:${questionId}`,
  );

  const totalSubmissions = Object.values(result).reduce(
    (total, curr) => (total += parseInt(curr)),
    0,
  );

  return {
    roomId,
    questionId,
    totalSubmissions,
    info: result,
  };
};

export const SubmissionManager = {
  submitAnswer,
  getSubmissionCountForQuestion,
  getUserSubmissions,
  getLeaderboard,
  getMemberScore,
} as const;
