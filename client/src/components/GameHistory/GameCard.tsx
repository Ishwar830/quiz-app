import { ArrowRightIcon, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export interface UserGameMeta {
  id: string;
  quizTitle: string;
  endedAt: string;
  rank: number;
  score: number;
}

export function GameCard({ game }: { game: UserGameMeta }) {
  return (
    <div className="hover:scale-101 hover:-translate-y-1 shadow-sm transition-transform duration-300 group p-4 border rounded-lg space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(game.endedAt).toLocaleDateString()}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
        <span className="text-xs font-medium text-slate-400">
          {new Date(game.endedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="font-semibold">{game.quizTitle}</p>
      <div className="flex gap-6 items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-muted-foreground">Rank</span>
          <span className="text-lg text-primary-600 font-extrabold">
            #{game.rank}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-muted-foreground">Score</span>
          <span className="text-lg text-secondary-500 font-extrabold">
            {game.score}
          </span>
        </div>
      </div>
      <div className="text-xs w-fit">
        <Link
          to="/games/$gameId"
          className="flex items-center gap-1 hover:underline"
          params={{ gameId: game.id }}
        >
          <span>See complete info</span>
          <ArrowRightIcon size={12} />
        </Link>
      </div>
    </div>
  );
}
