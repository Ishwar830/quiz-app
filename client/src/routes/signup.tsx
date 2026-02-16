import { createFileRoute } from '@tanstack/react-router';
import { SignUpCard } from '@/components/Forms/SignupCard';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4 h-full grid items-center">
      <SignUpCard />
    </div>
  );
}
