import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// For Stage 1 MVP, make Supabase client optional since we don't need authentication yet
// Environment variables are handled by Cloudflare Workers, no need for dotenv
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

try {
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        supabaseAdminClient = createClient(
            supabaseUrl,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
        );
        console.log('Supabase client initialized successfully');
    } else {
        console.log('Supabase environment variables not configured - running in standalone mode for Stage 1 MVP');
    }
} catch (error: unknown) {
    console.warn('Failed to initialize Supabase client:', (error as Error).message);
    // For Stage 1 MVP, this is acceptable since we don't need authentication yet
}

// Export clients (may be null if not configured)
export const supabase = supabaseClient;
export const supabaseAdmin = supabaseAdminClient;

// Helper to check if Supabase is available
export function isSupabaseAvailable(): boolean {
    return supabaseClient !== null;
}