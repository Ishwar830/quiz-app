import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex gap-4 p-4'>
      <Link to="/quizbuilder">Quiz Builder</Link>
      <Link to="/quizzes">My Quizzes</Link>
    </div>
  );
}
