import { createFileRoute } from '@tanstack/react-router';
import { GamepadIcon } from 'lucide-react';
import type { UserGameMeta } from '@/components/GameHistory/GameCard';
import { GameCard } from '@/components/GameHistory/GameCard';

export const Route = createFileRoute('/_authenticated/(games)/games')({
  component: RouteComponent,
  loader: getUserGames,
});

async function getUserGames() {
  const res = await fetch('/api/games');
  if (res.ok) {
    return (await res.json()) as Array<UserGameMeta>;
  }
  throw new Error('Failed to fetch games');
}

function RouteComponent() {
  const userGames = Route.useLoaderData();
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 grid place-items-center">
            <GamepadIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-900">Past Games</h1>
            <p className="text-xs text-text-400">
              Review your game performance history
            </p>
          </div>
        </div>
      </header>
      <main>
        {userGames.length === 0 ? (
          <div className="text-center py-12 text-text-400">
            <GamepadIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No games played yet</p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {userGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </ul>
        )}
      </main>
    </section>
  );
}
