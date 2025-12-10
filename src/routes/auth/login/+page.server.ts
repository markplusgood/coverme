import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/server/supabase';

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const remember = formData.get('remember-me') === 'on';

        // Basic validation
        if (!email || !password) {
            return fail(400, {
                error: 'Email and password are required',
                email,
            });
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return fail(400, {
                    error: error.message,
                    email,
                });
            }

            // Redirect to app dashboard after successful login
            throw redirect(303, '/app');
        } catch (error) {
            return fail(500, {
                error: 'An unexpected error occurred',
                email,
            });
        }
    },
};