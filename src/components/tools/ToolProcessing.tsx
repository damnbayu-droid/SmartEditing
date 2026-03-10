'use client';

import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ToolProcessingProps {
  message?: string;
  progress?: number;
}

export function ToolProcessing({ 
  message = 'Processing your file...', 
  progress 
}: ToolProcessingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 
        className="h-12 w-12 text-primary animate-spin mb-4" 
        aria-hidden="true" 
      />
      <p className="text-lg font-medium mb-2">{message}</p>
      <p className="text-sm text-muted-foreground mb-4">
        Please wait while we process your file
      </p>
      {progress !== undefined && (
        <div className="w-full max-w-sm">
          <Progress value={progress} className="h-2" aria-label={`Processing progress: ${progress}%`} />
          <p className="text-xs text-muted-foreground text-center mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
}
