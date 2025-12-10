# Component Library (cover.me)

## Overview
This document lists the core UI components for the **cover.me** application.
**Tech Stack**: SvelteKit, Tailwind CSS, shadcn-svelte (or compatible headless UI).

---

## 1. Core Inputs

### `ResumeUploader.svelte`
**Purpose**: Handles file selection, validation, and upload of resumes.
- **Props**:
    - `accept`: string (default: ".pdf,.docx")
    - `maxSize`: number (default: 5MB)
- **States**:
    - `idle`: "Drop resume here or click to upload"
    - `uploading`: Progress bar / Spinner
    - `success`: File name displayed, "Change file" button
    - `error`: Red border, error message text
- **Events**: `on:upload` (returns file URL/ID)

### `JobInput.svelte`
**Purpose**: Multi-mode input for job descriptions.
- **Modes**:
    - **Paste**: Simple textarea.
    - **URL**: Input field for LinkedIn/Indeed URL (Future feature).
- **Props**:
    - `value`: string (bindable)
    - `placeholder`: string
- **Validation**: Minimum character count warning.

### `ToneSelector.svelte`
**Purpose**: Select the tone of voice for the cover letter.
- **UI**: Segmented control or Radio group.
- **Options**:
    - `Concise`: Direct, bullet-point focused.
    - `Professional`: Standard corporate tone.
    - `Enthusiastic`: High energy, startup-focused.

---

## 2. Letter Display

### `LetterPreview.svelte`
**Purpose**: Displays the generated cover letter with editing capabilities.
- **Props**:
    - `content`: string (Markdown/HTML)
    - `loading`: boolean
- **Features**:
    - **Editable**: ContentEditable area or Tiptap editor integration.
    - **Skeleton**: Loading skeleton while generating.
    - **Toolbar**: Copy, Export PDF, Regenerate.

### `ExportMenu.svelte`
**Purpose**: Dropdown to select export format.
- **Options**:
    - Copy to Clipboard
    - Download PDF
    - Download DOCX

---

## 3. Layout Components

### `AppHeader.svelte`
**Purpose**: Main navigation bar.
- **Content**:
    - Logo (Left)
    - Navigation Links (Center - Hidden on mobile)
    - User Menu / Sign In (Right)

### `AppFooter.svelte`
**Purpose**: Standard footer.
- **Content**: Copyright, Links to Privacy/Terms, Language Switcher.

### `Container.svelte`
**Purpose**: Centers content with max-width and padding.
- **Classes**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

---

## 4. Feedback & Status

### `Toast.svelte` (or external library)
**Purpose**: Temporary notifications.
- **Types**: Success (Green), Error (Red), Info (Blue).

### `LoadingSpinner.svelte`
**Purpose**: Visual indicator for async operations.
- **Style**: Tailwind `animate-spin` SVG.

---

## 5. Marketing Components (Landing Page)

### `HeroSection.svelte`
- **Elements**: H1 Headline, Subheadline, "Get Started" CTA (Primary Color), Hero Image/Graphic.

### `FeatureGrid.svelte`
- **Elements**: 3-column grid of features with icons.

### `HowItWorks.svelte`
- **Elements**: Step-by-step visual guide (1. Upload -> 2. Paste Job -> 3. Generate).