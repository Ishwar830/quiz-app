import { createFileRoute } from '@tanstack/react-router';
import type { UserGameMeta } from '@/components/GameHistory/GameCard';
import { GameCard } from '@/components/GameHistory/GameCard';

export const Route = createFileRoute('/_authenticated/games')({
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
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-secondary-400">Past Games</h1>
        <p className="text-sm text-muted-foreground">
          See your past game performance
        </p>
      </header>
      <main>
        <ul className="grid gap-2">
          {userGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      </main>
    </section>
  );
}
