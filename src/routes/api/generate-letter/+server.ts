import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateCoverLetterWithAI } from '$lib/server/ai/letters';

interface GenerateLetterRequest {
    resumeText: string;
    jobDescription: string;
    jobTitle?: string;
    company?: string;
    tone?: string;
    language?: string;
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Basic rate limiting for API endpoint (simple in-memory for now)
        // In a production environment, you'd use Redis or similar for distributed rate limiting
        const now = Date.now();
        const rateLimitWindow = 60000; // 1 minute
        const rateLimitMax = 10; // 10 requests per minute

        // Simple in-memory rate limiting (note: this won't work across multiple server instances)
        // For now, we'll just allow requests but log the attempt
        console.log(`API request received at ${new Date(now).toISOString()}`);

        // Parse request body
        let requestData: GenerateLetterRequest;
        try {
            requestData = await request.json();
        } catch (parseError) {
            throw error(400, 'Invalid JSON payload');
        }

        const { resumeText, jobDescription, jobTitle, company, tone, language } = requestData;

        // Validate required fields
        if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
            throw error(400, 'Valid resume text is required');
        }

        if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
            throw error(400, 'Valid job description is required');
        }

        // Validate text length
        if (resumeText.length > 10000) {
            throw error(400, 'Resume text is too long (max 10,000 characters)');
        }

        if (jobDescription.length > 10000) {
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
            throw error(500, 'Generated letter is empty');
        }

        return json({
            success: true,
            letter
        });

    } catch (err) {
        console.error('API error:', err);

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