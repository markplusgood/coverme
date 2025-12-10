# indigocosmo.club - Supabase Setup Guide

## Overview

This guide provides step-by-step instructions for setting up Supabase for the indigocosmo.club spiritual course platform. Supabase serves as the backend for authentication, database, and real-time features.

**Estimated Setup Time**: 45-60 minutes
**Prerequisites**: Cloudflare account (for R2 integration)

---

## Table of Contents

1. [Project Creation](#1-project-creation)
2. [Authentication Configuration](#2-authentication-configuration)
3. [Email Template Customization](#3-email-template-customization)
4. [Database Schema Setup](#4-database-schema-setup)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [Cloudflare R2 Integration](#6-cloudflare-r2-integration)
7. [Environment Variables](#7-environment-variables)
8. [Testing Setup](#8-testing-setup)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Project Creation

### Step 1.1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with your preferred method (GitHub recommended for developers)
4. Verify your email address

### Step 1.2: Create New Project

1. Click "New project" in your dashboard
2. Fill in project details:
   - **Name**: `indigocosmo` (or `indigocosmo-prod` for production)
   - **Database Password**: Generate a strong password (save this securely)
   - **Region**: Choose the region closest to your users (e.g., EU West for European users)
3. Click "Create new project"

### Step 1.3: Wait for Project Setup

- Project creation takes 2-3 minutes
- You'll see a progress indicator
- Once complete, you'll be redirected to the project dashboard

### Step 1.4: Get Project Credentials

1. Go to **Settings** → **API** in your project dashboard
2. Copy the following values (keep them secure):
   - **Project URL**: `https://[project-id].supabase.co`
   - **anon/public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (keep this secret!)

---

## 2. Authentication Configuration

### Step 2.1: Enable Email Authentication

1. Go to **Authentication** → **Providers** in your dashboard
2. Ensure **Email** provider is **Enabled**
3. Configure email settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add your production URLs later
4. **Enable email confirmations** for production security

### Step 2.2: Configure Google OAuth

1. Go to **Authentication** → **Providers** → **Google**
2. Click **Enable sign in with Google**

#### Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - Development: `https://[project-id].supabase.co/auth/v1/callback`
     - Production: `https://yourdomain.com/auth/callback`
5. Copy the **Client ID** and **Client Secret**

#### Configure in Supabase

1. Back in Supabase dashboard
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### Step 2.3: Configure Telegram OAuth

1. Go to **Authentication** → **Providers** → **Telegram**
2. Click **Enable sign in with Telegram**

#### Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command to create a new bot
3. Follow the prompts:
   - **Bot name**: `indigocosmo.club Bot`
   - **Bot username**: Choose a unique username (e.g., `indigocosmo_bot`)
4. Copy the **Bot Token** provided by BotFather

#### Configure in Supabase

1. Back in Supabase dashboard
2. Paste your **Bot Token**
3. Click **Save**

**Note**: Telegram OAuth requires users to interact with your bot first before they can authenticate through Supabase.

### Step 2.4: Configure Additional Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add all your callback URLs
   - **JWT Expiry**: 3600 seconds (1 hour) - balance security vs UX
   - **Enable email confirmations**: ✅ (required for production)
   - **Enable email change confirmations**: ✅
   - **Enable phone confirmations**: ❌ (not needed)

---

## 3. Email Template Customization

### Step 3.1: Access Email Templates

1. Go to **Authentication** → **Email Templates** in your dashboard

### Step 3.2: Customize Confirmation Email

1. Select **Confirm signup** template
2. Customize the email content:

**Subject**: `Добро пожаловать в indigocosmo.club! Подтвердите ваш email`

**Message** (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Подтверждение email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #a855f7;">🌟 Добро пожаловать в indigocosmo.club!</h1>

    <p>Спасибо за регистрацию на платформе духовного развития!</p>

    <p>Чтобы завершить регистрацию и начать свое путешествие к пробуждению третьего глаза, подтвердите ваш email:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}"
         style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        ✅ Подтвердить email
      </a>
    </div>

    <p><strong>Что вас ждет:</strong></p>
    <ul>
      <li>Курс по развитию ясновидения</li>
      <li>Практики астрального путешествия</li>
      <li>Упражнения по открытию третьего глаза</li>
      <li>Сообщество единомышленников</li>
    </ul>

    <p style="color: #666; font-size: 14px;">
      Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:<br>
      {{ .ConfirmationURL }}
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="color: #666; font-size: 12px;">
      Если вы не регистрировались на indigocosmo.club, просто игнорируйте это письмо.
    </p>
  </div>
</body>
</html>
```

### Step 3.3: Customize Password Reset Email

1. Select **Reset password** template

**Subject**: `Восстановление пароля - indigocosmo.club`

**Message** (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Восстановление пароля</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #a855f7;">🔐 Восстановление пароля</h1>

    <p>Мы получили запрос на восстановление пароля для вашей учетной записи на indigocosmo.club.</p>

    <p>Чтобы установить новый пароль, нажмите на кнопку ниже:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}"
         style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        🔑 Сбросить пароль
      </a>
    </div>

    <p style="color: #666; font-size: 14px;">
      Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:<br>
      {{ .ConfirmationURL }}
    </p>

    <p style="color: #666; font-size: 14px;">
      Ссылка действительна в течение 1 часа.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="color: #666; font-size: 12px;">
      Если вы не запрашивали восстановление пароля, просто игнорируйте это письмо.
    </p>
  </div>
</body>
</html>
```

### Step 3.4: Customize Email Change Email

1. Select **Change email address** template

**Subject**: `Подтверждение изменения email - indigocosmo.club`

**Message** (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Подтверждение изменения email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #a855f7;">📧 Подтверждение изменения email</h1>

    <p>Мы получили запрос на изменение email адреса для вашей учетной записи на indigocosmo.club.</p>

    <p>Ваш новый email адрес: <strong>{{ .NewEmail }}</strong></p>

    <p>Чтобы подтвердить изменение, нажмите на кнопку ниже:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}"
         style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        ✅ Подтвердить новый email
      </a>
    </div>

    <p style="color: #666; font-size: 14px;">
      Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:<br>
      {{ .ConfirmationURL }}
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="color: #666; font-size: 12px;">
      Если вы не запрашивали изменение email, обратитесь в службу поддержки.
    </p>
  </div>
</body>
</html>
```

### Step 3.5: Test Email Templates

1. Go to **Authentication** → **Users** in your dashboard
2. Click **Add user** to create a test user
3. Check your email for the confirmation message
4. Verify the styling and content are correct

---

## 4. Database Schema Setup

### Step 4.1: Access SQL Editor

1. Go to **SQL Editor** in your Supabase dashboard

### Step 4.2: Create Tables

Run the following SQL commands in order. You can run them one by one or as a single script.

#### Create Profiles Table
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Create Course Progress Table
```sql
-- Course progress tracking
CREATE TABLE public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id TEXT NOT NULL, -- e.g., 'course-1', 'course-2'
  lesson_slug TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id, lesson_slug)
);
```

#### Create Assignment Submissions Table
```sql
-- Assignment submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id TEXT NOT NULL, -- e.g., 'course-1', 'course-2'
  assignment_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'submitted', -- submitted, reviewed, completed
  feedback TEXT,
  score INTEGER,
  UNIQUE(user_id, course_id, assignment_slug)
);
```

#### Create User Schedules Table
```sql
-- Assignment schedules (for learners)
CREATE TABLE public.user_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id TEXT NOT NULL, -- e.g., 'course-1', 'course-2'
  assignment_slug TEXT NOT NULL,
  due_date DATE NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Create Library Downloads Table
```sql
-- Library downloads tracking
CREATE TABLE public.library_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  resource_slug TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Create User Consents Table
```sql
-- User consents for GDPR compliance
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  consent_type TEXT NOT NULL, -- 'terms', 'privacy', 'cookies_analytics', 'cookies_marketing'
  consent_given BOOLEAN NOT NULL,
  consent_version TEXT NOT NULL, -- version of terms/policy accepted (e.g., "v1.2024-11-01")
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Create Schema Migrations Table
```sql
-- Schema migrations tracking (system table)
CREATE TABLE public.schema_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT NOT NULL UNIQUE,
  description TEXT,
  version INTEGER NOT NULL UNIQUE,
  checksum TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  execution_time_ms INTEGER,
  executed_by TEXT DEFAULT 'system'
);
```

### Step 4.3: Enable Row Level Security

Run these commands to enable RLS on all tables:

```sql
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;
```

### Step 4.4: Create Indexes

Run these commands to create performance indexes:

```sql
-- Profiles (primary key index created automatically)

-- Course Progress
CREATE INDEX idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX idx_course_progress_course ON public.course_progress(course_id);
CREATE INDEX idx_course_progress_lesson ON public.course_progress(course_id, lesson_slug);

-- Assignment Submissions
CREATE INDEX idx_assignment_submissions_user_id ON public.assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_course ON public.assignment_submissions(course_id);
CREATE INDEX idx_assignment_submissions_assignment ON public.assignment_submissions(course_id, assignment_slug);

-- User Schedules
CREATE INDEX idx_user_schedules_user_id ON public.user_schedules(user_id);
CREATE INDEX idx_user_schedules_course ON public.user_schedules(course_id);
CREATE INDEX idx_user_schedules_due_date ON public.user_schedules(due_date);

-- Library Downloads
CREATE INDEX idx_library_downloads_user_id ON public.library_downloads(user_id);
CREATE INDEX idx_library_downloads_resource ON public.library_downloads(resource_slug);

-- User Consents
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_type ON public.user_consents(user_id, consent_type);

-- Schema Migrations
CREATE INDEX idx_schema_migrations_version ON public.schema_migrations(version);
CREATE INDEX idx_schema_migrations_executed_at ON public.schema_migrations(executed_at DESC);
```

---

## 5. Row Level Security (RLS) Policies

### Step 5.1: Create RLS Policies

Run these commands to create security policies for each table:

#### Profiles Policies
```sql
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Course Progress Policies
```sql
-- Course progress policies
CREATE POLICY "Users can view own progress" ON public.course_progress
  FOR ALL USING (auth.uid() = user_id);
```

#### Assignment Submissions Policies
```sql
-- Assignment submissions policies
CREATE POLICY "Users can manage own submissions" ON public.assignment_submissions
  FOR ALL USING (auth.uid() = user_id);
```

#### User Schedules Policies
```sql
-- User schedules policies
CREATE POLICY "Users can manage own schedules" ON public.user_schedules
  FOR ALL USING (auth.uid() = user_id);
```

#### Library Downloads Policies
```sql
-- Library downloads policies
CREATE POLICY "Users can view own downloads" ON public.library_downloads
  FOR ALL USING (auth.uid() = user_id);
```

#### User Consents Policies
```sql
-- User consents policies
CREATE POLICY "Users can view own consents" ON public.user_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents" ON public.user_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Schema Migrations Policies
```sql
-- Schema migrations (read-only for users, write for service role)
CREATE POLICY "Anyone can view migrations" ON public.schema_migrations
  FOR SELECT USING (true);
```

### Step 5.2: Test RLS Policies

1. Go to **Table Editor** in your dashboard
2. Try to view data in each table
3. Verify that you can only see data for the authenticated user
4. Test with different user accounts if available

---

## 6. Cloudflare R2 Integration

### Step 6.1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Create bucket**
3. Name your bucket: `indigocosmo-avatars` (or `indigocosmo-prod-avatars` for production)
4. Choose your region (same as your Supabase region if possible)

### Step 6.2: Get R2 Credentials

1. In R2 dashboard, go to **Account** → **R2** → **Manage R2 API tokens**
2. Click **Create API token**
3. Set permissions:
   - **Object Read & Write**
   - **Bucket Read & Write**
4. Copy the credentials:
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

### Step 6.3: Configure CORS for R2

1. In R2 bucket settings, go to **CORS policy**
2. Add the following CORS configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://indigocosmo.club",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

### Step 6.4: Create Public Bucket (Optional)

For serving images publicly:

1. Create another bucket: `indigocosmo-public`
2. In bucket settings, enable **Public access**
3. Note the public URL format: `https://[account-id].r2.cloudflarestorage.com/[bucket-name]/`

---

## 7. Environment Variables

### Step 7.1: Create Environment File

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=indigocosmo-avatars
PUBLIC_R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com/indigocosmo-public

# Site Configuration
PUBLIC_SITE_URL=http://localhost:5173
PUBLIC_SITE_NAME=indigocosmo.club

# Optional: Analytics (for development)
VITE_ENABLE_ANALYTICS=false
```

### Step 7.2: Cloudflare Pages Environment Variables

When deploying to Cloudflare Pages, add these environment variables in the Pages dashboard:

1. Go to **Cloudflare Pages** → **Your project** → **Settings** → **Environment variables**
2. Add each variable from your `.env.local` file
3. Set environment: **Production**

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

### Step 7.3: Validate Environment Variables

Test that your environment variables are working:

1. Start your development server: `bun run dev`
2. Check browser console for any Supabase connection errors
3. Try to sign up a test user
4. Verify that the signup process works without errors

---

## 8. Testing Setup

### Step 8.1: Test Authentication

1. **Email Signup**:
   - Go to your signup page
   - Create a test account
   - Check that confirmation email is sent
   - Verify email and ensure login works

2. **Social Login**:
   - Test Google OAuth login
   - Test Telegram OAuth login
   - Verify user profiles are created correctly

3. **Password Reset**:
   - Request password reset
   - Check email delivery
   - Test password reset flow

### Step 8.2: Test Database Operations

1. **Profile Management**:
   - Update user profile
   - Upload avatar (if implemented)
   - Verify data persists

2. **RLS Security**:
   - Create multiple test users
   - Verify users can only access their own data
   - Test with different permission levels

### Step 8.3: Test R2 Integration

1. **File Upload**:
   - Try uploading an avatar image
   - Verify file appears in R2 bucket
   - Check that public URLs work

2. **File Access**:
   - Test file download links
   - Verify CORS settings work
   - Check file size limits

---

## 9. Troubleshooting

### Common Issues

#### Authentication Issues

**Problem**: OAuth login not working
**Solution**:
- Check that redirect URLs are correctly configured in OAuth providers
- Verify client IDs and secrets are correct
- Ensure site URL in Supabase matches your domain

**Problem**: Email not sending
**Solution**:
- Check Supabase dashboard for email delivery status
- Verify SMTP settings if using custom email
- Check spam folder

#### Database Issues

**Problem**: RLS policies blocking legitimate access
**Solution**:
- Review policy definitions in SQL editor
- Test policies with different user accounts
- Check that `auth.uid()` is being used correctly

**Problem**: Migration errors
**Solution**:
- Run migrations one at a time
- Check for syntax errors in SQL
- Verify table dependencies

#### R2 Integration Issues

**Problem**: File upload failing
**Solution**:
- Check R2 credentials are correct
- Verify CORS policy allows your domain
- Check file size limits (default 5MB for avatars)

**Problem**: Images not displaying
**Solution**:
- Ensure public bucket is configured correctly
- Check that URLs are properly formatted
- Verify bucket permissions

### Getting Help

1. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
2. **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
3. **Cloudflare Documentation**: [developers.cloudflare.com](https://developers.cloudflare.com)
4. **GitHub Issues**: Check existing issues in the project repository

### Debug Tools

1. **Supabase Dashboard**: Monitor database queries and auth logs
2. **Browser DevTools**: Check network requests and console errors
3. **Cloudflare Analytics**: Monitor R2 usage and errors
4. **Email Testing**: Use tools like MailHog for local email testing

---

## Next Steps

After completing this setup:

1. **Implement Authentication**: Set up auth pages and components in your SvelteKit app
2. **Create Database Queries**: Implement server-side functions for database operations
3. **Build User Interface**: Create profile management and course interfaces
4. **Test End-to-End**: Perform comprehensive testing of all features
5. **Deploy**: Set up production environment and deploy

---

## Security Checklist

- [ ] Supabase project created with strong database password
- [ ] Service role key stored securely (never in client code)
- [ ] OAuth credentials configured correctly
- [ ] RLS policies implemented and tested
- [ ] Email confirmations enabled for production
- [ ] Environment variables properly configured
- [ ] CORS settings correct for R2 buckets
- [ ] File upload size limits set appropriately

---

**Last Updated**: December 2025
**Supabase Version**: Latest
**Document Version**: 1.0