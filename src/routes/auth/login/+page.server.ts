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
            if (!supabase) {
                // Demo mode - simulate successful login
                console.log('🔓 Demo mode: Simulating successful login for', email);
                throw redirect(303, '/app');
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Handle specific error cases
                if (error.message.includes('Email not confirmed')) {
                    return fail(400, {
                        error: 'Please check your email and click the confirmation link before logging in.',
                        email,
                        emailConfirmationRequired: true,
                    });
                }

                if (error.message.includes('Invalid login credentials')) {
                    return fail(400, {
                        error: 'Invalid email or password. Please check your credentials and try again.',
                        email,
                    });
                }

                return fail(400, {
                    error: error.message,
                    email,
                });
            }

            // Redirect to app dashboard after successful login
            throw redirect(303, '/app');
        } catch (error) {
            console.error('Login error:', error);
            return fail(500, {
                error: 'An unexpected error occurred',
                email,
            });
        }
    },
};