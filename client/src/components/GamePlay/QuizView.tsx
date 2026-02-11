import { useEffect, useState } from 'react';
import { Clock, GhostIcon, TrendingUp } from 'lucide-react';
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

  return (
    <div className="p-4 shadow-sm rounded-xl border grid gap-4">
      <div className="flex justify-between items-center mx-2">
        {member.role === 'PLAYER' ? (
          <div className="flex gap-2 text-lg items-center">
            <TrendingUp className="text-lime-600" />
            <p className="flex gap-2 items-center">
              <span className="text-sm">Score</span>
              <span className="font-semibold text-xl">{member.score}</span>
            </p>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <GhostIcon className="stroke-secondary-400" />
            <span className="text-sm text-primary-700 border-b-2 border-secondary-400">
              Spectator Mode
            </span>
          </div>
        )}
        <p className="flex gap-2 items-center">
          <span className="text-xs">Question</span>
          <span className="font-semibold text-lg">
            {questionInfo.order} / {quizMeta.totalQuestions}
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between mx-2">
        <QuestionTimer endTime={questionInfo.submissionEndTime} />
        {hasQuestionEnded && (
          <div className="flex gap-2 items-center">
            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
            {isLastQuestion ? (
              <span>Thanks for playing!</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Next Question will start soon
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionText({ text }: { text: string }) {
  return (
    <div className="bg-primary-100 border p-6 rounded-xl shadow-sm mb-4 overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight wrap-break-word">
        {text}
      </h2>
    </div>
  );
}

function QuestionTimer({ endTime }: { endTime: number }) {
  const timeLeft = useTimer(endTime);

  return (
    <div className="flex items-center justify-between gap-2 w-15">
      <span>
        <Clock size={18} className="mb-1" />
      </span>
      <span
        className={cn('text-2xl font-bold', {
          'text-red-600 animate-pulse': timeLeft < 5,
        })}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
