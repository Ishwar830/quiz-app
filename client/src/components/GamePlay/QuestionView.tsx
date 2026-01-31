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
  const selectedOptionId =
    submissions.find((sub) => sub.questionId == question.id)?.choiceId ?? null;

  const handleSubmit = (choiceId: string) => {
    if (hasQuestionEnded || selectedOptionId) return;
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
      },
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight wrap-break-word">
          {question.text}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.choices.map((choice, index) => {
          const isSelected = choice.id == selectedOptionId;
          return (
            <button
              key={choice.id}
              onClick={() => handleSubmit(choice.id)}
              disabled={hasQuestionEnded}
              className={cn(
                'relative p-4 rounded-xl text-left border-2 transition-all transform duration-200 overflow-hidden wrap-break-word',
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm',
              )}
            >
              <span
                className={cn(
                  'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3',
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-500',
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span
                className={cn(
                  'text-lg font-medium',
                  isSelected ? 'text-indigo-900' : 'text-gray-700',
                )}
              >
                {choice.text}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
