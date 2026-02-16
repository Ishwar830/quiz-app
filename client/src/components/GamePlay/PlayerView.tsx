import { useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { Submission } from '@/stores/MemberStore';
import { cn } from '@/lib/utils';
import { useSocket } from '@/socket';
import { useQuestionInfo } from '@/stores/GameStore';
import { useMemberActions, useMemberSubmissions } from '@/stores/MemberStore';

export default function PlayerView({
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
        'grid grid-cols-[32px_1fr_32px] p-4 rounded-xl text-left border hover:cursor-pointer hover:scale-102 transition-transform transform duration-300 overflow-hidden wrap-break-word gap-2 shadow-sm bg-white',
        status === 'idle' && hasQuestionEnded && 'border-slate-200 opacity-60',
        status !== 'idle' && 'scale-[1.02]',
        {
          'border-emerald-400 bg-emerald-50': status === 'correct',
          'border-red-400 bg-red-50': status === 'incorrect',
        },
      )}
    >
      <span
        className={cn(
          'inline-flex items-center justify-center size-8 rounded-xl text-sm font-bold',
          `${labelColors[index]} text-white`,
        )}
      >
        {String.fromCharCode(65 + index)}
      </span>

      <span className="text-sm self-center font-semibold">{text}</span>

      <span className="flex items-center justify-center">
        {status === 'submitting' && (
          <Loader2 size={22} className="text-primary-500 animate-spin" />
        )}
        {status === 'correct' && (
          <CheckCircle2
            size={22}
            className="text-emerald-500 fill-emerald-100 animate-in zoom-in duration-300"
          />
        )}
        {status === 'incorrect' && (
          <XCircle
            size={22}
            className="text-red-500 fill-red-100 animate-in zoom-in duration-300"
          />
        )}

        {status === 'correct' && (
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-200/30 to-transparent animate-shimmer" />
        )}
      </span>
    </button>
  );
}
