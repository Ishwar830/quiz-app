import { RequestHandler } from "express";
import { QuizRepository } from "../services/db_queries/QuizRepository.ts";
import { ApiResponse } from "../lib/utils.ts";
import z from "zod";
import { QuizPayloadSchema } from "../lib/zod_schemas.ts";

export const getQuizzesHandler: RequestHandler = async (req, res) => {
  const user = req.user!;

  const data = await QuizRepository.getUserQuizzes(user.id);
  res.json(ApiResponse.success(data));
};

export const getQuizHandler: RequestHandler = async (req, res) => {
  const quizId = req.params.quizId as string;
  const user = req.user!;

  const data = await QuizRepository.getUserQuizById(user.id, quizId);
  if (data) return res.json(ApiResponse.success(data));

  res.status(404).json(
    ApiResponse.error({
      code: "NOT FOUND",
      message: `Quiz with id: ${quizId} doesn't exist`,
    }),
  );
};

export const deleteQuizHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;
  const quizId = req.params.quizId as string;

  const data = await QuizRepository.deleteQuiz(quizId, user.id);
  res.json(ApiResponse.success(data));
};

export const createOrUpdateQuizHandler: RequestHandler = async (req, res) => {
  const user = req.user!;

  const parsedResult = z.safeParse(QuizPayloadSchema, req.body);
  if (parsedResult.success) {
    const payload = parsedResult.data;
    const quizId = await QuizRepository.createOrUpdateQuiz(
      user.id,
      payload.id,
      payload,
    );
    res.json(ApiResponse.success(quizId));
  } else {
    res.status(400).json(
      ApiResponse.error({
        code: "VALIDATION ERROR",
        message: "Invalid quiz form data",
        details: z.flattenError(parsedResult.error),
      }),
    );
  }
};
