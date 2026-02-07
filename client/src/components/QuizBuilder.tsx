import { useContext, useState } from 'react';
import { PlusCircle, Timer, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import type { AnswerChoice, QuizFormState } from '@/stores/QuizFormStore';
import {
  QuizStoreContext,
  createQuizStore,
  useQuizDescription,
  useQuizFormActions,
  useQuizQuestionById,
  useQuizQuestionIds,
  useQuizTitle,
  useQuizTopics,
} from '@/stores/QuizFormStore';
import { cn, generateMockFormQuestion } from '@/lib/utils';

export function QuizBuilder({ quiz }: { quiz: QuizFormState }) {
  const [store] = useState(createQuizStore(quiz));

  return (
    <QuizStoreContext.Provider value={store}>
      <div className="p-4 grid gap-2 max-w-3xl mx-auto">
        <div className="flex justify-between mb-4 items-center">
          <p className="text-2xl font-semibold text-secondary-500">
            Quiz Builder
          </p>
          <SaveQuizButton />
        </div>
        <div className="flex flex-col gap-6 border-b-2 border-secondary-500 pb-2">
          <QuizTitle />
          <QuizDescription />
          <QuizTopic />
        </div>
        <div className="mt-4">
          <QuestionContainer />
        </div>
      </div>
    </QuizStoreContext.Provider>
  );
}

function SaveQuizButton() {
  const store = useContext(QuizStoreContext)!;
  const saveQuiz = async () => {
    const { actions, ...quizData } = store.getState();
    const toastId = toast.loading('Saving');
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

  return (
    <Button
      className="bg-primary-400 text-text-800 transition-transform duration-200 hover:scale-105 hover:bg-primary-500 shadow-sm"
      onClick={saveQuiz}
    >
      Save
    </Button>
  );
}

function QuizTitle() {
  const title = useQuizTitle();
  const { updateTitle } = useQuizFormActions();

  return (
    <Field>
      <FieldLabel htmlFor="title">Title</FieldLabel>
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
  const { updateDescription } = useQuizFormActions();

  return (
    <Field>
      <FieldLabel htmlFor="description">Description</FieldLabel>
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
  const { addTopic, removeTopic } = useQuizFormActions();
  const [topicToAdd, setTopicToAdd] = useState('');
  return (
    <>
      <div className="flex gap-2 items-center">
        <FieldLabel htmlFor="topic">Topic</FieldLabel>
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
          className="grid place-items-center size-10 rounded-full hover:bg-accent-100 hover:cursor-pointer"
        >
          <PlusCircle />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm rounded-xl bg-accent-100 p-1 px-2"
          >
            <span>{topic}</span>
            <button
              className="rounded-full p-1 bg-rose-300 hover:cursor-pointer"
              onClick={() => removeTopic(idx)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function QuestionContainer() {
  const questionsIds = useQuizQuestionIds();
  const { addQuestion } = useQuizFormActions();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <p className="text-xl">Questions</p>
          <span className="rounded-full size-6 bg-accent-200 text-center">
            {questionsIds.length}
          </span>
        </div>
        <Button
          className="border-secondary-200 border-2 text-secondary-400 bg-white hover:bg-secondary-400 hover:text-white"
          onClick={() => {
            if (questionsIds.length >= 20) {
              toast.error('Maximum Question limit reached', {
                autoClose: 2000,
              });
              return;
            }
            addQuestion(generateMockFormQuestion());
          }}
        >
          Add Question
        </Button>
      </div>
      <div className="pl-4 grid gap-4">
        {questionsIds.map((id, idx) => (
          <Question key={id} questionId={id} idx={idx} />
        ))}
      </div>
    </div>
  );
}

function Question({ questionId }: { questionId: string; idx: number }) {
  const question = useQuizQuestionById(questionId)!;
  const { updateQuestionText, updateQuestionTimeLimit, removeQuestion } =
    useQuizFormActions();
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4 border-b-2 pb-2 border-secondary-300 w-fit">
        <p>Q. {question.order}</p>
        <button
          className="bg-red-400 rounded-full size-6 grid place-items-center hover:cursor-pointer"
          onClick={() => removeQuestion(questionId)}
        >
          <X size={20} />
        </button>
      </div>
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
  const { updateChoice, updateCorrectChoice } = useQuizFormActions();

  const isCorrectChoice = choice.id == correctChoiceId;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-1',
        isCorrectChoice && 'bg-lime-200 rounded-md',
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
