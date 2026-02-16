import { TagIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function TopicList({
  className,
  children,
  ...props
}: ComponentProps<'ul'>) {
  return (
    <ul className={cn('flex gap-2 flex-wrap', className)} {...props}>
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
        'inline-flex items-center gap-1.5 text-xs font-medium rounded-full bg-accent-50 text-accent-700 border border-accent-200 px-3 py-1',
        className,
      )}
      {...props}
    >
      {withTagIcon && <TagIcon size={10} className="shrink-0" />}
      {children}
    </li>
  );
}
