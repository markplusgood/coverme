import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/server/supabase';

export const load: PageServerLoad = async ({ url }) => {
    const token_hash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    const redirect_to = url.searchParams.get('redirect_to');

    if (!token_hash || !type) {
        return {
            error: 'Invalid confirmation link',
            success: false
        };
    }

    try {
        if (!supabase) {
            return {
                error: 'Authentication service not available',
                success: false
            };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any, // email, signup, recovery, etc.
        });

        if (error) {
            return {
                error: error.message,
                success: false
            };
        }

        if (data?.user) {
            // Successful confirmation - redirect to app or specified location
            const destination = redirect_to || '/app';
            throw redirect(303, destination);
        }

        return {
            error: 'Confirmation failed',
            success: false
        };
    } catch (error) {
        console.error('Confirmation error:', error);
        return {
            error: 'An unexpected error occurred',
            success: false
        };
    }
};