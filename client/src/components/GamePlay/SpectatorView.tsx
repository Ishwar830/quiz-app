import { useEffect, useState } from 'react';
import type { Question } from '@/stores/GameStore';
import { useSocket } from '@/socket';
import { useQuestionInfo } from '@/stores/GameStore';
import { cn } from '@/lib/utils';

interface QuestionAnalytics {
  questionId: string;
  totalSubmissions: number;
  info: {
    [key: string]: number;
  };
}

export default function SpectatorView() {
  const socket = useSocket();
  const question = useQuestionInfo();
  const [analytics, setAnalytics] = useState<QuestionAnalytics>({
    questionId: question.id,
    totalSubmissions: 0,
    info: Object.fromEntries(question.choices.map((choice) => [choice.id, 0])),
  });

  useEffect(() => {
    socket.on('question:analytics', (submissionReport: QuestionAnalytics) => {
      setAnalytics(submissionReport);
    });

    return () => {
      socket.off('question:analytics');
    };
  }, [question.id]);

  return (
    <>
      <div className="flex-1 place-content-end hidden sm:block">
        <SubmissionsVertical question={question} analytics={analytics} />
      </div>
      <div className="flex-1 sm:hidden">
        <SubmissionsHorizontal question={question} analytics={analytics} />
      </div>
    </>
  );
}

function SubmissionsVertical({
  question,
  analytics,
}: {
  question: Question;
  analytics: QuestionAnalytics;
}) {
  const totalSubmissions = analytics.totalSubmissions;

  const getPercentageForSubmission = (count: number) => {
    return totalSubmissions === 0
      ? 0
      : Math.floor((count / totalSubmissions) * 100);
  };

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];

  return (
    <div className="grid grid-cols-4 gap-4">
      {question.choices.map((choice, index) => {
        const count = analytics.info[choice.id] ?? 0;
        const percentage = getPercentageForSubmission(count);

        return (
          <div key={choice.id} className="grid grid-rows-[1fr_40px]">
            <div className="relative border-b-4 border-gray-700 ">
              <div
                className={`absolute bottom-0 z-10 mb-2 left-1/2 -translate-x-1/2`}
              >
                <span className="rounded-full bg-accent-200 shadow-sm font-semibold size-10 grid place-items-center">
                  {count}
                </span>
              </div>
              <div
                className={`h-full rounded-tl-lg opacity-80 rounded-tr-lg ${colors[index]}  origin-bottom transition-transform duration-500`}
                style={{ transform: `scaleY(${percentage / 100})` }}
              ></div>
            </div>

            <div className="grid items-center text-center">
              <div
                className={`truncate rounded-sm p-1 px-2 ${colors[index]} text-white  text-sm`}
              >
                {choice.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubmissionsHorizontal({
  question,
  analytics,
}: {
  question: Question;
  analytics: QuestionAnalytics;
}) {
  const totalSubmissions = analytics.totalSubmissions;

  const getPercentageForSubmission = (count: number) => {
    return totalSubmissions === 0
      ? 0
      : Math.floor((count / totalSubmissions) * 100);
  };

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];

  return (
    <div className="grid gap-4">
      {question.choices.map((choice, index) => {
        const count = analytics.info[choice.id] ?? 0;
        const percentage = getPercentageForSubmission(count);

        return (
          <div
            key={choice.id}
            className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-sm transform transition-all duration-300 hover:scale-102 relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 ${colors[index]} opacity-20 origin-left transition-transform duration-500`}
              style={{ transform: `scaleX(${percentage / 100})` }}
            ></div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                    `${colors[index]} text-white`,
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-gray-800 text-lg font-semibold flex-1">
                  {choice.text}
                </span>
              </div>

              <span
                className={cn(
                  'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                  `${colors[index]} text-white`,
                )}
              >
                {count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
