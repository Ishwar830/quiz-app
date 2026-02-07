import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/Dashboard';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const {user} = Route.useRouteContext()
  return <Dashboard user={user!} />;
}
