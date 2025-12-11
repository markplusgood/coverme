import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/server/supabase';

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        // Basic validation
        if (!email) {
            return fail(400, {
                error: 'Email is required',
                email,
            });
        }

        try {
            if (!supabase) {
                // Demo mode - simulate successful password reset request
                console.log('🔓 Demo mode: Simulating password reset for', email);
                return {
                    success: true,
                    message: 'Demo mode: Password reset email sent. (Authentication service not configured)',
                };
            }

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${request.url.replace('/forgot-password', '/reset-password')}`,
            });

            if (error) {
                return fail(400, {
                    error: error.message,
                    email,
                });
            }

            // Return success message (don't reveal if email exists or not for security)
            return {
                success: true,
                message: 'Password reset email sent. Please check your inbox.',
            };
        } catch (error) {
            console.error('Forgot password error:', error);
            return fail(500, {
                error: 'An unexpected error occurred',
                email,
            });
        }
    },
};