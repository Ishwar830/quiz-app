import { useCountdownInfo, useGameRoom } from '@/stores/GameStore';
import { useTimer } from '@/hooks/useTimer';

export default function CountDownView() {
  const { quizMeta } = useGameRoom();
  const { title } = quizMeta;

  return (
    <div className="min-h-dvh max-w-2xl mx-auto px-6 py-12 flex flex-col justify-between items-center gap-6">
      <header className="flex flex-col items-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center uppercase">
          {title}
        </h1>
        <div className="h-1 w-12 bg-slate-900 mt-2" />
      </header>

      <main>
        <CountdownTimer />
      </main>

      <footer>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center max-w-70">
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
      <div className="text-8xl bg-slate-100 font-bold tracking-tighter tabular-nums flex items-center justify-center  shadow-2xl rounded-full size-50 sm:size-60 border-4 border-slate-600">
        <span>{timeLeft}</span>
      </div>

      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
        Get Ready
      </p>
    </div>
  );
}
