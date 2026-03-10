'use client';

import { useState, useCallback } from 'react';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { ToolResult } from '@/components/tools/ToolResult';
import { removeImageBackground } from '@/lib/processing/imageProcessing';
import { BackgroundRemovalBrush } from '@/components/tools/image/BackgroundRemovalBrush';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, RefreshCw, Eraser } from 'lucide-react';
import type { ToolDefinition } from '@/lib/config/toolRegistry';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface RemoveBgToolProps {
  tool: ToolDefinition;
}

type Step = 'upload' | 'preview' | 'processing' | 'result' | 'manual-edit';

export function RemoveBgTool({ tool }: RemoveBgToolProps) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setStep('preview');
  }, []);

  const handleProcess = async () => {
    if (!file) return;

    setStep('processing');
    setError(null);

    try {
      const processingResult = await removeImageBackground(file);
      
      if (processingResult.success && processingResult.url) {
        setResult({
          url: processingResult.url,
          filename: `smartediting-nobg-${file.name.split('.')[0]}.png`,
        });
        setProcessingTime(processingResult.processingTime);
        setStep('result');
      } else {
        setError(processingResult.error || (lang === 'id' ? 'Pemrosesan gagal' : 'Processing failed'));
        setStep('preview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'id' ? 'Kesalahan tak terduga terjadi' : 'An unexpected error occurred'));
      setStep('preview');
    }
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setStep('upload');
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    handleClear();
  };

  const handleManualEditSave = (blob: Blob) => {
    if (result?.url) URL.revokeObjectURL(result.url);
    const newUrl = URL.createObjectURL(blob);
    setResult(prev => prev ? { ...prev, url: newUrl } : null);
    setStep('result');
  };

  if (step === 'manual-edit' && (result?.url || previewUrl)) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold">{t.tools.removeBg.refineTitle}</h3>
          <p className="text-sm text-muted-foreground">{t.tools.removeBg.refineDesc}</p>
        </div>
        <BackgroundRemovalBrush 
          imageUrl={result?.url || previewUrl!} 
          onSave={handleManualEditSave}
          onCancel={() => setStep(result ? 'result' : 'preview')}
        />
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <ToolProcessing 
        message={t.common.processing} 
        progress={undefined} 
      />
    );
  }

  if (step === 'result' && result && file) {
    return (
      <div className="space-y-6">
        <ToolResult
          originalFile={file}
          resultUrl={result.url}
          resultFilename={result.filename}
          processingTime={processingTime}
          onReset={handleReset}
          previewComponent={
            <div className="rounded-lg overflow-hidden checkerboard min-h-[300px] flex items-center justify-center bg-muted/20">
              <img
                src={result.url}
                alt="Background removed"
                className="max-w-full max-h-[500px] object-contain shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
              />
            </div>
          }
        />
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setStep('manual-edit')} className="gap-2">
            <Eraser className="h-4 w-4" />
            {t.tools.removeBg.notPerfect}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'preview' && previewUrl && file) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 space-y-6">
          <div className="rounded-xl overflow-hidden bg-muted/10 border border-border/50 group relative">
            <img
              src={previewUrl}
              alt="Original preview"
              className="w-full max-h-[500px] object-contain mx-auto"
            />
            {error && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    {t.tools.removeBg.tryAnother}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              onClick={handleProcess}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {t.tools.removeBg.removeBtn}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8"
              onClick={handleClear}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.tools.removeBg.changePhoto}
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button variant="link" size="sm" onClick={() => setStep('manual-edit')} className="text-muted-foreground hover:text-primary gap-2">
              <Eraser className="h-3 w-3" />
              {t.tools.removeBg.skipAI}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {[
              t.tools.removeBg.features.ai,
              t.tools.removeBg.features.hd,
              t.tools.removeBg.features.privacy,
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-lg bg-muted/5 border border-border/50 text-center">
                <div className="text-sm font-semibold mb-1">{feature.title}</div>
                <div className="text-xs text-muted-foreground">{feature.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ToolUploader
        acceptedTypes={tool.acceptedFileTypes}
        maxSize={tool.maxFileSize}
        onFileSelect={handleFileSelect}
        currentFile={file}
        onClear={handleClear}
        label={lang === 'id' ? 'Pilih foto untuk menghapus latar belakang' : 'Select a photo to remove background'}
      />
      <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <span>✓ {lang === 'id' ? 'Tanpa pendaftaran' : 'No signup required'}</span>
        <span>✓ {lang === 'id' ? 'Output PNG berkualitas tinggi' : 'High-quality PNG output'}</span>
        <span>✓ 100% {lang === 'id' ? 'Gratis' : 'Free'}</span>
      </div>
    </div>
  );
}
