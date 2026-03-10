import { supabase } from './client';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  tool: string;
  status: JobStatus;
  input_url: string;
  output_url: string | null;
  created_at: string;
  updated_at?: string;
  error?: string;
}

/**
 * Create a new processing job
 */
export const createJob = async (
  tool: string,
  inputUrl: string
): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      tool,
      status: 'pending',
      input_url: inputUrl,
      output_url: null,
      created_at: new Date().toISOString(),
    })
    .select();
  
  if (error || !data) {
    throw new Error(`Failed to create job: ${error?.message || 'Unknown error'}`);
  }
  
  return data[0] as Job;
};

/**
 * Update job status
 */
export const updateJobStatus = async (
  jobId: string,
  status: JobStatus,
  outputUrl?: string,
  error?: string
): Promise<Job> => {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  
  if (outputUrl) {
    updateData.output_url = outputUrl;
  }
  
  if (error) {
    updateData.error = error;
  }
  
  const { data, error: updateError } = await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', jobId);
  
  if (updateError || !data) {
    throw new Error(`Failed to update job: ${updateError?.message || 'Unknown error'}`);
  }
  
  return data[0] as Job;
};

/**
 * Get job by ID
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId);
  
  if (error) {
    throw new Error(`Failed to get job: ${error.message}`);
  }
  
  return data && data.length > 0 ? (data[0] as Job) : null;
};

/**
 * Get jobs by tool
 */
export const getJobsByTool = async (tool: string): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('tool', tool);
  
  if (error) {
    throw new Error(`Failed to get jobs: ${error.message}`);
  }
  
  return (data as Job[]) || [];
};
