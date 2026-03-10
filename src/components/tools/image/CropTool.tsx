'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolResult } from '@/components/tools/ToolResult';
import { cropImage } from '@/lib/processing/mockImageProcessing';
import type { ToolDefinition } from '@/lib/config/toolRegistry';

interface CropToolProps {
  tool: ToolDefinition;
}

const ASPECT_RATIOS = [
  { name: 'Free', value: 'free' },
  { name: '1:1 (Square)', value: '1:1' },
  { name: '4:3', value: '4:3' },
  { name: '16:9', value: '16:9' },
  { name: '9:16 (Portrait)', value: '9:16' },
  { name: '3:2', value: '3:2' },
  { name: '2:3', value: '2:3' },
];

const PRESET_SIZES = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Facebook Cover', width: 820, height: 312 },
];

type Step = 'upload' | 'edit' | 'result';

export function CropTool({ tool }: CropToolProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('free');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Load image dimensions
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
      setStep('edit');
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setStep('upload');
  };

  // Calculate display dimensions when image loads
  useEffect(() => {
    if (step === 'edit' && imageDimensions.width > 0 && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // padding
      const scale = containerWidth / imageDimensions.width;
      const displayHeight = imageDimensions.height * scale;
      setDisplayDimensions({ width: containerWidth, height: displayHeight });
    }
  }, [step, imageDimensions]);

  const getScale = useCallback(() => {
    return displayDimensions.width / imageDimensions.width;
  }, [displayDimensions, imageDimensions]);

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    
    if (value !== 'free' && imageDimensions.width > 0) {
      const [w, h] = value.split(':').map(Number);
      const ratio = w / h;
      
      let newWidth = cropArea.width;
      let newHeight = newWidth / ratio;
      
      if (newHeight > imageDimensions.height) {
        newHeight = imageDimensions.height;
        newWidth = newHeight * ratio;
      }
      
      // Center the crop area
      const x = (imageDimensions.width - newWidth) / 2;
      const y = (imageDimensions.height - newHeight) / 2;
      
      setCropArea({ x, y, width: newWidth, height: newHeight });
    }
  };

  const handlePresetSize = (preset: typeof PRESET_SIZES[0]) => {
    // Scale preset to fit within image
    const scale = Math.min(
      imageDimensions.width / preset.width,
      imageDimensions.height / preset.height
    );
    
    const newWidth = preset.width * scale;
    const newHeight = preset.height * scale;
    const x = (imageDimensions.width - newWidth) / 2;
    const y = (imageDimensions.height - newHeight) / 2;
    
    setCropArea({ x, y, width: newWidth, height: newHeight });
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize', corner?: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setResizeCorner(corner || null);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragType) return;
    
    const scale = getScale();
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (dragType === 'move') {
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(imageDimensions.width - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(imageDimensions.height - prev.height, prev.y + dy)),
      }));
    } else if (dragType === 'resize' && resizeCorner) {
      setCropArea(prev => {
        let newArea = { ...prev };
        const ratio = aspectRatio !== 'free' 
          ? parseInt(aspectRatio.split(':')[0]) / parseInt(aspectRatio.split(':')[1])
          : null;
        
        if (resizeCorner.includes('e')) {
          newArea.width = Math.max(50, Math.min(imageDimensions.width - prev.x, prev.width + dx));
          if (ratio) newArea.height = newArea.width / ratio;
        }
        if (resizeCorner.includes('w')) {
          const newWidth = Math.max(50, prev.width - dx);
          if (prev.x + dx >= 0 && prev.x + dx + newWidth <= imageDimensions.width) {
            newArea.x = prev.x + dx;
            newArea.width = newWidth;
          }
          if (ratio) newArea.height = newArea.width / ratio;
        }
        if (resizeCorner.includes('s')) {
          newArea.height = Math.max(50, Math.min(imageDimensions.height - prev.y, prev.height + dy));
          if (ratio) newArea.width = newArea.height * ratio;
        }
        if (resizeCorner.includes('n')) {
          const newHeight = Math.max(50, prev.height - dy);
          if (prev.y + dy >= 0 && prev.y + dy + newHeight <= imageDimensions.height) {
            newArea.y = prev.y + dy;
            newArea.height = newHeight;
          }
          if (ratio) newArea.width = newArea.height * ratio;
        }
        
        // Ensure within bounds
        newArea.x = Math.max(0, newArea.x);
        newArea.y = Math.max(0, newArea.y);
        newArea.width = Math.min(newArea.width, imageDimensions.width - newArea.x);
        newArea.height = Math.min(newArea.height, imageDimensions.height - newArea.y);
        
        return newArea;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
    setResizeCorner(null);
  };

  const handleCrop = async () => {
    if (!file) return;
    
    const startTime = Date.now();
    
    try {
      const { blob, filename } = await cropImage(file, {
        x: Math.round(cropArea.x),
        y: Math.round(cropArea.y),
        width: Math.round(cropArea.width),
        height: Math.round(cropArea.height),
      });
      
      const url = URL.createObjectURL(blob);
      setResult({ url, filename });
      setProcessingTime(Date.now() - startTime);
      setStep('result');
    } catch (error) {
      console.error('Crop failed:', error);
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

  // Render based on current step
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
    const scale = getScale();
    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale,
    };

    return (
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Preset Sizes</Label>
            <Select onValueChange={(value) => {
              const preset = PRESET_SIZES.find(p => p.name === value);
              if (preset) handlePresetSize(preset);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select preset..." />
              </SelectTrigger>
              <SelectContent>
                {PRESET_SIZES.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={handleClear}>
              Cancel
            </Button>
            <Button onClick={handleCrop}>
              Apply Crop
            </Button>
          </div>
        </div>

        {/* Crop info */}
        <div className="text-sm text-muted-foreground">
          Crop area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
        </div>

        {/* Canvas area */}
        <div 
          ref={containerRef}
          className="relative bg-muted rounded-lg overflow-hidden"
          style={{ height: displayDimensions.height + 32 }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={URL.createObjectURL(file)}
            alt="Crop preview"
            className="absolute top-4 left-4"
            style={{
              width: displayDimensions.width,
              height: displayDimensions.height,
            }}
            draggable={false}
          />
          
          {/* Darkened overlay */}
          <div
            className="absolute bg-black/50 pointer-events-none"
            style={{
              top: 4,
              left: 4,
              width: displayDimensions.width,
              height: displayDimensions.height,
              clipPath: `polygon(
                0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                ${scaledCrop.x}px ${scaledCrop.y}px,
                ${scaledCrop.x}px ${scaledCrop.y + scaledCrop.height}px,
                ${scaledCrop.x + scaledCrop.width}px ${scaledCrop.y + scaledCrop.height}px,
                ${scaledCrop.x + scaledCrop.width}px ${scaledCrop.y}px,
                ${scaledCrop.x}px ${scaledCrop.y}px
              )`,
            }}
          />
          
          {/* Crop area */}
          <div
            className="absolute border-2 border-white cursor-move"
            style={{
              top: scaledCrop.y + 4,
              left: scaledCrop.x + 4,
              width: scaledCrop.width,
              height: scaledCrop.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-0 right-0 border-t border-white/50" />
              <div className="absolute top-2/3 left-0 right-0 border-t border-white/50" />
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/50" />
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/50" />
            </div>
            
            {/* Resize handles */}
            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((corner) => (
              <div
                key={corner}
                className={`absolute w-3 h-3 bg-white border border-gray-400 ${
                  corner.includes('n') ? 'top-0 -translate-y-1/2' : 'bottom-0 translate-y-1/2'
                } ${
                  corner.includes('w') ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
                } ${
                  corner.length === 1
                    ? corner === 'n' || corner === 's'
                      ? 'left-1/2 -translate-x-1/2 cursor-ns-resize'
                      : 'top-1/2 -translate-y-1/2 cursor-ew-resize'
                    : corner === 'nw' || corner === 'se'
                      ? 'cursor-nwse-resize'
                      : 'cursor-nesw-resize'
                }`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'resize', corner);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToolUploader
      acceptedTypes={tool.acceptedFileTypes}
      maxSize={tool.maxFileSize}
      onFileSelect={handleFileSelect}
      currentFile={file}
      onClear={handleClear}
      label="Upload an image to crop"
    />
  );
}
