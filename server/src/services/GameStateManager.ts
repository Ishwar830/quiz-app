import redisClient from "../lib/redis.ts";
import { KeyManager } from "./redis/KeyManager.js";
import { QuizManager } from "./QuizManager.ts";
import EventEmitter from "node:events";
import { SubmissionManager } from "./SubmissionManager.ts";
import type { Question, Room } from "./types.d.ts";

export const GameEventEmitter = new EventEmitter();

const analyticsTimers = new Map();

type QuestionInfo = Omit<Question, "correctChoiceId"> & {
  submissionStartTime: number;
  submissionEndTime: number;
};

interface CountdownInfo {
  endsAt: number;
  duration: number;
}

interface GameState {
  room: Room;
  status: "WAITING" | "COUNTDOWN" | "QUESTION_ACTIVE" | "FINISHED";
  quizStartedAt: number | null;
  quizEndedAt: number | null;
  currentQuestionInfo: QuestionInfo | null;
  countdownInfo: CountdownInfo | null;
}

const initializeGameState = async (room: Room) => {
  const initialState: GameState = {
    room,
    status: "WAITING",
    quizStartedAt: null,
    quizEndedAt: null,
    currentQuestionInfo: null,
    countdownInfo: null,
  };

  await redisClient.json.set(
    KeyManager.gameState(room.id),
    "$",
    initialState as any,
  );
  return initialState;
};

const startQuiz = async (roomId: string) => {
  const startDelay = 10 * 1000; // 10 seconds in ms

  const countdownEndsAt = Date.now() + startDelay;
  const stateUpdates: Partial<GameState> = {
    quizStartedAt: Date.now(),
    status: "COUNTDOWN",
    countdownInfo: {
      endsAt: countdownEndsAt,
      duration: 10,
    },
  };

  await updateGameState(roomId, stateUpdates);

  setTimeout(async () => {
    const questionData = await GameStateManager.moveToNextQuestion(roomId);
    GameEventEmitter.emit("startQuestion", { roomId, questionData });
  }, startDelay);

  return countdownEndsAt;
};

const getGameState = async (roomId: string) => {
  const gameState = (await redisClient.json.get(
    KeyManager.gameState(roomId),
  )) as unknown as GameState | null;
  if (!gameState) {
    throw new Error(`Cannot find state related to ${roomId}`);
  }

  return gameState;
};

const getCurrentQuestionInfo = async (roomId: string) => {
  const gameState = await getGameState(roomId);
  const questionInfo = gameState.currentQuestionInfo;
  return questionInfo;
};

const moveToNextQuestion = async (roomId: string) => {
  const canMove = await canMoveToNextQuestion(roomId);

  if (!canMove) {
    throw new Error("Question is active, cant move to next question yet");
  }

  const currentState = (await redisClient.json.get(
    KeyManager.gameState(roomId),
  )) as unknown as GameState;

  let currentQuestionOrder = currentState.currentQuestionInfo?.order;
  if (!currentQuestionOrder) {
    currentQuestionOrder = 0;
  }

  stopAnalyticHandler(roomId);

  const nextQuestionOrder = currentQuestionOrder + 1;

  const question = await QuizManager.getQuestionWithOrder(
    currentState.room.quizMeta.id,
    nextQuestionOrder,
  );

  if (!question) return;
  // remove correctChoiceId
  const { correctChoiceId, ...questionForPlayer } = question;

  const submissionStartTime = Date.now();
  const submissionEndTime =
    submissionStartTime + question.timeLimitSeconds * 1000;

  const questionInfo: QuestionInfo = {
    ...questionForPlayer,
    submissionStartTime,
    submissionEndTime,
  };

  const stateUpdates: Partial<GameState> = {
    status: "QUESTION_ACTIVE",
    currentQuestionInfo: questionInfo,
    countdownInfo: null,
  };

  await updateGameState(roomId, stateUpdates);
  startAnalyticHandler(roomId, question.id);
  return questionInfo;
};

const canMoveToNextQuestion = async (roomId: string) => {
  const gameState = await getGameState(roomId);

  const currentQuestionInfo = gameState.currentQuestionInfo;
  if (currentQuestionInfo === null) return true;

  const currentTime = Date.now();
  if (currentTime > currentQuestionInfo.submissionEndTime) return true;
  return false;
};

const startAnalyticHandler = async (roomId: string, questionId: string) => {
  // clear previous timer if any exist
  stopAnalyticHandler(roomId);

  const intervalTime = 2000; // ms
  const timerId = setInterval(async () => {
    const data = await SubmissionManager.getSubmissionCountForQuestion(
      roomId,
      questionId,
    );
    GameEventEmitter.emit("submissionCountUpdate", { roomId, data });
  }, intervalTime);

  // automatic termination after 2 mins
  setTimeout(
    () => {
      clearInterval(timerId);
    },
    2 * 60 * 1000,
  );

  analyticsTimers.set(roomId, timerId);
};

const stopAnalyticHandler = (roomId: string) => {
  const currTimerId = analyticsTimers.get(roomId);
  if (currTimerId) {
    clearInterval(currTimerId);
  }
  analyticsTimers.delete(roomId);
};

const updateGameState = async (roomId: string, updates: Partial<GameState>) => {
  const currentState = await getGameState(roomId);
  const newState = {
    ...currentState,
    ...updates,
  };

  await redisClient.json.set(
    KeyManager.gameState(roomId),
    "$",
    newState as any,
  );

  const updatedState = await redisClient.json.get(KeyManager.gameState(roomId));
  return updatedState;
};

export const GameStateManager = {
  initializeGameState,
  startQuiz,
  moveToNextQuestion,
  getGameState,
  getCurrentQuestionInfo,
} as const;
