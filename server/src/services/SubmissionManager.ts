import redisClient from "../lib/redis.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import type { Submission } from "./types.d.ts";


const submitAnswer = async (submissionData: Submission) => {
  const { roomId, questionId, userId, choiceId } = submissionData;
  const submissionKey = KeyManager.submission(roomId, userId, questionId);

  await Promise.all([
    redisClient.json.set(submissionKey, "$", submissionData as any),
    incrementSubmissionCount(roomId, questionId, choiceId),
  ]);

  const submission = await redisClient.json.get(submissionKey);
  return submission;
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
} as const;
