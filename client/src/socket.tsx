import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { User } from 'better-auth';

const socket = io({
  autoConnect: false,
});

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  socket.auth = { userId: user.id };

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
}
