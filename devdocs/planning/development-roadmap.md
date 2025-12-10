# cover.me - Development Roadmap

## Executive Summary
This roadmap outlines the development of **cover.me**, an AI-powered cover letter generator, organized into 5 distinct stages. The goal is to rapidly validate the core value proposition with an MVP before expanding into a full production-ready SaaS product.

## 📅 Stages Overview

1.  **MVP Local Deployment**: Core functionality working locally.
2.  **MVP Deployment on Cloudflare**: Publicly accessible prototype.
3.  **Landing Page Development**: Conversion-optimized marketing site.
4.  **Landing Page Deployment**: Live marketing presence.
5.  **Production-Ready Product Development**: Full SaaS features (Auth, Payments, Localization).

---

## Stage 1: MVP Local Deployment
**Goal**: Build and validate the core AI generation loop locally.

### Key Deliverables
- **Project Setup**: 
    - SvelteKit + TailwindCSS initialization.
    - Configure `index.css` with design system tokens.
- **Core UI**:
    - Resume input (Text paste or simple file read).
    - Job Description input (Text paste).
    - "Generate" button.
    - Output display area.
- **AI Integration**:
    - Connect to LLM Provider (e.g., OpenAI/Claude).
    - Implement base system prompt from `devdocs/prompt.md`.
    - Basic error handling.
- **Local Dev Environment**:
    - `npm run dev` working error-free.
    - Environment variables configured (`.env.local`).

### Success Criteria
- [ ] Can input a resume and job description.
- [ ] AI generates a coherent cover letter.
- [ ] Application runs locally without errors.

---

## Stage 2: MVP Deployment on Cloudflare
**Goal**: Make the MVP accessible via a public URL for testing and feedback.

### Key Deliverables
- **Cloudflare Pages Setup**:
    - Connect GitHub repository.
    - Configure build settings (`npm run build`).
- **Environment Configuration**:
    - Set production API keys/secrets in Cloudflare Dashboard.
- **Basic Security**:
    - (Optional) Simple password protection or obscure URL if strictly internal.

### Success Criteria
- [ ] Application is accessible via a `*.pages.dev` or custom URL.
- [ ] Core generation flow works in the production environment.

---

## Stage 3: Landing Page Development
**Goal**: Create a high-converting landing page to explain the product value.

### Key Deliverables
- **Design Implementation**:
    - Hero section with clear Value Proposition.
    - "How it Works" section.
    - Features/Benefits.
    - Social Proof (placeholders if needed).
    - Pricing Section (static).
- **Assets**:
    - Create/Select brand assets (Logo, Colors) per `devdocs/brand/brand-guidelines.md`.
- **Copywriting**:
    - Draft initial marketing copy (EN).

### Success Criteria
- [ ] Landing page is visually appealing and responsive.
- [ ] Clearly communicates what cover.me does.

---

## Stage 4: Landing Page Deployment
**Goal**: Publish the landing page to drive traffic.

### Key Deliverables
- **Integration**:
    - Decide on routing: Landing at `/`, App at `/app` OR Landing links to App.
- **SEO Basics**:
    - Meta tags (Title, Description).
    - OpenGraph tags.
- **Deployment**:
    - Push changes to Cloudflare.
    - Verify domain settings.

### Success Criteria
- [ ] Landing page is live and performant.
- [ ] SEO tags are correctly populated.

---

## Stage 5: Production-Ready Product Development
**Goal**: Transform the MVP into a fully-featured, localized SaaS product.

### Key Deliverables
- **Authentication**:
    - Implement Supabase Auth (Email/Password, OAuth).
- **Database**:
    - Set up User Profiles, Saved Letters, Credits tables.
- **Payments**:
    - Integrate Payment Provider (e.g., Stripe/LemonSqueezy).
    - Implement checkout flow.
- **Localization (i18n)**:
    - Implement EN/RU localization for all UI and AI outputs.
- **Advanced Features**:
    - PDF/DOCX Export.
    - Resume Parsing (PDF upload).
    - History/Dashboard.
- **Compliance**:
    - Privacy Policy, Terms of Service.
    - Cookie Consent.

### Success Criteria
- [ ] Users can sign up, pay, and manage their account.
- [ ] Full localization support (EN/RU).
- [ ] Product meets all requirements in `devdocs/prd.md`.
