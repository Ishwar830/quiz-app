import { useEffect } from 'react';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import type { AnswerChoice, Quiz } from '@/stores/quiz.store';
import {
  useQuizActions,
  useQuizQuestionById,
  useQuizQuestionIds,
  useQuizTitle,
  useQuizTopic,
} from '@/stores/quiz.store';
import { cn } from '@/lib/utils';

export function QuizBuilder({ quiz }: { quiz: Quiz }) {
  const { initialize } = useQuizActions();

  useEffect(() => {
    initialize(quiz);
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <QuizTitle />
        <QuizTopic />
      </div>
      <div>
        <QuestionContainer />
      </div>
    </div>
  );
}

function QuizTitle() {
  const title = useQuizTitle();
  const { updateTitle } = useQuizActions();

  return (
    <Field>
      <FieldLabel htmlFor="title" className="text-xl">
        Quiz Title
      </FieldLabel>
      <Input
        id="title"
        type="text"
        required
        placeholder="Enter your quiz title"
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
      />
    </Field>
  );
}

function QuizTopic() {
  const topic = useQuizTopic();
  const { updateTopic } = useQuizActions();
  return (
    <Field>
      <FieldLabel htmlFor="topic" className="text-xl">
        Quiz Topic
      </FieldLabel>
      <Input
        id="topic"
        type="text"
        required
        placeholder="Enter your quiz topic"
        value={topic}
        onChange={(e) => updateTopic(e.target.value)}
      />
    </Field>
  );
}

function QuestionContainer() {
  const questionsIds = useQuizQuestionIds();

  return questionsIds.map((id, idx) => (
    <Question key={id} questionId={id} idx={idx} />
  ));
}

function Question({ questionId, idx }: { questionId: string; idx: number }) {
  const question = useQuizQuestionById(questionId)!;
  const { updateQuestion } = useQuizActions();
  return (
    <div>
      <p>Q. {idx + 1}</p>
      <Input
        id={question.id}
        type="text"
        value={question.text}
        onChange={(e) => updateQuestion(question.id, e.target.value)}
      />
      <li className="list-none">
        <ChoiceContainer
          questionId={question.id}
          choices={question.choices}
          correctChoiceId={question.correctChoiceId}
        />
      </li>
    </div>
  );
}

function ChoiceContainer({
  questionId,
  choices,
  correctChoiceId,
}: {
  questionId: string;
  choices: Array<AnswerChoice>;
  correctChoiceId: string;
}) {
  return choices.map((choice) => (
    <Choice
      questionId={questionId}
      key={choice.id}
      choice={choice}
      correctChoiceId={correctChoiceId}
    />
  ));
}

function Choice({
  questionId,
  choice,
  correctChoiceId,
}: {
  questionId: string;
  choice: AnswerChoice;
  correctChoiceId: string;
}) {
  const { updateChoice, updateCorrectChoice } = useQuizActions();

  const isCorrectChoice = choice.id == correctChoiceId;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-1',
        isCorrectChoice && 'border rounded-md border-slate-800',
      )}
    >
      <Checkbox
        className="size-5"
        checked={isCorrectChoice}
        onCheckedChange={() => updateCorrectChoice(questionId, choice.id)}
      />
      <Input
        id={choice.id}
        type="text"
        value={choice.text}
        onChange={(e) => updateChoice(questionId, choice.id, e.target.value)}
      />
    </div>
  );
}
