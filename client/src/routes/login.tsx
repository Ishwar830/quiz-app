import { createFileRoute } from '@tanstack/react-router';
import { LoginCard } from '@/components/LoginCard';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-10">
      <LoginCard />
    </div>
  );
}
