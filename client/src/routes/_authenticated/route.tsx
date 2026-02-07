import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (user == null) throw redirect({ to: '/login' });
  },
});

function RouteComponent() {
  return <Outlet />;
}
