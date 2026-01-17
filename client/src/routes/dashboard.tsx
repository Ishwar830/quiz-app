import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/quizzes">My Quizzes</Link>
    </div>
  );
}
