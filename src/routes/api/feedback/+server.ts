import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { collectFeedback } from '$lib/server/monitoring';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const feedbackData = await request.json();

        // Validate feedback data
        if (!feedbackData || typeof feedbackData !== 'object') {
            return json({ success: false, error: 'Invalid feedback data' }, { status: 400 });
        }

        // Collect and log feedback
        collectFeedback({
            rating: Number(feedbackData.rating) || 0,
            comments: feedbackData.comments,
            userAgent: request.headers.get('user-agent')
        });

        return json({ success: true, message: 'Thank you for your feedback!' });

    } catch (error) {
        console.error('Feedback error:', error);
        return json({ success: false, error: 'Failed to process feedback' }, { status: 500 });
    }
};