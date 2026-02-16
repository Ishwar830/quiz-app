import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export interface UserGameMeta {
  id: string;
  quizTitle: string;
  endedAt: string;
  rank: number;
  score: number;
}

export function GameCard({ game }: { game: UserGameMeta }) {
  let rankStyle = 'bg-gray-200 text-gray-600';
  if (game.rank === 1) rankStyle = 'bg-amber-100 text-amber-600';
  if (game.rank === 2) rankStyle = 'bg-slate-100 text-slate-600';
  if (game.rank === 3) rankStyle = 'bg-orange-100 text-orange-600';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 space-y-3">
      <div className="flex items-center gap-2 text-text-400">
        <Calendar size={12} />
        <span className="text-xs font-medium">
          {new Date(game.endedAt).toLocaleDateString()}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="text-xs font-medium">
          {new Date(game.endedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <p className="font-semibold text-text-900">{game.quizTitle}</p>

      <div className="flex gap-3">
        <div
          className={`${rankStyle} flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold`}
        >
          <span className="text-xs">Rank</span>
          <span>#{game.rank}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-sm font-bold">
          <span className="text-xs">Score</span>
          <span>{game.score}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/games/$gameId"
          params={{ gameId: game.id }}
          className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
        >
          My Performance
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <Link
          to="/games/$gameId/leaderboard"
          params={{ gameId: game.id }}
          className="text-xs font-medium text-secondary-500 hover:text-secondary-600 flex items-center gap-1 transition-colors"
        >
          Leaderboard
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}
