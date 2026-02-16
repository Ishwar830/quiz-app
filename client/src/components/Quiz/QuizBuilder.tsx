import { useContext, useState } from 'react';
import { PlusCircle, SquarePlusIcon, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Accordion } from '../ui/accordion';
import { QuestionCard } from '../General/QuestionCard';
import { TopicList } from '../General/TopicList';
import { ChoiceList } from '../General/ChoiceList';
import { Card, CardContent } from '../ui/card';
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
      <div className="grid gap-4">
        <div className="flex justify-between mb-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 grid place-items-center">
              <SquarePlusIcon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-900">Quiz Builder</h1>
              <p className="text-xs text-text-400">
                Create and edit quiz content
              </p>
            </div>
          </div>
          <SaveQuizButton />
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <QuizTitle />
            <QuizDescription />
            <QuizTopic />
          </CardContent>
        </Card>
        <QuestionContainer />
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
      className="bg-primary-400 text-text-800 transition-transform duration-300 hover:scale-105 hover:bg-primary-500 shadow-sm"
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
      <TopicList>
        {topics.map((topic, idx) => (
          <TopicList.Item key={idx}>
            <span>{topic}</span>
            <button
              className="rounded-full p-1 bg-red-100 hover:bg-red-200 text-red-500 hover:cursor-pointer"
              onClick={() => removeTopic(idx)}
            >
              <X size={12} />
            </button>
          </TopicList.Item>
        ))}
      </TopicList>
    </>
  );
}

function QuestionContainer() {
  const questionsIds = useQuizQuestionIds();
  const { addQuestion } = useQuizFormActions();
  return (
    <div className="mt-6 space-y-4 bg-white p-4 px-5 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-text-900">Questions</h2>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-100 text-accent-700 text-xs font-bold">
          {questionsIds.length}
        </span>
        <Button
          className="ml-auto border border-secondary-200 text-secondary-500 bg-white hover:bg-secondary-50 rounded-xl gap-2"
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
          <PlusCircle size={14} />
          Add Question
        </Button>
      </div>
      <Accordion className="space-y-2" type="multiple">
        {questionsIds.map((id, idx) => (
          <EditQuestionCard key={id} questionId={id} idx={idx} />
        ))}
      </Accordion>
    </div>
  );
}

function EditChoice({
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
    <div className="flex gap-2 items-center">
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

function EditQuestionCard({ questionId }: { questionId: string; idx: number }) {
  const question = useQuizQuestionById(questionId)!;
  const { updateQuestionText, updateQuestionTimeLimit, removeQuestion } =
    useQuizFormActions();

  const correctChoice = question.choices.find(
    (c) => c.id === question.correctChoiceId,
  );

  return (
    <QuestionCard.Root value={questionId}>
      <QuestionCard.Header>
        <QuestionCard.OrderBadge order={question.order} />
        <QuestionCard.HeaderContent>
          <div className="grid gap-2 grid-cols-[1fr_32px]">
            <QuestionCard.Text
              className={cn(
                'overflow-hidden wrap-break-word',
                !question.text && 'text-gray-400',
              )}
            >
              {question.text || `Question ${question.order}`}
            </QuestionCard.Text>
            <button
              className="justify-self-center self-start w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 grid place-items-center transition-colors cursor-pointer"
              onClick={() => removeQuestion(questionId)}
            >
              <X size={14} />
            </button>
          </div>
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
      <QuestionCard.Body>
        <div className="flex flex-row gap-4">
          <Input
            id={question.id}
            type="text"
            value={question.text}
            onChange={(e) => updateQuestionText(question.id, e.target.value)}
            placeholder={`Question ${question.order}....`}
            className="flex-1"
          />
          <QuestionCard.TimeLimit iconSize={16} className="min-w-10 shrink-0">
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
          </QuestionCard.TimeLimit>
        </div>
        <ChoiceList>
          {question.choices.map((c) => {
            const isCorrect = c.id === question.correctChoiceId;
            return (
              <ChoiceList.Item key={c.id} isCorrect={isCorrect}>
                <EditChoice
                  questionId={question.id}
                  correctChoiceId={question.correctChoiceId}
                  choice={c}
                />
              </ChoiceList.Item>
            );
          })}
        </ChoiceList>
      </QuestionCard.Body>
    </QuestionCard.Root>
  );
}
