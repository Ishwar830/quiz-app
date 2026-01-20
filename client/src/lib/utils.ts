import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import type { ClassValue } from 'clsx';
import type { Quiz, QuizQuestion } from '@/stores/quiz.store';

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
  const question: QuizQuestion = {
    id: nanoid(),
    text: '',
    choices,
    order: 1,
    timeLimitSeconds: 20,
    correctChoiceId: choices[0].id,
  };

  return question;
}

export function generateMockQuizData() {
  const quiz: Quiz = {
    id: nanoid(),
    title: '',
    topics: [],
    description: '',
    questions: [],
  };

  return quiz;
}
