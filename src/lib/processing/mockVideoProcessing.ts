import { delay } from '../utils/delay';
import { generateUniqueFileName } from '../utils/fileHelpers';

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  outputFilename?: string;
  error?: string;
  processingTime: number;
}

export interface TrimOptions {
  startTime: number;
  endTime: number;
}

/**
 * Mock video trim processing - returns original with simulated delay
 */
export const trimVideo = async (
  file: File,
  options: TrimOptions
): Promise<ProcessingResult> => {
  const startTime = Date.now();
  
  // Calculate processing time based on video duration and trim range
  const duration = options.endTime - options.startTime;
  const baseDelay = 5000 + (duration * 500); // Longer videos take longer
  
  // Simulate video processing delay
  await delay(baseDelay + Math.random() * 3000);
  
  const outputFilename = generateUniqueFileName(file.name, 'trimmed');
  
  // In mock mode, we return the same file but renamed
  // Real implementation would use FFmpeg or similar to trim
  const outputUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    outputUrl,
    outputFilename,
    processingTime: Date.now() - startTime,
  };
};

/**
 * Generic video processing function
 */
export const processVideo = async (
  file: File,
  operation: 'trim',
  options?: Record<string, unknown>
): Promise<ProcessingResult> => {
  switch (operation) {
    case 'trim':
      if (!options?.startTime || !options?.endTime) {
        return {
          success: false,
          error: 'Missing trim options',
          processingTime: 0,
        };
      }
      return trimVideo(file, {
        startTime: options.startTime as number,
        endTime: options.endTime as number,
      });
    default:
      return {
        success: false,
        error: 'Unknown operation',
        processingTime: 0,
      };
  }
};
