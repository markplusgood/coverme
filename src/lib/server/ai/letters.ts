// Use SvelteKit's built-in environment variable handling for Cloudflare compatibility
// In Cloudflare Pages, environment variables are automatically available via process.env
// For local development, we rely on the existing dotenv setup in hooks.server.ts

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface CoverLetterInput {
    resumeText: string;
    jobDescription: string;
    jobTitle: string;
    company: string;
    tone: string;
    language: string;
}

export async function generateCoverLetterWithAI(input: CoverLetterInput): Promise<string> {
    // Validate input
    if (!input.resumeText || input.resumeText.trim().length === 0) {
        throw new Error('Resume text is required');
    }

    if (!input.jobDescription || input.jobDescription.trim().length === 0) {
        throw new Error('Job description is required');
    }

    try {
        // Check if we have an API key
        if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
            console.warn('OpenRouter API key not configured, using mock implementation');
            return generateMockCoverLetter(input);
        }

        // Build the system prompt based on the requirements from devdocs/prompt.md
        const systemPrompt = buildSystemPrompt(input);

        // Call OpenRouter API
        const response = await callOpenRouterAPI(systemPrompt);

        // Extract and clean the generated letter
        const cleanedLetter = cleanGeneratedLetter(response.choices[0].message.content);

        if (!cleanedLetter || cleanedLetter.length === 0) {
            throw new Error('Empty response from AI service');
        }

        return cleanedLetter;

    } catch (error) {
        console.error('AI generation error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                throw new Error('AI service authentication failed - check API key');
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error('AI service rate limit exceeded');
            } else if (error.message.includes('Empty response')) {
                throw new Error('AI service returned empty response');
            }
        }

        // Fallback to mock if API fails
        console.warn('Falling back to mock implementation due to AI service error');
        return generateMockCoverLetter(input);
    }
}

function buildSystemPrompt(input: CoverLetterInput): string {
    const { resumeText, jobDescription, jobTitle, company, tone, language } = input;

    // Build the prompt based on devdocs/prompt.md requirements
    return `You are an expert Career Coach and Professional Copywriter with 10+ years of experience in HR and recruitment.

Generate a tailored cover letter based on the following inputs:

Resume: ${resumeText}

Job Description: ${jobDescription}

Job Title: ${jobTitle}
Company: ${company}
Tone: ${tone}
Language: ${language}

Guidelines:
1. Analyze the job description and find matching experience in the resume
2. Structure the letter with:
   - Header with standard business letter format
   - Hook mentioning the specific role and company
   - Body paragraph connecting skills to job requirements
   - Body paragraph about why the company appeals
   - Call to action requesting an interview
3. Tone control:
   - Concise: Short sentences, bullet points, under 200 words
   - Professional: Standard business language, polite, structured
   - Enthusiastic: Energetic, use words like "excited", "passionate", "thrilled"
4. Constraints:
   - Do NOT invent experiences not in the resume
   - Do NOT use generic clichés
   - If resume missing critical skills, focus on transferable skills
   - For Russian language, use formal "Vy" and local business norms

Return ONLY the cover letter in Markdown format, no conversational filler.`;
}

async function callOpenRouterAPI(prompt: string): Promise<any> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://cover.me',
            'X-Title': 'cover.me - AI Cover Letter Generator'
        },
        body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct', // Good balance of quality and cost
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional cover letter writer. Follow the user instructions precisely.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        })
    });

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

function cleanGeneratedLetter(letter: string): string {
    // Basic cleaning of the generated letter
    return letter.trim();
}

function generateMockCoverLetter(input: CoverLetterInput): string {
    // Mock implementation for development when API key is not available
    const { jobTitle, company, tone, language } = input;

    let toneStyle = 'professional';
    if (tone === 'concise') toneStyle = 'concise and to the point';
    if (tone === 'enthusiastic') toneStyle = 'enthusiastic and passionate';

    let greeting = 'Dear Hiring Manager,';
    let closing = 'Sincerely,';
    let signature = '[Your Name]';

    if (language === 'russian') {
        greeting = 'Уважаемый руководитель отдела кадров,';
        closing = 'С уважением,';
        signature = '[Ваше имя]';
    }

    return `${greeting}

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background and experience, I am confident in my ability to contribute effectively to your team.

This is a ${toneStyle} cover letter generated based on your resume and the job description. In a real implementation, this would be replaced with AI-generated content from OpenRouter.

${closing}
${signature}`;
}