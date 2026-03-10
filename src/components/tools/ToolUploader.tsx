'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils/fileHelpers';

interface ToolUploaderProps {
  acceptedTypes: string[];
  maxSize: number; // in MB
  onFileSelect: (file: File) => void;
  currentFile?: File | null;
  onClear?: () => void;
  label?: string;
}

export function ToolUploader({
  acceptedTypes,
  maxSize,
  onFileSelect,
  currentFile,
  onClear,
  label = 'Upload your file',
}: ToolUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSize} MB`;
    }
    return null;
  }, [acceptedTypes, maxSize]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setError(null);
    onClear?.();
  }, [onClear]);

  const isImage = currentFile?.type.startsWith('image/');
  const isVideo = currentFile?.type.startsWith('video/');

  return (
    <div className="w-full">
      {!currentFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            error && 'border-destructive'
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={label}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-4" aria-hidden="true" />
          <p className="mb-2 text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground text-center">
            Drag and drop or click to upload
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Max {maxSize} MB • {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
            aria-label="File upload input"
          />
        </div>
      ) : (
        <div className="relative border rounded-lg p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleClear}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          <div className="flex items-center gap-4">
            {isImage && (
              <div className="h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={URL.createObjectURL(currentFile)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {isVideo && (
              <div className="h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                <FileIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            {!isImage && !isVideo && (
              <div className="h-20 w-20 rounded bg-muted flex-shrink-0 flex items-center justify-center">
                <FileIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(currentFile.size)}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentFile.type}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
