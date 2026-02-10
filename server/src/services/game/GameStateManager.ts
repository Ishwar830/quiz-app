import redisClient from "../../lib/redis.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import { QuizManager } from "../quiz/QuizManager.ts";
import EventEmitter from "node:events";
import type { GameState, QuestionInfo, QuizMeta, Room } from "../types.js";
import { ScoreManager } from "./ScoreManager.ts";

export const GameEventEmitter = new EventEmitter();

const GameConfigs = {
  COUNTDOWN_TIMER: 5, // seconds
};

const initializeGameState = async (room: Room) => {
  const initialState: GameState = {
    room,
    status: "WAITING",
    quizStartedAt: null,
    quizEndedAt: null,
    currentQuestionInfo: null,
    countdownInfo: null,
    finalRankings: null,
  };

  await redisClient.json.set(
    KeyManager.gameState(room.id),
    "$",
    initialState as any,
  );
  return initialState;
};

const startQuiz = async (roomId: string) => {
  const stateUpdates: Partial<GameState> = {
    quizStartedAt: Date.now(),
  };

  await updateGameState(roomId, stateUpdates);
  await prepareNextQuestion(roomId);
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

const updateGameState = async (roomId: string, updates: Partial<GameState>) => {
  const currentState = await getGameState(roomId);
  const newState: GameState = {
    ...currentState,
    ...updates,
  };

  await redisClient.json.set(
    KeyManager.gameState(roomId),
    "$",
    newState as any,
  );

  return newState;
};

const endQuiz = async (roomId: string) => {
  const finalRankings = await ScoreManager.getLeaderboard(roomId);

  const gameState = await updateGameState(roomId, {
    status: "FINISHED",
    quizEndedAt: Date.now(),
    currentQuestionInfo: null,
    countdownInfo: null,
    finalRankings,
  });

  console.log(finalRankings);
  GameEventEmitter.emit("quizEnded", gameState);
};

const hasQuestionEnded = (questionInfo: QuestionInfo | null) => {
  const currentTime = Date.now();
  return !questionInfo || currentTime > questionInfo.submissionEndTime;
};

const hasMoreQuestions = (nextQuestionOrder: number, quizMeta: QuizMeta) => {
  return nextQuestionOrder <= quizMeta.totalQuestions;
};

const prepareNextQuestion = async (roomId: string) => {
  let currentGameState = await getGameState(roomId);
  const currentQuestionInfo = currentGameState.currentQuestionInfo;

  const nextQuestionOrder = (currentQuestionInfo?.order ?? 0) + 1;

  const hasQuizEnded = !hasMoreQuestions(
    nextQuestionOrder,
    currentGameState.room.quizMeta,
  );

  if (hasQuizEnded) {
    await endQuiz(roomId);
    return;
  }

  if (!hasQuestionEnded(currentQuestionInfo)) return;

  GameEventEmitter.emit("questionEnded", currentGameState);
  await setupCountdown(roomId);
  await startNextQuestion(currentGameState, nextQuestionOrder);
};

const setupCountdown = async (roomId: string) => {
  const duration = GameConfigs.COUNTDOWN_TIMER;
  const endsAt = Date.now() + duration * 1000;

  const gameState = await updateGameState(roomId, {
    status: "COUNTDOWN",
    countdownInfo: { duration, endsAt },
  });

  GameEventEmitter.emit("startCountdown", gameState);

  await new Promise<void>((resolve) => setTimeout(resolve, duration * 1000));
};

const startNextQuestion = async (
  gameState: GameState,
  nextQuestionOrder: number,
) => {
  const roomId = gameState.room.id;
  const quizId = gameState.room.quizMeta.id;
  const question = await QuizManager.getQuestionWithOrder(
    quizId,
    nextQuestionOrder,
  );

  if (!question) {
    throw new Error("No questions left");
  }
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

  const newState = await updateGameState(roomId, stateUpdates);
  GameEventEmitter.emit("startQuestion", newState);
};

export const GameStateManager = {
  initializeGameState,
  startQuiz,
  prepareNextQuestion,
  getGameState,
} as const;
