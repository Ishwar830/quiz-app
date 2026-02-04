import { useCountdownInfo, useGameRoom } from '@/stores/GameStore';
import { useTimer } from '@/hooks/useTimer';

export default function CountDownView() {
  const { quizMeta } = useGameRoom();
  const { title } = quizMeta;

  return (
    <div className="min-h-dvh max-w-3xl mx-auto px-6 py-12 flex flex-col justify-between items-center gap-6">
      <header className="flex flex-col items-center">
        <h1 className="text-2xl font-cascadia tracking-wider font-black truncate text-center uppercase">
          {title}
        </h1>
        <div className="h-1 w-12 bg-primary-500 mt-2" />
      </header>

      <main>
        <CountdownTimer />
      </main>

      <footer>
        <p className="text-xs font-bold text-text-500 text-center max-w-70">
          Please stay on this screen. The question will begin automatically.
        </p>
      </footer>
    </div>
  );
}

function CountdownTimer() {
  const countdownInfo = useCountdownInfo();
  const endTime = countdownInfo!.endsAt;
  const timeLeft = useTimer(endTime);

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-8xl bg-gray-100 font-bold tracking-tighter tabular-nums flex items-center justify-center  shadow-2xl rounded-full size-50 sm:size-60 border-4 border-gray-800">
        <span className='text-primary-800'>{timeLeft}</span>
      </div>

      <p className="text-sm font-bold uppercase text-text-800 tracking-wider">
        Get Ready
      </p>
    </div>
  );
}
