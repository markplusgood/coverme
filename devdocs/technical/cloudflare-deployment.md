# Cloudflare Pages Deployment Guide for cover.me

## Overview
This guide provides step-by-step instructions for deploying cover.me to Cloudflare Pages for Stage 2 MVP.

## Prerequisites
- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- OpenRouter API key (for production AI generation)
- Basic understanding of Cloudflare Pages

## Deployment Steps

### 1. Connect GitHub Repository

1. **Log in** to your Cloudflare account
2. **Navigate** to Pages section
3. **Click "Create application"** and select "Connect to Git"
4. **Choose your GitHub account** and authorize Cloudflare
5. **Select the cover.me repository**

### 2. Configure Build Settings

**Build configuration:**
- **Build command:** `bun run build`
- **Build directory:** `.svelte-kit/cloudflare` (using explicit Cloudflare adapter)
- **Environment variables:** Configure the following variables:

| Variable Name | Description | Required |
|---------------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key for AI generation | ✅ Yes |
| `APP_PASSWORD` | Password for basic auth (e.g., `secure_mvp_password`) | ✅ Yes |
| `APP_ENV` | Set to `production` | ✅ Yes |
| `PUBLIC_SUPABASE_URL` | Supabase URL (for future stages) | ❌ No |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (for future stages) | ❌ No |

### 3. Configure Deployment Settings

- **Branch:** `main` (or your production branch)
- **Deployment triggers:** Automatic on push to main branch
- **Project name:** `coverme-mvp` (or your preferred name)

### 4. Deploy and Verify

1. **Click "Save and Deploy"**
2. **Wait for build to complete** (typically 2-5 minutes)
3. **Access your deployment** at the provided `*.pages.dev` URL

### 5. Test Security

**Basic Authentication Test:**
```bash
# Test with correct password
curl -u user:your_password https://your-app.pages.dev/api/generate-letter

# Test without authentication (should return 401)
curl https://your-app.pages.dev/api/generate-letter
```

### 6. Configure Custom Domain (Optional)

1. **Go to Custom domains** in Cloudflare Pages
2. **Add your domain** (e.g., `mvp.cover.me`)
3. **Configure DNS** in Cloudflare DNS settings
4. **Set up SSL/TLS** (Full or Full (Strict) mode)

## Post-Deployment Configuration

### Environment Variables Management

For security, use Cloudflare Pages environment variables instead of `.env` files:

1. **Go to Settings > Environment variables**
2. **Add variables** one by one
3. **Mark sensitive variables** as "Secret" (eye icon)

### Monitoring Setup

1. **Enable Cloudflare Analytics** in Pages settings
2. **Set up alerts** for:
   - Failed deployments
   - High error rates
   - Traffic spikes

### Rate Limiting

Cloudflare provides built-in rate limiting:

1. **Go to Firewall > Rate Limiting**
2. **Create rule** for `/api/*` endpoints
3. **Set threshold** (e.g., 10 requests per minute per IP)

## Troubleshooting

### Common Issues

**Build failures:**
- Check build logs in Cloudflare Pages
- Verify all dependencies are listed in `package.json`
- Ensure Node.js version compatibility

**Authentication issues:**
- Verify `APP_PASSWORD` is correctly set
- Check browser console for 401 errors
- Test with `curl` as shown above

**API key issues:**
- Verify `OPENROUTER_API_KEY` is correct
- Check OpenRouter dashboard for rate limits
- Test API locally first

### Debugging Tips

```bash
# Check deployment logs
curl -v https://your-app.pages.dev

# Test API endpoint
curl -u user:password -X POST https://your-app.pages.dev/api/generate-letter \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"...","jobDescription":"..."}'
```

## Security Best Practices

1. **Rotate API keys** regularly
2. **Use strong passwords** for basic auth
3. **Monitor access logs** for suspicious activity
4. **Keep dependencies updated**
5. **Enable Cloudflare WAF** for additional protection

## Rollback Procedure

1. **Go to Deployments** in Cloudflare Pages
2. **Select previous successful deployment**
3. **Click "Rollback"**
4. **Verify functionality**

## Performance Optimization

1. **Enable Cloudflare CDN** caching
2. **Configure browser caching** headers
3. **Optimize images** and assets
4. **Enable Brotli compression**

## Next Steps

After successful Stage 2 deployment:
1. ✅ Verify all core functionality works
2. ✅ Test security measures
3. ✅ Monitor performance and errors
4. ✅ Gather feedback for Stage 3 improvements

**Stage 3 will focus on:**
- Landing page development
- Conversion optimization
- User onboarding improvements