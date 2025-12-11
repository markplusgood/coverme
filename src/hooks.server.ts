import { supabase, isSupabaseAvailable } from '$lib/server/supabase';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle: Handle = async ({ event, resolve }) => {
    // For Stage 1 MVP, disable authentication requirements since we don't need it yet
    // This allows the build to succeed without Supabase configuration
    if (isSupabaseAvailable() && event.url.pathname.startsWith('/app')) {
        const session = await event.locals.getSession();
        if (!session) {
            throw redirect(303, '/auth/login');
        }
    }

    return resolve(event);
};

const supabaseHandle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = supabase;
    event.locals.getSession = async () => {
        if (!isSupabaseAvailable() || !supabase) {
            // For Stage 1 MVP, return a mock session when Supabase is not available
            return {
                user: null,
                access_token: null,
                token_type: null,
                expires_in: null,
                expires_at: null,
                refresh_token: null
            };
        }
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (error) {
            console.warn('Supabase auth error:', error);
            return null;
        }
    };

    return resolve(event);
};

export const handle = sequence(supabaseHandle, authHandle);