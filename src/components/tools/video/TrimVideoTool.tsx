'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { trimVideoReal } from '@/lib/processing/videoProcessing';
import { getVideoDuration } from '@/lib/utils/fileHelpers';
import { Play, Pause, Scissors, RefreshCw } from 'lucide-react';
import type { ToolDefinition } from '@/lib/config/toolRegistry';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface TrimVideoToolProps {
  tool: ToolDefinition;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function TrimVideoTool({ tool }: TrimVideoToolProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    try {
      const url = URL.createObjectURL(selectedFile);
      setVideoPreviewUrl(url);
      const videoDuration = await getVideoDuration(selectedFile);
      setDuration(videoDuration);
      setEndTime(videoDuration);
      setStartTime(0);
      setStep('edit');
    } catch (err) {
      setError(t.tools.trimVideo.errorLoad);
      setFile(null);
    }
  }, [t.tools.trimVideo.errorLoad]);

  const handleClear = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setFile(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setError(null);
    setVideoPreviewUrl(null);
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
    if (videoRef.current) {
      videoRef.current.currentTime = newEnd;
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.currentTime >= endTime || videoRef.current.currentTime < startTime) {
          videoRef.current.currentTime = startTime;
        }
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
        setIsPlaying(false);
      }
    }
  };

  const handleTrim = async () => {
    if (!file) return;
    
    setStep('processing');
    setError(null);

    try {
      const processingResult = await trimVideoReal(file, {
        startTime,
        endTime,
      });
      
      if (processingResult.success && processingResult.outputUrl) {
        setResult({
          url: processingResult.outputUrl,
          filename: processingResult.outputFilename || `trimmed-${file.name}`,
        });
        setProcessingTime(processingResult.processingTime);
        setStep('result');
      } else {
        setError(processingResult.error || t.tools.trimVideo.errorProcess);
        setStep('edit');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.tools.trimVideo.errorUnexpected);
      setStep('edit');
    }
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    handleClear();
  };

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  if (step === 'processing') {
    return (
      <ToolProcessing 
        message={t.tools.trimVideo.processing} 
        progress={undefined}
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

  if (step === 'edit' && file && videoPreviewUrl) {
    const clipDuration = endTime - startTime;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-xl overflow-hidden bg-black border border-border/50 shadow-2xl relative group">
          <video
            ref={videoRef}
            src={videoPreviewUrl}
            className="w-full max-h-[500px] mx-auto"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {!isPlaying && <Play className="h-16 w-16 text-white/50" />}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 bg-muted/20 p-6 rounded-xl border border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium text-sm">
                <Label className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-500 fill-green-500" /> 
                  {t.tools.trimVideo.start}: {formatTime(startTime)}
                </Label>
              </div>
              <Slider
                value={[startTime]}
                onValueChange={handleStartTimeChange}
                max={duration}
                step={0.1}
                className="py-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium text-sm">
                <Label className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-red-500 fill-red-500" />
                  {t.tools.trimVideo.end}: {formatTime(endTime)}
                </Label>
              </div>
              <Slider
                value={[endTime]}
                onValueChange={handleEndTimeChange}
                max={duration}
                step={0.1}
                className="py-2"
              />
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.tools.trimVideo.selected}: {formatTime(clipDuration)}</span>
                <span>Total: {formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <Play className="h-4 w-4 text-primary fill-primary" />
                {t.tools.trimVideo.playback}
              </h4>
              <div className="flex items-center gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 rounded-full h-14" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <><Pause className="h-5 w-5 mr-2" /> {t.tools.trimVideo.pausePreview}</>
                  ) : (
                    <><Play className="h-5 w-5 mr-2 fill-current" /> {t.tools.trimVideo.playSelection}</>
                  )}
                </Button>
                <div className="text-2xl font-mono tabular-nums bg-background px-4 py-2 rounded-lg border border-border/50">
                   {formatTime(currentTime)}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleTrim} 
                className="flex-1 h-14 bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20"
              >
                <Scissors className="mr-2 h-5 w-5" />
                {t.tools.trimVideo.trimBtn}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClear} 
                className="h-14 px-6"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              {t.tools.trimVideo.disclaimer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 animate-in shake-1 duration-300">
          {error}
        </div>
      )}
      <ToolUploader
        acceptedTypes={tool.acceptedFileTypes}
        maxSize={tool.maxFileSize}
        onFileSelect={handleFileSelect}
        currentFile={file}
        onClear={handleClear}
        label={t.tools.trimVideo.label}
      />
      <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <span>✓ {t.tools.trimVideo.features.instant}</span>
        <span>✓ {t.tools.trimVideo.features.privacy}</span>
        <span>✓ {t.tools.trimVideo.features.speed}</span>
      </div>
    </div>
  );
}

type Step = 'upload' | 'edit' | 'processing' | 'result';
