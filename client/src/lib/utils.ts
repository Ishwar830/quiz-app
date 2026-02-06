import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import type { ClassValue } from 'clsx';
import type { Question, QuizFormState } from '@/stores/QuizFormStore';

export interface Quiz extends QuizFormState {
  createdAt: number | Date;
  updatedAt: number | Date;
}

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number | Date) {
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return formattedDate;
}

export function generateMockFormQuestion() {
  const choices = Array.from({ length: 4 }).map((_, idx) => ({
    id: nanoid(),
    text: `Choice ${idx + 1}`,
  }));
  const question: Question = {
    id: nanoid(),
    text: '',
    choices,
    order: 1,
    timeLimitSeconds: 10,
    correctChoiceId: choices[0].id,
  };

  return question;
}

export function generateMockQuizFormData() {
  const quiz: QuizFormState = {
    id: nanoid(),
    title: '',
    topics: [],
    description: '',
    questions: [],
  };

  return quiz;
}

export function calulateTimeLeft(endTime: number) {
  const timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  return timeLeft;
}

export async function fetchQuiz(quizId: string) {
  const res = await fetch(`/api/quizzes/${quizId}`);
  if (!res.ok) {
    throw new Error('Failed to get quiz');
  }
  const { data } = await res.json();
  return data as Quiz;
}
