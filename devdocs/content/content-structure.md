# Content Structure (cover.me)

## Overview
This guide explains how content is organized, validated, and moved through the cover.me system—from user input/upload through AI cover letter output/export. All flows are job/resume/letter focused; no legacy course or education assets remain.

---

## Input Content (Intake)
### 1. Job Description
- Pasted text (or optionally fetched from URL).
- Required fields: Title, Company, Role/Function, Responsibilities (min length, mandatory).
- Used directly as prompt/context for AI letter gen.

### 2. Resume
- Upload PDF or DOCX only; max 5MB. Parsed to extract plain text for keywords/skills/experience matching.
- User must confirm proper parsing (preview for non-pdf is recommended).
- File must be deleted upon account deletion (GDPR).

### 3. User Profile Fields
- Name, experience highlights/summary (optional), preferred tone/language.

---

## AI Generation Context & Output
- **Inputs:** Job Description, Resume, Tone, Language
- Output: Clean, single-column plain text cover letter, designed for ATS—no decorative formatting, images, or outer HTML beyond semantic headings.
- Multilingual support: Structure must cleanly separate language field for prompt and for output.

---

## Data Validation & Legal
- All user inputs validated client and server: schema-based checks, length, type, file format, privacy flag for PII suppression in logs.
- No intake, output, or intermediate content is stored or sent to analytics except as hashes/ids for metrics.

---

## Export
- Only user can export their letters (PDF/DOCX, text, clipboard).
- Filenames: `{company}-{role}-cover-letter.pdf` (no PII in exported file paths).

---

## TODO: Content Processing Details

### Resume Parsing Implementation
- **TODO-CONTENT**: Select resume parsing library (see PRD TODO-PRODUCT). Define exact parsing output format: plain text string, structured JSON with sections, or both?
- **TODO-CONTENT**: Define user preview/confirmation flow: show parsed text before proceeding? Allow manual editing of parsed content?
- **TODO-CONTENT**: Define handling for unparseable resumes: show error, allow manual text entry, or attempt OCR?

### Job Description Parsing
- **TODO-CONTENT**: Define exact parsing logic for pasted job descriptions: extract title, company, location, requirements, responsibilities using regex/NLP? Or require user to fill structured form?
- **TODO-CONTENT**: Define job URL parsing implementation (see PRD TODO-PRODUCT): which sites supported, extraction method, fallback behavior.

### Export Format Specifications
- **TODO-CONTENT**: Define exact PDF/DOCX export format: page margins, font size, line spacing, header/footer content. Ensure ATS compatibility.
- **TODO-CONTENT**: Define export filename format for Russian locale (see PRD TODO-PRODUCT): transliteration rules, Unicode handling, ASCII fallback.
- **TODO-CONTENT**: Define clipboard export format: plain text only, or formatted text? How to handle line breaks, bullet points?

### AI Output Format
- **TODO-CONTENT**: Define exact AI output structure: greeting, body paragraphs, closing, signature. Define character limits per section.
- **TODO-CONTENT**: Define how to handle AI hallucinations or off-topic content: validation rules, user review requirements, regeneration triggers.

---

## TODO-REWRITE
Remove any deprecated notes about lessons, assignments, or content structure for course platforms.
