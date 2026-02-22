import type { QuizMeta } from '@/components/Quiz/QuizCard';
import type { Quiz } from '@/lib/utils';
import type { ApiResponse } from './types.api';

export async function getUserQuizzes(): Promise<ApiResponse<Array<QuizMeta>>> {
  try {
    const res = await fetch('/api/quizzes');
    return await res.json();
  } catch (err) {
    let errorMessage = 'Unknown Error occurred';
    if (err instanceof Error) errorMessage = err.message;
    return {
      data: null,
      error: { code: 'UNKNOWN ERROR', message: errorMessage },
    };
  }
}

export async function getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
  try {
    const res = await fetch(`/api/quizzes/${quizId}`);
    return await res.json();
  } catch (err) {
    let errorMessage = 'Unknown Error occurred';
    if (err instanceof Error) errorMessage = err.message;
    return {
      data: null,
      error: { code: 'UNKNOWN ERROR', message: errorMessage },
    };
  }
}
