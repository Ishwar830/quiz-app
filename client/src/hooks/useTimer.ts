import { useEffect, useRef, useState } from 'react';
import { calulateTimeLeft } from '@/lib/utils';

export function useTimer(endTime: number) {
  const [timeLeft, setTimeLeft] = useState(calulateTimeLeft(endTime));
  const timeRef = useRef<number | null>(null);

  useEffect(() => {
    timeRef.current = window.setInterval(() => {
      const remaining = calulateTimeLeft(endTime);
      if (remaining <= 0 && timeRef.current) {
        window.clearInterval(timeRef.current);
        timeRef.current = null;
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => {
      if (timeRef.current) window.clearInterval(timeRef.current);
    };
  }, []);

  return timeLeft;
}
