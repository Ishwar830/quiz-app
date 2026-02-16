import { createFileRoute } from '@tanstack/react-router';
import { LoginCard } from '@/components/Forms/LoginCard';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='p-4 h-full grid items-center'>
      <LoginCard />
    </div>
  );
}
