'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eraser, Paintbrush, Undo2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackgroundRemovalBrushProps {
  imageUrl: string;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
}

export function BackgroundRemovalBrush({ imageUrl, onSave, onCancel }: BackgroundRemovalBrushProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [brushType, setBrushType] = useState<'erase' | 'restore'>('erase');
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Initialize canvases
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set dimensions
      const containerWidth = canvas.parentElement?.clientWidth || img.width;
      const ratio = img.height / img.width;
      const displayWidth = Math.min(containerWidth, img.width);
      const displayHeight = displayWidth * ratio;

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      maskCanvas.width = displayWidth;
      maskCanvas.height = displayHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      
      // Initialize mask (transparent)
      maskCtx.clearRect(0, 0, displayWidth, displayHeight);
      
      // Save initial state
      setHistory([maskCtx.getImageData(0, 0, displayWidth, displayHeight)]);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const getPointerPos = (e: React.PointerEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const maskCtx = maskCanvasRef.current?.getContext('2d');
      if (maskCtx) {
        setHistory(prev => [...prev, maskCtx.getImageData(0, 0, maskCtx.canvas.width, maskCtx.canvas.height)]);
      }
    }
    setIsDrawing(false);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);

    ctx.globalCompositeOperation = brushType === 'erase' ? 'destination-out' : 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushType === 'restore' ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)';
    ctx.lineWidth = brushSize;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const prevState = newHistory[newHistory.length - 1];
    
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx && prevState) {
      maskCtx.putImageData(prevState, 0, 0);
      setHistory(newHistory);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    // Draw original image
    finalCtx.drawImage(canvas, 0, 0);
    
    // Apply mask
    finalCtx.globalCompositeOperation = 'destination-in';
    finalCtx.drawImage(maskCanvas, 0, 0);

    finalCanvas.toBlob((blob) => {
      if (blob) onSave(blob);
    }, 'image/png');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg border border-border/50">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={brushType === 'restore' ? 'default' : 'outline'}
            onClick={() => setBrushType('restore')}
            className="gap-2"
          >
            <Paintbrush className="h-4 w-4" />
            Keep
          </Button>
          <Button
            size="sm"
            variant={brushType === 'erase' ? 'default' : 'outline'}
            onClick={() => setBrushType('erase')}
            className="gap-2"
          >
            <Eraser className="h-4 w-4" />
            Remove
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xs px-4">
          <span className="text-xs font-medium whitespace-nowrap">Size: {brushSize}px</span>
          <Slider
            value={[brushSize]}
            onValueChange={(v) => setBrushSize(v[0])}
            min={1}
            max={100}
            step={1}
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleUndo} disabled={history.length <= 1}>
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-muted/20 border border-border/50 checkerboard touch-none">
        <canvas ref={canvasRef} className="max-w-full h-auto mx-auto" />
        <canvas
          ref={maskCanvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="absolute top-0 left-0 right-0 bottom-0 max-w-full h-auto mx-auto cursor-crosshair opacity-60"
        />
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Apply Changes
        </Button>
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
