import { createFileRoute } from '@tanstack/react-router';
import { QuizBuilder } from '@/components/Quiz/QuizBuilder';
import { generateMockQuizFormData } from '@/lib/utils';
import { getQuiz } from '@/api/quiz.api';

export const Route = createFileRoute('/_authenticated/quizbuilder/{-$quizId}')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const quizId = params.quizId;
    if (quizId) {
      const { data, error } = await getQuiz(quizId);
      if (data) return data;
      throw new Error(error?.message);
    }

    return generateMockQuizFormData();
  },
});

function RouteComponent() {
  const quiz = Route.useLoaderData();
  return <QuizBuilder quiz={quiz} />;
}
