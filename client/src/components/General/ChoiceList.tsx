import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function ChoiceList({
  className,
  children,
  ...props
}: ComponentProps<'ul'>) {
  return (
    <ul className={cn('grid gap-2 list-none', className)} {...props}>
      {children}
    </ul>
  );
}

ChoiceList.Item = ChoiceItem;

function ChoiceItem({
  isCorrect,
  isWrongSubmission,
  className,
  children,
  ...props
}: {
  isCorrect?: boolean;
  isWrongSubmission?: boolean;
} & ComponentProps<'li'>) {
  return (
    <li
      className={cn(
        'bg-gray-100 p-1 rounded-lg px-2 text-sm',
        isCorrect && 'bg-green-200',
        isWrongSubmission && 'bg-red-200',
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
}
