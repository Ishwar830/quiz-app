import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';

export interface Submission {
  roomId: string;
  userId: string;
  questionId: string;
  choiceId: string;
  submittedAt: number;
}

interface Member {
  id: string;
  name: string;
  role: 'PLAYER' | 'SPECTATOR';
}

interface MemberState {
  member: Member;
  submissions: Array<Submission>;
}

interface MemberActions {
  actions: {
    updateSubmissions: (submission: Submission) => void;
  };
}

export type MemberStore = ReturnType<typeof createMemberStore>;
export const MemberStoreContext = createContext<MemberStore | null>(null);

export const createMemberStore = (initialState: MemberState) => {
  return createStore<MemberState & MemberActions>()((set) => ({
    ...initialState,
    actions: {
      updateSubmissions: (newSubmission) =>
        set((s) => ({ submissions: [...s.submissions, newSubmission] })),
    },
  }));
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
export const useMemberActions = () => useMemberStore((s) => s.actions);
