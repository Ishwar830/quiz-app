import { useEffect } from 'react';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import type { AnswerChoice, Quiz } from '@/stores/quiz.store';
import {
  useQuizActions,
  useQuizQuestionById,
  useQuizQuestionIds,
  useQuizTitle,
  useQuizTopic,
} from '@/stores/quiz.store';

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
        <ChoiceContainer questionId={question.id} choices={question.choices} />
      </li>
    </div>
  );
}

function ChoiceContainer({
  questionId,
  choices,
}: {
  questionId: string;
  choices: Array<AnswerChoice>;
}) {
  return choices.map((choice) => (
    <Choice questionId={questionId} key={choice.id} choice={choice} />
  ));
}

function Choice({
  questionId,
  choice,
}: {
  questionId: string;
  choice: AnswerChoice;
}) {
  const { updateChoice } = useQuizActions();

  return (
    <Input
      id={choice.id}
      type="text"
      value={choice.text}
      onChange={(e) => updateChoice(questionId, choice.id, e.target.value)}
    />
  );
}
