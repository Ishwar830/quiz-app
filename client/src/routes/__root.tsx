import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';
import { MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from 'better-auth';
import UserAvatar from '@/components/UserAvatar';
import { auth } from '@/lib/authClient';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RouterContext {
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await auth.getSession();

    if (data == null) return null;
    return {
      user: data.user,
    };
  },
});

function RouteComponent() {
  return (
    <>
      <ToastContainer
        position="top-center"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
      <div className="min-h-dvh grid grid-rows-[auto_1fr] relative bg-slate-50 font-sora">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const { user } = Route.useRouteContext();
  return (
    <header className="sticky z-10 top-0 w-full py-4 px-4 md:px-12 shadow-xs bg-slate-100/70 backdrop-blur-sm">
      <div className="h-full relative flex justify-between items-center">
        <span className="font-semibold text-2xl tracking-wider text-secondary-500">
          Quizzy
        </span>
        {user ? (
          <div className="flex gap-4 items-center">
            <span>
              <UserAvatar name={user.name} size="lg" />
            </span>
            <button
              onClick={handleMenuClick}
              className="bg-white p-1 rounded-md hover:bg-blue-400 text-blue-500 hover:text-white hover:cursor-pointer"
            >
              {isOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        ) : (
          <Link to="/login">
            <Button className="bg-white text-black border-black border-2 hover:bg-primary-500 hover:border-primary-600 hover:text-white">
              Login
            </Button>
          </Link>
        )}
        <Menu isOpen={isOpen} closeMenu={closeMenu} />
      </div>
    </header>
  );
}

function Menu({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean;
  closeMenu: () => void;
}) {
  const navList = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'My Quizzes',
      href: '/quizzes',
    },
    {
      title: 'Quiz Builder',
      href: '/quizbuilder',
    },
  ];
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { data } = await auth.signOut();
    if (data?.success) {
      closeMenu();
      navigate({ to: '/' });
    }
  };

  return (
    <div
      className={cn(
        { 'scale-y-0 opacity-0': !isOpen },
        'absolute right-0 top-0 opacity-100 translate-y-14 w-60 shadow-md rounded-md bg-white border p-4 transition-transform duration-200 origin-top',
      )}
    >
      <nav className="space-y-4 flex flex-col">
        {navList.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            activeProps={{ className: 'bg-primary-200' }}
            className="hover:underline p-2 rounded-sm active:bg-primary-200"
          >
            {item.title}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="p-2 rounded-sm text-red-500 text-start hover:cursor-pointer"
        >
          LogOut
        </button>
      </nav>
    </div>
  );
}
