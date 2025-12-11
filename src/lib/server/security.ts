/**
 * Basic Security Utilities for Stage 2 MVP
 */

// Basic password protection for MVP
export function checkBasicAuth(request: Request, password: string): boolean {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return false;

    try {
        const [scheme, encoded] = authHeader.split(' ');
        if (scheme !== 'Basic') return false;

        const decoded = atob(encoded);
        const [username, providedPassword] = decoded.split(':');
        return providedPassword === password;
    } catch (error) {
        return false;
    }
}

// Simple rate limiting for API endpoints
const requestCounts = new Map<string, { count: number, lastReset: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    let entry = requestCounts.get(ip);

    if (!entry || now - entry.lastReset > windowMs) {
        entry = { count: 1, lastReset: now };
        requestCounts.set(ip, entry);
        return true;
    }

    entry.count++;
    if (entry.count > limit) {
        return false;
    }

    return true;
}

// Get client IP from request (basic implementation)
export function getClientIp(request: Request): string {
    const cfConnectingIp = request.headers.get('CF-Connecting-IP');
    const xForwardedFor = request.headers.get('X-Forwarded-For');
    const realIp = request.headers.get('X-Real-IP');

    return cfConnectingIp || xForwardedFor?.split(',')[0] || realIp || 'unknown';
}