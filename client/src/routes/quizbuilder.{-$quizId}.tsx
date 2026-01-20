import { createFileRoute } from '@tanstack/react-router';
import type { Quiz } from '@/stores/quiz.store';
import { QuizBuilder } from '@/components/QuizBuilder';
import { generateMockQuizData } from '@/lib/utils';

export const Route = createFileRoute('/quizbuilder/{-$quizId}')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const quizId = params.quizId;
    if (quizId) {
      return await fetchQuiz(quizId);
    }

    return generateMockQuizData();
  },
});

async function fetchQuiz(quizId: string) {
  const res = await fetch(`/api/quizzes/${quizId}`);
  if (!res.ok) {
    throw new Error('Failed to get quiz');
  }
  const { data } = await res.json();
  return data as Quiz;
}

function RouteComponent() {
  const quiz = Route.useLoaderData();
  return (
    <div>
      <QuizBuilder quiz={quiz} />
    </div>
  );
}
