import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import type { QuizMeta } from '@/components/QuizCard';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { QuizCard } from '@/components/QuizCard';
import { QuizCardSkeleton } from '@/components/Skeletons';

export const Route = createFileRoute('/quizzes')({
  component: RouteComponent,
  loader: getUserQuizzes,
  pendingComponent: () => <LoadingCardContainer />,
  pendingMinMs: 200,
  pendingMs: 200,
});

function RouteComponent() {
  const quizzes = Route.useLoaderData();
  return (
    <div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <QuizCardSkeleton />
      <QuizCardSkeleton />
      <QuizCardSkeleton />
      <QuizCardSkeleton />
      <QuizCardSkeleton />
      <QuizCardSkeleton />
    </div>
  );
}
