# Stage 2 Implementation Plan: MVP Deployment on Cloudflare

## Executive Summary
This document outlines the detailed implementation plan for Stage 2 of cover.me development, focusing on deploying the MVP to Cloudflare Pages and ensuring it's accessible for testing and feedback.

## Current Status
- ✅ Stage 1 (MVP Local Deployment) is complete
- ✅ Core functionality working locally
- ✅ Cloudflare adapter configured in package.json
- ❌ Production deployment not yet verified
- ❌ Environment variables not configured for production
- ❌ Basic security measures not implemented

## Implementation Plan

### 1. Cloudflare Pages Setup Verification

**Objective**: Ensure the project is properly configured for Cloudflare Pages deployment

**Tasks**:
- [ ] Verify `adapter-cloudflare` configuration in `svelte.config.js`
- [ ] Check `vite.config.js` for Cloudflare compatibility
- [ ] Ensure build script (`npm run build`) produces Cloudflare-compatible output
- [ ] Test local build process: `bun run build`

**Success Criteria**:
- ✅ Build completes without errors
- ✅ Output directory contains Cloudflare-compatible files
- ✅ Static assets are properly bundled

### 2. Production Environment Configuration

**Objective**: Set up production environment variables and API keys

**Tasks**:
- [ ] Create `.env.production` file with required variables:
  - `OPENROUTER_API_KEY` - Production OpenRouter API key
  - `PUBLIC_SUPABASE_URL` - Supabase project URL
  - `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side)
- [ ] Configure Cloudflare Pages environment variables in dashboard
- [ ] Update `hooks.server.ts` to handle production environment properly
- [ ] Verify API key validation in `src/lib/server/ai/letters.ts`

**Success Criteria**:
- ✅ All required environment variables are configured
- ✅ Production API keys are securely stored in Cloudflare
- ✅ Application can access environment variables in production

### 3. Basic Security Implementation

**Objective**: Implement minimal security measures for the MVP deployment

**Tasks**:
- [ ] Implement simple password protection middleware:
  - Create `/src/lib/server/security.ts` with basic auth check
  - Add password protection to `hooks.server.ts`
  - Configure password via environment variable (`APP_PASSWORD`)
- [ ] Alternatively, implement obscure URL routing:
  - Create random URL path for the app (e.g., `/app-abc123`)
  - Update routing configuration
- [ ] Add rate limiting for API endpoints:
  - Implement basic request counting
  - Add 429 responses for excessive requests

**Success Criteria**:
- ✅ Application is not publicly accessible without authentication
- ✅ API endpoints have basic rate limiting
- ✅ Security measures don't interfere with legitimate usage

### 4. Deployment and Verification

**Objective**: Deploy to Cloudflare Pages and verify functionality

**Tasks**:
- [ ] Connect GitHub repository to Cloudflare Pages
- [ ] Configure build settings:
  - Build command: `bun run build`
  - Build directory: `.svelte-kit/cloudflare`
  - Environment variables: Configure all required vars
- [ ] Trigger initial deployment
- [ ] Verify deployment status and logs
- [ ] Test core functionality on production URL:
  - Resume input works
  - Job description input works
  - Cover letter generation works
  - Error handling works properly

**Success Criteria**:
- ✅ Application is accessible via `*.pages.dev` URL
- ✅ All core functionality works in production environment
- ✅ No critical errors in production logs
- ✅ Response times are acceptable

### 5. Monitoring and Feedback Setup

**Objective**: Set up basic monitoring for the deployed MVP

**Tasks**:
- [ ] Configure Cloudflare Analytics for the Pages site
- [ ] Set up error logging (console.log to Cloudflare logs)
- [ ] Create simple feedback form or contact method
- [ ] Document known limitations and issues

**Success Criteria**:
- ✅ Basic usage analytics are available
- ✅ Errors are logged and accessible
- ✅ Users can provide feedback

## Technical Implementation Details

### Cloudflare Adapter Configuration

Ensure `svelte.config.js` has proper Cloudflare adapter:

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
  kit: {
    adapter: adapter(),
    // Other config...
  },
  preprocess: vitePreprocess()
};
```

### Environment Variable Handling

Update environment variable handling to work with Cloudflare:

```typescript
// In hooks.server.ts and API routes
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.warn('Running in mock mode - no OpenRouter API key configured');
  // Fall back to mock implementation
}
```

### Security Middleware Example

```typescript
// src/lib/server/security.ts
export function basicAuth(password: string) {
  return (event: any) => {
    const authHeader = event.request.headers.get('Authorization');
    if (authHeader !== `Basic ${btoa(`user:${password}`)}`) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="cover.me MVP"' }
      });
    }
  };
}
```

## Risk Assessment

### Potential Risks and Mitigations

1. **API Key Exposure**
   - Risk: OpenRouter API key could be exposed in client-side code
   - Mitigation: Ensure all API calls go through server-side endpoints

2. **Rate Limit Issues**
   - Risk: Free tier API limits could be exceeded
   - Mitigation: Implement client-side caching and rate limiting

3. **Deployment Failures**
   - Risk: Build might fail in Cloudflare environment
   - Mitigation: Test build locally first and verify all dependencies

4. **Security Vulnerabilities**
   - Risk: Basic auth could be bypassed
   - Mitigation: Use obscure URLs and monitor access logs

## Timeline Estimate

| Task | Estimated Time |
|------|----------------|
| Cloudflare configuration verification | 1-2 hours |
| Environment setup | 1 hour |
| Security implementation | 2-3 hours |
| Deployment and testing | 2 hours |
| Monitoring setup | 1 hour |
| **Total** | **7-9 hours** |

## Next Steps

1. Review this plan and provide feedback
2. Approve implementation approach
3. Begin implementation with Cloudflare configuration
4. Proceed step-by-step with verification at each stage

## Open Questions

1. Should we use password protection or obscure URL for basic security?
2. Do we have the production API keys ready for configuration?
3. Should we implement any additional monitoring beyond basic Cloudflare analytics?