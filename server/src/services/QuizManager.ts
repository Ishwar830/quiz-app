import redisClient from "../lib/redis.ts";
import { KeyManager } from "./redis/KeyManager.ts";
import type { Quiz, Question, QuizMeta } from "./types.d.ts";

const storeQuiz = async (quiz: Quiz) => {
  const key = KeyManager.quiz(quiz.id);
  await redisClient.json.set(key, "$", quiz as any);
};

const getQuiz = async (quizId: string) => {
  const key = KeyManager.quiz(quizId);
  const quiz = await redisClient.json.get(key);

  if (!quiz) return null;

  return quiz as unknown as Quiz;
};

const getQuizMeta = async (quizId: string) => {
  const quiz = await getQuiz(quizId);
  if (!quiz) return null;
  const quizMeta: QuizMeta = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    topics: quiz.topics,
    totalQuestions: quiz.questions.length
  };
  return quizMeta as unknown as QuizMeta;
};

const getQuestionWithOrder = async (quizId: string, order: number) => {
  const [question] = (await redisClient.json.get(KeyManager.quiz(quizId), {
    path: `$.questions[?(@.order==${order})]`,
  })) as unknown as Question[];

  if (!question) return null;
  return question;
};

export const QuizManager = {
  storeQuiz,
  getQuiz,
  getQuizMeta,
  getQuestionWithOrder,
} as const;
