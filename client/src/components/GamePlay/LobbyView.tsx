import { useState } from 'react';
import {
  Check,
  CircleHelp,
  Copy,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { TopicList } from '../General/TopicList';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMember } from '@/stores/MemberStore';
import { useGameRoom } from '@/stores/GameStore';
import { useSocket } from '@/socket';

export default function LobbyView() {
  const room = useGameRoom();
  const member = useMember();

  const isHost = member.id === room.host.id;

  const { title, description, topics, totalQuestions } = room.quizMeta;

  return (
    <div className="space-y-4">
      <LobbyHeader
        title={title}
        description={description}
        hostname={room.host.name}
      />

      <LobbyContent topics={topics} totalQuestions={totalQuestions} />

      <LobbyFooter isHost={isHost} roomCode={room.id} />
    </div>
  );
}

interface LobbyHeaderProps {
  title: string;
  description: string;
  hostname: string;
}

function LobbyHeader({ title, description, hostname }: LobbyHeaderProps) {
  return (
    <Card className="relative overflow-hidden bg-linear-to-br from-primary-300 to-primary-500">
      <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 size-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <CardHeader>
        <div className="flex gap-2">
          <div className="shrink-0 grow-0 size-14 rounded-xl shadow-lg grid place-items-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-white/40">
            <Trophy size={32} className="stroke-accent-500" />
          </div>
          <div>
            <p className="text-xs space-x-2">
              <span>Hosted by</span>
              <span className="text-sm font-bold">{hostname}</span>
            </p>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

interface LobbyContentProps {
  topics: Array<string>;
  totalQuestions: number;
}

function LobbyContent({ topics, totalQuestions }: LobbyContentProps) {
  return (
    <main className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Topics */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-400 flex items-center gap-2">
          <Sparkles size={14} className="stroke-secondary-400" />
          Topics
        </h2>
        <TopicList>
          {topics.map((topic) => (
            <TopicList.Item key={topic}>{topic}</TopicList.Item>
          ))}
        </TopicList>
      </div>

      {/* Question count */}
      <div className="flex items-center gap-2.5 bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-2.5 w-fit">
        <CircleHelp size={16} className="stroke-secondary-500" />
        <span className="text-sm font-semibold text-secondary-700">
          {totalQuestions} Questions
        </span>
      </div>
    </main>
  );
}

function LobbyFooter({
  isHost,
  roomCode,
}: {
  isHost: boolean;
  roomCode: string;
}) {
  return (
    <footer className='space-y-4'>
      <RoomCodeButton roomCode={roomCode} />
      {isHost ? (
        <StartQuizButton />
      ) : (
        <p className="text-center text-lg mt-4 animate-pulse">
          Waiting for host to start quiz...
        </p>
      )}
    </footer>
  );
}

function RoomCodeButton({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-400">
        Room Code
      </h2>
      <button
        onClick={copyCode}
        className="group w-full flex items-center justify-between bg-linear-to-r from-secondary-400 to-secondary-500 rounded-xl px-6 py-4 text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        aria-label="Copy room code"
      >
        <span className="text-2xl sm:text-3xl font-bold tracking-[0.3em] font-mono">
          {roomCode}
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          {copied ? (
            <>
              <Check size={18} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} />
              Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}

function StartQuizButton() {
  const socket = useSocket();

  const handleStartQuiz = () => {
    socket.emit('quiz:start');
  };

  return (
    <button
      onClick={handleStartQuiz}
      className="w-full flex justify-center items-center gap-2 group hover:-translate-y-0.5 transition-all duration-300 border shadow-md font-bold py-5 rounded-xl text-lg text-white tracking-widest bg-linear-to-r from-sky-500 to-sky-600 hover:cursor-pointer"
    >
      <Play className="fill-white stroke-gray-50 group-hover:scale-110 duration-300" />
      Start Quiz
    </button>
  );
}
