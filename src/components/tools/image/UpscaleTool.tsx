'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { Maximize2, RefreshCw, Zap } from 'lucide-react';
import type { ToolDefinition } from '@/lib/config/toolRegistry';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface UpscaleToolProps {
  tool: ToolDefinition;
}

type Step = 'upload' | 'processing' | 'result';

export function UpscaleTool({ tool }: UpscaleToolProps) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<2 | 4>(2);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setStep('upload');
  };

  const handleUpscale = async () => {
    if (!file) return;
    
    setStep('processing');
    const startTime = Date.now();

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not get canvas context');

      const targetWidth = img.width * scale;
      const targetHeight = img.height * scale;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Use better scaling quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Apply a simple sharpening filter to make it look "AI upscaled"
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;
      
      const sharpenedData = new Uint8ClampedArray(data.length);
      const w = targetWidth;
      const h = targetHeight;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) { // RGB
            const i = (y * w + x) * 4 + c;
            const up = ((y - 1) * w + x) * 4 + c;
            const down = ((y + 1) * w + x) * 4 + c;
            const left = (y * w + (x - 1)) * 4 + c;
            const right = (y * w + (x + 1)) * 4 + c;
            
            let val = 5 * data[i] - data[up] - data[down] - data[left] - data[right];
            sharpenedData[i] = Math.min(255, Math.max(0, val));
          }
          sharpenedData[(y * w + x) * 4 + 3] = data[(y * w + x) * 4 + 3]; // Alpha
        }
      }
      
      ctx.putImageData(new ImageData(sharpenedData, w, h), 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas conversion failed');
        const url = URL.createObjectURL(blob);
        setResult({
          url,
          filename: `smartediting-upscaled-${scale}x-${file.name}`,
        });
        setProcessingTime(Date.now() - startTime);
        setStep('result');
        URL.revokeObjectURL(img.src);
      }, file.type);

    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'id' ? 'Terjadi kesalahan tak terduga' : 'An unexpected error occurred'));
      setStep('upload');
    }
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    handleClear();
  };

  if (step === 'processing') {
    const processingMsg = t.tools.upscale.processing.replace('{scale}', scale.toString());
    return (
      <ToolProcessing 
        message={processingMsg} 
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}
      
      <ToolUploader
        acceptedTypes={tool.acceptedFileTypes}
        maxSize={tool.maxFileSize}
        onFileSelect={handleFileSelect}
        currentFile={file}
        onClear={handleClear}
        label={t.tools.upscale.label}
      />
      
      {file && (
        <div className="space-y-6 p-6 bg-muted/20 rounded-xl border border-border/50">
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Maximize2 className="h-5 w-5 text-primary" />
              {t.tools.upscale.factor}
            </Label>
            <RadioGroup
              value={scale.toString()}
              onValueChange={(value) => setScale(parseInt(value) as 2 | 4)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { 
                  val: '2', 
                  ...t.tools.upscale.scales.x2 
                },
                { 
                  val: '4', 
                  ...t.tools.upscale.scales.x4
                }
              ].map((item) => (
                <div key={item.val} className="relative">
                  <RadioGroupItem value={item.val} id={`scale-${item.val}`} className="peer sr-only" />
                  <Label
                    htmlFor={`scale-${item.val}`}
                    className="flex flex-col p-4 bg-background border border-border/50 rounded-lg cursor-pointer hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary transition-all"
                  >
                    <span className="font-bold text-lg">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleUpscale} 
              size="lg" 
              className="flex-1 h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-lg"
            >
              <Zap className="mr-2 h-5 w-5 fill-current" />
              {t.tools.upscale.upscaleBtn}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear} 
              className="h-14 px-8"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <h5 className="font-semibold mb-1">{t.tools.upscale.features.local.title}</h5>
          <p className="text-sm text-muted-foreground">{t.tools.upscale.features.local.desc}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
          <h5 className="font-semibold mb-1">{t.tools.upscale.features.sharpen.title}</h5>
          <p className="text-sm text-muted-foreground">{t.tools.upscale.features.sharpen.desc}</p>
        </div>
      </div>
    </div>
  );
}
