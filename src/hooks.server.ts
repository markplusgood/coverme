import { type Handle } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';

// Helper function to get session safely
async function getSession(event: Parameters<Handle>[0]['event']) {
    if (!supabase) return null;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

// Helper function to get user safely  
async function getUser(event: Parameters<Handle>[0]['event']) {
    if (!supabase) return null;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    // Add session and user to locals for easy access in routes
    event.locals.getSession = () => getSession(event);
    event.locals.getUser = () => getUser(event);
    event.locals.safeGetSession = async () => {
        const session = await getSession(event);
        return { session, user: session?.user ?? null };
    };

    return resolve(event);
};