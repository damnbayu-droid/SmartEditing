'use client';

import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { downloadFile } from '@/lib/utils/fileHelpers';

interface ToolResultProps {
  originalFile: File;
  resultUrl: string;
  resultFilename: string;
  processingTime?: number;
  onReset?: () => void;
  previewComponent?: React.ReactNode;
}

export function ToolResult({
  originalFile,
  resultUrl,
  resultFilename,
  processingTime,
  onReset,
  previewComponent,
}: ToolResultProps) {
  const handleDownload = () => {
    downloadFile(resultUrl, resultFilename);
  };

  const isImage = originalFile.type.startsWith('image/');
  const isVideo = originalFile.type.startsWith('video/');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-1">
            Processing Complete!
          </p>
          {processingTime && (
            <p className="text-sm text-muted-foreground">
              Completed in {(processingTime / 1000).toFixed(1)} seconds
            </p>
          )}
        </div>
        
        {/* Preview */}
        <div className="mb-6">
          {previewComponent ? (
            previewComponent
          ) : isImage ? (
            <div className="rounded-lg overflow-hidden bg-muted">
              <img
                src={resultUrl}
                alt="Processed result"
                className="w-full max-h-96 object-contain mx-auto"
              />
            </div>
          ) : isVideo ? (
            <div className="rounded-lg overflow-hidden bg-muted">
              <video
                src={resultUrl}
                controls
                className="w-full max-h-96 mx-auto"
              >
                <track kind="captions" label="No captions available" />
              </video>
            </div>
          ) : null}
        </div>
        
        {/* File info */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="font-medium truncate mb-1">{resultFilename}</p>
          <p className="text-sm text-muted-foreground">
            Original: {originalFile.name}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownload}
            className="flex-1"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Download
          </Button>
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              size="lg"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Process Another
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
