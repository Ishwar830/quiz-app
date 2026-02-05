import { createFileRoute } from '@tanstack/react-router';
import { QuizBuilder } from '@/components/QuizBuilder';
import { fetchQuiz, generateMockQuizData } from '@/lib/utils';

export const Route = createFileRoute('/_authenticated/quizbuilder/{-$quizId}')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const quizId = params.quizId;
    if (quizId) {
      return await fetchQuiz(quizId);
    }

    return generateMockQuizData();
  },
});

function RouteComponent() {
  const quiz = Route.useLoaderData();
  return <QuizBuilder quiz={quiz} />;
}
