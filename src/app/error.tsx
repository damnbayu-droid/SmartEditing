'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b bg-background/95" />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={reset} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Go Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-w-full">
              {error.message}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
