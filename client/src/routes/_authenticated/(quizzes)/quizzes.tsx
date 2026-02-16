import { createFileRoute } from '@tanstack/react-router';
import { Library, Search } from 'lucide-react';
import type { QuizMeta } from '@/components/Quiz/QuizCard';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { QuizCard } from '@/components/Quiz/QuizCard';
import { QuizCardSkeleton, Skeleton } from '@/components/Skeletons';

export const Route = createFileRoute('/_authenticated/(quizzes)/quizzes')({
  component: RouteComponent,
  loader: getUserQuizzes,
  pendingComponent: () => <LoadingCardContainer />,
  pendingMinMs: 200,
  pendingMs: 200,
});

function RouteComponent() {
  const quizzes = Route.useLoaderData();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 grid place-items-center">
          <Library size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-900">My Quizzes</h1>
          <p className="text-xs text-text-400">
            Browse, preview, and manage your quizzes
          </p>
        </div>
      </div>
      <SearchBar />
      <QuizContainer quizzes={quizzes} />
    </div>
  );
}

function SearchBar() {
  return (
    <div>
      <InputGroup>
        <InputGroupInput
          type="search"
          placeholder="Search quizzes..."
          id="query"
          className="rounded-xl"
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function QuizContainer({ quizzes }: { quizzes: Array<QuizMeta> }) {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12 text-text-400">
        <Library size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No quizzes yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quizInfo={quiz} />
      ))}
    </div>
  );
}

async function getUserQuizzes() {
  const res = await fetch('/api/quizzes');

  if (!res.ok) {
    throw new Error(`Failed to fetch quizzes: ${res.status}`);
  }

  const { data } = await res.json();
  return data as Array<QuizMeta>;
}

function LoadingCardContainer() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
      </div>
    </div>
  );
}
