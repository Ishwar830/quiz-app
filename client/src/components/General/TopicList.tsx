import { TagIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function TopicList({
  className,
  children,
  ...props
}: ComponentProps<'ul'>) {
  return (
    <ul className={cn('flex gap-4 flex-wrap', className)} {...props}>
      {children}
    </ul>
  );
}

TopicList.Item = TopicItem;

function TopicItem({
  withTagIcon = true,
  className,
  children,
  ...props
}: { withTagIcon?: boolean } & ComponentProps<'li'>) {
  return (
    <li
      className={cn(
        'text-xs flex items-center gap-2 rounded-md bg-accent-100 p-1 px-2',
        className,
      )}
      {...props}
    >
      {withTagIcon && <TagIcon size={12} />}
      {children}
    </li>
  );
}
