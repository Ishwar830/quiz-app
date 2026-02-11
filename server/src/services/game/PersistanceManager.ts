import { GameRepository } from "../db_queries/GameRepository.ts";
import { RoomManager } from "../room/RoomManager.ts";
import { GameDataPayload } from "../types.js";
import { GameStateManager } from "./GameStateManager.ts";
import { QuestionManager } from "./QuestionManager.ts";
import { ScoreManager } from "./ScoreManager.ts";
import { SubmissionManager } from "./SubmissionManager.ts";

export const persistGameData = async (roomId: string) => {
  const room = await RoomManager.getRoomInfo(roomId);
  const submissions = await SubmissionManager.getSubmissionsByRoomId(roomId);
  const rankings = await ScoreManager.getLeaderboard(roomId);
  const gameState = await GameStateManager.getGameState(roomId);
  const questions = await QuestionManager.getCompletedQuestions(roomId);

  const gameDataPayload: GameDataPayload = {
    hostId: room.host.id,
    quizTitle: room.quizMeta.title,
    quizDescription: room.quizMeta.description,
    quizTopics: room.quizMeta.topics,
    createdAt: new Date(Date.now()),
    startedAt: new Date(gameState.quizStartedAt!),
    endedAt: new Date(gameState.quizEndedAt!),
    submissions: submissions.map((s) => ({
      ...s,
      submittedAt: new Date(s.submittedAt),
    })),
    questions: questions.map((q) => ({
      ...q,
      startedAt: new Date(q.startedAt),
      endedAt: new Date(q.endedAt),
    })),
    rankings,
  };

  await GameRepository.saveGame(gameDataPayload);
};
