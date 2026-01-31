import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { Question } from '@/stores/GameStore';
import { useSocket } from '@/socket';
import { useQuestionInfo } from '@/stores/GameStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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
    <div className="flex flex-col">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight wrap-break-word">
          {question.text}
        </h2>
      </div>
      <div className="flex-1 hidden sm:block">
        <SubmissionsBarChart question={question} analytics={analytics} />
      </div>
      <div className="flex-1 sm:hidden">
        <SubmissionsVertical question={question} analytics={analytics} />
      </div>
    </div>
  );
}

function SubmissionsBarChart({
  question,
  analytics,
}: {
  question: Question;
  analytics: QuestionAnalytics;
}) {
  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const chartData = question.choices.map((choice) => {
    return {
      x: choice.text,
      y: analytics.info[choice.id],
    };
  });

  return (
    <Bar
      options={options}
      data={{
        labels: question.choices.map((choice) => choice.text),
        datasets: [
          {
            label: 'Submission Count',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(255, 205, 86)',
              'rgba(75, 192, 192)',
            ],
            borderRadius: {
              topLeft: 4,
              topRight: 4,
            },
          },
        ],
      }}
    />
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
    <div className="grid gap-4">
      {question.choices.map((choice, index) => {
        const count = analytics.info[choice.id] ?? 0;
        const percentage = getPercentageForSubmission(count);

        return (
          <div
            key={choice.id}
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl transform transition-all duration-300 hover:scale-102 relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 ${colors[index]} opacity-20 origin-left transition-transform duration-500`}
              style={{ transform: `scaleX(${percentage / 100})` }}
            ></div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 ${colors[index]} rounded-lg flex items-center justify-center shadow-lg`}
                >
                  <span className="text-xl font-bold text-white">
                    {String.fromCharCode(index + 65)}
                  </span>
                </div>

                <span className="text-gray-800 text-lg font-semibold flex-1">
                  {choice.text}
                </span>
              </div>

              <div
                className={`p-2 rounded-full shadow-lg size-12 text-center text-white ${colors[index]}`}
              >
                <span className="text-xl font-bold">{count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
