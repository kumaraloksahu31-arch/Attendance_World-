'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAttendanceInsightsAction } from '@/app/lib/actions';
import { Bot, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function InsightsGenerator() {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setError(null);
      setInsights(null);
      const result = await getAttendanceInsightsAction();
      if (result.success) {
        setInsights(result.insights);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Bot className="h-5 w-5" />
              AI Data Insights
            </CardTitle>
            <CardDescription>
              Generate insights from your attendance data.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : insights ? (
          <p className="text-sm text-muted-foreground">{insights}</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the button to get AI-powered insights and summaries of attendance patterns.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateInsights}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          {isPending ? 'Generating...' : 'Generate Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
}
