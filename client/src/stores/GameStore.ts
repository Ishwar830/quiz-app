import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';

export interface Question {
  id: string;
  text: string;
  order: number;
  timeLimitSeconds: number;
  choices: Array<{ id: string; text: string }>;
  submissionStartTime: number;
  submissionEndTime: number;
}

export interface Room {
  id: string;
  host: {
    id: string;
    name: string;
  };
  quizMeta: {
    id: string;
    title: string;
    description: string;
    topics: Array<string>;
    totalQuestions: number;
  };
}

export interface RankInfo {
  userId: string;
  name: string;
  rank: number;
  score: number;
}

type GameStatus = 'WAITING' | 'COUNTDOWN' | 'QUESTION_ACTIVE' | 'FINISHED';

export interface GameState {
  room: Room;
  status: GameStatus;
  startedAt: number | null;
  endedAt: number | null;
  currentQuestionInfo: Question;
  countdownInfo: { endsAt: number } | null;
  topRankings: Array<RankInfo>;
}

interface GameActions {
  actions: {
    updateQuestionInfo: (questionInfo: Question) => void;
    updateGameStatus: (status: GameStatus) => void;
    updateCountdownInfo: (endsAt: number) => void;
    updateRankings: (rankings: Array<RankInfo>) => void;
  };
}

export type GameStore = ReturnType<typeof createGameStore>;
export const GameStoreContext = createContext<GameStore | null>(null);

export const createGameStore = (initialState: GameState) => {
  return createStore<GameState & GameActions>()((set) => ({
    ...initialState,
    actions: {
      updateGameStatus: (status) => set({ status }),
      updateCountdownInfo: (endsAt) =>
        set({ status: 'COUNTDOWN', countdownInfo: { endsAt } }),
      updateQuestionInfo: (questionInfo) =>
        set({ status: 'QUESTION_ACTIVE', currentQuestionInfo: questionInfo }),
      updateRankings: (topRankings) => set({ topRankings }),
    },
  }));
};

function useGameStore<T>(selector: (store: GameState & GameActions) => T): T {
  const ctx = useContext(GameStoreContext);
  if (!ctx) throw new Error('Invalid use of useGameStore hook');
  return useStore(ctx, selector);
}

export const useGameStatus = () => useGameStore((s) => s.status);
export const useGameRoom = () => useGameStore((s) => s.room);
export const useQuestionInfo = () => useGameStore((s) => s.currentQuestionInfo);
export const useGameActions = () => useGameStore((s) => s.actions);
export const useCountdownInfo = () => useGameStore((s) => s.countdownInfo);
export const useRankings = () => useGameStore((s) => s.topRankings);
