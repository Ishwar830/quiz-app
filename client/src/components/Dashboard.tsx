import {
  ArrowRight,
  GamepadIcon,
  Library,
  PlaySquare,
  Sparkles,
  SquarePlus,
  Users,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import UserAvatar from './UserAvatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { JoinRoomForm } from './Forms/JoinRoomForm';
import { AiRoomForm } from './Forms/AiRoomForm';
import type { User } from 'better-auth';
import type { ReactNode } from 'react';

export function Dashboard({ user }: { user: User }) {
  return (
    <div className='space-y-6'>
      <DashboardHeader
        username={user.name}
        imageUrl={user.image ?? undefined}
      />
      <DashboardContent />
    </div>
  );
}

function DashboardHeader({
  username,
  imageUrl,
}: {
  username: string;
  imageUrl?: string;
}) {
  return (
    <header className="p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex gap-4 items-center">
        <UserAvatar name={username} imageUrl={imageUrl} size="lg" />
        <div>
          <div className="text-lg flex flex-wrap items-baseline gap-x-2">
            <span>Welcome</span>
            <span className="text-2xl font-medium text-secondary-500">
              {username}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ready to challenge friends or build something ?
          </p>
        </div>
      </div>
    </header>
  );
}

function DashboardContent() {
  return (
    <main>
      <div className="grid sm:grid-cols-2 gap-3">
        <ActionCard
          href="/quizzes"
          icon={<PlaySquare size={20} />}
          title="Create Room"
          description="Host a live quiz game"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <JoinRoomCard />
        <AIRoomCard />
        <ActionCard
          href="/games"
          icon={<GamepadIcon size={20} />}
          title="Past Games"
          description="Review your game history"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <ActionCard
          href="/quizzes"
          icon={<Library size={20} />}
          title="My Quizzes"
          description="Browse your quiz collection"
          iconBg="bg-secondary-100"
          iconColor="text-secondary-600"
        />
        <ActionCard
          href="/quizbuilder/{-$quizId}"
          icon={<SquarePlus size={20} />}
          title="Build Quiz"
          description="Create a custom quiz"
          iconBg="bg-accent-100"
          iconColor="text-accent-700"
        />
      </div>
    </main>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Link to={href}>
      <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl ${iconBg} ${iconColor} grid place-items-center`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-text-900">{title}</p>
          <p className="text-xs text-text-400 truncate">{description}</p>
        </div>
        <ArrowRight
          size={16}
          className="text-text-300 group-hover:text-text-600 group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
        />
      </div>
    </Link>
  );
}

function JoinRoomCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-100 text-blue-600 grid place-items-center">
            <Users size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-900">Join Room</p>
            <p className="text-xs text-text-400 truncate">
              Enter a code to join a live session
            </p>
          </div>
          <ArrowRight
            size={16}
            className="text-text-300 group-hover:text-text-600 group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="font-sora">
        <DialogHeader className="text-start">
          <DialogTitle className="text-lg font-semibold">
            Join an Existing Room
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-pretty">
            Enter room code and your role to join the quiz session
          </DialogDescription>
        </DialogHeader>
        <JoinRoomForm />
      </DialogContent>
    </Dialog>
  );
}

function AIRoomCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-100 text-primary-600 grid place-items-center">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-900">AI Quiz</p>
            <p className="text-xs text-text-400 truncate">
              Generate a quiz with AI
            </p>
          </div>
          <ArrowRight
            size={16}
            className="text-text-300 group-hover:text-text-600 group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="font-sora">
        <DialogHeader className="text-start">
          <DialogTitle className="text-lg font-semibold">AI Quiz</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter topics to generate quiz
          </DialogDescription>
        </DialogHeader>
        <AiRoomForm />
      </DialogContent>
    </Dialog>
  );
}
