import { RequestHandler } from "express";
import * as DBQueryHandler from "../services/queries.ts";
import { ApiResponse } from "../lib/utils.ts";
import z, { ZodError } from "zod";
import { QuizPayloadSchema } from "../lib/zod_schemas.ts";

export const getQuizzesHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;

  try {
    const data = await DBQueryHandler.getUserQuizzes(user.id);
    res.json(ApiResponse.success(data));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getQuizHandler: RequestHandler = async (req, res, next) => {
  const quizId = req.params.quizId as string;

  try {
    const data = await DBQueryHandler.getQuizById(quizId);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

export const deleteQuizHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;
  const quizId = req.params.quizId as string;

  try {
    const data = await DBQueryHandler.deleteQuiz(quizId, user.id);
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateQuizHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;

  try {
    const payload = z.parse(QuizPayloadSchema, req.body);
    const data = await DBQueryHandler.createOrUpdateQuiz(user.id, payload.id, payload);
    res.json(ApiResponse.success(data));
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(z.flattenError(err));
      // const errors = err.issues.
      return res.status(400).json(ApiResponse.error({message: "Invalid Quiz"}));
    }
    console.error(err);
    next(err);
  }
};
