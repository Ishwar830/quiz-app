import { Clock } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const Root = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <AccordionItem value={value} className={className}>
    {children}
  </AccordionItem>
);

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <AccordionTrigger className={cn(className)}>
    <div className="flex-1 flex gap-4 items-start">{children}</div>
  </AccordionTrigger>
);

const OrderBadge = ({
  order,
  className,
}: {
  order: number;
  className?: string;
}) => (
  <div
    className={cn(
      'size-8 grow-0 shrink-0 rounded-full bg-primary-300 grid place-items-center text-sm font-medium',
      className,
    )}
  >
    {order}
  </div>
);

const HeaderContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 flex-1">{children}</div>
);

// For timelimit, status badges, correct choice text
const MetaRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 items-center text-xs text-muted-foreground">
    {children}
  </div>
);

const Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <AccordionContent>
    <div className={cn('p-1 space-y-2', className)}>{children}</div>
  </AccordionContent>
);

// question title
const Text = ({ className, children, ...props }: ComponentProps<'p'>) => {
  return (
    <p
      className={cn(
        'font-medium text-sm sm:text-base wrap-break-word',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const TimeLimit = ({
  iconSize = 12,
  className,
  children,
  ...props
}: { iconSize?: number } & ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        'flex gap-2 items-center text-xs text-muted-foreground',
        className,
      )}
      {...props}
    >
      <Clock className="shrink-0 grow-0" size={iconSize} />
      {children}
    </span>
  );
};

export const QuestionCard = {
  Root,
  Text,
  TimeLimit,
  OrderBadge,
  Header,
  Body,
  MetaRow,
  HeaderContent,
};
