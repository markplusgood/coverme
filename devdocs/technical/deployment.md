# Cloudflare Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the cover.me AI cover letter writer platform to Cloudflare Pages. The platform uses a modern Jamstack architecture with SvelteKit, Supabase for backend services, and Cloudflare for hosting and edge computing.

## Prerequisites

Before deploying, ensure you have:

- ✅ Cloudflare account
- ✅ GitHub repository (for CI/CD)
- ✅ Supabase project (for database and auth)
- ✅ Domain name (optional, for custom domain)
- ✅ Environment variables configured

---

## 1. Cloudflare Pages Setup

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com) and sign up for a free account
2. Verify your email address
3. Complete the account setup process

### Step 2: Access Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Click on "Pages" in the left sidebar
3. Click "Create a project"

### Step 3: Connect GitHub Repository

1. Select "Connect to Git" option
2. Choose GitHub as your Git provider
3. Authorize Cloudflare to access your GitHub account
4. Select your coverme repository from the list
5. Click "Begin setup"

### Step 4: Configure Build Settings

Configure the following build settings:

```yaml
# Build settings
Production branch: main
Build command: bun run build
Build output directory: build
Root directory: (leave empty)

# Environment variables (see Environment Variables section below)
```

### Step 5: Deploy

1. Click "Save and Deploy"
2. Cloudflare will start building your project
3. Monitor the build process in the deployment logs
4. Once complete, your site will be available at `https://[project-name].pages.dev`

---

## 2. Build Configuration

### SvelteKit Adapter Configuration

The project uses `@sveltejs/adapter-cloudflare` for optimal Cloudflare Pages deployment.

**File**: `svelte.config.js`

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      },
      platformProxy: {
        configPath: 'wrangler.toml',
        environment: undefined,
        experimentalJsonConfig: undefined
      }
    }),

    // Other SvelteKit config...
    alias: {
      '$lib': 'src/lib'
    }
  }
};

export default config;
```

### Wrangler Configuration

**File**: `wrangler.toml`

```toml
name = "coverme"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[build]
command = "bun run build"

[build.upload]
format = "modules"

[[build.upload.rules]]
type = "ESModule"
globs = ["**/*.js"]

# Environment variables (defined in Cloudflare dashboard)
[vars]
PUBLIC_SITE_URL = "https://cover.me"

