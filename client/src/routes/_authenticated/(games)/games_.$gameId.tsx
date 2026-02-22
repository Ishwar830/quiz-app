import { createFileRoute } from '@tanstack/react-router';
import {
  GameDetailsContent,
  GameDetailsHeader,
} from '@/components/GameHistory/GameDetails';
import { getGameDetails } from '@/api/games.api';

export const Route = createFileRoute('/_authenticated/(games)/games_/$gameId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data, error } = await getGameDetails(params.gameId);
   if (data) return data;
   throw new Error(error?.message);
  },
});

function RouteComponent() {
  const gameDetails = Route.useLoaderData();
  return (
    <div className="space-y-4">
      <GameDetailsHeader gameDetails={gameDetails} />
      <GameDetailsContent gameDetails={gameDetails} />
    </div>
  );
}
