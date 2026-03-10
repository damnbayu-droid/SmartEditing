import { delay } from '../utils/delay';
import { generateUniqueFileName } from '../utils/fileHelpers';

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  outputFilename?: string;
  error?: string;
  processingTime: number;
}

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UpscaleOptions {
  scale: 2 | 4;
}

/**
 * Mock image crop processing - client-side canvas-based
 */
export const cropImage = async (
  file: File,
  options: CropOptions
): Promise<{ blob: Blob; filename: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = options.width;
      canvas.height = options.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(
        img,
        options.x,
        options.y,
        options.width,
        options.height,
        0,
        0,
        options.width,
        options.height
      );
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            const filename = generateUniqueFileName(file.name, 'cropped');
            resolve({ blob, filename });
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        file.type,
        0.95
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Mock background removal - returns original with simulated delay
 */
export const removeBackground = async (file: File): Promise<ProcessingResult> => {
  const startTime = Date.now();
  
  // Simulate AI processing delay
  await delay(3000 + Math.random() * 2000);
  
  const outputFilename = generateUniqueFileName(file.name, 'nobg');
  
  // In mock mode, we return the same file but renamed
  // Real implementation would use AI to remove background
  const outputUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    outputUrl,
    outputFilename,
    processingTime: Date.now() - startTime,
  };
};

/**
 * Mock image upscale - returns original with simulated delay
 */
export const upscaleImage = async (
  file: File,
  options: UpscaleOptions
): Promise<ProcessingResult> => {
  const startTime = Date.now();
  
  // Simulate AI processing delay (longer for higher scale)
  const baseDelay = options.scale === 4 ? 5000 : 3000;
  await delay(baseDelay + Math.random() * 2000);
  
  const outputFilename = generateUniqueFileName(file.name, `upscaled-${options.scale}x`);
  
  // In mock mode, we return the same file but renamed
  // Real implementation would use AI to upscale
  const outputUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    outputUrl,
    outputFilename,
    processingTime: Date.now() - startTime,
  };
};

/**
 * Generic image processing function
 */
export const processImage = async (
  file: File,
  operation: 'remove-background' | 'upscale',
  options?: Record<string, unknown>
): Promise<ProcessingResult> => {
  switch (operation) {
    case 'remove-background':
      return removeBackground(file);
    case 'upscale':
      return upscaleImage(file, { scale: (options?.scale as 2 | 4) || 2 });
    default:
      return {
        success: false,
        error: 'Unknown operation',
        processingTime: 0,
      };
  }
};
