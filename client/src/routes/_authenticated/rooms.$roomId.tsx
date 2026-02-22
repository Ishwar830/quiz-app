import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SocketProvider } from '@/socket';
import { GameStoreContext, createGameStore } from '@/stores/GameStore';
import { MemberStoreContext, createMemberStore } from '@/stores/MemberStore';
import { GameLayout } from '@/components/GamePlay/GameLayout';
import { getGameStatus } from '@/api/room.api';

export const Route = createFileRoute('/_authenticated/rooms/$roomId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data, error } = await getGameStatus(params.roomId);
    if (data) return data;
    throw new Error(error?.message);
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const { memberState, gameState } = Route.useLoaderData();
  const [gameStore] = useState(() => createGameStore(gameState));
  const [memberStore] = useState(() => createMemberStore(memberState));

  return (
    <SocketProvider user={user!}>
      <GameStoreContext.Provider value={gameStore}>
        <MemberStoreContext.Provider value={memberStore}>
          <GameLayout />
        </MemberStoreContext.Provider>
      </GameStoreContext.Provider>
    </SocketProvider>
  );
}
