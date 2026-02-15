import { useContext, useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import {
  Accordion,
} from '../ui/accordion';
import { QuestionCard } from '../General/QuestionCard';
import { TopicList } from '../General/TopicList';
import { ChoiceList } from '../General/ChoiceList';
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
import { generateMockFormQuestion } from '@/lib/utils';

export function QuizBuilder({ quiz }: { quiz: QuizFormState }) {
  const [store] = useState(createQuizStore(quiz));

  return (
    <QuizStoreContext.Provider value={store}>
      <div className="grid gap-2">
        <div className="flex justify-between mb-4 items-center">
          <p className="text-xl font-semibold text-secondary-400">
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
      <TopicList>
        {topics.map((topic, idx) => (
          <TopicList.Item key={idx}>
            <span>{topic}</span>
            <button
              className="rounded-full p-1 bg-rose-300 hover:cursor-pointer"
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-4">
        <p className="text-xl">Questions</p>
        <span className="rounded-full size-8 grid place-items-center bg-accent-200 text-center">
          {questionsIds.length}
        </span>
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
      <Accordion
        className="pl-4 grid gap-4"
        type="multiple"
      >
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
            <QuestionCard.Text className="overflow-hidden wrap-break-word">
              {question.text || `Question ${question.order}`}
            </QuestionCard.Text>
            <span
              className="justify-self-center bg-red-400 self-start rounded-full size-6 grid place-items-center hover:cursor-pointer"
              onClick={() => removeQuestion(questionId)}
            >
              <X size={20} />
            </span>
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
