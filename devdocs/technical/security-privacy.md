# Security & Privacy Documentation (cover.me)

## Overview

This document details ALL procedures for privacy and user data protection in cover.me. It is publication-ready: headings are clear, concise, and actionable. No residual education or non-product content is present.

---

## Core Security Practices
**Passwords:** Securely managed by Supabase Auth (hashed via bcrypt).  
**Database:** PII data (user email, resume, jobs, cover letters) is encrypted at rest (AES-256).  
**File Storage:** Resume and export files encrypted in R2.  
**In Transit:** HTTPS/TLS-1.3 everywhere.
**Session/Secrets:** HTTP-only cookies; never expose secrets in client code.
**RLS:** Always enforced by user_id or id.

---

## ATS Compliance & Export Privacy
- All letter exports are single column, minimal formatting, ATS-passable. No images, hidden text, or metadata.
- ALL analytics/logging uses only non-PII hash identifiers.
- Exports only accessible to the authenticated user, deleted with account.

---

## Consent, Legal & Compliance
- Privacy/Consent banners must be easily understandable, localized, and accessible (keyboard navigable, readable, and screen-reader tested). Error-free, B2C, C1-level copy only.
- All policy/legal text is present/QA'd in both EN/RU and reviewed for clarity (never machine-translated only).
- T&C/Privacy/Consent versioning and acceptance tracked **per language**.
- All legal/PII comms (deletion, export, notifications) meet accessibility standards AND are released in both supported languages.
- See [technical/security-privacy.md] for implementation requirements and always check [README.md] and [brand/brand-guidelines.md] for latest accessibility/copy/tone patterns.

---

## Data Rights, Deletion, Incident Response
- Data export/deletion flows are C1+, B2C, error-free copy; flows are accessible and localized.
- Breach notices and consent updates must meet accessibility and plain-language standards in both languages; delivery is tracked.

---

## Copy, Language & Accessibility
- All strings surfaced to users in legal, consent, or privacy context are written and checked at C1 (advanced professional) English or professional Russian.
- Never allow typos, ambiguous instructions, or buried references.
- Language switchers and legal/consent banners are always visible, accessible, and loom large on legal flows.

---
