import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2, PlusCircle, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from './ui/field';
import { Input } from './ui/input';
import type { ValidationError } from './LoginCard';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';

export function AiRoomForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Array<ValidationError>>();
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(10);
  const [topics, setTopics] = useState<Array<string>>([]);
  const [role, setRole] = useState('PLAYER');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    if (topics.length == 0) {
      setErrors([{ message: 'Require atleast 1 topic' }]);
      return;
    }

    try {
      setIsPending(true);
      const res = await fetch(`/api/rooms/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionCount,
          timeLimitSeconds,
          topics,
          role,
        }),
      });

      const { data, error } = await res.json();

      if (res.ok) {
        console.log(data);
        navigate({
          to: '/rooms/$roomId',
          params: { roomId: data.id },
        });
      } else {
        setErrors([error]);
      }
    } catch (err) {
      setErrors([{ message: 'Server Error' }]);
    } finally {
      setIsPending(false);
    }
  };

  const addTopic = (newTopic: string) => {
    setTopics([...topics, newTopic]);
  };

  const removeTopic = (idxToRemove: number) => {
    setTopics(topics.filter((_, idx) => idx !== idxToRemove));
  };

  return (
    <div className="bg-white">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="questionCount">
                Number of Questions
              </FieldLabel>
              <Input
                className="text-sm"
                type="number"
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                id="questionCount"
                min={5}
                max={20}
                value={questionCount}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="questionTimeLimit">
                Question Time Limit
              </FieldLabel>
              <Input
                className="text-sm"
                onChange={(e) => setTimeLimitSeconds(parseInt(e.target.value))}
                id="questionTimeLimit"
                min={10}
                max={30}
                value={timeLimitSeconds}
                step={5}
                type="number"
                required
              />
            </Field>
          </div>
          <QuizTopicsField
            topics={topics}
            addTopic={addTopic}
            removeTopic={removeTopic}
          />
          <RadioGroup
            defaultValue="PLAYER"
            className="max-w-sm"
            onValueChange={(val) => setRole(val)}
          >
            <p className="text-sm mt-4">Role</p>
            <FieldLabel htmlFor="player-role">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Player</FieldTitle>
                  <FieldDescription>Participate in quiz.</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="PLAYER" id="player-role" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="spectator-role">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Spectator</FieldTitle>
                  <FieldDescription>Spectate other players</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="SPECTATOR" id="spectator-role" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </div>
        <FieldError errors={errors} />
        <button
          disabled={isPending}
          className={cn(
            'w-full flex justify-center gap-2 bg-primary-400 hover:bg-primary-500  text-black font-medium py-2.5 px-4 rounded-lg transition-colors mt-2',
            {
              'bg-primary-300': isPending,
            },
          )}
        >
          Generate Quiz {isPending && <Loader2 className="animate-spin" />}
        </button>
      </form>
    </div>
  );
}

interface QuizTopicsFieldProps {
  topics: Array<string>;
  addTopic: (topic: string) => void;
  removeTopic: (idx: number) => void;
}

function QuizTopicsField({
  topics,
  addTopic,
  removeTopic,
}: QuizTopicsFieldProps) {
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
          type="button"
          onClick={() => {
            const data = topicToAdd.trim();
            if (data.length > 0) {
              addTopic(topicToAdd);
              setTopicToAdd('');
            }
          }}
          className="grid place-items-center size-10 rounded-full hover:bg-accent-50"
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
