import { useEffect } from 'react';
import LobbyView from './LobbyView';
import CountDownView from './CountDownView';
import QuizView from './QuizView';
import { useSocket } from '@/socket';
import { useGameActions, useGameRoom, useGameStatus } from '@/stores/GameStore';

export function GameLayout() {
  const socket = useSocket();

  const gameStatus = useGameStatus();
  const room = useGameRoom();
  const { updateQuestionInfo, updateCountdownInfo, updateGameStatus } =
    useGameActions();

  useEffect(() => {
    socket.emit('room:join', room.id);

    socket.on('question:update', (questionInfo) => {
      updateQuestionInfo(questionInfo);
    });
    socket.on('question:countdown', (countdownInfo) => {
      updateCountdownInfo(countdownInfo);
    });

    socket.on('quiz:end', () => {
      updateGameStatus('FINISHED');
    });

    // eslint-disable-next-line @typescript-eslint/array-type
    const catchAllListener = (event: any, ...args: any[]) => {
      console.log(event, '  ', args);
    };

    socket.onAny(catchAllListener);

    socket.onAnyOutgoing(catchAllListener);

    return () => {
      socket.off('question:update');
      socket.off('question:countdown');
      socket.off('quiz:end');
      socket.offAny();
      socket.offAnyOutgoing();
      socket.volatile.emit('room:leave');
    };
  }, []);

  if (gameStatus == 'WAITING') return <LobbyView />;
  if (gameStatus == 'COUNTDOWN') return <CountDownView />;
  if (gameStatus == 'QUESTION_ACTIVE') return <QuizView />;
  return <div>Quiz Finished. Thanks for playing!!!</div>;
}
