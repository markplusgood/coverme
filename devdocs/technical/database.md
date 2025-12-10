# Database Schema Documentation (cover.me)

## Overview
This document is the single canonical source for Supabase, D1, and application schema. For all PII, regulatory/legal, consent, privacy, or editorial/i18n requirements, see [technical/security-privacy.md], [brand/brand-guidelines.md], and [content/editing-guide-ru.md]. All platform privacy and export requirements are always subject to those references and the [PRD].

---

## Table Localization/i18n Support
- All i18n/legal QA/validation flows always reference [technical/security-privacy.md] and [README.md] for expected fields/values/locale lists. Do not redeclare PII policy or copy/tone rules here—only structure the fields to be i18n/consent-ready.

---

## i18n Data Modeling Example
See: [PRD], [content/editing-guide-ru.md] for actual field requirements, phrasing, and copy QA. Any language storage improvement should be proposed here and cross-validated in canonical UX/copy docs.

---

## Export & Compliance
For ATS, privacy, and user consent handling, always double-check current version in [technical/security-privacy.md] before reviewing migrations or new tables.

---

## TODO: Database Schema Decisions

### i18n Data Storage Strategy
- **TODO-DB**: Finalize i18n storage approach: separate columns per locale (`title_en`, `title_ru`) vs JSONB with locale keys vs separate translation table. Document trade-offs and query patterns.
- **TODO-DB**: Define how to handle job descriptions in multiple languages: store original + translations, or only user's selected language?
- **TODO-DB**: Define user locale preference storage: `profiles.preferred_locale` enum vs freeform string? Default locale fallback strategy.

### Cover Letter Versioning
- **TODO-DB**: Define versioning strategy for cover letters: store full copies of each version, or diff-based storage? Define version numbering scheme.
- **TODO-DB**: Define how to handle letter edits: create new version on every edit, or only on explicit "save as new version"?

### Cache Key Structure
- **TODO-DB**: Define D1 cache key normalization: how to hash job description text (remove whitespace? lowercase? remove punctuation?). Include resume hash, tone, language in key.
- **TODO-DB**: Define cache invalidation triggers: when resume updated? when profile skills changed? when job description edited?

### Indexes and Performance
- **TODO-DB**: Define indexes needed for common queries: user's letter history, letters by job, letters by resume. Document query patterns and expected load.
- **TODO-DB**: Define archiving strategy for old letters: archive after N days? soft-delete vs hard-delete? retention policy.

---

## TODO-REWRITE
Schema changes never override business/legal/i18n rules—always cross-reference [PRD] and privacy/copy guideline docs for final policy.
