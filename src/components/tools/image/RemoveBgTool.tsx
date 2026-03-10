'use client';

import { useState } from 'react';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { removeBackground } from '@/lib/processing/mockImageProcessing';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface RemoveBgToolProps {
  tool: ToolDefinition;
}

type Step = 'upload' | 'processing' | 'result';

export function RemoveBgTool({ tool }: RemoveBgToolProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStep('processing');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const processingResult = await removeBackground(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (processingResult.success && processingResult.outputUrl) {
        setResult({
          url: processingResult.outputUrl,
          filename: processingResult.outputFilename || 'processed-image.png',
        });
        setProcessingTime(processingResult.processingTime);
        setStep('result');
      } else {
        setError(processingResult.error || 'Processing failed');
        setStep('upload');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('upload');
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStep('upload');
  };

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setResult(null);
    setFile(null);
    setStep('upload');
  };

  if (step === 'processing') {
    return (
      <ToolProcessing 
        message="Removing background..." 
        progress={Math.min(100, Math.round(progress))}
      />
    );
  }

  if (step === 'result' && result && file) {
    return (
      <ToolResult
        originalFile={file}
        resultUrl={result.url}
        resultFilename={result.filename}
        processingTime={processingTime}
        onReset={handleReset}
        previewComponent={
          <div className="rounded-lg overflow-hidden checkerboard">
            <img
              src={result.url}
              alt="Processed result with transparent background"
              className="w-full max-h-96 object-contain mx-auto"
            />
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}
      <ToolUploader
        acceptedTypes={tool.acceptedFileTypes}
        maxSize={tool.maxFileSize}
        onFileSelect={handleFileSelect}
        currentFile={file}
        onClear={handleClear}
        label="Upload an image to remove background"
      />
      <p className="text-sm text-muted-foreground">
        Works best with images that have clear subject separation.
        Output will be a transparent PNG.
      </p>
    </div>
  );
}
