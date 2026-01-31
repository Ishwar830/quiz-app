import { useState } from 'react';
import { Check, Copy, Hash, TrophyIcon } from 'lucide-react';
import { useMember } from '@/stores/MemberStore';
import { useGameRoom } from '@/stores/GameStore';
import { useSocket } from '@/socket';

export default function LobbyView() {
  const room = useGameRoom();
  const member = useMember();

  const isHost = member.id === room.host.id;

  const { title, description, topics, totalQuestions } = room.quizMeta;

  return (
    <div className="min-h-dvh max-w-2xl p-4 mx-auto">
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
    <div className="bg-linear-to-r from-gray-800 to-gray-900 p-4 sm:px-8 sm:py-10 text-white rounded-lg">
      <div className="grid gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="size-12 bg-gray-500 rounded-lg grid place-items-center">
            <TrophyIcon size={32} stroke="white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              Hosted by <span className="text-gray-100">{hostname}</span>
            </p>
            <h1 className="text-3xl font-bold tracking-wide">{title}</h1>
          </div>
        </div>

        <p className="text-gray-200 leading-relaxed">{description}</p>
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
        <ul className="flex gap-2">
          {topics.map((topic, index) => (
            <li
              className="list-none border text-sm rounded-lg p-1 bg-gray-200"
              key={index}
            >
              {topic}
            </li>
          ))}
        </ul>
        <div>
          <div className="rounded-sm border bg-gray-100 p-2 w-fit">
            <div className="flex items-center gap-1">
              <Hash size={16} />
              <span>Questions</span>
            </div>
            <p className="text-center text-2xl">{totalQuestions}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Room Code
        </h2>
        <button
          onClick={copyCode}
          className="flex items-center gap-4 justify-center w-full bg-gray-900 rounded-xl px-6 py-4 hover:bg-gray-800"
          aria-label="Copy room code"
        >
          <span className="text-3xl font-mono font-bold text-white tracking-widest text-center">
            {roomCode}
          </span>
          <span className="text-white">
            {copied ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <Copy className="w-6 h-6" />
            )}
          </span>
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
          className="w-full bg-gray-900 text-white font-bold py-5 rounded-xl text-lg"
        >
          Start Quiz
        </button>
      ) : (
        <p className="text-center text-lg text-gray-500 mt-4 animate-pulse">
          Waiting for host to start quiz...
        </p>
      )}
    </>
  );
}
