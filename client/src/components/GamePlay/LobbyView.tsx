import { useState } from 'react';
import { useMember } from '@/stores/MemberStore';
import { useGameRoom } from '@/stores/GameStore';
import { useSocket } from '@/socket';

export default function LobbyView() {
  const [copied, setCopied] = useState(false);
  const room = useGameRoom();
  const member = useMember();
  const socket = useSocket();

  const isHost = member.id === room.host.id;

  const handleStartQuiz = () => {
    socket.emit('quiz:start');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
      <div className="text-center mb-8 border-b pb-6 border-gray-100">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
          Quiz Topic
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-1">
          {room.quizMeta.topics}
        </h1>
        <p className="text-gray-500 text-sm">
          Hosted by{' '}
          <span className="font-medium text-gray-800">{room.host.name}</span>
        </p>
      </div>

      <div>
       
        <div className="flex flex-col gap-6">
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              Room Code
            </p>
            <button
              onClick={copyCode}
              className="text-4xl font-mono font-bold text-slate-800 tracking-widest hover:text-indigo-600 transition-colors cursor-pointer w-full"
              title="Click to copy"
            >
              {room.id}
            </button>
            <p className="text-xs h-4 mt-2 text-green-600 font-medium transition-opacity">
              {copied ? 'Copied to clipboard!' : 'Click code to copy'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
        {isHost ? (
          <div className="w-full max-w-sm text-center">
            <button
              onClick={handleStartQuiz}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-0.5"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-pulse">
            <div className="text-xl font-medium text-slate-700">
              Waiting for host to start...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
