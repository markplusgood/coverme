/**
 * Basic Monitoring Utilities for Stage 2 MVP
 */

// Simple request logging
export function logRequest(request: Request, responseStatus: number) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: new URL(request.url).pathname,
        status: responseStatus,
        userAgent: request.headers.get('user-agent') || 'unknown',
        ip: getClientIp(request)
    };

    console.log(JSON.stringify(logEntry));
}

// Simple error tracking
export function logError(error: unknown, context: string) {
    const errorLog = {
        timestamp: new Date().toISOString(),
        context,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
    };

    console.error(JSON.stringify(errorLog));
}

// Get client IP (reused from security module for consistency)
function getClientIp(request: Request): string {
    const cfConnectingIp = request.headers.get('CF-Connecting-IP');
    const xForwardedFor = request.headers.get('X-Forwarded-For');
    const realIp = request.headers.get('X-Real-IP');

    return cfConnectingIp || xForwardedFor?.split(',')[0] || realIp || 'unknown';
}

// Simple usage metrics
let requestCount = 0;
let successfulGenerations = 0;
let failedGenerations = 0;

export function trackGenerationSuccess() {
    requestCount++;
    successfulGenerations++;
    logMetrics();
}

export function trackGenerationFailure() {
    requestCount++;
    failedGenerations++;
    logMetrics();
}

function logMetrics() {
    if (requestCount % 10 === 0) { // Log every 10 requests
        console.log(`📊 Metrics: ${successfulGenerations} successful, ${failedGenerations} failed, ${requestCount} total requests`);
    }
}

// Simple feedback collection
export function collectFeedback(feedback: {
    rating: number;
    comments?: string;
    userAgent?: string;
}) {
    const feedbackEntry = {
        timestamp: new Date().toISOString(),
        ...feedback,
        ip: 'anonymous' // Don't log IPs for feedback to respect privacy
    };

    console.log('💬 Feedback:', JSON.stringify(feedbackEntry));
}