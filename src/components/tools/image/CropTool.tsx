'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolResult } from '@/components/tools/ToolResult';
import { ToolProcessing } from '@/components/tools/ToolProcessing';
import { Scissors, RefreshCw, Smartphone, Monitor, Square } from 'lucide-react';
import type { ToolDefinition } from '@/lib/config/toolRegistry';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CropToolProps {
  tool: ToolDefinition;
}

const PRESETS = [
  { name: '1:1 Square', value: 1, icon: Square },
  { name: '16:9 Wide', value: 16 / 9, icon: Monitor },
  { name: '9:16 Portrait', value: 9 / 16, icon: Smartphone },
  { name: '4:3 Classic', value: 4 / 3, icon: Monitor },
];

type Step = 'upload' | 'edit' | 'processing' | 'result';

export function CropTool({ tool }: CropToolProps) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(selectedFile);
    setStep('edit');
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect || 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleApplyCrop = async () => {
    if (!imgRef.current || !completedCrop || !file) return;

    setStep('processing');
    const startTime = Date.now();

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResult({ url, filename: `smartediting-cropped-${file.name}` });
      setProcessingTime(Date.now() - startTime);
      setStep('result');
    }, file.type);
  };

  const handleClear = () => {
    setFile(null);
    setImgSrc('');
    setResult(null);
    setStep('upload');
  };

  if (step === 'processing') {
    return <ToolProcessing message={lang === 'id' ? 'Memotong gambar...' : 'Cropping image...'} />;
  }

  if (step === 'result' && result && file) {
    return (
      <ToolResult
        originalFile={file}
        resultUrl={result.url}
        resultFilename={result.filename}
        processingTime={processingTime}
        onReset={handleClear}
      />
    );
  }

  if (step === 'edit' && imgSrc) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-wrap gap-3 items-center justify-between pb-4 border-b border-border/50">
          <div className="flex gap-2">
            <Button
              variant={aspect === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAspect(undefined)}
            >
              {lang === 'id' ? 'Bebas' : 'Free'}
            </Button>
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                variant={aspect === p.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAspect(p.value)}
                className="gap-2"
              >
                <p.icon className="h-4 w-4" />
                {lang === 'id' ? p.name.split(' ')[1] : p.name.split(' ')[0]}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.common.cancel}
            </Button>
            <Button onClick={handleApplyCrop} className="bg-primary hover:bg-primary/90">
              <Scissors className="h-4 w-4 mr-2" />
              {t.tools.crop.applyBtn}
            </Button>
          </div>
        </div>

        <div className="flex justify-center bg-muted/20 rounded-xl p-4 border border-border/50 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              alt="Crop preview"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-h-[600px] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="text-center text-xs text-muted-foreground italic">
          {lang === 'id' 
            ? 'Tip: Tarik sudut untuk mengubah ukuran, atau shift+tarik untuk bentuk bebas.' 
            : 'Tip: Drag the corners to resize, or shift+drag for free-form.'}
        </div>
      </div>
    );
  }

  return (
    <ToolUploader
      acceptedTypes={tool.acceptedFileTypes}
      maxSize={tool.maxFileSize}
      onFileSelect={onSelectFile}
      currentFile={file}
      onClear={handleClear}
      label={lang === 'id' ? 'Pilih gambar untuk dipotong' : 'Select an image to crop'}
    />
  );
}
