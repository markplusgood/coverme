# SEO & Analytics Strategy - indigocosmo.club

## Overview

This document outlines the comprehensive SEO and analytics strategy for the indigocosmo.club spiritual course platform. It covers meta tags implementation, structured data schemas, sitemap generation, analytics tracking, conversion funnel monitoring, and A/B testing framework.

## SEO Implementation

### Meta Tags Strategy Per Page Type

#### 1. Landing Page (`/+page.svelte`)

**Primary Goal**: High conversion, brand awareness, spiritual search terms

```typescript
// src/lib/utils/seo.ts
export function getLandingPageMeta() {
  return {
    title: 'Платформа Духовного Развития | Обучение Ясновидению и Астральным Путешествиям',
    description: 'Раскройте свой духовный потенциал с помощью структурированных курсов по ясновидению, астральным путешествиям и дальновидению. Присоединяйтесь к нашему сообществу искателей.',
    keywords: 'ясновидение, астральные путешествия, дальновидение, духовные курсы, третий глаз, медитация на чакры, духовное пробуждение, сакральная геометрия, золотое сечение',
    og: {
      title: 'Пробудите Свою Духовную Силу | indigocosmo.club',
      description: 'Трансформируйте свое сознание с помощью экспертных духовных курсов. Начните свой путь к мастерству ясновидения и астральных путешествий.',
      image: '/images/og/landing-hero.jpg',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Платформа Духовного Развития | Обучение Ясновидению и Астральным Путешествиям',
      description: 'Раскройте свой духовный потенциал с помощью структурированных курсов по ясновидению, астральным путешествиям и дальновидению.',
      image: '/images/og/landing-hero.jpg'
    },
    canonical: 'https://indigocosmo.club'
  };
}
```

**Key Elements**:
- Title: 50-60 characters, includes primary keywords
- Description: 150-160 characters, compelling value proposition
- Keywords: Primary spiritual terms, course topics
- Open Graph: Optimized for social sharing
- Twitter Cards: Large image format for engagement

#### 2. Blog Post Pages (`/portal/blog/[slug]/+page.svelte`)

**Primary Goal**: Organic traffic from spiritual content searches

