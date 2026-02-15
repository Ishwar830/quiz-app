import { createFileRoute } from '@tanstack/react-router';
import type { UserGameDetail } from '@/components/GameHistory/GameDetails';
import {
  GameDetailsContent,
  GameDetailsHeader,
} from '@/components/GameHistory/GameDetails';

export const Route = createFileRoute('/_authenticated/(games)/games_/$gameId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return (await getGameDetails(params.gameId)) as UserGameDetail;
  },
});

async function getGameDetails(gameId: string) {
  const res = await fetch(`/api/games/${gameId}`);
  if (res.ok) {
    return await res.json();
  }

  throw new Error('Failed to fetch game details');
}

function RouteComponent() {
  const gameDetails = Route.useLoaderData();
  return (
    <div className='space-y-4'>
      <GameDetailsHeader gameDetails={gameDetails} />
      <GameDetailsContent gameDetails={gameDetails} />
    </div>
  );
}
