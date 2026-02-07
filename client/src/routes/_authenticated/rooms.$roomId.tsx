import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SocketProvider } from '@/socket';
import { GameStoreContext, createGameStore } from '@/stores/GameStore';
import { MemberStoreContext, createMemberStore } from '@/stores/MemberStore';
import { GameLayout } from '@/components/GamePlay/GameLayout';

export const Route = createFileRoute('/_authenticated/rooms/$roomId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const roomId = params.roomId;
    return await getGameStatus(roomId);
  },
});

async function getGameStatus(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}`);
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}

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
