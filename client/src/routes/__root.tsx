import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';

interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  image?: string | null | undefined;
}

interface RouterContext {
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
      <div className='min-h-dvh bg-background-50/50 text-text-900 font-sora'>
        <Outlet />
      </div>
    </>
  ),
});
