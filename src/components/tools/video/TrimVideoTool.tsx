'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { trimVideo } from '@/lib/processing/mockVideoProcessing';
import { getVideoDuration } from '@/lib/utils/fileHelpers';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface TrimVideoToolProps {
  tool: ToolDefinition;
}

type Step = 'upload' | 'edit' | 'processing' | 'result';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function TrimVideoTool({ tool }: TrimVideoToolProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    try {
      const videoDuration = await getVideoDuration(selectedFile);
      setDuration(videoDuration);
      setEndTime(videoDuration);
      setStartTime(0);
      setStep('edit');
    } catch (err) {
      setError('Failed to load video. Please try another file.');
      setFile(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setError(null);
    setStep('upload');
  };

  const handleStartTimeChange = (value: number[]) => {
    const newStart = Math.min(value[0], endTime - 0.1);
    setStartTime(newStart);
    if (videoRef.current) {
      videoRef.current.currentTime = newStart;
    }
  };

  const handleEndTimeChange = (value: number[]) => {
    const newEnd = Math.max(value[0], startTime + 0.1);
    setEndTime(newEnd);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        videoRef.current.currentTime = startTime;
        setIsPlaying(false);
      }
    }
  };

  const handleTrim = async () => {
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
        return prev + Math.random() * 8;
      });
    }, 300);

    try {
      const processingResult = await trimVideo(file, {
        startTime,
        endTime,
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (processingResult.success && processingResult.outputUrl) {
        setResult({
          url: processingResult.outputUrl,
          filename: processingResult.outputFilename || 'trimmed-video.mp4',
        });
        setProcessingTime(processingResult.processingTime);
        setStep('result');
      } else {
        setError(processingResult.error || 'Processing failed');
        setStep('edit');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('edit');
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

  useEffect(() => {
    return () => {
      if (isPlaying && videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isPlaying]);

  if (step === 'processing') {
    return (
      <ToolProcessing 
        message="Trimming video..." 
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

  if (step === 'edit' && file) {
    const clipDuration = endTime - startTime;

    return (
      <div className="space-y-6">
        {/* Video Preview */}
        <div className="rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={URL.createObjectURL(file)}
            className="w-full max-h-96 mx-auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = startTime;
              }
            }}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play Selection'}
          </Button>
          <span className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Trim Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Start Time: {formatTime(startTime)}</Label>
            </div>
            <Slider
              value={[startTime]}
              onValueChange={handleStartTimeChange}
              max={duration}
              step={0.1}
              className="w-full"
              aria-label="Start time"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>End Time: {formatTime(endTime)}</Label>
            </div>
            <Slider
              value={[endTime]}
              onValueChange={handleEndTimeChange}
              max={duration}
              step={0.1}
              className="w-full"
              aria-label="End time"
            />
          </div>

          {/* Timeline visualization */}
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            {/* Full video */}
            <div className="absolute inset-0 bg-muted-foreground/20" />
            {/* Selected range */}
            <div
              className="absolute top-0 bottom-0 bg-primary/50"
              style={{
                left: `${(startTime / duration) * 100}%`,
                width: `${((endTime - startTime) / duration) * 100}%`,
              }}
            />
            {/* Start marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary"
              style={{ left: `${(startTime / duration) * 100}%` }}
            />
            {/* End marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary"
              style={{ left: `${(endTime / duration) * 100}%` }}
            />
            {/* Current time marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Clip duration: {formatTime(clipDuration)}</span>
            <span>of {formatTime(duration)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleTrim}>
            Trim Video
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Cancel
          </Button>
        </div>
      </div>
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
        label="Upload a video to trim"
      />
      <p className="text-sm text-muted-foreground">
        Select start and end points to trim your video. The trimmed video will be exported in high quality.
      </p>
    </div>
  );
}
