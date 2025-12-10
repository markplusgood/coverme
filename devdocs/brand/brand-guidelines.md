# Brand Guidelines (cover.me)

## 1. Visual Identity Overview
**cover.me** stands for clarity, speed, and professional success. The visual language is **high-contrast, vibrant, and energetic**, utilizing bright blues and greens to signify "green light" for your career.

---

## 2. Color Palette (Tailwind CSS)

We use standard Tailwind CSS colors to ensure consistency and accessibility.

### Primary: Electric Blue
Used for primary buttons, active states, and key brand elements.
- **Token**: `primary`
- **Tailwind Class**: `bg-blue-600` / `text-blue-600`
- **Hex**: `#2563EB`
- **Hover**: `bg-blue-700` (#1D4ED8)

### Secondary: Signal Green
Used for success states, "Generate" actions, and high-visibility accents.
- **Token**: `accent`
- **Tailwind Class**: `bg-green-500` / `text-green-500`
- **Hex**: `#22C55E`
- **Hover**: `bg-green-600` (#16A34A)

### Neutrals: Slate
Used for text, backgrounds, and borders to maintain high contrast.
- **Background**: `bg-slate-50` (#F8FAFC)
- **Surface**: `bg-white` (#FFFFFF)
- **Text Main**: `text-slate-900` (#0F172A)
- **Text Muted**: `text-slate-600` (#475569)
- **Border**: `border-slate-200` (#E2E8F0)

### Semantic Colors
- **Error**: `red-600` (#DC2626)
- **Warning**: `amber-500` (#F59E0B)

---

## 3. Typography

### Font Family
**Inter** (Google Fonts) or System Sans-Serif.
- **Headings**: Bold (700) or Semibold (600). Tight tracking (`-0.025em`).
- **Body**: Regular (400) or Medium (500). Standard tracking.

### Type Scale
- **H1**: `text-4xl` md: `text-5xl` (Hero)
- **H2**: `text-3xl` (Section Headers)
- **H3**: `text-xl` (Card Titles)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

---

## 4. UI Elements & Radius

- **Border Radius**: `rounded-lg` (0.5rem) for cards and inputs. `rounded-full` for pill buttons.
- **Shadows**: `shadow-sm` for cards, `shadow-md` for floating elements.
- **Spacing**: Use the 4pt grid (Tailwind default). `p-4`, `gap-4`, `m-8`.

---

## 5. Accessibility Requirements
- **Contrast**: All text must pass WCAG AA (4.5:1) against its background.
- **Focus Rings**: All interactive elements must have a visible focus ring (`focus:ring-2 focus:ring-blue-600`).
- **Dark Mode**: Not in MVP scope, but use semantic classes (`bg-background` vs `bg-white`) to future-proof.

---

## 6. Language & Tone
- **English**: Professional, confident, direct.
- **Russian**: Formal but modern (avoid bureaucratic "kantselyarit").
- **Keywords**: "Tailored", "Instant", "Professional", "ATS-Friendly".