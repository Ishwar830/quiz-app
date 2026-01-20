import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { cn } from '@/lib/utils';

export function Skeleton({ className = '' }) {
  return <div className={cn('animate-pulse bg-gray-400 rounded', className)} />;
}

export function QuizCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <Skeleton className="h-7 w-3/4 mb-4" />
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-1" />
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-40" />
      </CardContent>

      <CardFooter className="flex justify-around gap-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
