import {
  ArrowRight,
  Library,
  PlaySquare,
  Sparkles,
  SquarePlus,
  Users,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import UserAvatar from './UserAvatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { JoinRoomForm } from './JoinRoomForm';
import { AiRoomForm } from './AiRoomForm';
import type { User } from 'better-auth';

export function Dashboard({ user }: { user: User }) {
  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
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
          <div className="text-xl">
            Welcome
            <span className="text-2xl ml-2 font-medium text-secondary-500">{username}</span>
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
    <main className="mt-4">
      <div className="grid gap-4">
        <CreateRoomCard />
        <JoinRoomCard />
        <AIRoomCard />
        <BrowseQuizCard />
        <BuildQuizCard />
      </div>
    </main>
  );
}

function CreateRoomCard() {
  return (
    <Link to="/quizzes">
      <Card className="hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300 group">
        <CardContent className="space-y-3">
          <PlaySquare className="stroke-green-600 rounded-2xl p-2 bg-green-100 size-10" />
          <CardTitle className="flex gap-2 items-center">
            <span>Create Room</span>
            <span className="group-hover:translate-x-1 duration-300">
              <ArrowRight size={16} className="stroke-green-600" />
            </span>
          </CardTitle>
          <CardDescription>Host a game</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

function JoinRoomCard() {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300 group">
          <CardContent className="space-y-3">
            <Users className="stroke-blue-600 rounded-2xl p-2 bg-blue-100 size-10" />
            <CardTitle className="flex gap-2 items-center">
              <span>Join Room</span>
              <span className="group-hover:translate-x-1 duration-300">
                <ArrowRight size={16} className="stroke-blue-600" />
              </span>
            </CardTitle>
            <CardDescription className="text-start">
              Have a game code? Enter it here to jump into a live session.
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="font-sora">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Join an Existing Room
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter room code and your role to join the quiz session
          </DialogDescription>
        </DialogHeader>
        <JoinRoomForm />
      </DialogContent>
    </Dialog>
  );
}

function BrowseQuizCard() {
  return (
    <Link to="/quizzes">
      <Card className="hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300 group">
        <CardContent className="space-y-3">
          <Library className="stroke-secondary-600 rounded-2xl p-2 bg-secondary-100 size-10" />
          <CardTitle className="flex gap-2 items-center">
            <span>My Quiz Collection</span>
            <span className="group-hover:translate-x-1 duration-300">
              <ArrowRight size={16} className="stroke-secondary-600" />
            </span>
          </CardTitle>
          <CardDescription>Browse your quizzes</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

function BuildQuizCard() {
  return (
    <Link to="/quizbuilder/{-$quizId}">
      <Card className="hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300 group">
        <CardContent className="space-y-3">
          <SquarePlus className="stroke-accent-700 rounded-2xl p-2 bg-accent-100 size-10" />
          <CardTitle className="flex gap-2 items-center">
            <span>Build Custom Quiz</span>
            <span className="group-hover:translate-x-1 duration-300">
              <ArrowRight size={16} className="stroke-accent-600" />
            </span>
          </CardTitle>
          <CardDescription>Create a new quiz</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

function AIRoomCard() {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300 group">
          <CardContent className="space-y-3">
            <Sparkles className="stroke-primary-600 rounded-2xl p-2 bg-primary-100 size-10" />
            <CardTitle className="flex gap-2 items-center">
              <span>AI Quiz</span>
              <span className="group-hover:translate-x-1 duration-300">
                <ArrowRight size={16} className="stroke-primary-600" />
              </span>
            </CardTitle>
            <CardDescription className="text-start">
              Generate quiz using AI
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="font-sora">
        <DialogHeader>
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
