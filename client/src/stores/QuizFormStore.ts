import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

export interface AnswerChoice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  choices: Array<AnswerChoice>;
  order: number;
  timeLimitSeconds: number;
  correctChoiceId: string;
}

export interface QuizFormState {
  id: string;
  title: string;
  description: string;
  topics: Array<string>;
  questions: Array<Question>;
}

interface QuizFormActions {
  actions: {
    addQuestion: (question: Question) => void;
    updateQuestionText: (questionId: string, text: string) => void;
    updateQuestionTimeLimit: (questionId: string, timeLimit: number) => void;
    updateChoice: (questionId: string, choiceId: string, text: string) => void;
    removeQuestion: (questionId: string) => void;
    addTopic: (topic: string) => void;
    removeTopic: (idx: number) => void;
    updateTitle: (title: string) => void;
    updateDescription: (description: string) => void;
    updateCorrectChoice: (questionId: string, choiceId: string) => void;
  };
}

export const createQuizStore = (initialState: QuizFormState) => {
  return createStore<QuizFormState & QuizFormActions>()(
    immer((set) => ({
      ...initialState,
      actions: {
        addQuestion: (question) =>
          set((s) => {
            const newQuestions = [question, ...s.questions];
            s.questions = newQuestions.map((q, idx) => ({
              ...q,
              order: idx + 1,
            }));
          }),
        removeQuestion: (questionId: string) =>
          set((s) => {
            s.questions = s.questions
              .filter(({ id }) => id !== questionId)
              .map((q, idx) => ({ ...q, order: idx + 1 }));
          }),
        updateQuestionText: (id, text) =>
          set((s) => {
            const question = s.questions.find((q) => q.id === id);
            if (question) question.text = text;
          }),
        updateChoice: (questionId, choiceId, text) =>
          set((s) => {
            const question = s.questions.find((q) => q.id === questionId);
            if (question) {
              const choice = question.choices.find((ch) => ch.id === choiceId);
              if (choice) choice.text = text;
            }
          }),
        addTopic: (topic) =>
          set((s) => {
            s.topics.push(topic);
          }),
        removeTopic: (idx) =>
          set((s) => {
            s.topics = s.topics.filter((_, i) => i !== idx);
          }),
        updateTitle: (title) =>
          set((s) => {
            s.title = title;
          }),
        updateDescription: (description) =>
          set((s) => {
            s.description = description;
          }),
        updateCorrectChoice: (questionId, choiceId) =>
          set((s) => {
            const question = s.questions.find((q) => q.id === questionId);
            if (question) question.correctChoiceId = choiceId;
          }),
        updateQuestionTimeLimit: (questionId, timeLimit) =>
          set((s) => {
            const question = s.questions.find((q) => q.id === questionId);
            if (question) question.timeLimitSeconds = timeLimit;
          }),
      },
    })),
  );
};

type QuizStore = ReturnType<typeof createQuizStore>;

export const QuizStoreContext = createContext<QuizStore | null>(null);

function useQuizStore<T>(selector: (state: QuizFormState & QuizFormActions) => T): T {
  const ctx = useContext(QuizStoreContext);
  if (!ctx) throw new Error('Invalid use of useGameStore hook');
  return useStore(ctx, selector);
}

export const useQuizFormActions = () => useQuizStore((s) => s.actions);
export const useQuizTopics = () => useQuizStore((s) => s.topics);
export const useQuizTitle = () => useQuizStore((s) => s.title);
export const useQuizDescription = () => useQuizStore((s) => s.description);
export const useQuizQuestionById = (id: string) =>
  useQuizStore(useShallow((s) => s.questions.find((q) => q.id === id)));
export const useQuizQuestionIds = () =>
  useQuizStore(useShallow((s) => s.questions.map((q) => q.id)));
