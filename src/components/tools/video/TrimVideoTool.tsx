'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { processVideo, ProcessingOptions } from '@/lib/processing/videoProcessing';
import { getVideoDuration } from '@/lib/utils/fileHelpers';
import { 
  Play, 
  Pause, 
  Scissors, 
  RefreshCw, 
  Settings2, 
  Volume2, 
  VolumeX, 
  Gauge, 
  RotateCw, 
  FlipHorizontal,
  Download
} from 'lucide-react';
import type { ToolDefinition } from '@/lib/config/toolRegistry';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  
  // Advanced Settings
  const [speed, setSpeed] = useState<number>(1);
  const [mute, setMute] = useState<boolean>(false);
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  
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
    setSpeed(1);
    setMute(false);
    setRotate(0);
    setFlipH(false);
    setProgress(0);
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

  const handleProcess = async () => {
    if (!file) return;
    
    setStep('processing');
    setError(null);
    setProgress(0);

    const options: ProcessingOptions = {
        startTime,
        endTime,
        speed,
        mute,
        rotate,
        flipH
    };

    try {
      const processingResult = await processVideo(file, options, (p) => setProgress(p));
      
      if (processingResult.success && processingResult.outputUrl) {
        setResult({
          url: processingResult.outputUrl,
          filename: processingResult.outputFilename || `trimmed-${file.name}`,
        });
        setProcessingTime(processingResult.processingTime);
        setStep('result');
        
        toast.success(t.tools.trimVideo.successTitle, {
          description: t.tools.trimVideo.successDesc,
        });
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
        progress={progress}
      />
    );
  }

  if (step === 'result' && result && file) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
          <ToolResult
            originalFile={file}
            resultUrl={result.url}
            resultFilename={result.filename}
            processingTime={processingTime}
            onReset={handleReset}
            previewComponent={
                <div className="rounded-xl overflow-hidden bg-black border border-border/50 shadow-2xl relative group">
                    <video
                        src={result.url}
                        className="w-full max-h-[500px] mx-auto"
                        controls
                        autoPlay
                    />
                    <div className="absolute top-4 right-4 animate-in slide-in-from-top-4 duration-1000">
                        <Button 
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = result.url;
                                link.download = result.filename;
                                link.click();
                            }}
                            className="bg-primary hover:bg-primary/90 shadow-lg gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {t.tools.trimVideo.downloadNow}
                        </Button>
                    </div>
                </div>
            }
          />
      </div>
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
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center justify-between">
              <p className="text-white font-mono text-sm tabular-nums">{formatTime(currentTime)}</p>
              <p className="text-white/60 font-mono text-xs">{formatTime(clipDuration)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
              {/* Trimming Controls */}
              <Card className="border-border/50 bg-muted/20">
                  <CardContent className="p-6 space-y-6">
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
                  </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-14 flex-1 rounded-xl" 
                    onClick={handlePlayPause}
                >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                </Button>
                <Button 
                    onClick={handleProcess} 
                    className="flex-[3] h-14 bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20 rounded-xl"
                >
                    <Scissors className="mr-2 h-5 w-5" />
                    {t.tools.trimVideo.trimBtn}
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={handleClear} 
                    className="h-14 px-6 rounded-xl text-muted-foreground hover:text-destructive"
                >
                    <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
          </div>

          <div className="space-y-6">
              {/* Advanced Settings */}
              <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6 space-y-6">
                      <div className="flex items-center gap-2 font-bold text-primary">
                          <Settings2 className="h-5 w-5" />
                          {t.tools.trimVideo.settings.title}
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                          {/* Speed */}
                          <div className="space-y-3">
                              <Label className="text-sm font-semibold flex items-center gap-2">
                                  <Gauge className="h-4 w-4" />
                                  {t.tools.trimVideo.settings.speed}
                              </Label>
                              <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseFloat(v))}>
                                  <SelectTrigger className="bg-background">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="0.5">{t.tools.trimVideo.settings.slow}</SelectItem>
                                      <SelectItem value="1">{t.tools.trimVideo.settings.normal}</SelectItem>
                                      <SelectItem value="1.5">{t.tools.trimVideo.settings.fast}</SelectItem>
                                      <SelectItem value="2">{t.tools.trimVideo.settings.veryFast}</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          {/* Rotate & Flip */}
                          <div className="space-y-3">
                              <Label className="text-sm font-semibold flex items-center gap-2">
                                  <RotateCw className="h-4 w-4" />
                                  {t.tools.trimVideo.settings.rotate}
                              </Label>
                              <div className="flex gap-2">
                                  <Select value={rotate.toString()} onValueChange={(v) => setRotate(parseInt(v) as any)}>
                                      <SelectTrigger className="bg-background flex-1">
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="0">{t.tools.trimVideo.settings.none}</SelectItem>
                                          <SelectItem value="90">{t.tools.trimVideo.settings.rotate90}</SelectItem>
                                          <SelectItem value="180">{t.tools.trimVideo.settings.rotate180}</SelectItem>
                                          <SelectItem value="270">{t.tools.trimVideo.settings.rotate270}</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <Button 
                                    variant={flipH ? "default" : "outline"} 
                                    size="icon" 
                                    onClick={() => setFlipH(!flipH)}
                                    className="bg-background"
                                    title={t.tools.trimVideo.settings.flipH}
                                  >
                                      <FlipHorizontal className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>

                          {/* Mute toggle */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                              <div className="flex items-center gap-3">
                                  {mute ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-primary" />}
                                  <div className="space-y-0.5">
                                      <Label className="text-sm font-semibold">{t.tools.trimVideo.settings.mute}</Label>
                                  </div>
                              </div>
                              <Switch checked={mute} onCheckedChange={setMute} />
                          </div>
                      </div>
                  </CardContent>
              </Card>

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
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Play className="h-3 w-3" /> {t.tools.trimVideo.features.instant}</span>
        <span className="flex items-center gap-1.5 font-bold text-primary">🛡️ {t.tools.trimVideo.features.privacy}</span>
        <span className="flex items-center gap-1.5"><Scissors className="h-3 w-3" /> {t.tools.trimVideo.features.speed}</span>
      </div>
    </div>
  );
}

type Step = 'upload' | 'edit' | 'processing' | 'result';
