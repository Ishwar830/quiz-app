import { useEffect, useState } from 'react';
import { CircleQuestionMarkIcon, Clock, Eye, TrendingUp } from 'lucide-react';
import SpectatorView from './SpectatorView';
import PlayerView from './PlayerView';
import { useGameRoom, useQuestionInfo } from '@/stores/GameStore';
import { useMember } from '@/stores/MemberStore';
import { calulateTimeLeft, cn } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';

export default function QuizView() {
  const questionInfo = useQuestionInfo();
  const [hasQuestionEnded, setHasQuestionEnded] = useState(false);
  const member = useMember();

  useEffect(() => {
    setHasQuestionEnded(false);
    const timeLeft = calulateTimeLeft(questionInfo.submissionEndTime);

    const timerId = window.setTimeout(() => {
      setHasQuestionEnded(true);
    }, timeLeft * 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [questionInfo.id]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <QuizViewHeader hasQuestionEnded={hasQuestionEnded} />
      <QuestionText text={questionInfo.text} />
      {member.role === 'SPECTATOR' ? (
        <SpectatorView />
      ) : (
        <PlayerView hasQuestionEnded={hasQuestionEnded} />
      )}
    </div>
  );
}

function QuizViewHeader({ hasQuestionEnded }: { hasQuestionEnded: boolean }) {
  const { quizMeta } = useGameRoom();
  const member = useMember();
  const questionInfo = useQuestionInfo();

  const isLastQuestion = questionInfo.order == quizMeta.totalQuestions;
  const progress = (questionInfo.order / quizMeta.totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1.5 bg-slate-100">
        <div
          className="h-full bg-linear-to-r from-primary-400 to-primary-500 transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 sm:px-5 py-3 space-y-3">
        <div className="flex justify-between items-center">
          {member.role === 'PLAYER' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
                <TrendingUp size={16} className="stroke-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-text-900 tabular-nums">
                  {member.score}
                </span>
                <span className="text-xs text-text-400 font-medium">pts</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-50 border border-secondary-200">
              <Eye size={14} className="stroke-secondary-500" />
              <span className="text-xs font-semibold text-secondary-600">
                Spectator
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
            <span className="text-xs text-text-400">Q</span>
            <span className="text-sm font-bold text-text-800 tabular-nums">
              {questionInfo.order}
              <span className="text-text-300 font-normal">
                /{quizMeta.totalQuestions}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuestionTimer endTime={questionInfo.submissionEndTime} />
          {hasQuestionEnded && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-medium text-text-500">
                {isLastQuestion
                  ? 'Thanks for playing!'
                  : 'Next question coming up…'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionText({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 p-6 sm:p-8 shadow-lg">
      <div className="absolute -top-2 -right-4">
        <CircleQuestionMarkIcon size={120} className="stroke-white/10" />
      </div>
      <h2 className="relative z-10 text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white wrap-break-word">
        {text}
      </h2>
    </div>
  );
}

function QuestionTimer({ endTime }: { endTime: number }) {
  const timeLeft = useTimer(endTime);
  const isLow = timeLeft < 5;
  const isCritical = timeLeft <= 2;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 bg-slate-100 text-text-700',
        { 'bg-amber-100 text-amber-700': isLow },
        { 'bg-red-100 text-red-700': isCritical },
      )}
    >
      <Clock
        size={14}
        className={cn(
          'transition-colors stroke-text-400',
          { 'stroke-amber-500': isLow },
          { 'stroke-red-500': isCritical },
        )}
      />
      <span
        className={cn(
          'text-lg font-bold tabular-nums',
          isCritical && 'animate-pulse',
        )}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