# KV namespaces (if using Cloudflare KV)
[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_id"
```

### Package.json Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "deploy": "wrangler pages deploy build"
  }
}
```

---

## 3. Environment Variables

### Required Environment Variables

Set these in your Cloudflare Pages project settings under "Environment variables":

#### Production Environment Variables

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
PUBLIC_SITE_URL=https://cover.me

# AI Provider Configuration
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_api_key
AI_MODEL=google/gemini-2.0-flash-exp:free

# Analytics (Optional)
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=123456789012345
PUBLIC_TIKTOK_PIXEL_ID=ABCDEFGHIJKLMNO
PUBLIC_POSTHOG_KEY=your_posthog_key

# Cloudflare R2 (for file uploads)
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.dev
```

#### Preview Environment Variables

For preview deployments (pull requests), use test/development values:

```bash
# Use staging Supabase project
PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=staging_anon_key

# Disable analytics in preview
PUBLIC_GA_MEASUREMENT_ID=
PUBLIC_META_PIXEL_ID=
PUBLIC_TIKTOK_PIXEL_ID=
```

### Setting Environment Variables in Cloudflare

1. Go to your Cloudflare Pages project dashboard
2. Click on "Settings" tab
3. Scroll down to "Environment variables"
4. Add each variable with its value
5. Choose "Production" or "Preview" scope as appropriate
6. Click "Save"

### Local Development

**File**: `.env.local`

```bash
# Copy from .env.example and fill in your values
PUBLIC_SUPABASE_URL=your_local_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key

# AI Provider Configuration
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_api_key
AI_MODEL=google/gemini-2.0-flash-exp:free

# Add other variables as needed
```

---

## 4. Custom Domain Setup

### Step 1: Purchase Domain

1. Purchase a domain from a registrar (Namecheap, GoDaddy, etc.)
2. Recommended: `cover.me` or similar career-focused domain

### Step 2: Add Domain to Cloudflare

1. In Cloudflare dashboard, go to "Websites"
2. Click "Add a site"
3. Enter your domain name
4. Follow the DNS setup instructions provided by Cloudflare

### Step 3: Configure DNS Records

Cloudflare will provide specific DNS records to add at your registrar:

```
Type: CNAME
Name: www
Target: [your-project].pages.dev

Type: CNAME
Name: @
Target: [your-project].pages.dev
```

### Step 4: Connect Domain to Pages

1. In your Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `cover.me`)
4. Add `www` subdomain if desired
5. Cloudflare will automatically provision SSL certificates

### Step 5: Update DNS at Registrar

1. Log in to your domain registrar
2. Update nameservers to Cloudflare's nameservers (provided during setup)
3. Wait for DNS propagation (can take 24-48 hours)

### Step 6: Verify Setup

1. Check domain status in Cloudflare dashboard
2. Test both `yoursite.com` and `www.yoursite.com`
3. Verify SSL certificate is active (should show padlock icon)

---

## 5. SSL/TLS Configuration

### Automatic SSL (Recommended)

Cloudflare Pages automatically provides SSL certificates for all deployments:

- ✅ Free SSL certificates from Let's Encrypt
- ✅ Automatic renewal
- ✅ Supports both apex domain and subdomains
- ✅ HTTP/2 and HTTP/3 support

### SSL Settings in Cloudflare

1. Go to your domain in Cloudflare dashboard
2. Click "SSL/TLS" tab
3. Ensure "Full (strict)" encryption mode is selected
4. Enable "Always Use HTTPS"
5. Enable "Automatic HTTPS Rewrites"

### Custom SSL Certificate (Optional)

For advanced users who need custom certificates:

1. Go to SSL/TLS → Custom certificates
2. Upload your certificate and private key
3. Cloudflare will validate and install the certificate

### Security Headers

Add security headers via `_headers` file in your `static` directory:

**File**: `static/_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/api/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Access-Control-Allow-Origin: https://cover.me
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 6. CI/CD Pipeline (GitHub Actions)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: bun install

      - name: Type check
        run: bun run check

      - name: Lint
        run: bun run lint

      - name: Build
        run: bun run build
        env:
          # Add your environment variables here
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
          OPENAI_API_BASE_URL: ${{ secrets.OPENAI_API_BASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          AI_MODEL: ${{ secrets.AI_MODEL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: build
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build
        env:
          # Use staging/test environment variables
          PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}

      - name: Deploy Preview
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: build
          branch: ${{ github.head_ref }}
```

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets:

```bash
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_PROJECT_NAME=coverme

PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI Provider Configuration
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=your_openrouter_api_key
AI_MODEL=google/gemini-2.0-flash-exp:free

# Staging versions for previews
STAGING_SUPABASE_URL=https://staging-project.supabase.co
STAGING_SUPABASE_ANON_KEY=staging_anon_key
```

### Creating Cloudflare API Token

1. Go to Cloudflare dashboard → My Profile → API Tokens
2. Create Custom Token with these permissions:
   - Account: Cloudflare Pages:Edit
   - Zone: Page Rules:Edit
   - Zone: Zone:Read
3. Copy the token and add to GitHub secrets

---

## 7. Deployment Previews Workflow

### Automatic Preview Deployments

Cloudflare Pages automatically creates preview deployments for:

- ✅ Pull requests
- ✅ Branch pushes (except main)
- ✅ Custom branches

### Preview URL Format

```
https://[branch-name].[project-name].pages.dev
```

Example:
- PR #123: `https://pr-123-coverme.pages.dev`
- Feature branch: `https://feature-new-ui.coverme.pages.dev`

### Preview Environment Variables

Configure different environment variables for previews:

1. In Cloudflare Pages dashboard
2. Go to Settings → Environment variables
3. Set scope to "Preview"
4. Use staging/test values for databases and APIs

### Testing Previews

#### Automated Testing
Add automated tests to your GitHub Actions workflow:

```yaml
- name: Run tests
  run: bun run test

- name: Lighthouse audit
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: ${{ steps.deploy.outputs.url }}
    configPath: .lighthouserc.json
```

#### Manual Testing Checklist

Before merging a PR, verify:

- [ ] Site loads without console errors
- [ ] All pages render correctly
- [ ] Authentication flows work
- [ ] Database connections successful
- [ ] Images load properly
- [ ] Mobile responsive design
- [ ] Lighthouse scores > 90

### Preview Deployment Comments

GitHub Actions can automatically comment on PRs with preview URLs:

```yaml
- name: Comment PR
  uses: actions/github-script@v7
  if: github.event_name == 'pull_request'
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `🚀 Preview deployment ready: https://pr-${{ github.event.number }}-coverme.pages.dev`
      })
```

---

## 8. Troubleshooting

### Common Deployment Issues

#### Build Failures

**Issue**: `Error: Cannot resolve dependency`
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
bun install
```

**Issue**: `TypeScript errors during build`
**Solution**:
```bash
# Run type checking locally
bun run check

# Fix TypeScript errors before deploying
```

#### Environment Variables

**Issue**: `Environment variable not found`
**Solution**:
1. Check Cloudflare Pages environment variables
2. Ensure variables are set for correct scope (Production/Preview)
3. Restart deployment after adding variables

#### Domain Issues

**Issue**: `SSL certificate not provisioning`
**Solution**:
1. Wait 24-48 hours for DNS propagation
2. Check DNS records are correctly configured
3. Verify domain ownership in Cloudflare

#### Performance Issues

**Issue**: Slow loading times
**Solution**:
1. Enable Cloudflare caching
2. Optimize images (WebP, lazy loading)
3. Use Cloudflare's image optimization
4. Implement proper caching headers

### Debugging Tools

#### Cloudflare Analytics
- Real-time visitor analytics
- Performance metrics
- Error tracking

#### Build Logs
- Check deployment logs in Cloudflare dashboard
- GitHub Actions logs for CI/CD issues

#### Local Testing
```bash
# Test build locally
bun run build

# Preview production build
bun run preview

# Check for runtime errors
bun run dev
```

---

## 9. Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Supabase project set up and accessible
- [ ] Database migrations run
- [ ] R2 bucket configured with CORS
- [ ] Domain purchased and DNS configured
- [ ] SSL certificate active
- [ ] GitHub repository connected to Cloudflare Pages

### Build Configuration
- [ ] `svelte.config.js` configured with Cloudflare adapter
- [ ] `wrangler.toml` properly configured
- [ ] Build commands working locally
- [ ] All dependencies listed in `package.json`

### Testing
- [ ] Local development works (`bun run dev`)
- [ ] Production build succeeds (`bun run build`)
- [ ] Preview deployment works
- [ ] All pages load without errors
- [ ] Authentication flows functional
- [ ] Database connections working
- [ ] Mobile responsive design verified

### Security
- [ ] Environment variables not exposed in client code
- [ ] HTTPS enabled and working
- [ ] Security headers configured
- [ ] CORS properly configured for API routes

### Performance
- [ ] Images optimized (WebP format)
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Lighthouse scores > 90

### Monitoring
- [ ] Analytics configured (GA4, Meta Pixel, etc.)
- [ ] Error tracking set up (Sentry)
- [ ] Performance monitoring active

### Post-Deployment
- [ ] DNS propagation complete (24-48 hours)
- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] All redirects configured
- [ ] CDN caching enabled

---

## 10. Performance Optimization

### Cloudflare-Specific Optimizations

#### Page Rules
Configure page rules for better performance:

1. Go to Cloudflare dashboard → Page Rules
2. Create rules for:
   - Cache static assets (1 year)
   - Compress responses
   - Enable Brotli compression

#### Image Optimization
Use Cloudflare Images or Image Resizing:

```html
<!-- Automatic format conversion -->
<img src="/images/hero.jpg" alt="Hero image"
     style="width: 100%; height: auto;"
     loading="lazy">

<!-- With Cloudflare Image Resizing -->
<img src="https://images.cover.me/cdn-cgi/image/width=800,format=webp/images/hero.jpg"
     alt="Hero image">
```

#### Caching Strategy

**Static Assets** (1 year cache):
```
/static/*
/_images/*
/favicon.ico
```

**API Routes** (short cache):
```
/api/*  # 5 minutes cache
```

**HTML Pages** (no cache):
```
/*  # no cache for dynamic content
```

### Monitoring Performance

#### Core Web Vitals
Monitor using:
- Cloudflare Web Analytics
- Google PageSpeed Insights
- Lighthouse CI in GitHub Actions

#### Real User Monitoring
```javascript
// Add to your app for RUM
import { initRum } from '@cloudflare/rum';

initRum({
  token: 'your_rum_token',
  spa: true
});
```

---

## 11. Backup and Recovery

### Database Backups
- Supabase provides automatic backups
- Export data regularly for additional safety
- Test restore procedures

### Code Repository
- All code stored in Git
- Use GitHub for version control
- Tag releases for easy rollback

### Static Assets
- Cloudflare R2 provides durability
- Enable versioning on R2 bucket
- Regular backup of critical assets

### Rollback Strategy
1. Identify the issue
2. Check deployment history in Cloudflare
3. Roll back to previous working deployment
4. Investigate root cause
5. Fix and redeploy

---

## 12. Cost Optimization

### Cloudflare Free Tier Limits
- 100,000 requests/month
- 10GB bandwidth/month
- Unlimited static sites
- 500 custom domains

### Supabase Free Tier
- 500MB database
- 50MB file storage
- 2GB bandwidth
- 50,000 monthly active users

### Monitoring Usage
- Set up alerts for usage limits
- Monitor costs in Cloudflare dashboard
- Plan upgrades before hitting limits

---

## Support Resources

### Cloudflare Documentation
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [SvelteKit Cloudflare Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)

### Community Support
- [Cloudflare Community](https://community.cloudflare.com)
- [Svelte Discord](https://svelte.dev/chat)
- [Supabase Discord](https://supabase.com/docs/guides/getting-started)

### Emergency Contacts
- Cloudflare Support: [support.cloudflare.com](https://support.cloudflare.com)
- Supabase Support: [supabase.com/support](https://supabase.com/support)

---

**Last Updated**: December 2025
**Version**: 1.0
**Platform**: cover.me