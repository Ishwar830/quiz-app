import { useEffect, useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
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

  return <LiveResults question={question} analytics={analytics} />;
}

function LiveResults({
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="stroke-text-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-400">
            Live Results
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
          <Users size={12} className="stroke-text-400" />
          <span className="text-xs font-semibold text-text-600 tabular-nums">
            {totalSubmissions}
          </span>
        </div>
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        {question.choices.map((choice, index) => {
          const color = colors[index % colors.length];
          const count = analytics.info[choice.id] ?? 0;
          const percentage = getPercentageForSubmission(count);

          return (
            <div
              key={choice.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden"
            >
              <div
                className={`absolute inset-y-0 left-0 ${color} opacity-15 transition-all duration-700 ease-out`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold text-white shrink-0',
                      color,
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm font-semibold text-text-800 truncate">
                    {choice.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {percentage > 0 && (
                    <span className="text-xs text-text-400 tabular-nums">
                      {percentage}%
                    </span>
                  )}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-accent-100">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
