import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/server/supabase';

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm-password') as string;

        // Basic validation
        if (!password || !confirmPassword) {
            return fail(400, {
                error: 'All fields are required',
            });
        }

        if (password !== confirmPassword) {
            return fail(400, {
                error: 'Passwords do not match',
            });
        }

        if (password.length < 8) {
            return fail(400, {
                error: 'Password must be at least 8 characters',
            });
        }

        try {
            if (!supabase) {
                // Demo mode - simulate successful password reset
                console.log('🔓 Demo mode: Simulating password reset');
                return {
                    success: true,
                    message: 'Demo mode: Password updated successfully! (Authentication service not configured)',
                };
            }

            const { data, error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                return fail(400, {
                    error: error.message,
                });
            }

            if (data?.user) {
                // Password updated successfully - redirect to login
                throw redirect(303, '/auth/login?message=password-updated');
            }

            return fail(500, {
                error: 'Password update failed',
            });
        } catch (error) {
            console.error('Password reset error:', error);
            return fail(500, {
                error: 'An unexpected error occurred',
            });
        }
    },
};