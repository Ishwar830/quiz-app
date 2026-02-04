import { useEffect, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import SpectatorView from './SpectatorView';
import QuestionView from './QuestionView';
import { useGameRoom, useQuestionInfo } from '@/stores/GameStore';
import { useSocket } from '@/socket';
import { useMember } from '@/stores/MemberStore';
import { calulateTimeLeft, cn } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';

export default function QuizView() {
  const questionInfo = useQuestionInfo();
  const [hasQuestionEnded, setHasQuestionEnded] = useState(false);
  const member = useMember();
  const room = useGameRoom();

  const isHost = member.id === room.host.id;

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
    <div className="min-h-dvh max-w-2xl mx-auto p-4 grid gap-4 grid-rows-[100px_1fr_80px]">
      <QuizViewHeader />
      {member.role === 'SPECTATOR' ? (
        <SpectatorView />
      ) : (
        <div>
          <QuestionView hasQuestionEnded={hasQuestionEnded} />
        </div>
      )}
      {isHost && hasQuestionEnded && <NextButton />}
    </div>
  );
}

function NextButton() {
  const socket = useSocket();
  const handleNextClick = () => {
    socket.emit('question:next');
  };

  return (
    <div className="flex justify-center">
      <button
        className="size-16 p-2 shadow-lg font-semibold bg-primary-500 border rounded-full"
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
}

function QuizViewHeader() {
  const { quizMeta } = useGameRoom();
  const member = useMember();
  const questionInfo = useQuestionInfo();

  return (
    <div className="p-4 bg-linear-to-br from-secondary-100 to-secondary-50 rounded-xl border grid gap-4">
      <div className="flex justify-between items-center mx-2">
        <h1>{quizMeta.title}</h1>
        <p className="flex gap-2 items-center">
          <span className="text-xs">Question</span>
          <span className="font-semibold text-lg">
            {questionInfo.order} / {quizMeta.totalQuestions}
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between mx-2">
        {member.role === 'PLAYER' && (
          <div className="flex gap-2 text-lg items-center">
            <TrendingUp className="text-lime-600" />
            <p className="flex gap-2 items-center">
              <span className="text-sm">Score</span>
              <span className="font-semibold text-xl">{member.score}</span>
            </p>
          </div>
        )}
        <div>
          <QuestionTimer endTime={questionInfo.submissionEndTime} />
        </div>
      </div>
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
