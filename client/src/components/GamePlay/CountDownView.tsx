import { useCountdownInfo } from '@/stores/GameStore';
import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

export default function CountDownView() {
  return (
    <div className="relative overflow-hidden flex flex-col justify-around items-center gap-4 h-full">
      <main className='grid place-items-center gap-12'>
        <p className="text-lg font-bold uppercase tracking-wider">Get Ready</p>
        <CountdownTimer />
      </main>

      <footer className="flex justify-center">
        <p className="text-xs justify-center text-muted-foreground text-center max-w-70">
          Please stay on this screen. The question will begin automatically.
        </p>
      </footer>
    </div>
  );
}

function CountdownTimer() {
  const countdownInfo = useCountdownInfo();
  const { duration, endsAt } = countdownInfo!;
  const timeLeft = useTimer(endsAt);

  const progress = Math.max(0, Math.min(1, timeLeft / duration));

  const size = 220;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Dynamic color based on time remaining
  const ringColor = cn(
    'stroke-primary-500',
    { 'stroke-amber-500': timeLeft <= 2 },
    { 'stroke-red-500': timeLeft <= 1 },
  );

  const numberColor = cn(
    'text-primary-700',
    { 'text-amber-600': timeLeft <= 2 },
    { 'text-red-600': timeLeft <= 1 },
  );

  const glowColor = cn(
    'shadow-primary-200/60',
    { 'shadow-amber-200/60': timeLeft <= 2 },
    { 'shadow-red-200/60': timeLeft <= 1 },
  );

  const pulseRingBorderColor = cn(
    { 'border-amber-400/60': timeLeft <= 2 },
    { 'border-red-400/60': timeLeft <= 1 },
  );

  return (
    <div
      className={`relative flex items-center justify-center transition-shadow duration-300 shadow-2xl ${glowColor} rounded-full`}
    >
      {/* SVG progress ring */}
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-slate-200"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${ringColor} transition-all duration-1000 ease-linear`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Center number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-8xl font-black tabular-nums transition-colors duration-300',
            numberColor,
            { 'animate-bounce-subtle': timeLeft <= 3 },
          )}
        >
          {timeLeft}
        </span>
      </div>

      {/* Outer Pulse ring */}
      {timeLeft <= 2 && (
        <div
          className={`absolute inset-0 rounded-full border-4 ${pulseRingBorderColor} animate-ping animation-duration-[1s]`}
        />
      )}
    </div>
  );
}