```typescript
// Dynamic meta based on frontmatter
export function getBlogPostMeta(post: BlogPost) {
  const title = `${post.title} | Блог о Духовном Развитии`;
  const description = post.excerpt || post.title;
  const keywords = post.tags?.join(', ') || 'духовный блог, ясновидение, медитация, сакральная геометрия';

  return {
    title: title.length > 60 ? `${post.title.substring(0, 55)}... | Блог` : title,
    description: description.length > 160 ? `${description.substring(0, 155)}...` : description,
    keywords,
    og: {
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      type: 'article',
      published_time: post.publishedAt,
      modified_time: post.updatedAt,
      author: post.author,
      section: 'Духовное Образование',
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      image: post.coverImage
    },
    canonical: `https://indigocosmo.club/portal/blog/${post.slug}`,
    article: {
      published_time: post.publishedAt,
      modified_time: post.updatedAt,
      author: post.author,
      section: 'Духовное Образование',
      tag: post.tags
    }
  };
}
```

**Key Elements**:
- Title: Post title + site name
- Description: Excerpt or first paragraph
- Article-specific Open Graph tags
- Reading time in description
- Author information
- Publication dates

#### 3. Course Lesson Pages (`/portal/course/lessons/[slug]/+page.svelte`)

**Primary Goal**: Course-specific SEO, educational content ranking

```typescript
export function getLessonPageMeta(lesson: Lesson, course: Course) {
  const title = `${lesson.title} | ${course.title} - Духовный Курс`;
  const description = `Изучите ${lesson.title.toLowerCase()} в нашем полном курсе ${course.title}. ${lesson.objectives?.join('. ')}`;

  return {
    title: title.length > 60 ? `${lesson.title} | Курс` : title,
    description: description.length > 160 ? `${description.substring(0, 155)}...` : description,
    keywords: `духовный курс, ${course.title.toLowerCase()}, ${lesson.title.toLowerCase()}, ясновидение, астральные путешествия`,
    og: {
      title: lesson.title,
      description: lesson.objectives?.join('. '),
      image: `/images/courses/${course.slug}/lesson-${lesson.order}.jpg`,
      type: 'article',
      section: 'Содержание Курса'
    },
    twitter: {
      card: 'summary_large_image',
      title: lesson.title,
      description: lesson.objectives?.join('. ')
    },
    canonical: `https://indigocosmo.club/portal/course/lessons/${lesson.slug}`,
    article: {
      section: course.title,
      tag: ['духовное образование', 'содержание курса']
    }
  };
}
```

#### 4. Auth Pages (`/auth/*`)

**Primary Goal**: Clear, accessible pages with minimal SEO focus

```typescript
export function getAuthPageMeta(page: 'login' | 'signup' | 'reset') {
  const titles = {
    login: 'Вход | indigocosmo.club',
    signup: 'Присоединиться к Сообществу | indigocosmo.club',
    reset: 'Сброс Пароля | indigocosmo.club'
  };

  const descriptions = {
    login: 'Войдите, чтобы продолжить свое духовное обучение.',
    signup: 'Начните свой путь духовного пробуждения. Присоединяйтесь к нашему сообществу.',
    reset: 'Сбросьте пароль, чтобы продолжить обучение.'
  };

  return {
    title: titles[page],
    description: descriptions[page],
    robots: 'noindex, nofollow', // Prevent indexing of auth pages
    og: {
      title: titles[page],
      description: descriptions[page],
      type: 'website'
    }
  };
}
```

### Structured Data (JSON-LD) Schemas

#### 1. Organization Schema (Global)

```json
// src/lib/utils/seo.ts - Add to root layout
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "indigocosmo.club",
  "url": "https://indigocosmo.club",
  "logo": "https://indigocosmo.club/images/logo.png",
  "description": "Платформа духовных курсов, предлагающая структурированное обучение ясновидению, астральным путешествиям и дальновидению.",
  "foundingDate": "2025",
  "sameAs": [
    "https://twitter.com/indigocosmo",
    "https://facebook.com/indigocosmo",
    "https://instagram.com/indigocosmo"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@indigocosmo.club",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  }
}
```

#### 2. Course Schema (Course Overview Pages)

```json
// For /portal/course pages
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Полный Курс Ясновидения",
  "description": "Комплексный курс по развитию способностей ясновидения через структурированные уроки и практики.",
  "provider": {
    "@type": "Organization",
    "name": "indigocosmo.club"
  },
  "courseMode": "online",
  "educationalLevel": "Beginner to Advanced",
  "inLanguage": "ru",
  "teaches": [
    "Развитие ясновидения",
    "Активация третьего глаза",
    "Интуитивное восприятие",
    "Чувствование энергии"
  ],
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "instructor": {
      "@type": "Person",
      "name": "Инструктор Духовных Курсов"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "156"
  }
}
```

#### 3. Article Schema (Blog Posts)

```json
// For blog post pages
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Пробуждение Третьего Глаза: Руководство для Начинающих",
  "description": "Изучите базовые практики для открытия чакры третьего глаза...",
  "image": "https://indigocosmo.club/images/blog/third-eye-cover.jpg",
  "datePublished": "2025-11-15T10:00:00Z",
  "dateModified": "2025-11-16T14:30:00Z",
  "inLanguage": "ru",
  "author": {
    "@type": "Person",
    "name": "Инструктор Курса",
    "url": "https://indigocosmo.club/authors/instructor"
  },
  "publisher": {
    "@type": "Organization",
    "name": "indigocosmo.club",
    "logo": {
      "@type": "ImageObject",
      "url": "https://indigocosmo.club/images/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://indigocosmo.club/portal/blog/awakening-third-eye-guide"
  },
  "articleSection": "Духовное Образование",
  "keywords": ["ясновидение", "чакры", "для начинающих", "третий глаз"]
}
```

#### 4. Breadcrumb Schema

```json
// For navigation pages
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://indigocosmo.club"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Курс",
      "item": "https://indigocosmo.club/portal/course"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Уроки",
      "item": "https://indigocosmo.club/portal/course/lessons"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Введение в Ясновидение",
      "item": "https://indigocosmo.club/portal/course/lessons/intro-to-clairvoyance"
    }
  ]
}
```

#### 5. FAQ Schema (Landing Page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Что такое ясновидение?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ясновидение — это способность воспринимать информацию за пределами обычного чувственного контакта, часто называемая «ясным видением» или интуитивным восприятием."
      }
    },
    {
      "@type": "Question",
      "name": "Нужен ли мне предыдущий опыт?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Никакого предварительного опыта не требуется. Наши курсы разработаны для начинающих и включают базовые практики и медитации."
      }
    }
  ]
}
```

### Sitemap Generation Approach

#### 1. Static Sitemap Generation

**File**: `src/routes/sitemap.xml/+server.ts`

```typescript
import type { RequestHandler } from './$types';
import { getAllBlogPosts } from '$lib/utils/content';
import { getAllLessons } from '$lib/utils/course-loader';

export const GET: RequestHandler = async () => {
  const baseUrl = 'https://indigocosmo.club';

  // Static pages
  const staticPages = [
    '',
    '/portal/course',
    '/portal/blog',
    '/auth/login',
    '/auth/signup'
  ];

  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts();
  const blogUrls = blogPosts.map(post =>
    `/portal/blog/${post.slug}`
  );

  // Dynamic course lessons
  const lessons = await getAllLessons();
  const lessonUrls = lessons.map(lesson =>
    `/portal/course/lessons/${lesson.slug}`
  );

  // Combine all URLs
  const allUrls = [...staticPages, ...blogUrls, ...lessonUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${getChangeFrequency(url)}</changefreq>
    <priority>${getPriority(url)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

function getChangeFrequency(url: string): string {
  if (url.includes('/blog/')) return 'monthly';
  if (url.includes('/course/lessons/')) return 'weekly';
  if (url === '') return 'daily';
  return 'monthly';
}

function getPriority(url: string): string {
  if (url === '') return '1.0';
  if (url.includes('/course/')) return '0.9';
  if (url.includes('/blog/')) return '0.8';
  return '0.5';
}
```

#### 2. Dynamic Sitemap Updates

**Integration with Content Management**:
- Sitemap regenerates on content updates
- Uses build-time generation for static content
- Server-side generation for dynamic content
- Cached for performance (1-hour cache)

#### 3. Sitemap Index (Future Scaling)

For larger sites, create a sitemap index:
```
sitemap-index.xml
├── sitemap-static.xml
├── sitemap-blog.xml
├── sitemap-courses.xml
└── sitemap-library.xml
```

### robots.txt Configuration

**File**: `static/robots.txt`

```
User-agent: *
Allow: /

# Block auth pages from indexing
Disallow: /auth/
Disallow: /portal/settings/
Disallow: /api/

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Sitemap location
Sitemap: https://indigocosmo.club/sitemap.xml
```

**Advanced robots.txt for SEO**:
```
# Allow crawling but limit crawl rate for development
User-agent: *
Crawl-delay: 1

# Block duplicate content
Disallow: /*?*
Disallow: /*sort=*
Disallow: /*filter=*

# Allow important directories
Allow: /images/
Allow: /portal/blog/
Allow: /portal/course/

# Block admin areas
Disallow: /admin/
Disallow: /api/private/

# Specific rules for images
User-agent: Googlebot-Image
Allow: /images/
```

## Analytics Implementation

### Analytics Events Tracking Plan

#### 1. Cloudflare Web Analytics

**Purpose**: Privacy-friendly, lightweight analytics

**Setup**:
```html
<!-- Add to app.html -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "your-cloudflare-token"}'></script>
```

**Automatic Tracking**:
- Page views
- Visitor analytics
- Performance metrics
- No cookies required

#### 2. Google Analytics 4 (GA4)

**Расширенные события электронной коммерции**:

```typescript
// src/lib/analytics/google-analytics.ts
import { dev } from '$app/environment';
import { supabase } from '$lib/server/supabase'; // Assuming we can access supabase client

let initialized = false;

export async function initGoogleAnalytics() {
  if (initialized || dev) return;
  if (typeof window === 'undefined') return;

  // GDPR Check: Only initialize if 'cookies_analytics' consent is given
  const { data: consent } = await supabase
    .from('user_consents')
    .select('consent_given')
    .eq('consent_type', 'cookies_analytics')
    .eq('user_id', supabase.auth.user()?.id) // Pseudo-code for getting current user
    .single();

  if (!consent?.consent_given) {
    console.log('GA4 initialization blocked due to missing consent');
    return;
  }

  const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) { window.dataLayer.push(args); }

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false // Manual page view tracking
  });

  initialized = true;
}

export function trackGA4Event(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (!initialized || dev) return;
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, parameters);
}

export function trackPageView(url: string, title?: string) {
  trackGA4Event('page_view', {
    page_title: title || document.title,
    page_location: url
  });
}

// Course-specific events
export const courseAnalytics = {
  courseStart: (courseName: string, courseId: string) => trackGA4Event('course_start', {
    course_name: courseName,
    course_id: courseId,
    timestamp: new Date().toISOString()
  }),

  lessonComplete: (lessonName: string, courseName: string, progress: number) => trackGA4Event('lesson_complete', {
    lesson_name: lessonName,
    course_name: courseName,
    progress_percentage: progress,
    completion_time: new Date().toISOString()
  }),

  assignmentSubmit: (assignmentName: string, courseName: string) => trackGA4Event('assignment_submit', {
    assignment_name: assignmentName,
    course_name: courseName,
    submission_timestamp: new Date().toISOString()
  })
};

// E-commerce events (future)
export const ecommerceAnalytics = {
  checkoutInitiate: (courseName: string, price: number) => trackGA4Event('begin_checkout', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: courseName.toLowerCase().replace(/\s+/g, '_'),
      item_name: courseName,
      price: price,
      quantity: 1,
      item_category: 'spiritual_course'
    }]
  }),

  purchaseComplete: (transactionId: string, courseName: string, revenue: number) => trackGA4Event('purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: revenue,
    tax: 0,
    shipping: 0,
    items: [{
      item_id: courseName.toLowerCase().replace(/\s+/g, '_'),
      item_name: courseName,
      price: revenue,
      quantity: 1,
      item_category: 'spiritual_course'
    }]
  })
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
```

#### 3. Meta Pixel (Facebook)

**Отслеживание конверсий**:

```typescript
// src/lib/analytics/meta-pixel.ts
import { dev } from '$app/environment';
import { supabase } from '$lib/server/supabase';

let initialized = false;

export async function initMetaPixel() {
  if (initialized || dev) return;
  if (typeof window === 'undefined') return;

  // GDPR Check: Only initialize if 'cookies_marketing' consent is given
  const { data: consent } = await supabase
    .from('user_consents')
    .select('consent_given')
    .eq('consent_type', 'cookies_marketing')
    .eq('user_id', supabase.auth.user()?.id)
    .single();

  if (!consent?.consent_given) {
    console.log('Meta Pixel initialization blocked due to missing consent');
    return;
  }

  const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID;
  if (!pixelId) return;

  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(
    window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');

  initialized = true;
}

export function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (!initialized || dev) return;
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', eventName, parameters);
}

export const metaAnalytics = {
  signup: () => trackMetaEvent('Lead', {
    content_name: 'Course Signup',
    content_category: 'Spiritual Learning'
  }),

  courseStart: (courseName: string) => trackMetaEvent('Subscribe', {
    content_name: courseName,
    content_category: 'Spiritual Course'
  }),

  purchase: (courseName: string, value: number) => trackMetaEvent('Purchase', {
    content_name: courseName,
    content_type: 'product',
    content_ids: [courseName.toLowerCase().replace(/\s+/g, '_')],
    value: value,
    currency: 'USD'
  })
};

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}
```

#### 4. TikTok Pixel

**События для формирования аудитории**:

```typescript
// src/lib/analytics/tiktok-pixel.ts
import { dev } from '$app/environment';
import { supabase } from '$lib/server/supabase';

let initialized = false;

export async function initTikTokPixel() {
  if (initialized || dev) return;
  if (typeof window === 'undefined') return;

  // GDPR Check: Only initialize if 'cookies_marketing' consent is given
  const { data: consent } = await supabase
    .from('user_consents')
    .select('consent_given')
    .eq('consent_type', 'cookies_marketing')
    .eq('user_id', supabase.auth.user()?.id)
    .single();

  if (!consent?.consent_given) {
    console.log('TikTok Pixel initialization blocked due to missing consent');
    return;
  }

  const pixelId = import.meta.env.PUBLIC_TIKTOK_PIXEL_ID;
  if (!pixelId) return;

  (function(w: any, d: any, t: any) {
    w.TikTokAnalyticsObject = t;
    const ttq = w[t] = w[t] || [];
    ttq.methods = [
      'page', 'track', 'identify', 'instances', 'debug', 'on', 'off',
      'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'
    ];
    ttq.setAndDefer = function(t: any, e: any) {
      t[e] = function() { t[e] = function() { return ttq.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
    };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function(t: any) {
      const e = ttq._i[t] || [];
      for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function(e: any, n: any) {
      const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const o = document.createElement('script');
      o.type = 'text/javascript';
      o.async = true;
      o.src = i + '?sdkid=' + e + '&lib=' + t;
      const a = document.getElementsByTagName('script')[0];
      a.parentNode!.insertBefore(o, a);
    };

    ttq.load(pixelId);
    ttq.page();
  })(window, document, 'ttq');

  initialized = true;
}

export function trackTikTokEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (!initialized || dev) return;
  if (typeof window === 'undefined' || !window.ttq) return;

  window.ttq.track(eventName, parameters);
}

export const tiktokAnalytics = {
  signup: () => trackTikTokEvent('CompleteRegistration', {
    content_name: 'Email Signup',
    value: 0,
    currency: 'USD'
  }),

  courseStart: (courseName: string) => trackTikTokEvent('Subscribe', {
    content_name: courseName,
    value: 0,
    currency: 'USD'
  }),

  purchase: (courseName: string, value: number) => trackTikTokEvent('Subscribe', {
    content_name: courseName,
    value: value,
    currency: 'USD',
    transaction_id: `TT_${Date.now()}`
  })
};

declare global {
  interface Window {
    ttq: any;
    TikTokAnalyticsObject: string;
  }
}
```

### Conversion Funnel Tracking

#### 1. Primary Conversion Funnel

**Awareness → Interest → Consideration → Purchase → Retention**

```
1. Landing Page Visit
   ↓ (30% conversion target)
2. Email Signup
   ↓ (70% conversion target)
3. Email Verification
   ↓ (50% conversion target)
4. Course Start (First Lesson)
   ↓ (40% conversion target)
5. Course Completion (30% lessons)
   ↓ (20% conversion target)
6. Advanced Course Purchase
   ↓ (60% conversion target)
7. Repeat Purchase/Referral
```

#### 2. Micro-Funnels

**Blog Engagement Funnel**:
```
Blog Post View → Read Time > 3min → Social Share → Email Signup → Course Start
```

**Course Engagement Funnel**:
```
Lesson View → Mark Complete → Assignment Submit → Next Lesson → Course Completion
```

#### 3. Funnel Analytics Implementation

```typescript
// src/lib/analytics/funnel.ts
export interface FunnelStep {
  name: string;
  event: string;
  conversionRate?: number;
}

export const primaryFunnel: FunnelStep[] = [
  { name: 'Landing Page Visit', event: 'page_view', conversionRate: 100 },
  { name: 'Email Signup', event: 'sign_up', conversionRate: 30 },
  { name: 'Email Verification', event: 'email_verified', conversionRate: 70 },
  { name: 'Course Start', event: 'course_start', conversionRate: 50 },
  { name: 'Lesson Completion', event: 'lesson_complete', conversionRate: 40 },
  { name: 'Course Completion', event: 'course_complete', conversionRate: 30 },
  { name: 'Repeat Purchase', event: 'purchase', conversionRate: 20 }
];

export function trackFunnelProgress(stepName: string, userId: string, metadata?: any) {
  // Track in all analytics platforms
  const step = primaryFunnel.find(s => s.name === stepName);
  if (!step) return;

  analytics.trackEvent(step.event, {
    funnel_step: stepName,
    user_id: userId,
    ...metadata
  });
}

// Funnel abandonment tracking
export function trackFunnelAbandonment(
  abandonedAt: string,
  startedAt: string,
  userId: string,
  reason?: string
) {
  analytics.trackEvent('funnel_abandonment', {
    abandoned_step: abandonedAt,
    started_step: startedAt,
    user_id: userId,
    time_spent: Date.now() - new Date(startedAt).getTime(),
    reason: reason || 'unknown'
  });
}
```

#### 4. Cohort Analysis Setup

**User Segmentation**:
```typescript
// src/lib/analytics/cohorts.ts
export interface UserCohort {
  signup_month: string;
  acquisition_channel: string;
  user_type: 'free' | 'premium';
  course_progress: number;
}

export function getUserCohort(user: User): UserCohort {
  return {
    signup_month: new Date(user.created_at).toISOString().slice(0, 7),
    acquisition_channel: user.acquisition_channel || 'organic',
    user_type: user.subscription_status || 'free',
    course_progress: calculateProgress(user.id)
  };
}

export function trackCohortMetrics(cohort: UserCohort, event: string, value?: any) {
  analytics.trackEvent('cohort_metric', {
    cohort_month: cohort.signup_month,
    acquisition_channel: cohort.acquisition_channel,
    user_type: cohort.user_type,
    course_progress: cohort.course_progress,
    event_name: event,
    event_value: value
  });
}
```

### A/B Testing Implementation

#### 1. A/B Testing Framework

**Reference**: See `devdocs/ab-tests` for testing priorities

**Implementation**: `src/lib/analytics/ab-testing.ts`

```typescript
// src/lib/analytics/ab-testing.ts
import { dev } from '$app/environment';

export interface ABTest {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
  audience?: string; // percentage of users
}

export interface TestResult {
  testId: string;
  variant: string;
  userId: string;
  event: string;
  value?: any;
  timestamp: string;
}

class ABTesting {
  private tests: Map<string, ABTest> = new Map();
  private userVariants: Map<string, Map<string, string>> = new Map();

  registerTest(test: ABTest) {
    this.tests.set(test.id, test);
  }

  getVariant(testId: string, userId: string): string {
    if (dev) return 'control'; // Always show control in development

    const test = this.tests.get(testId);
    if (!test) return 'control';

    // Check if user already assigned to variant
    const userTests = this.userVariants.get(userId) || new Map();
    if (userTests.has(testId)) {
      return userTests.get(testId)!;
    }

    // Assign variant based on weights
    const variant = this.assignVariant(test, userId);
    userTests.set(testId, variant);
    this.userVariants.set(userId, userTests);

    // Track assignment
    analytics.trackEvent('ab_test_assignment', {
      test_id: testId,
      test_name: test.name,
      variant: variant,
      user_id: userId
    });

    return variant;
  }

  private assignVariant(test: ABTest, userId: string): string {
    // Simple hash-based assignment for consistency
    const hash = this.simpleHash(userId + test.id);
    const random = Math.abs(hash) % 100;

    let cumulativeWeight = 0;
    const weights = test.weights || test.variants.map(() => 100 / test.variants.length);

    for (let i = 0; i < test.variants.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        return test.variants[i];
      }
    }

    return test.variants[0]; // fallback
  }

  trackConversion(testId: string, userId: string, event: string, value?: any) {
    const variant = this.getVariant(testId, userId);

    analytics.trackEvent('ab_test_conversion', {
      test_id: testId,
      test_name: this.tests.get(testId)?.name,
      variant: variant,
      user_id: userId,
      conversion_event: event,
      conversion_value: value,
      timestamp: new Date().toISOString()
    });
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}

export const abTesting = new ABTesting();

// Pre-configured tests
abTesting.registerTest({
  id: 'hero_image_test',
  name: 'Hero Image Variations',
  variants: ['control', 'variant_a', 'variant_b'],
  weights: [33, 33, 34]
});

abTesting.registerTest({
  id: 'cta_text_test',
  name: 'CTA Button Text',
  variants: ['control', 'variant_a', 'variant_b'],
  weights: [50, 25, 25]
});

abTesting.registerTest({
  id: 'value_prop_test',
  name: 'Value Proposition Headlines',
  variants: ['control', 'variant_a', 'variant_b'],
  weights: [40, 30, 30]
});
```

#### 2. Component Integration

**Hero Component with A/B Testing**:

```svelte
<!-- src/lib/components/landing/Hero.svelte -->
<script lang="ts">
  import { abTesting } from '$lib/analytics/ab-testing';
  import { page } from '$app/stores';

  // Get user ID from store/session
  $: userId = getUserId();
  $: heroVariant = abTesting.getVariant('hero_image_test', userId);
  $: ctaVariant = abTesting.getVariant('cta_text_test', userId);
  $: headlineVariant = abTesting.getVariant('value_prop_test', userId);

  function handleCTAClick() {
    // Track conversion
    abTesting.trackConversion('cta_text_test', userId, 'cta_click');
    abTesting.trackConversion('hero_image_test', userId, 'cta_click');
    abTesting.trackConversion('value_prop_test', userId, 'cta_click');

    // Navigate to signup
    goto('/auth/signup');
  }
</script>

<section class="hero-section">
  <!-- Dynamic hero image based on test variant -->
  {#if heroVariant === 'control'}
    <img src="/images/hero/control.jpg" alt="Spiritual awakening" />
  {:else if heroVariant === 'variant_a'}
    <img src="/images/hero/variant-a.jpg" alt="Meditating woman" />
  {:else if heroVariant === 'variant_b'}
    <img src="/images/hero/variant-b.jpg" alt="Crystal energy" />
  {/if}

  <!-- Dynamic headline -->
  {#if headlineVariant === 'control'}
    <h1>Awaken Your Spiritual Power</h1>
  {:else if headlineVariant === 'variant_a'}
    <h1>Discover Your Clairvoyant Abilities</h1>
  {:else if headlineVariant === 'variant_b'}
    <h1>Master Astral Travel & Remote Viewing</h1>
  {/if}

  <!-- Dynamic CTA -->
  {#if ctaVariant === 'control'}
    <button on:click={handleCTAClick}>Start Your Journey</button>
  {:else if ctaVariant === 'variant_a'}
    <button on:click={handleCTAClick}>Begin Free Course</button>
  {:else if ctaVariant === 'variant_b'}
    <button on:click={handleCTAClick}>Unlock Your Third Eye</button>
  {/if}
</section>
```

#### 3. Test Analysis & Reporting

**Statistical Significance Calculator**:

```typescript
// src/lib/analytics/ab-analysis.ts
export interface ABTestResults {
  testId: string;
  control: {
    visitors: number;
    conversions: number;
    conversionRate: number;
  };
  variants: Array<{
    name: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    improvement: number;
    confidence: number;
  }>;
  winner?: string;
  significance: boolean;
}

export function analyzeABTest(testId: string): ABTestResults {
  // Fetch data from analytics database
  const data = fetchTestData(testId);

  const control = calculateMetrics(data.control);
  const variants = data.variants.map(variant => {
    const metrics = calculateMetrics(variant);
    const improvement = ((metrics.conversionRate - control.conversionRate) / control.conversionRate) * 100;
    const confidence = calculateConfidence(control, metrics);

    return {
      ...variant,
      ...metrics,
      improvement,
      confidence
    };
  });

  const winner = variants.find(v => v.confidence > 95 && v.improvement > 0)?.name;
  const significance = variants.some(v => v.confidence > 95);

  return {
    testId,
    control,
    variants,
    winner,
    significance
  };
}

function calculateMetrics(data: { visitors: number; conversions: number }) {
  return {
    visitors: data.visitors,
    conversions: data.conversions,
    conversionRate: (data.conversions / data.visitors) * 100
  };
}

function calculateConfidence(control: any, variant: any): number {
  // Simplified chi-square test for proportions
  // In production, use proper statistical libraries
  const p1 = control.conversionRate / 100;
  const p2 = variant.conversionRate / 100;
  const n1 = control.visitors;
  const n2 = variant.visitors;

  if (n1 === 0 || n2 === 0) return 0;

  const p = (control.conversions + variant.conversions) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
  const z = Math.abs(p2 - p1) / se;

  // Convert z-score to confidence percentage
  return Math.min(99.9, (1 - 2 * (1 - normalCDF(z))) * 100);
}

function normalCDF(x: number): number {
  // Approximation of normal cumulative distribution function
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}
```

#### 4. A/B Testing Best Practices

**Test Prioritization**:
1. **High Impact**: Hero section, CTA buttons, value propositions
2. **Medium Impact**: Headlines, trust signals, testimonials
3. **Low Impact**: Colors, fonts, minor copy changes

**Test Duration**:
- Minimum 2 weeks for statistical significance
- Continue until 95% confidence level
- Monitor for external factors (holidays, marketing campaigns)

**Success Metrics**:
- Primary: Conversion rate to signup
- Secondary: Time on page, bounce rate, social shares
- Tertiary: Course start rate, completion rate

**Implementation Checklist**:
- [ ] Define clear hypothesis for each test
- [ ] Ensure proper randomization
- [ ] Track user experience consistency
- [ ] Monitor for technical issues
- [ ] Document results and learnings
- [ ] Implement winning variants
- [ ] Plan follow-up tests based on insights

---

## Implementation Checklist

### SEO Setup
- [ ] Meta tags implemented per page type
- [ ] Structured data schemas added
- [ ] Sitemap generation configured
- [ ] robots.txt optimized
- [ ] Canonical URLs set
- [ ] Open Graph and Twitter cards configured

### Analytics Setup
- [ ] Google Analytics 4 configured
- [ ] Meta Pixel implemented
- [ ] TikTok Pixel added
- [ ] Cloudflare Analytics enabled
- [ ] Privacy consent banner implemented
- [ ] Event tracking configured
- [ ] Conversion funnels defined

### A/B Testing
- [ ] Testing framework implemented
- [ ] Key tests identified and configured
- [ ] Statistical analysis tools ready
- [ ] Test monitoring dashboard set up

### Monitoring & Reporting
- [ ] Key metrics dashboards created
- [ ] Alert system for anomalies
- [ ] Regular reporting schedule
- [ ] Data export capabilities

---

## Environment Variables

Add to `.env`:

```env
# SEO
PUBLIC_SITE_URL=https://indigocosmo.club

# Analytics
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=123456789012345
PUBLIC_TIKTOK_PIXEL_ID=ABCDEFGHIJKLMNO
PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your-token

# A/B Testing
PUBLIC_AB_TESTING_ENABLED=true
```

---

## Success Metrics

### SEO KPIs
- Organic search traffic growth: 40% month-over-month
- Keyword rankings: Top 10 for primary spiritual terms
- Page load speed: < 2.5s LCP
- Core Web Vitals: All green scores

### Analytics KPIs
- User acquisition cost: < $15 per signup
- Conversion rate: > 3% landing to signup
- Course completion rate: > 25%
- User retention: > 60% at day 30

### A/B Testing KPIs
- Test velocity: 2-3 tests running simultaneously
- Statistical significance: > 95% confidence on results
- Implementation rate: > 80% winning variants deployed
- Learning velocity: New insights weekly

---

## Maintenance & Optimization

### Monthly SEO Tasks
- Keyword performance review
- Content gap analysis
- Technical SEO audit
- Backlink profile monitoring

### Weekly Analytics Tasks
- Conversion funnel analysis
- A/B test results review
- Traffic quality assessment
- Error rate monitoring

### Quarterly Optimization
- Algorithm update adaptation
- Competitive analysis
- User experience testing
- Technology stack evaluation

---

## PostHog Implementation

### Event Tracking

```javascript
// Page Views (automatic with PostHog)
posthog.capture('$pageview', {
  $current_url: window.location.href
});

// User Onboarding
posthog.capture('user_signed_up', {
  method: 'email',
  source: 'landing_page'
});

posthog.capture('user_verified_email', {
  time_to_verify: '2 minutes'
});

// Course Engagement
posthog.capture('course_started', {
  course_name: 'Clairvoyance Course',
  course_id: 'course_001'
});

posthog.capture('lesson_viewed', {
  lesson_name: 'Introduction to Clairvoyance',
  course: 'Course 1',
  lesson_number: 1,
  time_spent: 0 // Will be updated on exit
});

posthog.capture('lesson_completed', {
  lesson_name: 'Introduction to Clairvoyance',
  course: 'Course 1',
  completion_rate: 100,
  time_spent: 1200 // seconds
});

// Assignment Tracking
posthog.capture('assignment_started', {
  assignment_name: 'Dream Journal Week 1',
  course: 'Course 1'
});

posthog.capture('assignment_submitted', {
  assignment_name: 'Dream Journal Week 1',
  word_count: 850,
  time_to_complete: '3 days'
});

// Feature Usage
posthog.capture('library_download', {
  resource_name: 'Clairvoyance Workbook',
  resource_type: 'pdf',
  file_size: '2.3MB'
});

posthog.capture('blog_post_read', {
  post_title: 'Awakening Your Third Eye',
  reading_time: 5,
  scroll_depth: 85
});

// Payment & Conversion Events
posthog.capture('checkout_initiated', {
  course_name: 'Clairvoyance Course',
  course_id: 'course_001',
  price: 99.00,
  currency: 'USD',
  discount_code: null,
  cart_value: 99.00,
  items_count: 1,
  user_type: 'free',
  source: 'course_page'
});

posthog.capture('checkout_display', {
  checkout_type: 'course_purchase',
  course_name: 'Clairvoyance Course',
  price: 99.00,
  currency: 'USD',
  discount_applied: false,
  time_to_display: 1250 // ms from page load
});

posthog.capture('payment_init', {
  payment_method: 'stripe',
  amount: 99.00,
  currency: 'USD',
  course_name: 'Clairvoyance Course',
  discount_applied: false,
  cart_value: 99.00,
  user_type: 'free',
  session_duration: 180 // seconds on site before purchase
});

posthog.capture('payment_completed', {
  transaction_id: 'T_12345',
  course_name: 'Clairvoyance Course',
  course_id: 'course_001',
  revenue: 99.00,
  currency: 'USD',
  payment_method: 'stripe',
  payment_processor: 'stripe',
  processing_time: 2100, // ms
  user_cohort: '2025-01',
  discount_applied: false,
  tax_amount: 0,
  net_revenue: 99.00,
  subscription_type: 'one_time'
});

posthog.capture('payment_failed', {
  transaction_id: 'T_12345_failed',
  course_name: 'Clairvoyance Course',
  amount: 99.00,
  currency: 'USD',
  payment_method: 'stripe',
  failure_reason: 'card_declined',
  failure_code: 'card_declined',
  processing_time: 1800, // ms
  retry_attempt: 1,
  user_cohort: '2025-01'
});

// Enhanced E-commerce Events
posthog.capture('product_view', {
  course_name: 'Clairvoyance Course',
  course_id: 'course_001',
  price: 99.00,
  currency: 'USD',
  category: 'spiritual_course',
  source: 'landing_page'
});

posthog.capture('add_to_cart', {
  course_name: 'Clairvoyance Course',
  course_id: 'course_001',
  price: 99.00,
  currency: 'USD',
  quantity: 1,
  cart_value: 99.00
});

posthog.capture('checkout_step', {
  step: 'payment_details',
  course_name: 'Clairvoyance Course',
  cart_value: 99.00,
  currency: 'USD'
});

// Session & User Journey Events
posthog.capture('session_start', {
  session_id: 'sess_12345',
  referrer: 'https://google.com',
  landing_page: '/course/clairvoyance',
  user_agent: 'Mozilla/5.0...',
  screen_resolution: '1920x1080',
  timezone: 'America/New_York',
  user_type: 'anonymous'
});

posthog.capture('form_interaction', {
  form_type: 'checkout_form',
  field: 'email',
  action: 'focus',
  time_spent: 0
});

posthog.capture('checkout_abandon', {
  abandon_step: 'payment_details',
  time_spent: 45, // seconds
  cart_value: 99.00,
  reason: 'user_closed'
});
```

### Advanced Analytics Features
- **Funnel Analysis**: Track conversion through signup → course start → completion
- **Cohort Analysis**: Analyze user behavior by signup month/week
- **Retention Tracking**: Monitor user return patterns and engagement over time
- **A/B Test Integration**: Run experiments and measure impact on key metrics
- **User Segmentation**: Create segments based on behavior, demographics, course progress
- **Path Analysis**: Understand user navigation patterns through the platform

### Dashboard Setup
- Create custom dashboards for key metrics
- Set up alerts for important events (high error rates, conversion drops)
- Configure user property tracking for segmentation
- Enable feature flags for gradual rollouts

---

## Resources & Tools

### SEO Tools
- Google Search Console
- Google Analytics
- SEMrush/Ahrefs
- Screaming Frog
- Schema Markup Validator

### Analytics Tools
- Google Analytics 4
- Meta Ads Manager
- TikTok Ads Manager
- PostHog
- Mixpanel

### A/B Testing Tools
- Google Optimize
- Optimizely
- VWO
- Custom implementation

### Monitoring Tools
- Sentry (error tracking)
- Cloudflare Analytics
- Google PageSpeed Insights
- WebPageTest

---

*This document should be updated quarterly to reflect new SEO best practices, analytics insights, and testing results.*