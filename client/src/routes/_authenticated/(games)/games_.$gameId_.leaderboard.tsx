import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trophy,
} from 'lucide-react';
import { z } from 'zod';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';

const leaderboardSearchSchema = z.object({
  page: z.number().int().positive().min(1).catch(1),
});

export const Route = createFileRoute(
  '/_authenticated/(games)/games_/$gameId_/leaderboard',
)({
  validateSearch: leaderboardSearchSchema,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ params, deps: { page } }) => {
    return await getLeaderboard(params.gameId, page);
  },
  component: RouteComponent,
});

interface LeaderboardData {
  items: Array<Rank>;
  totalCount: number;
  totalPages: number;
}

interface Rank {
  id: string;
  name: string;
  score: number;
  rank: number;
}

async function getLeaderboard(
  gameId: string,
  page: number,
): Promise<LeaderboardData> {
  const res = await fetch(`/api/games/${gameId}/rankings?page=${page}`);
  if (res.ok) return await res.json();
  throw new Error('Failed to fetch game rankings');
}

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 grid place-items-center">
          <Trophy size={20} />
        </div>
        <h1 className="text-xl font-bold text-text-900">Leaderboard</h1>
      </div>
      <ListRankings rankings={data.items} />
      <PaginationControls totalPages={data.totalPages} />
    </div>
  );
}

function ListRankings({ rankings }: { rankings: Array<Rank> }) {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-[60px_1fr_80px] gap-4 px-5 py-3 bg-primary-300 text-xs font-bold uppercase tracking-wider">
        <div>Rank</div>
        <div>Player</div>
        <div className="text-center">Score</div>
      </div>

      <div className="divide-y divide-slate-100">
        {rankings.map((r) => {
          const isTop3 = r.rank <= 3;
          return (
            <div
              key={r.id}
              className={cn(
                'grid grid-cols-[60px_1fr_80px] gap-4 px-5 py-3 items-center transition-colors hover:bg-primary-50',
                isTop3 && 'bg-amber-50/50',
              )}
            >
              <div className="text-center">
                {r.rank <= 3 ? (
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                      r.rank === 1 && 'bg-amber-200 text-amber-800',
                      r.rank === 2 && 'bg-slate-200 text-slate-700',
                      r.rank === 3 && 'bg-orange-200 text-orange-700',
                    )}
                  >
                    {r.rank}
                  </span>
                ) : (
                  <span className="font-semibold text-text-400">{r.rank}</span>
                )}
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <UserAvatar name={r.name} />
                <span className="font-medium truncate text-sm">{r.name}</span>
              </div>
              <div className="text-center font-bold text-sm">
                {r.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {rankings.length === 0 && (
        <div className="p-10 text-center text-text-400">
          <MoreHorizontal className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No players to show</p>
        </div>
      )}
    </div>
  );
}

function PaginationControls({ totalPages }: { totalPages: number }) {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  let nextPages = [page - 1, page, page + 1];
  if (page === 1) nextPages = [1, 2, 3];
  else if (page === totalPages)
    nextPages = [totalPages - 2, totalPages - 1, totalPages];

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
        className="flex items-center gap-1 text-xs font-semibold text-secondary-500 px-3 py-2 rounded-xl border border-secondary-200 hover:bg-secondary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={14} /> First
      </button>

      <div className="flex gap-1">
        {nextPages.map((pageNum) => {
          if (pageNum > totalPages || pageNum <= 0) return null;
          return (
            <button
              onClick={() => handlePageChange(pageNum)}
              key={pageNum}
              className={cn(
                'w-8 h-8 rounded-xl text-xs font-semibold grid place-items-center transition-all cursor-pointer',
                page === pageNum
                  ? 'bg-linear-to-r from-primary-400 to-primary-500 text-white shadow-sm'
                  : 'bg-accent-100 hover:bg-accent-200',
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-xs font-semibold text-secondary-500 px-3 py-2 rounded-xl border border-secondary-200 hover:bg-secondary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Last <ChevronRight size={14} />
      </button>
    </div>
  );
}
