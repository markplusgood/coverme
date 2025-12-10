# cover.me - AI Cover Letter Writer - Product Requirements Document

## Executive Summary
A SaaS product that lets job-seekers generate tailored, ATS-friendly cover letters from resume/CV and job description with AI. Features mobile-first, conversion-optimized B2C landing, secure job/resume intake, customizable tone/language, and export to PDF/DOCX. Built for high conversion, privacy, recruiter-readiness, and **full localization in English and Russian (RU)**. 

**Canonical Cross-References**:
- All technical and schema details: [technical/database.md]
- Legal, ATS, consent, compliance: [technical/security-privacy.md]
- All tone, visual/copy UX/brand: [brand/brand-guidelines.md]
- API schemas, error handling: [technical/api-reference.md]

**Target Audience / Product Value**: See above docs for success criteria and audience segmentation.

---

## 📋 Development Roadmap
See: [planning/development-roadmap.md] for current milestone details and sequencing. For all milestone, feature, and requirements justification, cross-check [PRD] with the canonical roadmap doc. 

---

## Technical Stack
For implementation standards, up-to-date supported libraries/versions, and environment practice: see [technical/database.md], [technical/api-reference.md], and [AGENTS.md].

---

## Architecture Overview
Canonical project structure and up-to-date code layout always in [technical/database.md] and [README.md].

---

## Key Product Flows
Detailed English/Russian user journeys, CTA and onboarding split, and multi-language field storage can be found in [planning/user-flows.md]. Always maintain a single source of truth for first-time, returning, and advanced user flows in that doc.

---

## Compliance, Privacy & ATS
Always reference [technical/security-privacy.md] for current regulatory/legal/ATS handling and consent policies. Do not re-document flows here: see canonical doc.

---

## Success Metrics
For current product and business success/analytics breakdown: see [technical/seo-analytics.md] and [planning/ab-tests.md].

---

## I18n, Localization and QA
Definitive rules for i18n support (fields, flows, QA), and copy/language QA: see [README.md], [content/editing-guide-ru.md], [brand/brand-guidelines.md].

---

## TODO: Domain Decisions Requiring Product Owner Input

### AI/ML Infrastructure
- **TODO-PRODUCT**: Select AI model/provider for cover letter generation (OpenAI GPT-4, Claude, custom fine-tuned model, etc.). Document API keys, rate limits, cost per generation, and fallback strategy.
- **Prompt Strategy**: The core prompt structure and strategy for cover letter generation is defined in [prompt.md](./prompt.md). This includes instructions for keyword matching, tone of voice, and output formatting.

### Export Filename Localization
- **TODO-PRODUCT**: Define exact export filename format for Russian language letters (transliteration rules, Cyrillic handling, fallback to Latin). Example: `{company}-{role}-cover-letter.pdf` vs `{компания}-{роль}-cover-letter.pdf` vs transliterated `{kompaniya}-{rol}-cover-letter.pdf`.
- **TODO-PRODUCT**: Confirm if exported filenames should always be ASCII-safe or allow Unicode where filesystem supports it.

### Resume Parsing
- **TODO-PRODUCT**: Select resume parsing library/tool (pdf-parse, mammoth, pdfjs-dist, or commercial API). Document parsing accuracy requirements, fallback for unparseable files, and user preview/confirmation flow.
- **TODO-PRODUCT**: Define exact text extraction requirements: should we extract structured data (sections, dates, skills) or only plain text? How to handle tables, images, complex layouts?

### Job URL Parsing
- **TODO-PRODUCT**: Define job URL parsing implementation: which job boards/sites to support (LinkedIn, Indeed, company career pages)? Use headless browser (Puppeteer/Playwright) or content extraction API? Handle authentication/paywalls?
- **TODO-PRODUCT**: Define fallback behavior when URL parsing fails: show error, allow manual paste, or attempt partial extraction?

### Rate Limiting Thresholds
- **TODO-PRODUCT**: Define exact rate limits per user: letter generations per hour/day, resume uploads per day, export requests per minute. Document rationale and enforcement strategy.
- **TODO-PRODUCT**: Define rate limit error messages and user communication strategy when limits are hit.

### Email Templates
- **TODO-PRODUCT**: Define all email templates (signup verification, password reset, letter export confirmation, account deletion confirmation) with exact copy for both EN and RU. Include subject lines, body text, and CTA button text.
- **TODO-PRODUCT**: Select email service provider (Supabase built-in, SendGrid, Postmark, etc.) and configure templates.

### Localization Library
- **TODO-PRODUCT**: Select i18n library for SvelteKit: `sveltekit-i18n`, `@sveltekit/adapter-i18n`, or custom solution. Document translation key structure, fallback strategy, and how to handle missing translations.
- **TODO-PRODUCT**: Define translation file structure and workflow: JSON files per locale, translation key naming conventions, how to handle pluralization, date/number formatting.

### ATS Testing Methodology
- **TODO-PRODUCT**: Define ATS testing approach: which ATS systems to test against (Applicant Tracking Systems like Greenhouse, Lever, Workday)? Use automated testing tools or manual QA?
- **TODO-PRODUCT**: Define ATS compliance checklist and validation criteria: what constitutes "ATS-friendly" output? How to verify no hidden text, proper formatting, keyword optimization?

### Cache Configuration
- **TODO-PRODUCT**: Define D1 cache TTL values: how long to cache AI-generated letters? Cache invalidation strategy when resume/profile changes?
- **TODO-PRODUCT**: Define cache key structure: normalize job description text (how? hash?), include resume hash, tone, language in key?

### Additional Tone Options
- **TODO-PRODUCT**: Confirm if only 3 tone options (`concise`, `enthusiastic`, `formal`) are sufficient for MVP, or if additional tones needed (e.g., `casual`, `technical`, `executive`). Document tone definitions and examples.

### Analytics Event Naming
- **TODO-PRODUCT**: Define exact analytics event naming convention (snake_case, camelCase, kebab-case) and event taxonomy. Document all events to track: `letter_generated`, `letter_exported`, `resume_uploaded`, etc.
- **TODO-PRODUCT**: Select analytics platform(s) and define event schema, custom properties, and user identification strategy.

**Note**: All TODO-PRODUCT items above require product owner or domain expert decision before implementation. Do not proceed with implementation until these are resolved and documented.

---

