import { createFileRoute } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';
import { QuizPreview } from '@/components/Quiz/QuizPreview';
import { getQuiz } from '@/api/quiz.api';

export const Route = createFileRoute(
  '/_authenticated/(quizzes)/quizzes_/$quizId',
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data, error } = await getQuiz(params.quizId);
    if (data) return data;
    throw new Error(error?.message);
  },
});

function RouteComponent() {
  const quizData = Route.useLoaderData();
  console.log(quizData);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 grid place-items-center">
          <EyeIcon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-900">Quiz Preview</h1>
        </div>
      </div>
      <div>
        <QuizPreview quiz={quizData} />
      </div>
    </div>
  );
}
