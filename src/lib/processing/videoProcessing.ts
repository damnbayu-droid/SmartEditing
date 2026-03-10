let ffmpeg: any = null;

export interface ProcessingOptions {
  startTime: number;
  endTime: number;
  speed?: number;
  mute?: boolean;
  rotate?: 0 | 90 | 180 | 270;
  flipH?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  outputFilename?: string;
  error?: string;
  processingTime: number;
}

export async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;
  
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { toBlobURL } = await import('@ffmpeg/util');
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
}

export async function processVideo(
  file: File,
  options: ProcessingOptions,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const startProcessingTime = Date.now();
  
  try {
    const ffmpeg = await loadFFmpeg();
    const { startTime, endTime, speed = 1, mute = false, rotate = 0, flipH = false } = options;
    const duration = (endTime - startTime) / speed;
    
    // Set progress handler
    if (onProgress) {
        ffmpeg.on('progress', ({ progress }: { progress: number }) => {
            onProgress(Math.round(progress * 100));
        });
    }

    const { fetchFile } = await import('@ffmpeg/util');
    
    // Write input file
    await ffmpeg.writeFile('input', await fetchFile(file));
    
    const args: string[] = [];
    
    // 1. Seek to start time (fast seek before input)
    args.push('-ss', startTime.toString());
    args.push('-i', 'input');
    
    // 2. Set duration
    args.push('-t', (endTime - startTime).toString());
    
    // 3. Filters
    const videoFilters: string[] = [];
    const audioFilters: string[] = [];
    
    // Handle Speed
    if (speed !== 1) {
        videoFilters.push(`setpts=${1/speed}*PTS`);
        audioFilters.push(`atempo=${speed}`);
        // Note: atempo only supports 0.5 to 2.0. Our options are within this range.
    }
    
    // Handle Rotation/Flip
    if (flipH) videoFilters.push('hflip');
    if (rotate === 90) videoFilters.push('transpose=1');
    else if (rotate === 180) videoFilters.push('transpose=2,transpose=2');
    else if (rotate === 270) videoFilters.push('transpose=2');
    
    const filterParts: string[] = [];
    if (videoFilters.length > 0) {
        filterParts.push('-vf', videoFilters.join(','));
    }
    
    if (mute) {
        args.push('-an'); // Remove audio
    } else if (audioFilters.length > 0) {
        args.push('-af', audioFilters.join(','));
    }
    
    args.push(...filterParts);
    
    // 4. Output settings
    // Use libx264 for compatibility if we're not just copying
    if (videoFilters.length > 0 || audioFilters.length > 0 || speed !== 1) {
        args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28');
        args.push('-c:a', 'aac', '-b:a', '128k');
    } else {
        args.push('-c', 'copy');
    }

    args.push('output.mp4');
    
    // Run command
    await ffmpeg.exec(args);
    
    // Read output
    const data = await ffmpeg.readFile('output.mp4');
    const outputBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });
    const outputUrl = URL.createObjectURL(outputBlob);
    
    return {
      success: true,
      outputUrl,
      outputFilename: `smartediting-${file.name.split('.')[0]}-${Date.now()}.mp4`,
      processingTime: Date.now() - startProcessingTime,
    };
  } catch (error) {
    console.error('Video processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Video processing failed',
      processingTime: Date.now() - startProcessingTime,
    };
  }
}

// Keep original function name for compatibility if used elsewhere, but redirect to new one
export async function trimVideoReal(file: File, options: { startTime: number, endTime: number }): Promise<ProcessingResult> {
    return processVideo(file, options);
}
