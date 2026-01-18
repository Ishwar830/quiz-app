import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.ts";
import * as QuizController from "../controllers/quizController.ts"

export const quizRouter = Router();

quizRouter.use(authMiddleware);

quizRouter.get("/", QuizController.getQuizzesHandler);
quizRouter.get("/:quizId", QuizController.getQuizHandler);
quizRouter.post("/", QuizController.createQuizHandler);
quizRouter.delete("/:quizId", QuizController.deleteQuizHandler);
quizRouter.put("/:quizId", QuizController.updateQuizHandler);
