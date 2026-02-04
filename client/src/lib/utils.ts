import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import type { ClassValue } from 'clsx';
import type { Question, QuizState } from '@/stores/QuizStore';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number) {
  const formattedDate = new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return formattedDate;
}

export function generateMockQuestion() {
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

export function generateMockQuizData() {
  const quiz: QuizState = {
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
