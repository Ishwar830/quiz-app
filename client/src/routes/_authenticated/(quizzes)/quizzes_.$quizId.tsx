import { createFileRoute } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';
import { fetchQuiz } from '@/lib/utils';
import { QuizPreview } from '@/components/Quiz/QuizPreview';

export const Route = createFileRoute(
  '/_authenticated/(quizzes)/quizzes_/$quizId',
)({
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
