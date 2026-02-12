import { Calendar, CheckCircleIcon, TagIcon, XCircleIcon } from 'lucide-react';
import { StatCardsGrid } from '../General/StatCards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Accordion } from '../ui/accordion';
import { QuestionCard } from '../General/QuestionCard';
import { ChoiceList } from '../General/ChoiceList';
import type { Question } from '@/stores/QuizFormStore';
import type { ReactNode } from 'react';
import { calculateAccuracy, calculateLongestStreak, cn } from '@/lib/utils';

export interface UserGameDetail {
  id: string;
  createdAt: Date;
  quizTitle: string;
  quizDescription: string | null;
  quizTopics: Array<string>;
  startedAt: Date;
  endedAt: Date;
  questions: Array<GameQuestion>;
  submissions: Array<GameSubmissions>;
  userRankInfo: {
    score: number;
    rank: number;
  };
}

export interface GameSubmissions {
  id: string;
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
  submittedAt: Date;
}

export interface GameQuestion extends Question {
  startedAt: Date;
  endedAt: Date;
}

export function GameDetailsHeader({
  gameDetails,
}: {
  gameDetails: UserGameDetail;
}) {
  const totalQuestions = gameDetails.questions.length;
  const submissions = gameDetails.submissions;

  const accuracy = calculateAccuracy(submissions, totalQuestions);
  const streak = calculateLongestStreak(
    submissions.map((s) => ({
      ...s,
      submittedAt: new Date(s.submittedAt).getTime(),
    })),
  );

  return (
    <Card className="bg-primary-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(gameDetails.endedAt).toLocaleDateString()}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span className="text-xs font-medium text-slate-400">
            {new Date(gameDetails.endedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <CardTitle>{gameDetails.quizTitle}</CardTitle>
        <CardDescription className="text-xs">
          {gameDetails.quizDescription}
        </CardDescription>
        <div className="grid gap-2">
          <h2 className="border-b-2 border-secondary-500 w-fit">Topics</h2>
          <ul className="flex gap-4 flex-wrap">
            {gameDetails.quizTopics.map((topic) => (
              <li
                className="text-xs flex items-center gap-2 rounded-md bg-accent-100 p-1 px-2"
                key={topic}
              >
                <TagIcon size={12} />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <StatCardsGrid
          accuracy={accuracy}
          streak={streak}
          score={gameDetails.userRankInfo.score}
        />
      </CardContent>
    </Card>
  );
}

export function GameDetailsContent({
  gameDetails,
}: {
  gameDetails: UserGameDetail;
}) {
  const submissionsMap = new Map<string, GameSubmissions>();

  gameDetails.submissions.forEach((s) => submissionsMap.set(s.questionId, s));

  const questionsWithSubmissionChoices = gameDetails.questions.map((q) => {
    const submission = submissionsMap.get(q.id);

    return {
      ...q,
      submittedChoiceId: submission?.choiceId ?? null,
    };
  });

  return <QuestionsContainer questions={questionsWithSubmissionChoices} />;
}

function QuestionsContainer({
  questions,
}: {
  questions: Array<Question & { submittedChoiceId: string | null }>;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle>Questions</CardTitle>
        <div className="size-8 rounded-full bg-accent-200 grid place-items-center">
          {questions.length}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {questions.map((q) => (
            <ReviewQuestionCard key={q.id} question={q} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function ReviewQuestionCard({
  question,
}: {
  question: Question & { submittedChoiceId: string | null };
}) {
  let status: QuestionStatus = 'incorrect';
  if (question.submittedChoiceId === null) status = 'skipped';
  if (question.submittedChoiceId === question.correctChoiceId)
    status = 'correct';

  return (
    <QuestionCard.Root value={question.id}>
      <QuestionCard.Header>
        <QuestionCard.OrderBadge order={question.order} />
        <QuestionCard.HeaderContent>
          <QuestionCard.Text className="overflow-hidden wrap-break-word">
            {question.text}
          </QuestionCard.Text>
          <QuestionCard.MetaRow>
            <QuestionCard.TimeLimit>
              {question.timeLimitSeconds}
            </QuestionCard.TimeLimit>
            <StatusBadge status={status} />
          </QuestionCard.MetaRow>
        </QuestionCard.HeaderContent>
      </QuestionCard.Header>
      <QuestionCard.Body className="ml-8 p-2">
        <ChoiceList>
          {question.choices.map((c) => {
            const isCorrect = c.id === question.correctChoiceId;
            const isWrongSubmission =
              status === 'incorrect' && question.submittedChoiceId === c.id;
            return (
              <ChoiceList.Item
                className="text-xs"
                key={c.id}
                isCorrect={isCorrect}
                isWrongSubmission={isWrongSubmission}
              >
                {c.text}
              </ChoiceList.Item>
            );
          })}
        </ChoiceList>
      </QuestionCard.Body>
    </QuestionCard.Root>
  );
}

type QuestionStatus = 'correct' | 'incorrect' | 'skipped';

const statusConfig: Record<
  QuestionStatus,
  { className: string; icon: ReactNode; label: string }
> = {
  correct: {
    className: 'bg-green-200 text-green-800',
    icon: <CheckCircleIcon size={12} />,
    label: 'Correct',
  },
  incorrect: {
    className: 'bg-red-200 text-red-800',
    icon: <XCircleIcon size={12} />,
    label: 'Incorrect',
  },
  skipped: {
    className: 'bg-yellow-200 text-yellow-800',
    icon: null,
    label: 'Skipped',
  },
};

function StatusBadge({
  status,
  className,
}: {
  status: QuestionStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'flex items-center p-1 rounded-md gap-2 text-xs',
        config.className,
        className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
