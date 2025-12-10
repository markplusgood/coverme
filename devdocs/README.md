# Developer Documentation

Welcome to the **cover.me** developer documentation. This directory contains everything you need to understand, develop, and maintain the AI Cover Letter Writer platform.

> **Localization Requirement:** All user-facing text, forms, error messages, onboarding flows, and exports must be fully localized and QA'd in both English and Russian. Every new feature, UI, or content change must be internationalized and verified in both supported languages.

---

## 📚 Documentation Structure

### 1. Core Documentation
- **[PRD (Product Requirements Document)](./prd.md)**: The canonical source for all business requirements, i18n, supported locales, and functional constraints for the product. All features must be validated against this PRD.
- **[AGENTS.md](../AGENTS.md)**: The primary reference for coding agent standards, SvelteKit/TypeScript patterns, and code review.

### 2. Planning & Roadmap (`/planning`)
- **[Development Roadmap](./planning/development-roadmap.md)**: Only use this for the current canonical delivery scope and milestones.
- **[User Flows](./planning/user-flows.md)**: Most up-to-date, cross-lingual user journeys (see also PRD/README for summary).
- **[A/B Tests](./planning/ab-tests.md)**: Always cross-link test structure to analytics references in PRD.

### 3. Technical Documentation (`/technical`)
- **[Database Schema](./technical/database.md)**: Only use this schema when modeling new features or planning migrations.
- **[API Reference](./technical/api-reference.md)**: Reference this when building/modifying endpoints, schemas, validation flows; all validation patterns and i18n requirements canonical here.
- **[Security & Privacy](./technical/security-privacy.md)**: The source of truth for privacy, ATS, PII, consent, and regulatory patterns—link to this in any related ticket/docs.
- **[SEO & Analytics](./technical/seo-analytics.md)**: Use as canonical doc for all analytics tracking, funnel metrics, and reporting.
- **[Testing Strategy](./technical/testing-strategy.md)**: Always reference for CI, QA, and localization completeness checks.
- **[Accessibility Checklist](./technical/accessibility-checklist.md)**: All accessibility claims or implementations must be cross-checked here.
- **[Component Library](./technical/component-library.md)**: Reference only for approved UI/components (not historic examples).
- **[AI Prompts](./prompt.md)**: Contains the core system prompts and instructions for the AI cover letter generator.

### 4. Content & Brand (`/content`, `/brand`)
- **[Content Structure](./content/content-structure.md)**: Comprehensive reference for intake/export/workflow fields, i18n text handling, and structure.
- **[Editing Guide](./content/editing-guide-ru.md)**: The canonical editorial/linguistic guidance for all RU copy and onboarding.
- **[Brand Guidelines](./brand/brand-guidelines.md)**: Canonical for all copy tone, primary/secondary color/typography, and visual language; cross-link to this for all product or campaign decisions.
- **[Assets Generation](./brand/assets-gen-prompts.md)**: Use for all asset prompt work, marketing image guidelines, and QA.

---

## 🚀 Getting Started
- For requirements, always read [PRD](./prd.md)
- For technical flows, [API Reference](./technical/api-reference.md) and [Database Schema](./technical/database.md)
- For privacy, ATS, legal, and user trust, see [Security & Privacy](./technical/security-privacy.md)
- For copy, naming, and user tone, reference [Brand Guidelines](./brand/brand-guidelines.md) and [Editing Guide](./content/editing-guide-ru.md)
- For any i18n policy, always check this README, PRD, and [Testing Strategy](./technical/testing-strategy.md)

## 🤝 Contributing
- PRs on new features must explicitly cite the reference doc or canonical flow they implement or change.
- CI checks localization, privacy, and security against references above.

---

## ⚠️ Open TODOs Requiring Product/Technical Decisions

Before implementing major features, check for unresolved TODOs in:
- **[PRD](./prd.md)**: AI model selection, export filename localization, resume parsing, rate limits, email templates, i18n library choice, ATS testing methodology, cache configuration, analytics event naming
- **[API Reference](./technical/api-reference.md)**: Rate limiting implementation, error message translation keys, streaming response format, file upload validation
- **[Content Structure](./content/content-structure.md)**: Resume parsing implementation, job description parsing, export format specifications, AI output format
- **[Database Schema](./technical/database.md)**: i18n data storage strategy, cover letter versioning, cache key structure, indexes and performance

**All TODO-PRODUCT items require product owner approval before implementation. All TODO-TECH/TODO-DB/TODO-CONTENT items require technical lead review.**
