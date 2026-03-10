'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { upscaleImage } from '@/lib/processing/mockImageProcessing';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface UpscaleToolProps {
  tool: ToolDefinition;
}

type Step = 'upload' | 'processing' | 'result';

export function UpscaleTool({ tool }: UpscaleToolProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<2 | 4>(2);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
  };

  const handleUpscale = async () => {
    if (!file) return;
    
    setStep('processing');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 400);

    try {
      const processingResult = await upscaleImage(file, { scale });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (processingResult.success && processingResult.outputUrl) {
        setResult({
          url: processingResult.outputUrl,
          filename: processingResult.outputFilename || `upscaled-${scale}x.png`,
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
        message={`Upscaling image ${scale}x...`} 
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
      />
    );
  }

  return (
    <div className="space-y-6">
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
        label="Upload an image to upscale"
      />
      
      {file && (
        <>
          <div className="space-y-3">
            <Label>Upscale Factor</Label>
            <RadioGroup
              value={scale.toString()}
              onValueChange={(value) => setScale(parseInt(value) as 2 | 4)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="scale-2" />
                <Label htmlFor="scale-2" className="font-normal cursor-pointer">
                  2x (Double resolution)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="scale-4" />
                <Label htmlFor="scale-4" className="font-normal cursor-pointer">
                  4x (Quadruple resolution)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleUpscale}>
              Upscale Image
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Cancel
            </Button>
          </div>
        </>
      )}
      
      <p className="text-sm text-muted-foreground">
        AI-powered upscaling enhances image quality while increasing resolution.
        Best for enlarging small images or improving low-resolution photos.
      </p>
    </div>
  );
}
