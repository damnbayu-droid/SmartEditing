/**
 * Supabase client configuration
 * Note: Replace with actual Supabase credentials when deploying
 */

// Mock Supabase client for development
// In production, replace with actual @supabase/supabase-js client

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface SupabaseClient {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File | Blob) => Promise<{ data: { path: string } | null; error: Error | null }>;
      download: (path: string) => Promise<{ data: Blob | null; error: Error | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
      remove: (paths: string[]) => Promise<{ data: null; error: Error | null }>;
    };
  };
  from: (table: string) => {
    insert: (data: Record<string, unknown>) => { select: () => Promise<{ data: unknown[] | null; error: Error | null }> };
    update: (data: Record<string, unknown>) => { eq: (column: string, value: string | number) => Promise<{ data: unknown[] | null; error: Error | null }> };
    select: (columns?: string) => { eq: (column: string, value: string | number) => Promise<{ data: unknown[] | null; error: Error | null }> };
  };
}

// Create a mock client for development
const createMockClient = (): SupabaseClient => ({
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File | Blob) => {
        console.log(`[Mock] Uploading to ${bucket}/${path}`, file);
        return { data: { path }, error: null };
      },
      download: async (path: string) => {
        console.log(`[Mock] Downloading from ${bucket}/${path}`);
        return { data: new Blob(), error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `${supabaseUrl || 'https://mock.supabase.co'}/storage/v1/object/public/${bucket}/${path}` }
      }),
      remove: async (paths: string[]) => {
        console.log(`[Mock] Removing from ${bucket}`, paths);
        return { data: null, error: null };
      }
    })
  },
  from: (table: string) => ({
    insert: (data: Record<string, unknown>) => ({
      select: async () => {
        console.log(`[Mock] Inserting into ${table}`, data);
        return { data: [{ id: 'mock-id', ...data }], error: null };
      }
    }),
    update: (data: Record<string, unknown>) => ({
      eq: async (column: string, value: string | number) => {
        console.log(`[Mock] Updating ${table} where ${column}=${value}`, data);
        return { data: [{ id: value, ...data }], error: null };
      }
    }),
    select: (columns = '*') => ({
      eq: async (column: string, value: string | number) => {
        console.log(`[Mock] Selecting ${columns} from ${table} where ${column}=${value}`);
        return { data: [{ id: value }], error: null };
      }
    })
  })
});

// Export the appropriate client based on environment
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createMockClient() // In production, this would be the real Supabase client
  : createMockClient();

export default supabase;
