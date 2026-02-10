import { GameQuestion, Question } from "../types.js";
import redisClient from "../../lib/redis.ts";

const remKey = (roomId: string) => `room:${roomId}:remaining_questions`;
const compKey = (roomId: string) => `room:${roomId}:completed_questions`;
const ansKey = (roomId: string, questionId: string) =>
  `room:${roomId}:question:${questionId}:answer`;

const initializeQuestionList = async (
  roomId: string,
  questions: Array<Question>,
) => {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  await Promise.all([
    redisClient.rPush(
      remKey(roomId),
      sortedQuestions.map((q) => JSON.stringify(q)),
    ),
    cacheAnswers(roomId, questions),
  ]);
};

const cacheAnswers = async (roomId: string, questions: Question[]) => {
  await Promise.all(
    questions.map((q) =>
      redisClient.set(ansKey(roomId, q.id), q.correctChoiceId),
    ),
  );
};

const getNextRemainingQuestion = async (
  roomId: string,
): Promise<Question | null> => {
  const key = `room:${roomId}:remaining_questions`;
  const res = await redisClient.lIndex(key, 0);
  if (res) return JSON.parse(res);
  return null;
};

const hasQuestionsLeft = async (roomId: string) => {
  return Boolean(await redisClient.lLen(remKey(roomId)));
};

const markCurrentQuestionComplete = async (
  roomId: string,
  {
    startedAt,
    endedAt,
  }: {
    startedAt: Date;
    endedAt: Date;
  },
) => {
  const res = await redisClient.lPop(remKey(roomId));
  if (!res) return;

  const question: Question = JSON.parse(res);

  await redisClient.lPush(
    compKey(roomId),
    JSON.stringify({ ...question, startedAt, endedAt }),
  );
};

const getCompletedQuestions = async (roomId: string) => {
  const res = await redisClient.lRange(compKey(roomId), 0, -1);
  const completedQuestions = res.map((r) =>
    JSON.parse(r),
  ) as Array<GameQuestion>;
  return completedQuestions;
};

const getCorrectChoiceId = async (roomId: string, questionId: string) => {
  const correctChoiceId = await redisClient.get(ansKey(roomId, questionId));
  if (!correctChoiceId) throw new Error("correct choice not found");
  return correctChoiceId;
};

export const QuestionManager = {
  hasQuestionsLeft,
  initializeQuestionList,
  getNextRemainingQuestion,
  markCurrentQuestionComplete,
  getCompletedQuestions,
  getCorrectChoiceId,
};
