import { RequestHandler } from "express";
import * as DBQueryHandler from "../services/queries.ts";
import { ApiResponse } from "../lib/utils.ts";
import z from "zod";
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

export const createQuizHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;

  try {
    const payload = z.parse(QuizPayloadSchema, req.body);
    const data = await DBQueryHandler.createQuizWithQuestions(user.id, payload);
    res.json(ApiResponse.success(data));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateQuizHandler: RequestHandler = async (req, res, next) => {
  const user = req.user!;
  const quizId = req.params.quizId as string;

  try {
    const payload = z.parse(QuizPayloadSchema, req.body);
    const data = await DBQueryHandler.updateEntireQuiz(
      quizId,
      user.id,
      payload,
    );
    res.json(ApiResponse.success(data));
  } catch (err) {
    next(err);
  }
};
