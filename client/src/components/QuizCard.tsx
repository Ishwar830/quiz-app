import {
  CircleQuestionMark,
  Edit,
  Eye,
  MoreVertical,
  PlayCircle,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
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
    <Card className="relative w-full justify-between max-w-100 p-0 overflow-hidden hover:scale-101 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
      <div className="pt-4 flex-1 flex flex-col h-full justify-between">
        <QuizConfigs quizId={quizInfo.id} />
        <CardHeader>
          <CardTitle className="text-xl">{quizInfo.title}</CardTitle>
          <CardDescription>{quizInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-2 flex-1 justify-around flex flex-col gap-2">
          <QuizTopics topics={quizInfo.topics} />
          <div className="text-sm flex gap-2 items-center">
            <CircleQuestionMark size={16} className="stroke-primary-500" />
            <span>{quizInfo.totalQuestions} questions</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Created {formattedDate}
          </div>
        </CardContent>
      </div>
      <CardFooter className="grid grid-cols-2 p-0 min-h-12 items-stretch font-semibold">
        <Link to="/quizzes/$quizId" params={{ quizId: quizInfo.id }}>
          <button className="size-full flex items-center justify-center gap-2 bg-secondary-200 hover:cursor-pointer hover:bg-secondary-300">
            <Eye size={20} />
            Preview
          </button>
        </Link>
        <StartQuizButton quizId={quizInfo.id} />
      </CardFooter>
    </Card>
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
      className="flex items-center justify-center gap-2 bg-primary-400 hover:cursor-pointer hover:bg-primary-500"
    >
      <PlayCircle size={20} /> Start Quiz
    </button>
  );
}

function QuizTopics({ topics }: { topics: Array<string> }) {
  const topicsCount = topics.length;
  const topicsToShow = topics.slice(0, 3);
  const remainingTopicCount = topicsCount - topicsToShow.length;
  return (
    <div className="flex gap-4 flex-wrap">
      {topicsToShow.map((topic) => (
        <span className="text-xs rounded-md bg-accent-100 p-1 px-2" key={topic}>
          {topic}
        </span>
      ))}
      {remainingTopicCount > 0 && (
        <span className="text-xs rounded-md bg-accent-100 p-1 px-2">
          +{remainingTopicCount} More
        </span>
      )}
    </div>
  );
}

function QuizConfigs({ quizId }: { quizId: string }) {
  const router = useRouter();

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <button className="hover:cursor-pointer rounded-full hover:bg-slate-100 p-1">
            <MoreVertical size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2 px-3 font-sora">
          <div className="grid gap-2">
            <button>
              <Link
                to="/quizbuilder/{-$quizId}"
                params={{ quizId }}
                className="flex gap-2 items-center p-1 rounded-sm hover:bg-gray-50"
              >
                <Edit size={16} /> <span>Edit</span>
              </Link>
            </button>
            <button
              className="flex gap-2 items-center p-1 rounded-sm text-red-600 hover:text-red-700 hover:bg-gray-50"
              onClick={() =>
                fetch(`/api/quizzes/${quizId}`, {
                  method: 'DELETE',
                }).then(() => {
                  router.invalidate();
                })
              }
            >
              <Trash2 size={16} /> <span>Delete</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
