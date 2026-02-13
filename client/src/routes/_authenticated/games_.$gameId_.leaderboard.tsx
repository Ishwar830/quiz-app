import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';

const leaderboardSearchSchema = z.object({
  page: z.number().int().positive().min(1).catch(1),
});

export const Route = createFileRoute(
  '/_authenticated/games_/$gameId_/leaderboard',
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
  console.log(data);
  return (
    <div>
      <h1 className="text-xl font-semibold text-secondary-400 mb-4">
        Leaderboard
      </h1>
      <ListRankings rankings={data.items} />
      <PaginationControls totalPages={data.totalPages} />
    </div>
  );
}

function ListRankings({ rankings }: { rankings: Array<Rank> }) {
  return (
    <div className="overflow-hidden bg-white rounded-md border border-slate-400 shadow-xs">
      <div className="grid grid-cols-[60px_1fr_80px] gap-4 p-3 bg-primary-300 text-xs font-semibold uppercase border-b border-gray-800">
        <div>Rank</div>
        <div>Player</div>
        <div className="text-center">Score</div>
      </div>

      <div className="divide-y divide-slate-500/50">
        {rankings.map((r) => {
          return (
            <div
              key={r.id}
              className="grid grid-cols-[60px_1fr_80px] gap-4 p-3 items-center hover:bg-primary-50"
            >
              <div className="text-center font-bold">{r.rank}</div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-3 overflow-hidden">
                <UserAvatar name={r.name} />
                <span className="font-medium truncate">{r.name}</span>
              </div>
              <div className="text-center font-semibold">
                {r.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {rankings.length === 0 && (
        <div className="p-8 text-center">
          <MoreHorizontal className="mx-auto mb-2 opacity-50" />
          <p>No more players to show</p>
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
    <div className="flex items-center justify-around px-2 mt-6">
      <button
        onClick={() => handlePageChange(1)}
        className="flex items-center gap-1 text-secondary-400 px-2 p-1 border-2 border-secondary-200 rounded"
      >
        <ChevronLeft size={16} /> First
      </button>

      <div className="flex gap-2">
        {nextPages.map((pageNum) => {
          if (pageNum > totalPages || pageNum < 0) return null;
          return (
            <button
              onClick={() => handlePageChange(pageNum)}
              key={pageNum}
              className={cn(
                'rounded-sm size-8 grid place-items-center p-1 bg-accent-300',
                {
                  'bg-primary-400': page === pageNum,
                },
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(totalPages)}
        className="flex items-center gap-1 text-secondary-400 px-2 p-1 border-2 border-secondary-200 rounded"
      >
        Last <ChevronRight size={16} />
      </button>
    </div>
  );
}
