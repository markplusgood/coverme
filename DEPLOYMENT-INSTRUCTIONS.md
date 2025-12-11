# Cloudflare Pages Deployment Instructions

## ✅ Fixed Issues
Updated `package.json` scripts to use `bun run` for all local dependencies:

**Before:**
```json
"build": "svelte-kit sync && vite build"
"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
```

**After:**
```json
"build": "bun run vite build"
"check": "bun run svelte-kit sync && bun run svelte-check --tsconfig ./tsconfig.json"
"check:watch": "bun run svelte-kit sync && bun run svelte-check --tsconfig ./tsconfig.json --watch"
```

This resolves both:
- `svelte-kit: not found` error
- `vite: command not found` error

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Commit the fixed package.json
git add package.json
git commit -m "Fix all build scripts for Cloudflare Pages deployment"
git push origin main
```

### 2. Cloudflare Pages Setup

**A. Create New Project**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Choose **Connect to Git**

**B. Connect Repository**
1. Select your GitHub account
2. Find and select your `coverme` repository
3. Click **Begin setup**

**C. Configure Build Settings**
- **Project name:** `coverme` (or your preferred name)
- **Production branch:** `main`
- **Build command:** `bun run build`
- **Build output directory:** `.svelte-kit/cloudflare`

**D. Environment Variables**
Add these variables in the Pages dashboard:

| Variable Name | Value | Type |
|---------------|-------|------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Secret |
| `APP_PASSWORD` | Your secure password | Secret |
| `APP_ENV` | `production` | Plain text |
| `PUBLIC_SUPABASE_URL` | Your Supabase URL | Plain text |
| `PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Plain text |

### 3. Deploy
1. Click **Save and Deploy**
2. Wait for build to complete (2-5 minutes)
3. Check build logs for success

### 4. Verify Deployment
```bash
# Test the deployed site
curl -u user:YOUR_PASSWORD https://your-app.pages.dev

# Test API endpoint
curl -u user:YOUR_PASSWORD -X POST https://your-app.pages.dev/api/generate-letter \
  -H "Content-Type: application/json" \
  -d '{"jobDescription":"Test job","company":"Test Corp"}'
```

### 5. Configure Custom Domain (Optional)
1. Go to **Custom domains** in Pages settings
2. Add your domain (e.g., `cover.me`)
3. Configure DNS in Cloudflare
4. Enable SSL/TLS

## Troubleshooting

**Build fails?** Check build logs for:
- Missing environment variables
- Dependency issues
- Build script errors

**API not working?** Verify:
- `APP_PASSWORD` is set correctly
- `OPENROUTER_API_KEY` is valid
- Environment is set to `production`

**Site not loading?** Ensure:
- Build output directory is correct: `.svelte-kit/cloudflare`
- Build command is: `bun run build`

## Success Indicators
✅ Build completes without errors  
✅ Site loads at `*.pages.dev` URL  
✅ API endpoints return expected responses  
✅ Authentication works with your password

## Why These Fixes Were Needed

The original scripts were calling local dependencies (`svelte-kit`, `vite`, `svelte-check`) directly without using the package manager. In Cloudflare Pages:

1. Dependencies are installed locally (not globally)
2. Commands need to be executed through `bun run`
3. This ensures all commands are available in the build environment