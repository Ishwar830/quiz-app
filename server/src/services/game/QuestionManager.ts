import { GameQuestion, Question } from "../types.js";
import redisClient from "../../lib/redis.ts";
import { nanoid } from "nanoid";
import { KeyManager } from "../redis/KeyManager.ts";

const initializeQuestionList = async (
  roomId: string,
  questions: Array<Question>,
) => {
  // new question ids to differ from original ids
  const sortedQuestions = questions
    .map((q) => ({ ...q, id: nanoid() }))
    .sort((a, b) => a.order - b.order);

  await Promise.all([
    redisClient.rPush(
      KeyManager.remainingQuestions(roomId),
      sortedQuestions.map((q) => JSON.stringify(q)),
    ),
    cacheAnswers(roomId, sortedQuestions),
  ]);
};

const cacheAnswers = async (roomId: string, questions: Question[]) => {
  await Promise.all(
    questions.map((q) =>
      redisClient.set(KeyManager.answer(roomId, q.id), q.correctChoiceId),
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
  return Boolean(await redisClient.lLen(KeyManager.remainingQuestions(roomId)));
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
  const res = await redisClient.lPop(KeyManager.remainingQuestions(roomId));
  if (!res) return;

  const question: Question = JSON.parse(res);

  await redisClient.lPush(
    KeyManager.completedQuestions(roomId),
    JSON.stringify({ ...question, startedAt, endedAt }),
  );
};

const getCompletedQuestions = async (roomId: string) => {
  const res = await redisClient.lRange(
    KeyManager.completedQuestions(roomId),
    0,
    -1,
  );
  const completedQuestions = res.map((r) =>
    JSON.parse(r),
  ) as Array<GameQuestion>;
  return completedQuestions;
};

const getCorrectChoiceId = async (roomId: string, questionId: string) => {
  const correctChoiceId = await redisClient.get(
    KeyManager.answer(roomId, questionId),
  );
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
