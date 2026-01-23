import { Link, createFileRoute } from '@tanstack/react-router';
import { JoinRoomForm } from '@/components/JoinRoomForm';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex gap-4 p-4">
        <Link to="/quizbuilder/{-$quizId}">Quiz Builder</Link>
        <Link to="/quizzes">My Quizzes</Link>
      </div>
      <div>
        <JoinRoomForm />
      </div>
    </>
  );
}
