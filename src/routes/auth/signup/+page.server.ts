import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/server/supabase';

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm-password') as string;

        // Basic validation
        if (!email || !password || !confirmPassword) {
            return fail(400, {
                error: 'All fields are required',
                email,
            });
        }

        if (password !== confirmPassword) {
            return fail(400, {
                error: 'Passwords do not match',
                email,
            });
        }

        if (password.length < 8) {
            return fail(400, {
                error: 'Password must be at least 8 characters',
                email,
            });
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return fail(400, {
                    error: error.message,
                    email,
                });
            }

            // Redirect to login after successful signup
            throw redirect(303, '/auth/login');
        } catch (error) {
            return fail(500, {
                error: 'An unexpected error occurred',
                email,
            });
        }
    },
};