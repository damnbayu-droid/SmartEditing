import { NextRequest, NextResponse } from 'next/server';
import { createJob, updateJobStatus } from '@/lib/supabase/database';
import { uploadInputFile, uploadOutputFile } from '@/lib/supabase/storage';
import { delay } from '@/lib/utils/delay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/video/process
 * Process a video with the specified operation
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const operation = formData.get('operation') as string;
    const optionsStr = formData.get('options') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!operation || !['trim'].includes(operation)) {
      return NextResponse.json(
        { error: 'Invalid operation. Use "trim"' },
        { status: 400 }
      );
    }

    const options = optionsStr ? JSON.parse(optionsStr) : {};
    const { startTime = 0, endTime } = options;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: MP4, WebM, MOV, AVI' },
        { status: 400 }
      );
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 500MB' },
        { status: 400 }
      );
    }

    // Validate trim options
    if (operation === 'trim') {
      if (typeof startTime !== 'number' || typeof endTime !== 'number') {
        return NextResponse.json(
          { error: 'Trim operation requires startTime and endTime' },
          { status: 400 }
        );
      }
      if (startTime < 0 || endTime <= startTime) {
        return NextResponse.json(
          { error: 'Invalid time range. startTime must be >= 0 and endTime must be > startTime' },
          { status: 400 }
        );
      }
    }

    // Upload input file to storage
    const inputUpload = await uploadInputFile(file);

    // Create job record
    const job = await createJob(operation, inputUpload.publicUrl);

    // Update job status to processing
    await updateJobStatus(job.id, 'processing');

    // Calculate processing delay based on video duration
    const clipDuration = endTime - startTime;
    const processingDelay = 5000 + (clipDuration * 500) + Math.random() * 3000;
    await delay(processingDelay);

    // Mock processing: In production, this would use FFmpeg or similar
    // For now, we return the same file as output
    const outputBuffer = await file.arrayBuffer();
    const outputBlob = new Blob([outputBuffer], { type: file.type });
    
    // Generate output filename
    const nameParts = file.name.split('.');
    const ext = nameParts.pop() || 'mp4';
    const name = nameParts.join('.');
    
    // Upload output file
    const outputUpload = await uploadOutputFile(outputBlob, `${name}.${ext}`, 'trimmed');

    // Update job status to completed
    await updateJobStatus(job.id, 'completed', outputUpload.publicUrl);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      inputUrl: inputUpload.publicUrl,
      outputUrl: outputUpload.publicUrl,
      outputFilename: `${name}-trimmed.${ext}`,
      processingTime: processingDelay,
      trimRange: {
        startTime,
        endTime,
        duration: clipDuration,
      },
    });

  } catch (error) {
    console.error('Video processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Processing failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/video/process?jobId=xxx
 * Get the status of a processing job
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    );
  }

  // In production, fetch job from database
  // For now, return mock response
  return NextResponse.json({
    jobId,
    status: 'completed',
    outputUrl: '/mock-output.mp4',
  });
}
