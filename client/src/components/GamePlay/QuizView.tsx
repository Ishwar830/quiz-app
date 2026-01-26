import { useEffect, useRef, useState } from 'react';
import type { Question } from '@/stores/GameStore';
import type { Submission } from '@/stores/MemberStore';
import { useQuestionInfo } from '@/stores/GameStore';
import { useSocket } from '@/socket';
import { useMemberActions, useMemberSubmissions } from '@/stores/MemberStore';
import { calulateTimeLeft } from '@/lib/utils';

interface QuestionAnalytics {
  questionId: string;
  info: {
    [key: string]: number;
  };
}

function QuestionContent({
  selectedOptionId,
  hasEnded,
  handleSubmit,
  question,
}: {
  selectedOptionId: string | null;
  question: Question;
  hasEnded: boolean;
  handleSubmit: (optionId: string) => void;
}) {
  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.choices.map((choice, index) => {
          const isSelected = choice.id == selectedOptionId;
          return (
            <button
              key={choice.id}
              onClick={() => handleSubmit(choice.id)}
              disabled={hasEnded}
              className={`
                  relative p-6 rounded-xl text-left border-2 transition-all transform duration-200
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }
                  ${hasEnded ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}
                `}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3
                  ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}
                `}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span
                className={`text-lg font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}
              >
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function QuestionTimer({ endTime }: { endTime: number }) {
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

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">
          Time Remaining
        </span>
        <span
          className={`text-2xl font-bold font-mono ${timeLeft < 5 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}
        >
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}

function NextQuestion({ handleNextClick, isDisabled }: any) {
  return (
    <div className="flex justify-center mt-10">
      <button
        disabled={isDisabled}
        className="border w-40 p-2  bg-slate-900 text-white rounded-md"
        onClick={handleNextClick}
      >
        Next Question
      </button>
    </div>
  );
}

function QuestionView() {
  const socket = useSocket();
  const [hasEnded, setHasEnded] = useState(false);
  const question = useQuestionInfo();
  const submissions = useMemberSubmissions();
  const { updateSubmissions } = useMemberActions();
  const selectedOptionId =
    submissions.find((sub) => sub.questionId == question.id)?.choiceId ?? null;

  const handleSubmit = (choiceId: string) => {
    socket.emit(
      'question:submit',
      {
        questionId: question.id,
        choiceId,
      },
      (res: { success: boolean; submission: Submission }) => {
        if (res.success) {
          updateSubmissions(res.submission);
        }
      },
    );
  };

  const handleNextClick = () => {
    if (!hasEnded) return;
    socket.emit('question:next');
  };

  useEffect(() => {
    setHasEnded(false);
    const timeLeft = calulateTimeLeft(question.submissionEndTime);

    const timerId = window.setTimeout(() => {
      setHasEnded(true);
    }, timeLeft * 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [question.id]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col h-full justify-center">
      <QuestionTimer endTime={question.submissionEndTime} />
      <QuestionContent
        selectedOptionId={selectedOptionId}
        handleSubmit={handleSubmit}
        hasEnded={hasEnded}
        question={question}
      />
      <NextQuestion isDisabled={!hasEnded} handleNextClick={handleNextClick} />
    </div>
  );
}

function SpectatorView({ question }: { question: Question }) {
  const socket = useSocket();
  const [analytics, setAnalytics] = useState<QuestionAnalytics>({
    questionId: question.id,
    info: Object.fromEntries(question.choices.map((choice) => [choice.id, 0])),
  });

  useEffect(() => {
    socket.on('question:analytics', (questionReport: QuestionAnalytics) => {
      setAnalytics(questionReport);
    });

    return () => {
      socket.off('question:analytics');
    };
  }, [question.id]);

  return (
    <div className="mx-auto rounded-md">
      <div className="text-xl font-bold text-wrap">{question.text}</div>
      <div className="grid grid-cols-4 place-items-center">
        {question.choices.map((choice) => (
          <div
            key={choice.id}
            className="flex flex-col bg-sky-200 p-2 text-center"
          >
            <div>{analytics.info[choice.id] ?? 0}</div>
            <div>{choice.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelView() {
  const socket = useSocket();
  const [hasEnded, setHasEnded] = useState(false);
  const question = useQuestionInfo();

  const handleNextClick = () => {
    if (!hasEnded) return;
    socket.emit('question:next');
  };

  useEffect(() => {
    setHasEnded(false);
    const timeLeft = calulateTimeLeft(question.submissionEndTime);

    const timerId = window.setTimeout(() => {
      setHasEnded(true);
    }, timeLeft * 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [question.id]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col h-full justify-center">
      <QuestionTimer endTime={question.submissionEndTime} />
      <SpectatorView question={question} />
      <NextQuestion isDisabled={!hasEnded} handleNextClick={handleNextClick} />
    </div>
  );
}

export default function QuizView() {
  const questionInfo = useQuestionInfo();
  return (
    <>
      <QuestionView key={questionInfo.id} />
      <PanelView key={questionInfo.id + 'sv'} />
    </>
  );
}
