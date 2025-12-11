# API Reference Documentation (cover.me)

## Overview
All API endpoints for cover.me are fully localized: requests may specify or derive a locale (en/ru), and all string responses (errors, validation, hints, status, onboarding, exports, etc.) are provided in the requested/user locale.

---

## Localization Requirements
- Every endpoint response includes user-readable strings in the requested locale
- All validation errors must be mapped to translation keys with full EN and RU variants
- UI-initiated requests send a `locale` header or field in body; fallback to user profile, then Accept-Language
- Email, onboarding, consent, and legal notices generated via API are always localized
- API documentation, contract, and examples must include i18n keys/fields in all schemas

---

## API Internationalization Patterns
Example request body/params:
```json
{
  "jobId": "...",
  "resumeId": "...",
  "tone": "concise",
  "locale": "ru"
}
```
Example success response:
```json
{
  "success": true,
  "message": {
    "en": "Letter generated successfully",
    "ru": "Письмо сгенерировано"
  },
  "data": {...}
}
```
Example error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": {
      "en": "Company is required",
      "ru": "Название компании обязательно"
    },
    "field": "company"
  }
}
```
---

## Zod Schema Example
```typescript
const LetterGenSchema = z.object({
  jobId: z.string().uuid(),
  resumeId: z.string().uuid(),
  tone: z.enum(['concise', 'enthusiastic', 'formal']),
  locale: z.enum(['en', 'ru'])
});
```

---

## Implementation Notes
- Prefer translation keys in API contract; always resolve to full-string on frontend AND server.
- API integration tests must cover both locales for each endpoint.
- All analytics/events include current user locale context.

---

## Authentication
All endpoints (except a public health check or marketing routes) require Supabase Auth JWT.

---

## API Endpoints

### 1. Resume Upload
- **POST /api/resumes**: Upload and validate (PDF/DOCX), save to R2, store metadata in Supabase. Validate file type, size, deduplicate by hash, store user_id link.

### 2. Job Description Intake/Parse
- **POST /api/jobs**: Accept pasted job description or (optionally) a URL. Parse, extract title, company, responsibilities, role, stack. Validate min length/structure.

### 3. Cover Letter Generation
- **POST /api/letters**: Accepts { job_id, resume_id, tone, language, user_id }. Generates letter using OpenRouter AI API with Google's Gemini 2.0 Flash model, streams preview, allows inline editing, saves version. Uses D1 cache before invoking model.
- **GET /api/letters/:id**: Retrieve letter details for preview/export/history.
- **PUT /api/letters/:id**: Update/accept/reject edits, mark as reviewed/A/B variant.

### 4. Export Letter
- **POST /api/letters/:id/export**: Generate PDF/DOCX, return signed URL. Allow copy-to-clipboard. Filenames: `{company}-{role}-cover-letter.pdf`.

### 5. Letter History/Versioning
- **GET /api/letters/history**: Return previous letters per user/job.

### 6. User Profile
- **GET /api/user/profile**: Get user info/profile/settings.
- **POST /api/user/profile**: Update profile, manage resume uploads, export user data.

### 7. Analytics/Event Tracking
- **POST /api/analytics/event**: Log feature usage (generation, export, conversion, error events, etc.). PII stripped, logs only hashed ids/events.

### 8. A/B Experiments
- **GET /api/experiments/assignment**: Return A/B group (for self-serve assignment, or persist via Supabase).
- **POST /api/experiments/events**: Log experiment result/click/conversion.

### 9. Consent
- **POST /api/consent**: Log user privacy or marketing consent with version/ip/ua.

---

## Zod Schemas (Types)
Examples:
```typescript
export const ResumeUploadSchema = z.object({
  file: z.instanceof(File),
});

export const JobSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(1),
  description: z.string().min(30),
  url: z.string().url().optional(),
});

export const LetterGenSchema = z.object({
  jobId: z.string().uuid(),
  resumeId: z.string().uuid(),
  tone: z.enum(['concise', 'enthusiastic', 'formal']),
  language: z.string().min(2).max(10).optional(),
});

export const ProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
});
```

---

## Error Handling
All errors follow a standard JSON format (see AGENTS.md):
```json
{
  "error": {
    "message": "Descriptive error message",
    "code": "ERROR_CODE"
  }
}
```

- Validation errors list fields/missing info where possible.
- All endpoints rate-limited by user/auth token.

---

## TODO: Implementation Details Requiring Clarification

### Rate Limiting Implementation
- **TODO-TECH**: Define exact rate limit thresholds per endpoint (see PRD TODO-PRODUCT for business requirements). Implement rate limiting middleware using Cloudflare WAF rules or custom SvelteKit middleware.
- **TODO-TECH**: Define rate limit response format and headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After).

### Error Message Translation Keys
- **TODO-TECH**: Define translation key structure for all API error messages. Example: `errors.validation.company_required` → `{en: "Company is required", ru: "Название компании обязательно"}`.
- **TODO-TECH**: Implement error message resolution middleware that automatically localizes error responses based on request locale.

### Streaming Response Format
- **TODO-TECH**: Define exact streaming format for `/api/letters` POST endpoint: Server-Sent Events (SSE), WebSocket, or chunked HTTP? Document client-side consumption pattern.
- **TODO-TECH**: Define how to handle streaming errors mid-generation: partial content delivery, retry strategy, user notification.

### File Upload Validation
- **TODO-TECH**: Define exact file validation logic: MIME type checking, file signature verification, virus scanning (if applicable). Document validation error messages for both locales.
- **TODO-TECH**: Define resume file size limits and compression strategy if files exceed limit.

---

## ✅ COMPLETED
All endpoints, schemas, and references have been successfully refactored from "lesson/progress/assignment/course" to job/resume/letter terms. The documentation now fully reflects the career/cover letter context.