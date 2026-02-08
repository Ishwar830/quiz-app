import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import type { QuizMeta } from '@/components/QuizCard';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { QuizCard } from '@/components/QuizCard';
import { QuizCardSkeleton, Skeleton } from '@/components/Skeletons';

export const Route = createFileRoute('/_authenticated/quizzes')({
  component: RouteComponent,
  loader: getUserQuizzes,
  pendingComponent: () => <LoadingCardContainer />,
  pendingMinMs: 200,
  pendingMs: 200,
});

function RouteComponent() {
  const quizzes = Route.useLoaderData();
  return (
    <div className="space-y-4">
      <h1>My Quizzes</h1>
      <SearchBar />
      <QuizContainer quizzes={quizzes} />
    </div>
  );
}

function SearchBar() {
  return (
    <div>
      <InputGroup>
        <InputGroupInput type="search" placeholder="Search..." id="query" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function QuizContainer({ quizzes }: { quizzes: Array<QuizMeta> }) {
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
    <div className="space-y-4">
      <h1>My Quizzes</h1>
      <Skeleton className="h-8 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
        <QuizCardSkeleton />
      </div>
    </div>
  );
}
