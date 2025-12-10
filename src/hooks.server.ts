import { supabase } from '$lib/server/supabase';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandle: Handle = async ({ event, resolve }) => {
    // Protect app routes
    if (event.url.pathname.startsWith('/app')) {
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
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    };

    return resolve(event);
};

export const handle = sequence(supabaseHandle, authHandle);