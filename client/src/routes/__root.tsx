import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';
import {
  GamepadIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  LogOutIcon,
  MenuIcon,
  SquarePlusIcon,
  X,
} from 'lucide-react';
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
              className="w-9 h-9 rounded-xl hover:bg-slate-200 grid place-items-center transition-colors cursor-pointer"
            >
              {isOpen ? <X size={18} /> : <MenuIcon size={18} />}
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

const navList = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboardIcon size={18} />,
    color: 'text-primary-500 bg-primary-50',
  },
  {
    title: 'My Quizzes',
    href: '/quizzes',
    icon: <LibraryIcon size={18} />,
    color: 'text-secondary-500 bg-secondary-50',
  },
  {
    title: 'Quiz Builder',
    href: '/quizbuilder',
    icon: <SquarePlusIcon size={18} />,
    color: 'text-accent-600 bg-accent-50',
  },
  {
    title: 'Past Games',
    href: '/games',
    icon: <GamepadIcon size={18} />,
    color: 'text-orange-500 bg-orange-50',
  },
];

function Menu({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean;
  closeMenu: () => void;
}) {
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    closeMenu();
    navigate({ to: href });
  };

  const handleLogout = async () => {
    const { data } = await auth.signOut();
    if (data?.success) {
      handleNavigation('/');
    }
  };

  return (
    <div
      className={cn(
        'absolute right-0 top-0 translate-y-14 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 transition-all duration-200 origin-top-right',
        isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none',
      )}
    >
      <nav className="flex flex-col gap-0.5">
        {navList.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            onClick={() => closeMenu()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-text-700"
          >
            <span
              className={cn(
                'w-8 h-8 rounded-lg grid place-items-center',
                item.color,
              )}
            >
              {item.icon}
            </span>
            {item.title}
          </Link>
        ))}
        <div className="my-1 border-t border-slate-100" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium text-red-500 w-full text-start cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 grid place-items-center">
            <LogOutIcon size={18} />
          </span>
          Log Out
        </button>
      </nav>
    </div>
  );
}
