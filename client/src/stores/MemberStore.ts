import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Submission {
  roomId: string;
  userId: string;
  questionId: string;
  choiceId: string;
  submittedAt: number;
  isCorrect: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: 'PLAYER' | 'SPECTATOR';
  score?: number;
}

export interface MemberState {
  member: Member;
  submissions: Array<Submission>;
}

interface MemberActions {
  actions: {
    updateSubmissions: (submission: Submission) => void;
    updateScore: (newScore: number) => void;
  };
}

export type MemberStore = ReturnType<typeof createMemberStore>;
export const MemberStoreContext = createContext<MemberStore | null>(null);

export const createMemberStore = (initialState: MemberState) => {
  return createStore<MemberState & MemberActions>()(
    immer((set) => ({
      ...initialState,
      actions: {
        updateSubmissions: (newSubmission) =>
          set((s) => {
            s.submissions.push(newSubmission);
          }),
        updateScore: (newScore) =>
          set((s) => {
            s.member.score = newScore;
          }),
      },
    })),
  );
};

function useMemberStore<T>(
  selector: (state: MemberState & MemberActions) => T,
): T {
  const ctx = useContext(MemberStoreContext);
  if (!ctx) throw new Error('Invalid use of useGameStore hook');
  return useStore(ctx, selector);
}

export const useMember = () => useMemberStore((s) => s.member);
export const useMemberSubmissions = () => useMemberStore((s) => s.submissions);
export const useMemberScore = () => useMemberStore((s) => s.member.score);
export const useMemberActions = () => useMemberStore((s) => s.actions);
