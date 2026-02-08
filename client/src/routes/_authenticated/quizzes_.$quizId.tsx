import { createFileRoute } from '@tanstack/react-router';
import { fetchQuiz } from '@/lib/utils';
import { QuizPreview } from '@/components/QuizPreview';

export const Route = createFileRoute('/_authenticated/quizzes_/$quizId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const quizId = params.quizId;
    return await fetchQuiz(quizId);
  },
});

function RouteComponent() {
  const quizData = Route.useLoaderData();
  console.log(quizData);
  return (
    <div className='space-y-4'>
      <p>Quiz Preview</p>
      <div>
        <QuizPreview quiz={quizData} />
      </div>
    </div>
  );
}
