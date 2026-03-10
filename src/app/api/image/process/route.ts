import { NextRequest, NextResponse } from 'next/server';
import { createJob, updateJobStatus } from '@/lib/supabase/database';
import { uploadInputFile, uploadOutputFile } from '@/lib/supabase/storage';
import { delay } from '@/lib/utils/delay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProcessRequest {
  operation: 'remove-background' | 'upscale';
  inputUrl?: string;
  options?: {
    scale?: 2 | 4;
  };
}

/**
 * POST /api/image/process
 * Process an image with the specified operation
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

    if (!operation || !['remove-background', 'upscale'].includes(operation)) {
      return NextResponse.json(
        { error: 'Invalid operation. Use "remove-background" or "upscale"' },
        { status: 400 }
      );
    }

    const options = optionsStr ? JSON.parse(optionsStr) : {};

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }

    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 25MB' },
        { status: 400 }
      );
    }

    // Upload input file to storage
    const inputUpload = await uploadInputFile(file);

    // Create job record
    const job = await createJob(operation, inputUpload.publicUrl);

    // Update job status to processing
    await updateJobStatus(job.id, 'processing');

    // Simulate processing delay
    const processingDelay = operation === 'upscale' 
      ? 5000 + Math.random() * 3000 
      : 3000 + Math.random() * 2000;
    await delay(processingDelay);

    // Mock processing: In production, this would call actual AI services
    // For now, we return the same file as output
    const outputBuffer = await file.arrayBuffer();
    const outputBlob = new Blob([outputBuffer], { type: file.type });
    
    // Generate output filename
    const nameParts = file.name.split('.');
    const ext = nameParts.pop() || 'png';
    const name = nameParts.join('.');
    const suffix = operation === 'remove-background' ? 'nobg' : `upscaled-${options.scale || 2}x`;
    
    // Upload output file
    const outputUpload = await uploadOutputFile(outputBlob, `${name}.${ext}`, suffix);

    // Update job status to completed
    await updateJobStatus(job.id, 'completed', outputUpload.publicUrl);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      inputUrl: inputUpload.publicUrl,
      outputUrl: outputUpload.publicUrl,
      outputFilename: `${name}-${suffix}.${ext}`,
      processingTime: processingDelay,
    });

  } catch (error) {
    console.error('Image processing error:', error);
    
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
 * GET /api/image/process?jobId=xxx
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
    outputUrl: '/mock-output.png',
  });
}
