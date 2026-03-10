let ffmpeg: any = null;

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

export async function trimVideoReal(
  file: File,
  options: { startTime: number; endTime: number }
): Promise<ProcessingResult> {
  const startProcessingTime = Date.now();
  
  try {
    const ffmpeg = await loadFFmpeg();
    const { startTime, endTime } = options;
    const duration = endTime - startTime;
    
    // Dynamic import for utility
    const { fetchFile } = await import('@ffmpeg/util');
    
    // Write input file to FFmpeg FS
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    
    // Run FFmpeg command
    await ffmpeg.exec([
      '-ss', startTime.toString(),
      '-i', 'input.mp4',
      '-t', duration.toString(),
      '-c', 'copy',
      'output.mp4'
    ]);
    
    // Read output
    const data = await ffmpeg.readFile('output.mp4');
    const outputBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' });
    const outputUrl = URL.createObjectURL(outputBlob);
    
    return {
      success: true,
      outputUrl,
      outputFilename: `smartediting-trimmed-${file.name}`,
      processingTime: Date.now() - startProcessingTime,
    };
  } catch (error) {
    console.error('Video trimming error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to trim video',
      processingTime: Date.now() - startProcessingTime,
    };
  }
}
