import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateCoverLetterWithAI } from '$lib/server/ai/letters';
import { checkRateLimit, getClientIp } from '$lib/server/security';
import { logRequest, logError, trackGenerationSuccess, trackGenerationFailure } from '$lib/server/monitoring';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Log incoming request
        logRequest(request, 200);

        // Rate limiting for API endpoint
        const clientIp = getClientIp(request);
        const isRateLimited = checkRateLimit(clientIp, 5, 60000); // 5 requests per minute

        if (!isRateLimited) {
            logError(new Error('Rate limit exceeded'), 'API_RATE_LIMIT');
            throw error(429, 'Too many requests, please try again in a minute');
        }

        // Parse request body
        let requestData;
        try {
            requestData = await request.json();
        } catch (parseError) {
            logError(parseError, 'API_PARSE_ERROR');
            throw error(400, 'Invalid JSON payload');
        }

        const { resumeText, jobDescription, jobTitle, company, tone, language } = requestData;

        // Validate required fields
        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
            logError(new Error('Invalid resume text'), 'API_VALIDATION');
            throw error(400, 'Valid resume text is required');
        }

        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
            logError(new Error('Invalid job description'), 'API_VALIDATION');
            throw error(400, 'Valid job description is required');
        }

        // Validate text length
        if (resumeText.length > 10000) {
            logError(new Error('Resume text too long'), 'API_VALIDATION');
            throw error(400, 'Resume text is too long (max 10,000 characters)');
        }

        if (jobDescription.length > 10000) {
            logError(new Error('Job description too long'), 'API_VALIDATION');
            throw error(400, 'Job description is too long (max 10,000 characters)');
        }

        // Generate the cover letter
        const letter = await generateCoverLetterWithAI({
            resumeText: resumeText.trim(),
            jobDescription: jobDescription.trim(),
            jobTitle: jobTitle?.trim() || 'Position',
            company: company?.trim() || 'Company',
            tone: tone || 'concise',
            language: language || 'english'
        });

        if (!letter || letter.trim().length === 0) {
            logError(new Error('Empty letter generated'), 'AI_GENERATION');
            throw error(500, 'Generated letter is empty');
        }

        // Track successful generation
        trackGenerationSuccess();

        return json({
            success: true,
            letter
        });

    } catch (err) {
        // Track failed generation
        trackGenerationFailure();
        logError(err, 'API_ERROR');

        // Handle different types of errors
        if (err instanceof Error && err.message.includes('API key')) {
            throw error(402, 'AI service requires API key configuration');
        } else if (err instanceof Error && err.message.includes('rate limit')) {
            throw error(429, 'Rate limit exceeded, please try again later');
        } else {
            throw error(500, 'Failed to generate cover letter');
        }
    }
};