import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

export interface AnswerChoice {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  choices: Array<AnswerChoice>;
  correctChoiceId: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Array<QuizQuestion>;
}

interface QuizStore extends Quiz {
  actions: {
    initialize: (quizData: Quiz) => void;
    addQuestion: (question: QuizQuestion) => void;
    updateQuestion: (questionId: string, text: string) => void;
    updateChoice: (questionId: string, choiceId: string, text: string) => void;
    removeQuestion: (questionId: string) => void;
    updateTopic: (topic: string) => void;
    updateTitle: (title: string) => void;
    updateCorrectChoice: (questionId: string, choiceId: string) => void;
  };
}

const defaultData: Quiz = {
  id: '',
  title: '',
  topic: '',
  questions: [],
};

const useQuizStore = create<QuizStore>()(
  immer((set) => ({
    ...defaultData,
    actions: {
      initialize: (quizData) => set(() => ({ ...quizData })),
      addQuestion: (question) => set((s) => s.questions.push(question)),
      removeQuestion: (questionId: string) =>
        set((s) => s.questions.filter(({ id }) => id !== questionId)),
      updateQuestion: (id, text) =>
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
      updateTopic: (topic) =>
        set((s) => {
          s.topic = topic;
        }),
      updateTitle: (title) =>
        set((s) => {
          s.title = title;
        }),
      updateCorrectChoice: (questionId, choiceId) =>
        set((s) => {
          const question = s.questions.find((q) => q.id === questionId);
          if (question) question.correctChoiceId = choiceId;
        }),
    },
  })),
);

export const useQuizActions = () => useQuizStore((s) => s.actions);
export const useQuizTopic = () => useQuizStore((s) => s.topic);
export const useQuizTitle = () => useQuizStore((s) => s.title);
export const useQuizQuestionById = (id: string) =>
  useQuizStore(useShallow((s) => s.questions.find((q) => q.id === id)));
export const useQuizQuestionIds = () =>
  useQuizStore(useShallow((s) => s.questions.map((q) => q.id)));
