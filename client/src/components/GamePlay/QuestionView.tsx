import { useState } from 'react';
import { CheckIcon, Loader2, X } from 'lucide-react';
import type { Submission } from '@/stores/MemberStore';
import { cn } from '@/lib/utils';
import { useSocket } from '@/socket';
import { useQuestionInfo } from '@/stores/GameStore';
import { useMemberActions, useMemberSubmissions } from '@/stores/MemberStore';

export default function QuestionView({
  hasQuestionEnded,
}: {
  hasQuestionEnded: boolean;
}) {
  const socket = useSocket();
  const question = useQuestionInfo();
  const submissions = useMemberSubmissions();
  const { updateSubmissions, updateScore } = useMemberActions();
  const submission =
    submissions.find((sub) => sub.questionId == question.id) ?? null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeChoiceId = submission?.choiceId ?? null;

  const [optimisticChoiceId, setOptimisticChoiceId] = useState<string | null>(
    null,
  );

  const handleSubmit = (choiceId: string) => {
    if (hasQuestionEnded || activeChoiceId || isSubmitting) return;
    setOptimisticChoiceId(choiceId);
    setIsSubmitting(true);
    socket.emit(
      'question:submit',
      {
        questionId: question.id,
        choiceId,
      },
      (res: {
        success: boolean;
        submission: Submission & { score: number };
      }) => {
        if (res.success) {
          updateSubmissions(res.submission);
          updateScore(res.submission.score);
        }
        setIsSubmitting(false);
      },
    );
  };

  return (
    <>
      <div className="bg-primary-100 border p-6 rounded-xl shadow-md mb-4 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight wrap-break-word">
          {question.text}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.choices.map((choice, index) => {
          let status: SubmissionStatus = 'idle';
          const isChoiceSelected =
            optimisticChoiceId === choice.id || activeChoiceId == choice.id;
          const isCorrectChoice = submission?.isCorrect ?? null;
          if (isChoiceSelected) {
            if (isSubmitting) status = 'submitting';
            if (isCorrectChoice) status = 'correct';
            if (isCorrectChoice !== null && !isCorrectChoice)
              status = 'incorrect';
          }
          return (
            <QuestionChoice
              key={choice.id}
              id={choice.id}
              status={status}
              text={choice.text}
              hasQuestionEnded={hasQuestionEnded}
              handleSubmit={handleSubmit}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
}

type SubmissionStatus = 'idle' | 'submitting' | 'correct' | 'incorrect';

interface QuestionChoiceProps {
  id: string;
  text: string;
  index: number;
  status: SubmissionStatus;
  handleSubmit: (choiceId: string) => void;
  hasQuestionEnded: boolean;
}

function QuestionChoice({
  id,
  text,
  index,
  status,
  handleSubmit,
  hasQuestionEnded,
}: QuestionChoiceProps) {
  const labelColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
  ];

  return (
    <button
      onClick={() => handleSubmit(id)}
      disabled={hasQuestionEnded}
      className={cn(
        'grid grid-cols-[32px_1fr_32px] p-4 rounded-xl text-left border hover:ring-2 hover:ring-secondary-200 transition-transform transform duration-200 overflow-hidden wrap-break-word gap-2 shadow-sm',
        status !== 'idle' && 'bg-primary-50 scale-[1.02]',
        {
          'border-lime-400 bg-lime-100': status === 'correct',
          'border-red-400 bg-red-100': status === 'incorrect',
        },
      )}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
          `${labelColors[index]} text-white`,
        )}
      >
        {String.fromCharCode(65 + index)}
      </span>

      <span className="text-lg font-medium">{text}</span>

      <span>
        {status === 'submitting' && (
          <Loader2 className="text-gray-500 animate-spin" />
        )}
        {status === 'correct' && <CheckIcon className="text-lime-600" />}
        {status === 'incorrect' && <X className="text-red-600" />}
      </span>
    </button>
  );
}
