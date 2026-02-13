import redisClient from "../../lib/redis.ts";
import { KeyManager } from "../redis/KeyManager.ts";
import EventEmitter from "node:events";
import type { GameState, QuestionInfo, Room } from "../types.js";
import { ScoreManager } from "./ScoreManager.ts";
import { QuestionManager } from "./QuestionManager.ts";
import { persistGameData } from "./PersistanceManager.ts";

export const GameEventEmitter = new EventEmitter();

const GameConfigs = {
  COUNTDOWN_SEC: 5,
  NEXT_QUESTION_BUFFER_SEC: 3,
};

const initializeGameState = async (room: Room) => {
  const initialState: GameState = {
    room,
    status: "WAITING",
    quizStartedAt: null,
    quizEndedAt: null,
    currentQuestionInfo: null,
    countdownInfo: null,
    topRankings: null,
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
  const leaderboard = await ScoreManager.getLeaderboard(roomId);

  const gameState = await updateGameState(roomId, {
    status: "FINISHED",
    quizEndedAt: Date.now(),
    currentQuestionInfo: null,
    countdownInfo: null,
    topRankings: leaderboard.slice(0, 10), // send top 10 players only
  });

  persistGameData(roomId);
  GameEventEmitter.emit("quizEnded", gameState);
};

const hasQuestionEnded = (questionInfo: QuestionInfo | null) => {
  const currentTime = Date.now();
  return !questionInfo || currentTime > questionInfo.submissionEndTime;
};

const prepareNextQuestion = async (roomId: string) => {
  const gameState = await getGameState(roomId);
  const currentQuestionInfo = gameState.currentQuestionInfo;

  if (!hasQuestionEnded(currentQuestionInfo)) return;

  if (currentQuestionInfo) {
    await QuestionManager.markCurrentQuestionComplete(roomId, {
      startedAt: new Date(currentQuestionInfo.submissionStartTime),
      endedAt: new Date(currentQuestionInfo.submissionEndTime),
    });
  }

  const canEndQuiz = !(await QuestionManager.hasQuestionsLeft(roomId));

  if (canEndQuiz) {
    await endQuiz(roomId);
    return;
  }

  await setupCountdown(roomId);
  await startNextQuestion(roomId);
};

const setupCountdown = async (roomId: string) => {
  const duration = GameConfigs.COUNTDOWN_SEC;
  const endsAt = Date.now() + duration * 1000;

  const gameState = await updateGameState(roomId, {
    status: "COUNTDOWN",
    currentQuestionInfo: null,
    countdownInfo: { duration, endsAt },
  });

  GameEventEmitter.emit("countdownStarted", gameState);

  await new Promise<void>((resolve) => setTimeout(resolve, duration * 1000));
};

const startNextQuestion = async (roomId: string) => {
  const nextQuestion = await QuestionManager.getNextRemainingQuestion(roomId);

  if (!nextQuestion) {
    throw new Error("No questions left");
  }
  // remove correctChoiceId
  const { correctChoiceId, ...questionForPlayer } = nextQuestion;

  const submissionStartTime = Date.now();
  const submissionEndTime =
    submissionStartTime + nextQuestion.timeLimitSeconds * 1000;

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
  GameEventEmitter.emit("questionStarted", newState);

  const nextQuestionStartTime =
    questionInfo.timeLimitSeconds + GameConfigs.NEXT_QUESTION_BUFFER_SEC;

  setTimeout(async () => {
    const gameState = await getGameState(roomId);
    GameEventEmitter.emit("questionEnded", gameState);
  }, nextQuestionStartTime * 1000);
};

GameEventEmitter.on("questionEnded", (gameState: GameState) => {
  prepareNextQuestion(gameState.room.id);
});

export const GameStateManager = {
  initializeGameState,
  startQuiz,
  prepareNextQuestion,
  getGameState,
} as const;
