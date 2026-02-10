import { GameEventEmitter } from "./GameStateManager.ts";
import { SubmissionManager } from "./SubmissionManager.ts";
import type { GameState } from "../types.js";

const AnalyticConfigs = {
  UPDATE_INTERVAL: 2, // seconds
  AUTO_STOP_DURATION: 60, // seconds
};

const analyticsTimers = new Map<string, NodeJS.Timeout>();

const stopAnalyticHandler = (roomId: string) => {
  const timerId = analyticsTimers.get(roomId);
  if (timerId) {
    clearInterval(timerId);
    analyticsTimers.delete(roomId);
  }
};

const startAnalyticHandler = async (roomId: string, questionId: string) => {
  stopAnalyticHandler(roomId);

  const timerId = setInterval(async () => {
    const data = await SubmissionManager.getSubmissionCountForQuestion(
      roomId,
      questionId,
    );
    GameEventEmitter.emit("submissionCountUpdate", { roomId, data });
  }, AnalyticConfigs.UPDATE_INTERVAL * 1000);

  analyticsTimers.set(roomId, timerId);

  setTimeout(
    () => clearInterval(timerId),
    AnalyticConfigs.AUTO_STOP_DURATION * 1000,
  );
};

export function setupAnalyticsHandler() {
  const stopEvents = ["quizEnded", "questionEnded"];

  stopEvents.forEach((event) => {
    GameEventEmitter.on(event, ({ room }: GameState) => {
      stopAnalyticHandler(room.id);
    });
  });

  GameEventEmitter.on(
    "startQuestion",
    ({ room, currentQuestionInfo }: GameState) => {
      startAnalyticHandler(room.id, currentQuestionInfo?.id!);
    },
  );
}
