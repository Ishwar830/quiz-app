import redisClient from "../../lib/redis.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import type { Submission, SubmissionPayload } from "../types.js";
import { QuestionManager } from "./QuestionManager.ts";
import { ScoreManager } from "./ScoreManager.ts";

const submitAnswer = async (submissionPayload: SubmissionPayload) => {
  const { roomId, questionId, userId, choiceId } = submissionPayload;
  const submissionKey = KeyManager.submission(roomId, userId, questionId);

  const hasSubmittedBefore = await redisClient.exists(submissionKey);

  if (hasSubmittedBefore) {
    const score = await ScoreManager.getMemberScore(roomId, userId);

    const submission = (await redisClient.json.get(
      submissionKey,
    )) as unknown as Submission;

    return { ...submission, score };
  }

  const isCorrectChoice = await checkCorrectChoice(submissionPayload);
  const submissionData: Submission = {
    ...submissionPayload,
    isCorrect: isCorrectChoice,
  };

  await Promise.all([
    redisClient.json.set(submissionKey, "$", submissionData as any),
    incrementSubmissionCount(roomId, questionId, choiceId),
  ]);

  const score = await ScoreManager.calculateAndUpdateScore(submissionData);

  return { ...submissionData, score };
};

const checkCorrectChoice = async (submissionPayload: SubmissionPayload) => {
  const { roomId, questionId, choiceId } = submissionPayload;
  const correctChoiceId = await QuestionManager.getCorrectChoiceId(
    roomId,
    questionId,
  );
  if (!correctChoiceId) throw new Error("correct choice not found");

  const isCorrect = correctChoiceId === choiceId;
  return isCorrect;
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

const fetchSubmissions = async (query: string) => {
  const INDEX_KEY = "idx:submissions";

  type QueryResponse = {
    total: number;
    documents: Array<{ id: string; value: Submission }>;
  };

  const { documents } = (await redisClient.ft.search(
    INDEX_KEY,
    query,
  )) as unknown as QueryResponse;

  const submissions = documents.map(({ value }) => value);
  return submissions;
};

const getUserSubmissions = async (roomId: string, userId: string) => {
  const query = `@roomId:(${roomId}) @userId:(${userId})`;
  const userSubmissions = await fetchSubmissions(query);
  return userSubmissions;
};

const getSubmissionCountForQuestion = async (
  roomId: string,
  questionId: string,
) => {
  const result = await redisClient.hGetAll(
    KeyManager.submissionCount(roomId, questionId),
  );

  const totalSubmissions = Object.values(result).reduce(
    (total, curr) => (total += parseInt(curr)),
    0,
  );

  const info: { [key: string]: number } = {};
  Object.keys(result).forEach((k) => (info[k] = Number(result[k])));

  return {
    roomId,
    questionId,
    totalSubmissions,
    info,
  };
};

const getSubmissionsByRoomId = async (roomId: string) => {
  const query = `@roomId:(${roomId})`;
  const submissions = await fetchSubmissions(query);
  return submissions;
};

export const SubmissionManager = {
  submitAnswer,
  getSubmissionCountForQuestion,
  getUserSubmissions,
  getSubmissionsByRoomId,
} as const;
