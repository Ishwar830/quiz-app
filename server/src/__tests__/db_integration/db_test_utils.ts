import { nanoid } from "nanoid";
import { db } from "../../db/index.ts";
import {
  gameParticipants,
  gameQuestions,
  games,
  gameSubmissions,
} from "../../db/schema/game.ts";
import { questions, quiz } from "../../db/schema/quizzes.ts";
import { user } from "../../db/schema/users.ts";
import { QuizPayload } from "../../lib/zod_schemas.ts";
import { GameDataPayload, GameQuestion } from "../../services/types.js";

export const clearDb = async () => {
  await db.delete(gameParticipants);
  await db.delete(gameSubmissions);
  await db.delete(gameQuestions);
  await db.delete(games);
  await db.delete(questions);
  await db.delete(quiz);
  await db.delete(user);
};

export const getMockQuizPayloadData = () => {
  const mockQuiz: QuizPayload = {
    id: nanoid(),
    title: "Mock Quiz",
    description: "Quiz Desc",
    topics: ["mock"],
    questions: [
      {
        id: nanoid(),
        text: "question_1",
        choices: [],
        order: 1,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
      {
        id: nanoid(),
        text: "question_2",
        choices: [],
        order: 2,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
    ],
  };

  return mockQuiz;
};

export const insertMockQuizForUser = async (userId: string) => {
  const mockQuiz = getMockQuizPayloadData();
  const { questions: quizQuestions, ...quizMeta } = mockQuiz;

  await db.insert(quiz).values({
    ...quizMeta,
    userId,
  });

  await db
    .insert(questions)
    .values(quizQuestions.map((q) => ({ ...q, quizId: quizMeta.id })));

  return mockQuiz;
};

export const createMockGamePayload = (
  hostId: string,
  overrides: Partial<GameDataPayload> = {},
): GameDataPayload => {
  const defaultGame = {
    hostId,
    quizTitle: "Default Test Quiz",
    quizDescription: "Quiz Desc",
    quizTopics: ["General"],
    createdAt: new Date(),
    startedAt: new Date(),
    endedAt: new Date(),
    questions: [],
    rankings: [],
    submissions: [],
  };

  return {
    ...defaultGame,
    ...overrides,
    questions: overrides.questions || [],
    rankings: overrides.rankings || [],
    submissions: overrides.submissions || [],
  };
};

export const createMockGameQuestion = (id: string, order: number) => {
  const mockQuestion: GameQuestion = {
    id,
    order,
    text: "Question Text",
    startedAt: new Date(),
    endedAt: new Date(),
    correctChoiceId: "1",
    timeLimitSeconds: 10,
    choices: [],
  };

  return mockQuestion;
};

export const createMockGameSubmission = (
  questionId: string,
  userId: string,
) => {
  return {
    userId,
    questionId,
    choiceId: "A",
    isCorrect: false,
    submittedAt: new Date(),
  };
};
