import { useEffect, useState } from 'react';
import { PlusCircle, Timer, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import type { AnswerChoice, Quiz } from '@/stores/quiz.store';
import {
  getQuizData,
  useQuizActions,
  useQuizDescription,
  useQuizQuestionById,
  useQuizQuestionIds,
  useQuizTitle,
  useQuizTopics,
} from '@/stores/quiz.store';
import { cn, generateMockQuestion } from '@/lib/utils';

export function QuizBuilder({ quiz }: { quiz: Quiz }) {
  const { initialize } = useQuizActions();

  useEffect(() => {
    initialize(quiz);
  }, []);

  return (
    <>
      <div className="p-6 grid gap-2">
        <div className="flex justify-between mb-4">
          <p className="text-2xl">Quiz Builder</p>
          <SaveQuizButton />
        </div>
        <div className="flex flex-col gap-4">
          <QuizTitle />
          <QuizDescription />
          <QuizTopic />
        </div>
        <div>
          <QuestionContainer />
        </div>
      </div>
    </>
  );
}

function SaveQuizButton() {
  const saveQuiz = async () => {
    const toastId = toast.loading('Saving');
    const quizData = getQuizData();
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      console.log(data);
      toast.update(toastId, {
        render: 'Quiz saved successfully',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
      toast.update(toastId, {
        render: 'Failed to save quiz',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return <Button onClick={saveQuiz}>Save</Button>;
}

function QuizTitle() {
  const title = useQuizTitle();
  const { updateTitle } = useQuizActions();

  return (
    <Field>
      <FieldLabel htmlFor="title" className="text-xl">
        Title
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

function QuizDescription() {
  const description = useQuizDescription();
  const { updateDescription } = useQuizActions();

  return (
    <Field>
      <FieldLabel htmlFor="description" className="text-xl">
        Description
      </FieldLabel>
      <Input
        id="description"
        type="text"
        required
        placeholder="Enter your quiz description"
        value={description}
        onChange={(e) => updateDescription(e.target.value)}
      />
    </Field>
  );
}

function QuizTopic() {
  const topics = useQuizTopics();
  const { addTopic, removeTopic } = useQuizActions();
  const [topicToAdd, setTopicToAdd] = useState('');
  return (
    <>
      <div className="flex gap-2 items-center">
        <FieldLabel htmlFor="topic" className="text-xl">
          Topic
        </FieldLabel>
        <Input
          className="max-w-60"
          id="topic"
          type="text"
          placeholder="Add a topic"
          value={topicToAdd}
          onChange={(e) => setTopicToAdd(e.target.value)}
        />
        <button
          onClick={() => {
            const data = topicToAdd.trim();
            if (data.length > 0) {
              addTopic(topicToAdd);
              setTopicToAdd('');
            }
          }}
          className="grid place-items-center size-10 rounded-full hover:bg-gray-100"
        >
          <PlusCircle />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm rounded-xl bg-slate-200 text-gray-800 p-1 px-2"
          >
            <span>{topic}</span>
            <button
              className="rounded-full p-1 bg-red-600 hover:cursor-grab"
              onClick={() => removeTopic(idx)}
            >
              <X stroke="white" size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function QuestionContainer() {
  const questionsIds = useQuizQuestionIds();
  const { addQuestion } = useQuizActions();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <p className="text-xl">Questions</p>
          <span className="rounded-full size-6 bg-gray-200 text-center">
            {questionsIds.length}
          </span>
        </div>
        <Button
          onClick={() => {
            if (questionsIds.length >= 20) {
              toast.error('Maximum Question limit reached', {
                autoClose: 2000,
              });
              return;
            }
            addQuestion(generateMockQuestion());
          }}
        >
          Add Question
        </Button>
      </div>
      <div className="pl-2 grid gap-4">
        {questionsIds.map((id, idx) => (
          <Question key={id} questionId={id} idx={idx} />
        ))}
      </div>
    </div>
  );
}

function Question({ questionId, idx }: { questionId: string; idx: number }) {
  const question = useQuizQuestionById(questionId)!;
  const { updateQuestionText, updateQuestionTimeLimit } = useQuizActions();
  return (
    <div className="grid gap-2">
      <p className="mb-2">Q. {idx + 1}</p>
      <div className="flex flex-row gap-4">
        <Input
          id={question.id}
          type="text"
          value={question.text}
          onChange={(e) => updateQuestionText(question.id, e.target.value)}
          placeholder={`Question ${question.order}....`}
        />
        <div className="flex gap-2 items-center">
          <Timer size={32} />
          <Input
            id={question.id + ' timeLimit'}
            type="number"
            min={10}
            step={5}
            max={60}
            value={question.timeLimitSeconds}
            onChange={(e) =>
              updateQuestionTimeLimit(question.id, parseInt(e.target.value))
            }
          />
        </div>
      </div>
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
        isCorrectChoice && 'bg-gray-200 rounded-md border-slate-800',
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
