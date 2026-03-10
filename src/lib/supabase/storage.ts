import { supabase } from './client';

const BUCKETS = {
  UPLOADS: 'uploads',
  PROCESSED: 'processed',
} as const;

const STORAGE_PATHS = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Upload a file to Supabase storage
 */
export const uploadFile = async (
  file: File | Blob,
  filename: string,
  bucket: 'uploads' | 'processed' = 'uploads'
): Promise<UploadResult> => {
  const path = bucket === 'uploads' 
    ? `${STORAGE_PATHS.INPUT}/${filename}`
    : `${STORAGE_PATHS.OUTPUT}/${filename}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  
  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data!.path);
  
  return {
    path: data!.path,
    publicUrl: urlData.publicUrl,
  };
};

/**
 * Download a file from Supabase storage
 */
export const downloadFile = async (
  path: string,
  bucket: 'uploads' | 'processed' = 'uploads'
): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);
  
  if (error || !data) {
    throw new Error(`Failed to download file: ${error?.message || 'Unknown error'}`);
  }
  
  return data;
};

/**
 * Get the public URL for a file
 */
export const getPublicUrl = (
  path: string,
  bucket: 'uploads' | 'processed' = 'uploads'
): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Delete a file from Supabase storage
 */
export const deleteFile = async (
  path: string,
  bucket: 'uploads' | 'processed' = 'uploads'
): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Upload an input file (user upload)
 */
export const uploadInputFile = async (file: File): Promise<UploadResult> => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${randomStr}-${file.name}`;
  
  return uploadFile(file, filename, 'uploads');
};

/**
 * Upload a processed output file
 */
export const uploadOutputFile = async (
  file: Blob,
  originalFilename: string,
  suffix: string
): Promise<UploadResult> => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const nameParts = originalFilename.split('.');
  const ext = nameParts.pop() || 'bin';
  const name = nameParts.join('.');
  const filename = `${name}-${suffix}-${timestamp}-${randomStr}.${ext}`;
  
  return uploadFile(file, filename, 'processed');
};

export { BUCKETS, STORAGE_PATHS };
