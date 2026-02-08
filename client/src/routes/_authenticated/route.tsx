import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { user } = context;

    if (user == null) throw redirect({ to: '/login' });
  },
});

function RouteComponent() {
  return (
    <div className="size-full max-w-3xl mx-auto p-4">
      <Outlet />
    </div>
  );
}
