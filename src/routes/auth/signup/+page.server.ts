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
            if (!supabase) {
                // Demo mode - simulate successful signup
                console.log('🔓 Demo mode: Simulating successful signup for', email);
                return {
                    success: true,
                    demoMode: true,
                    message: 'Demo mode: Signup successful! (Authentication service not configured)',
                    email,
                };
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${request.url.replace('/signup', '/confirm')}`,
                },
            });

            if (error) {
                return fail(400, {
                    error: error.message,
                    email,
                });
            }

            // Check if user needs email confirmation
            if (data.user && !data.session) {
                return {
                    success: true,
                    emailConfirmationRequired: true,
                    message: 'Please check your email and click the confirmation link to complete your registration.',
                    email,
                };
            }

            // If user is immediately logged in (email confirmation disabled)
            if (data.session) {
                throw redirect(303, '/app');
            }

            // Fallback - redirect to login
            throw redirect(303, '/auth/login');
        } catch (error) {
            console.error('Signup error:', error);
            return fail(500, {
                error: 'An unexpected error occurred',
                email,
            });
        }
    },
};