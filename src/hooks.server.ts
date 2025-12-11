import { type Handle } from '@sveltejs/kit';

// Minimal handle - no complex logic that could cause startup issues
export const handle: Handle = async ({ event, resolve }) => {
    return resolve(event);
};