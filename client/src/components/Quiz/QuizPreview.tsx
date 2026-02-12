import { CircleQuestionMark } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Accordion,
} from '../ui/accordion';
import { QuestionCard } from '../General/QuestionCard';
import { TopicList } from '../General/TopicList';
import { ChoiceList } from '../General/ChoiceList';
import type { Question } from '@/stores/QuizFormStore';
import type { Quiz } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

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
    <TopicList>
      {topics.map((topic) => (
        <TopicList.Item key={topic}>{topic}</TopicList.Item>
      ))}
    </TopicList>
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
            <PreviewQuestionCard key={q.id} question={q}/>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}


function PreviewQuestionCard({ question }: { question: Question }) {
  const correctChoice = question.choices.find(
    (c) => c.id === question.correctChoiceId,
  );
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
            {correctChoice && (
              <span className="p-1 px-2 text-xs text-green-700 bg-green-200 rounded-md">
                {correctChoice.text}
              </span>
            )}
          </QuestionCard.MetaRow>
        </QuestionCard.HeaderContent>
      </QuestionCard.Header>
      <QuestionCard.Body className="ml-8 p-2">
        <ChoiceList>
          {question.choices.map((c) => {
            const isCorrect = c.id === question.correctChoiceId;
            return (
              <ChoiceList.Item
                className="text-xs"
                key={c.id}
                isCorrect={isCorrect}
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