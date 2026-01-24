import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { auth } from '@/lib/authClient';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await auth.getSession();
    if (data?.user) {
      return {
        user: data.user,
      };
    }
    throw redirect({ to: '/login' });
  },
});

function RouteComponent() {
  return <Outlet />;
}
