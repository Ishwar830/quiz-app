import {
  Calendar,
  CheckCircleIcon,
  Clock,
  TagIcon,
  XCircleIcon,
} from 'lucide-react';
import { StatCardsGrid } from '../GamePlay/StatCards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import type { AnswerChoice, Question } from '@/stores/QuizFormStore';
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
            <Question key={q.id} question={q} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function Question({
  question,
}: {
  question: Question & { submittedChoiceId: string | null };
}) {
  let status = '';
  if (question.submittedChoiceId === null) status = 'not attempted';
  else if (question.correctChoiceId === question.submittedChoiceId)
    status = 'correct';
  else status = 'incorrect';

  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger>
        <div className="flex gap-4 px-2 text-sm">
          <div className="size-8 grow-0 shrink-0 rounded-full bg-primary-300 grid place-items-center">
            {question.order}
          </div>
          <div className="flex flex-col gap-2">
            <div>{question.text}</div>
            <span className="flex gap-2 items-center text-xs text-muted-foreground">
              <div className="flex gap-2 items-center">
                <Clock size={12} />
                {question.timeLimitSeconds}s
              </div>
              <div>
                {status === 'correct' && (
                  <span className="flex items-center p-1 bg-green-200 rounded-md text-green-800 gap-2">
                    <CheckCircleIcon size={12} /> Correct
                  </span>
                )}
                {status === 'incorrect' && (
                  <span className="flex items-center p-1 bg-red-200 text-red-800 rounded-md gap-2">
                    <XCircleIcon size={12} /> Incorrect
                  </span>
                )}
                {status === 'not attempted' && (
                  <span className="flex items-center p-1 bg-yellow-200 text-yellow-800 rounded-md gap-2">
                    Skipped
                  </span>
                )}
              </div>
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="ml-8 p-2 grid gap-2">
          {question.choices.map((choice) => (
            <Choice
              key={choice.id}
              choice={choice}
              isWrongSubmission={
                !!question.submittedChoiceId &&
                question.submittedChoiceId === choice.id &&
                status === 'incorrect'
              }
              isCorrect={question.correctChoiceId === choice.id}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

function Choice({
  isCorrect,
  choice,
  isWrongSubmission,
}: {
  isCorrect: boolean;
  choice: AnswerChoice;
  isWrongSubmission: boolean;
}) {
  return (
    <li
      className={cn(
        'bg-gray-100 p-1 rounded-lg px-2 text-xs',
        isCorrect && 'bg-lime-300',
        isWrongSubmission && 'bg-red-300',
      )}
    >
      {choice.text}
    </li>
  );
}
