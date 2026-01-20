import { CopyIcon, Edit, MoreVertical, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from './ui/button';
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
    <Card className="relative">
      <QuizConfigs quizId={quizInfo.id} />
      <CardHeader>
        <CardTitle className="text-xl">{quizInfo.title}</CardTitle>
        <button
          className="flex gap-2 w-fit text-sm items-center hover:cursor-grab hover:text-slate-600"
          onClick={() => navigator.clipboard.writeText(quizInfo.id)}
        >
          <span>{quizInfo.id}</span>
          <CopyIcon size={16} />
        </button>
        <CardDescription>{quizInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <QuizTopics topics={quizInfo.topics} />
        <div>{quizInfo.totalQuestions} questions</div>
        <div>Created {formattedDate}</div>
      </CardContent>
      <CardFooter className="flex justify-around">
        <Button variant="outline" className="bg-gray-300">
          Preview
        </Button>
        <Button className="bg-green-300" variant="ghost">
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}

function QuizTopics({ topics }: { topics: Array<string> }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {topics.map((topic) => (
        <span className="text-xs rounded-md bg-slate-200 p-1 px-2" key={topic}>
          {topic}
        </span>
      ))}
    </div>
  );
}

function QuizConfigs({ quizId }: { quizId: string }) {
  const router = useRouter();

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <button className="hover:cursor-grab rounded-full hover:bg-slate-100 p-1">
            <MoreVertical size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-start bg-gray-100 shadow-lg p-2 rounded-lg border border-slate-200">
            <Link to="/quizbuilder/{-$quizId}" params={{ quizId }}>
              <Button variant="ghost">
                <Edit /> <span>Edit</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-red-600"
              onClick={() =>
                fetch(`/api/quizzes/${quizId}`, {
                  method: 'DELETE',
                }).then(() => {
                  router.invalidate();
                })
              }
            >
              <Trash2 /> <span>Delete</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
