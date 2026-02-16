import {
  CircleQuestionMark,
  Edit,
  Eye,
  MoreVertical,
  PlayIcon,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { TopicList } from '../General/TopicList';
import { formatDate } from '@/lib/utils';

export interface QuizMeta {
  id: string;
  title: string;
  topics: Array<string>;
  description: string;
  createdAt: number;
  totalQuestions: number;
}

interface QuizCardProps {
  quizInfo: QuizMeta;
}

export function QuizCard({ quizInfo }: QuizCardProps) {
  const formattedDate = formatDate(quizInfo.createdAt);

  return (
    <div className="relative w-full max-w-100 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col p-5">
        <QuizCardActions quizId={quizInfo.id} />

        <h3 className="text-lg font-bold text-text-900 mb-1 pr-8">
          {quizInfo.title}
        </h3>
        <p className="text-xs text-text-400 mb-4 line-clamp-2">
          {quizInfo.description}
        </p>

        <div className="mb-4">
          <QuizTopics topics={quizInfo.topics} />
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs bg-secondary-50 text-secondary-600 px-2.5 py-1 rounded-full font-medium">
            <CircleQuestionMark size={12} />
            <span>{quizInfo.totalQuestions} questions</span>
          </div>
          <span className="text-[10px] text-text-300">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-100">
        <Link
          to="/quizzes/$quizId"
          params={{ quizId: quizInfo.id }}
          className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-text-600 hover:bg-slate-100 transition-colors"
        >
          <Eye size={16} />
          Preview
        </Link>
        <StartQuizButton quizId={quizInfo.id} />
      </div>
    </div>
  );
}

function StartQuizButton({ quizId }: { quizId: string }) {
  const navigate = useNavigate();
  const handleStartQuiz = async () => {
    const res = await fetch(`/api/rooms?quizId=${quizId}`, { method: 'POST' });
    const { data } = await res.json();
    if (data) {
      navigate({ to: '/rooms/$roomId', params: { roomId: data.id } });
    }
  };

  return (
    <button
      onClick={handleStartQuiz}
      className="flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-linear-to-r from-primary-400 to-primary-500 text-white hover:from-primary-500 hover:to-primary-600 transition-all cursor-pointer"
    >
      <PlayIcon className="fill-white" size={16} />
      Start
    </button>
  );
}

function QuizTopics({ topics }: { topics: Array<string> }) {
  const topicsCount = topics.length;
  const topicsToShow = topics.slice(0, 3);
  const remainingTopicCount = topicsCount - topicsToShow.length;
  return (
    <TopicList>
      {topicsToShow.map((topic) => (
        <TopicList.Item key={topic} withTagIcon={false}>
          {topic}
        </TopicList.Item>
      ))}
      {remainingTopicCount > 0 && (
        <TopicList.Item withTagIcon={false}>
          +{remainingTopicCount} More
        </TopicList.Item>
      )}
    </TopicList>
  );
}

function QuizCardActions({ quizId }: { quizId: string }) {
  const router = useRouter();

  return (
    <div className="absolute top-5 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <button className="hover:cursor-pointer rounded-full hover:bg-slate-100 p-1.5 transition-colors">
            <MoreVertical size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-1.5 font-sora rounded-xl shadow-lg border border-slate-200">
          <div className="grid gap-0.5">
            <Link
              to="/quizbuilder/{-$quizId}"
              params={{ quizId }}
              className="flex gap-2 items-center p-2 px-3 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <Edit size={14} /> Edit
            </Link>
            <button
              className="flex gap-2 items-center p-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              onClick={() =>
                fetch(`/api/quizzes/${quizId}`, {
                  method: 'DELETE',
                }).then(() => {
                  router.invalidate();
                })
              }
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
