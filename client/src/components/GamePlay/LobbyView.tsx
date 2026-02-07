import { useState } from 'react';
import {
  Check,
  CircleQuestionMarkIcon,
  Copy,
  Play,
  Trophy,
} from 'lucide-react';
import { useMember } from '@/stores/MemberStore';
import { useGameRoom } from '@/stores/GameStore';
import { useSocket } from '@/socket';

export default function LobbyView() {
  const room = useGameRoom();
  const member = useMember();

  const isHost = member.id === room.host.id;

  const { title, description, topics, totalQuestions } = room.quizMeta;

  return (
    <div className="min-h-dvh max-w-3xl p-4 mx-auto">
      <LobbyHeader
        title={title}
        description={description}
        hostname={room.host.name}
      />

      <LobbyContent
        topics={topics}
        totalQuestions={totalQuestions}
        roomCode={room.id}
      />

      <LobbyFooter isHost={isHost} />
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
    <div className="overflow-hidden bg-linear-to-br from-primary-200 to-primary-100 border p-4 sm:px-8 sm:py-10 shadow-md text-deep-space-blue-800 rounded-lg">
      <div className="grid gap-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-14 border-2 border-gray-800 rounded-xl shadow-lg grid place-items-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-white">
            <Trophy size={32} className="stroke-accent-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">
              Hosted by <span className="text-sm">{hostname}</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        <p className="leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}

interface LobbyContentProps {
  topics: Array<string>;
  totalQuestions: number;
  roomCode: string;
}

function LobbyContent({ topics, totalQuestions, roomCode }: LobbyContentProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <h2 className="border-b-2 border-secondary-500 w-fit">Topics</h2>
          <ul className="flex gap-2">
            {topics.map((topic, index) => (
              <li
                className="list-none border text-sm rounded-lg p-1 px-2 bg-accent-100"
                key={index}
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="rounded-sm border bg-primary-50 p-2 w-fit">
            <div className="flex items-center gap-2">
              <CircleQuestionMarkIcon size={16} />
              <span>{totalQuestions} Questions</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-deep-space-blue-700 uppercase tracking-wider mb-3">
          Room Code
        </h2>
        <button
          onClick={copyCode}
          className="flex items-center gap-4 justify-center w-full bg-secondary-400 rounded-xl px-6 py-4 hover:bg-secondary-500 border text-white"
          aria-label="Copy room code"
        >
          <span className="text-3xl font-bold tracking-widest text-center">
            {roomCode}
          </span>
          <span className="w-6 h-6">{copied ? <Check /> : <Copy />}</span>
        </button>
      </div>
    </div>
  );
}

function LobbyFooter({ isHost }: { isHost: boolean }) {
  const socket = useSocket();

  const handleStartQuiz = () => {
    if (isHost) socket.emit('quiz:start');
  };

  return (
    <>
      {isHost ? (
        <button
          onClick={handleStartQuiz}
          className="w-full flex justify-center items-center gap-2 bg-primary-400 hover:bg-primary-500 hover:scale-[1.02] transition-transform duration-100 border shadow-md font-bold py-5 rounded-xl text-lg"
        >
          <Play className="fill-white stroke-gray-50" />
          Start Quiz
        </button>
      ) : (
        <p className="text-center text-lg mt-4 animate-pulse">
          Waiting for host to start quiz...
        </p>
      )}
    </>
  );
}
