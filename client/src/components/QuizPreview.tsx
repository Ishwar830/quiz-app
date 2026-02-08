import { CircleQuestionMark, Clock, TagIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import type { AnswerChoice, Question } from '@/stores/QuizFormStore';
import type { Quiz } from '@/lib/utils';
import { cn, formatDate } from '@/lib/utils';

export function QuizPreview({ quiz }: { quiz: Quiz }) {
  return (
    <div className="space-y-6">
      <PreviewHeader quiz={quiz} />
      <QuestionsContainer questions={quiz.questions} />
    </div>
  );
}

function PreviewHeader({ quiz }: { quiz: Quiz }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <QuizTopics topics={quiz.topics} />
        <div className="text-sm flex bg-secondary-200 p-2 rounded-lg w-fit gap-2 items-center">
          <CircleQuestionMark size={16} />
          <span>{quiz.questions.length} questions</span>
        </div>
        <div className="flex gap-6">
          <div className="text-xs text-muted-foreground text-balance">
            Created on {formatDate(quiz.createdAt)}
          </div>
          <div className="text-xs text-muted-foreground text-balance">
            Last Updated on {formatDate(quiz.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuizTopics({ topics }: { topics: Array<string> }) {
  return (
    <ul className="flex gap-4 flex-wrap">
      {topics.map((topic) => (
        <li
          className="text-xs flex items-center gap-2 rounded-md bg-accent-100 p-1 px-2"
          key={topic}
        >
          <TagIcon size={12} />
          {topic}
        </li>
      ))}
    </ul>
  );
}

function QuestionsContainer({ questions }: { questions: Array<Question> }) {
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

function Question({ question }: { question: Question }) {
  return (
    <AccordionItem value={question.id}>
      <AccordionTrigger>
        <div className="flex gap-4 px-2">
          <div className="size-8 rounded-full bg-primary-300 grid place-items-center">
            {question.order}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg">{question.text}</div>
            <span className="flex gap-2 items-center text-xs text-muted-foreground">
              <Clock size={12} />
              {question.timeLimitSeconds}s
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
}: {
  isCorrect: boolean;
  choice: AnswerChoice;
}) {
  return (
    <li
      className={cn(
        'bg-gray-100 p-1 rounded-lg px-2',
        isCorrect && 'bg-lime-300',
      )}
    >
      {choice.text}
    </li>
  );
}
