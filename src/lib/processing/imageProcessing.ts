import type { Config } from '@imgly/background-removal';

export interface RemoveBgResult {
  success: boolean;
  url?: string;
  error?: string;
  processingTime: number;
}

/**
 * Remove background from an image using AI in the browser
 */
export async function removeImageBackground(
  imageSource: string | File | URL | HTMLImageElement | HTMLCanvasElement
): Promise<RemoveBgResult> {
  const startTime = Date.now();
  
  const config: Config = {
    progress: (stage, progress) => {
      // Logic for progress can be handled by the caller if needed
    },
    publicPath: 'https://static.smartediting.biz.id/libs/background-removal/', // Point to CDN or local assets
  };

  try {
    const { removeBackground } = await import('@imgly/background-removal');
    const blob = await removeBackground(imageSource, config);
    const url = URL.createObjectURL(blob);
    
    return {
      success: true,
      url,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Background removal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during background removal',
      processingTime: Date.now() - startTime,
    };
  }
}
