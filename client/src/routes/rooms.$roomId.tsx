import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/rooms/$roomId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const roomId = params.roomId;
    return await getRoomInfo(roomId);
  },
});

async function getRoomInfo(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}`);
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }
  const { data } = await res.json();
  return data;
}

function RouteComponent() {
  const roomData = Route.useLoaderData();
  console.log(roomData);
  return <div>Hello "/rooms/$roomId"!</div>;
}
