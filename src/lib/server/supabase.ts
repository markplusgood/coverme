import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// For Stage 1 MVP, make Supabase client optional since we don't need authentication yet
// Environment variables are handled by Cloudflare Workers, no need for dotenv
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

try {
    // Environment variable access for Cloudflare Pages
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    // Debug logging for environment variables
    console.log('🔍 Environment Debug:', {
        PUBLIC_SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
        PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'undefined',
        SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey ? `${serviceRoleKey.substring(0, 30)}...` : 'undefined',
        NODE_ENV: process.env.NODE_ENV,
        VITE_PUBLIC_SUPABASE_URL: process.env.VITE_PUBLIC_SUPABASE_URL ? 'set' : 'undefined',
        VITE_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'undefined',
        VITE_SUPABASE_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'undefined'
    });

    if (supabaseUrl && supabaseAnonKey && serviceRoleKey) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
        console.log('✅ Supabase client initialized successfully');
    } else {
        console.log('❌ Supabase environment variables not configured - running in standalone mode for Stage 1 MVP');
    }
} catch (error: unknown) {
    console.warn('⚠️ Failed to initialize Supabase client:', (error as Error).message);
    // For Stage 1 MVP, this is acceptable since we don't need authentication yet
}

// Export clients (may be null if not configured)
export const supabase = supabaseClient;
export const supabaseAdmin = supabaseAdminClient;

// Helper to check if Supabase is available
export function isSupabaseAvailable(): boolean {
    return supabaseClient !== null;
}