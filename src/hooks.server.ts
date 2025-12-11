import { supabase, isSupabaseAvailable } from '$lib/server/supabase';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Basic security for Stage 2 MVP
const APP_PASSWORD = process.env.APP_PASSWORD || 'secure_password_for_mvp_access';
const APP_ENV = process.env.APP_ENV || 'development';

const securityHandle: Handle = async ({ event, resolve }) => {
    // For Stage 2 MVP, implement basic password protection
    if (APP_ENV === 'production' && !event.url.pathname.startsWith('/auth')) {
        const authHeader = event.request.headers.get('Authorization');

        // Allow basic auth or query parameter for simplicity in MVP
        const isAuthorized =
            authHeader === `Basic ${btoa('user:' + APP_PASSWORD)}` ||
            event.url.searchParams.get('password') === APP_PASSWORD;

        if (!isAuthorized) {
            return new Response('Unauthorized - MVP Access Required', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="cover.me MVP"',
                    'Content-Type': 'text/plain'
                }
            });
        }
    }

    return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
    // For Stage 2 MVP, we still disable Supabase auth requirements
    // since we're using basic password protection instead
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
            // For Stage 2 MVP, return a mock session when Supabase is not available
            return {
                user: {
                    id: 'mock-user-id',
                    email: 'user@example.com',
                    app_metadata: {},
                    user_metadata: {}
                },
                access_token: 'mock-access-token',
                token_type: 'bearer',
                expires_in: 3600,
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                refresh_token: 'mock-refresh-token'
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

export const handle = sequence(supabaseHandle, authHandle, securityHandle);