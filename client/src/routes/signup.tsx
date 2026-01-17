import { createFileRoute } from '@tanstack/react-router';
import { SignUpCard } from '@/components/SignupCard';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-10">
      <SignUpCard />
    </div>
  );
}
