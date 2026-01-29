import { TrendingUp } from 'lucide-react';
import { useCountdownInfo, useGameRoom } from '@/stores/GameStore';
import { useMember } from '@/stores/MemberStore';
import { useTimer } from '@/hooks/useTimer';

export default function CountDownView() {
  const { quizMeta } = useGameRoom();
  const { role } = useMember();

  const { title } = quizMeta;
  return (
    <div className="min-h-dvh max-w-2xl mx-auto p-4 grid grid-rows-[60px_1fr_120px]">
      <p className="self-center text-2xl">{title}</p>
      <CountdownTimer />
      {role === 'PLAYER' && <Stats />}
    </div>
  );
}

function CountdownTimer() {
  const countdownInfo = useCountdownInfo();
  const endTime = countdownInfo!.endsAt;
  const timeLeft = useTimer(endTime);
  
  return (
    <div className="place-self-center">
      <div className="grid justify-center place-items-center gap-4 p-2">
        <p className="text-3xl">Get Ready !!!</p>
        <div className="grid place-items-center rounded-full size-32  bg-gray-200">
          <p className="text-8xl font-medium">{timeLeft}</p>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const { score } = useMember();
  return (
    <div className="flex items-start">
      <div className="border rounded-lg p-3 grid bg-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp /> <span className="text-lg">Score</span>
        </div>
        <p className="text-3xl text-center">{score ?? 0}</p>
      </div>
    </div>
  );
}
