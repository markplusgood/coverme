# SEO & Analytics Strategy - cover.me

## Overview

This document outlines the comprehensive SEO and analytics strategy for the cover.me AI cover letter writer platform. It covers meta tags implementation, structured data schemas, sitemap generation, analytics tracking, conversion funnel monitoring, and A/B testing framework.

## SEO Implementation

### Meta Tags Strategy Per Page Type

#### 1. Landing Page (`/+page.svelte`)

**Primary Goal**: High conversion, brand awareness, career search terms

```typescript
// src/lib/utils/seo.ts
export function getLandingPageMeta() {
  return {
    title: 'Создайте Профессиональное Сопроводительное Письмо | cover.me',
    description: 'Генерируйте индивидуальные сопроводительные письма с помощью ИИ. Получите идеальное письмо для вашей работы за минуты.',
    keywords: 'сопроводительное письмо, резюме, поиск работы, карьера, ИИ генерация, профессиональное письмо, трудоустройство, карьерный рост',
    og: {
      title: 'Создайте Профессиональное Сопроводительное Письмо | cover.me',
      description: 'Генерируйте индивидуальные сопроводительные письма с помощью ИИ. Получите идеальное письмо для вашей работы за минуты.',
      image: '/images/og/landing-hero.jpg',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Создайте Профессиональное Сопроводительное Письмо | cover.me',
      description: 'Генерируйте индивидуальные сопроводительные письма с помощью ИИ. Получите идеальное письмо для вашей работы за минуты.',
      image: '/images/og/landing-hero.jpg'
    },
    canonical: 'https://cover.me'
  };
}
```

**Key Elements**:
- Title: 50-60 characters, includes primary keywords
- Description: 150-160 characters, compelling value proposition
- Keywords: Primary career terms, cover letter topics
- Open Graph: Optimized for social sharing
- Twitter Cards: Large image format for engagement

#### 2. Blog Post Pages (`/portal/blog/[slug]/+page.svelte`)

**Primary Goal**: Organic traffic from career content searches

```typescript
// Dynamic meta based on frontmatter
export function getBlogPostMeta(post: BlogPost) {
  const title = `${post.title} | Блог о Карьерном Развитии`;
  const description = post.excerpt || post.title;
  const keywords = post.tags?.join(', ') || 'карьерный блог, сопроводительные письма, поиск работы, карьерный рост';

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
      section: 'Карьерное Развитие',
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      image: post.coverImage
    },
    canonical: `https://cover.me/blog/${post.slug}`,
    article: {
      published_time: post.publishedAt,
      modified_time: post.updatedAt,
      author: post.author,
      section: 'Карьерное Развитие',
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

#### 3. Cover Letter Example Pages (`/app/examples/[slug]/+page.svelte`)

**Primary Goal**: Cover letter-specific SEO, career content ranking

```typescript
export function getExamplePageMeta(example: CoverLetterExample, job: Job) {
  const title = `${example.title} | ${job.title} - Пример Сопроводительного Письма`;
  const description = `Посмотрите пример ${example.title.toLowerCase()} для должности ${job.title}. ${example.keyPoints?.join('. ')}`;

  return {
    title: title.length > 60 ? `${example.title} | Пример` : title,
    description: description.length > 160 ? `${description.substring(0, 155)}...` : description,
    keywords: `сопроводительное письмо, ${job.title.toLowerCase()}, ${example.title.toLowerCase()}, карьера, поиск работы`,
    og: {
      title: example.title,
      description: example.keyPoints?.join('. '),
      image: `/images/examples/${job.slug}/example-${example.order}.jpg`,
      type: 'article',
      section: 'Примеры Сопроводительных Писем'
    },
    twitter: {
      card: 'summary_large_image',
      title: example.title,
      description: example.keyPoints?.join('. ')
    },
    canonical: `https://cover.me/cover-letter-examples/${example.slug}`,
    article: {
      section: job.title,
      tag: ['карьерное развитие', 'примеры писем']
    }
  };
}
```

#### 4. Auth Pages (`/auth/*`)

**Primary Goal**: Clear, accessible pages with minimal SEO focus

```typescript
export function getAuthPageMeta(page: 'login' | 'signup' | 'reset') {
  const titles = {
    login: 'Вход | cover.me',
    signup: 'Создать Аккаунт | cover.me',
    reset: 'Сброс Пароля | cover.me'
  };

  const descriptions = {
    login: 'Войдите, чтобы создать сопроводительные письма.',
    signup: 'Начните создавать профессиональные сопроводительные письма с помощью ИИ.',
    reset: 'Сбросьте пароль, чтобы продолжить работу.'
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
  "name": "cover.me",
  "url": "https://cover.me",
  "logo": "https://cover.me/images/logo.png",
  "description": "Платформа для создания профессиональных сопроводительных писем с помощью искусственного интеллекта.",
  "foundingDate": "2025",
  "sameAs": [
    "https://twitter.com/covermeai",
    "https://facebook.com/covermeai",
    "https://instagram.com/covermeai"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@cover.me",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  }
}
```

#### 2. Cover Letter Schema (Cover Letter Overview Pages)

```json
// For /app/examples pages
{
  "@context": "https://schema.org",
  "@type": "CoverLetter",
  "name": "Профессиональное Сопроводительное Письмо",
  "description": "Комплексный курс по развитию способностей ясновидения через структурированные уроки и практики.",
  "provider": {
    "@type": "Organization",
    "name": "cover.me"
  },
  "jobMode": "remote",
  "experienceLevel": "Entry to Senior",
  "inLanguage": "ru",
  "teaches": [
    "Создание профессиональных сопроводительных писем",
    "Оптимизация резюме для поиска работы",
    "Карьерное консультирование",
    "Подготовка к собеседованиям"
  ],
  "hasCoverLetterInstance": {
    "@type": "JobPosting",
    "jobMode": "remote",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "cover.me"
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
  "headline": "Как Написать Идеальное Сопроводительное Письмо: Руководство для Начинающих",
  "description": "Узнайте, как создать идеальное сопроводительное письмо для вашей работы...",
  "image": "https://cover.me/images/blog/cover-letter-tips.jpg",
  "datePublished": "2025-11-15T10:00:00Z",
  "dateModified": "2025-11-16T14:30:00Z",
  "inLanguage": "ru",
  "author": {
    "@type": "Person",
    "name": "Карьерный Эксперт",
    "url": "https://cover.me/authors/career-expert"
  },
  "publisher": {
    "@type": "Organization",
    "name": "cover.me",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cover.me/images/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://cover.me/blog/cover-letter-tips"
  },
  "articleSection": "Карьерное Развитие",
  "keywords": ["сопроводительное письмо", "поиск работы", "для начинающих", "карьера"]
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
      "item": "https://cover.me"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Примеры",
      "item": "https://cover.me/examples"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Цены",
      "item": "https://cover.me/pricing"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Как Создать Сопроводительное Письмо",
      "item": "https://cover.me/guide"
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
      "name": "Что такое сопроводительное письмо?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Сопроводительное письмо — это документ, который отправляется вместе с резюме и объясняет, почему вы подходите для конкретной должности."
      }
    },
    {
      "@type": "Question",
      "name": "Нужен ли мне предыдущий опыт для создания сопроводительного письма?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Никакого предварительного опыта не требуется. Наш ИИ поможет вам создать профессиональное сопроводительное письмо независимо от вашего уровня опыта."
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
import { getAllExamples } from '$lib/utils/example-loader';

export const GET: RequestHandler = async () => {
  const baseUrl = 'https://cover.me';

  // Static pages
  const staticPages = [
    '',
    '/app/examples',
    '/blog',
    '/auth/login',
    '/auth/signup'
  ];

  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts();
  const blogUrls = blogPosts.map(post =>
    `/blog/${post.slug}`
  );

  // Dynamic cover letter examples
  const examples = await getAllExamples();
  const exampleUrls = examples.map(example =>
    `/examples/${example.slug}`
  );

  // Combine all URLs
  const allUrls = [...staticPages, ...blogUrls, ...exampleUrls];

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
  if (url.includes('/examples/')) return 'weekly';
  if (url === '') return 'daily';
  return 'monthly';
}

function getPriority(url: string): string {
  if (url === '') return '1.0';
  if (url.includes('/examples/')) return '0.9';
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
├── sitemap-examples.xml
└── sitemap-library.xml
```

### robots.txt Configuration

**File**: `static/robots.txt`

```
User-agent: *
Allow: /

# Block auth pages from indexing
Disallow: /auth/
Disallow: /settings/
Disallow: /api/

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Sitemap location
Sitemap: https://cover.me/sitemap.xml
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
Allow: /blog/
Allow: /examples/

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

// Cover letter generation events
export const letterAnalytics = {
  generationStart: (jobTitle: string, jobId: string) => trackGA4Event('generation_start', {
    job_title: jobTitle,
    job_id: jobId,
    timestamp: new Date().toISOString()
  }),

  generationComplete: (letterId: string, jobTitle: string, tone: string) => trackGA4Event('generation_complete', {
    letter_id: letterId,
    job_title: jobTitle,
    tone: tone,
    completion_time: new Date().toISOString()
  }),

  exportComplete: (letterId: string, format: string) => trackGA4Event('export_complete', {
    letter_id: letterId,
    format: format,
    export_timestamp: new Date().toISOString()
  })
};

// E-commerce events (future)
export const ecommerceAnalytics = {
  checkoutInitiate: (planName: string, price: number) => trackGA4Event('begin_checkout', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: planName.toLowerCase().replace(/\s+/g, '_'),
      item_name: planName,
      price: price,
      quantity: 1,
      item_category: 'cover_letter_service'
    }]
  }),

  purchaseComplete: (transactionId: string, planName: string, revenue: number) => trackGA4Event('purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: revenue,
    tax: 0,
    shipping: 0,
    items: [{
      item_id: planName.toLowerCase().replace(/\s+/g, '_'),
      item_name: planName,
      price: revenue,
      quantity: 1,
      item_category: 'cover_letter_service'
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
    content_name: 'Account Signup',
    content_category: 'Cover Letter Service'
  }),

  generationStart: (jobTitle: string) => trackMetaEvent('Subscribe', {
    content_name: jobTitle,
    content_category: 'Cover Letter Service'
  }),

  purchase: (planName: string, value: number) => trackMetaEvent('Purchase', {
    content_name: planName,
    content_type: 'product',
    content_ids: [planName.toLowerCase().replace(/\s+/g, '_')],
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

  generationStart: (jobTitle: string) => trackTikTokEvent('Subscribe', {
    content_name: jobTitle,
    value: 0,
    currency: 'USD'
  }),

  purchase: (planName: string, value: number) => trackTikTokEvent('Subscribe', {
    content_name: planName,
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

**Awareness → Interest → Consideration → Generation → Retention**

```
1. Landing Page Visit
   ↓ (30% conversion target)
2. Email Signup
   ↓ (70% conversion target)
3. Email Verification
   ↓ (50% conversion target)
4. Letter Generation Start
   ↓ (40% conversion target)
  5. Letter Generation Complete (30% users)
   ↓ (20% conversion target)
6. Export/Download
   ↓ (60% conversion target)
7. Repeat Generation/Referral
```

#### 2. Micro-Funnels

**Blog Engagement Funnel**:
```
Blog Post View → Read Time > 3min → Social Share → Email Signup → Letter Generation
```

**Letter Generation Funnel**:
```
Generation Start → Preview → Edit → Export → Generation Complete
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
  { name: 'Generation Start', event: 'generation_start', conversionRate: 50 },
  { name: 'Generation Complete', event: 'generation_complete', conversionRate: 40 },
  { name: 'Export Complete', event: 'export_complete', conversionRate: 30 },
  { name: 'Repeat Generation', event: 'repeat_generation', conversionRate: 20 }
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
  letter_generation: number;
}

export function getUserCohort(user: User): UserCohort {
  return {
    signup_month: new Date(user.created_at).toISOString().slice(0, 7),
    acquisition_channel: user.acquisition_channel || 'organic',
    user_type: user.subscription_status || 'free',
    letter_generation: calculateGenerationCount(user.id)
  };
}

export function trackCohortMetrics(cohort: UserCohort, event: string, value?: any) {
  analytics.trackEvent('cohort_metric', {
    cohort_month: cohort.signup_month,
    acquisition_channel: cohort.acquisition_channel,
    user_type: cohort.user_type,
    letter_generation: cohort.letter_generation,
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
    <img src="/images/hero/control.jpg" alt="Professional cover letter generation" />
  {:else if heroVariant === 'variant_a'}
    <img src="/images/hero/variant-a.jpg" alt="AI-powered resume optimization" />
  {:else if heroVariant === 'variant_b'}
    <img src="/images/hero/variant-b.jpg" alt="Career development tools" />
  {/if}

  <!-- Dynamic headline -->
  {#if headlineVariant === 'control'}
    <h1>Create Professional Cover Letters with AI</h1>
  {:else if headlineVariant === 'variant_a'}
    <h1>Get Your Dream Job with Perfect Cover Letters</h1>
  {:else if headlineVariant === 'variant_b'}
    <h1>AI-Powered Career Documents in Minutes</h1>
  {/if}

  <!-- Dynamic CTA -->
  {#if ctaVariant === 'control'}
    <button on:click={handleCTAClick}>Generate Cover Letter</button>
  {:else if ctaVariant === 'variant_a'}
    <button on:click={handleCTAClick}>Create My Cover Letter</button>
  {:else if ctaVariant === 'variant_b'}
    <button on:click={handleCTAClick}>Get Started Free</button>
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
- Tertiary: Letter generation rate, export rate

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
PUBLIC_SITE_URL=https://cover.me

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
- Keyword rankings: Top 10 for primary career terms
- Page load speed: < 2.5s LCP
- Core Web Vitals: All green scores

### Analytics KPIs
- User acquisition cost: < $15 per signup
- Conversion rate: > 3% landing to signup
- Letter generation rate: > 25%
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

// Cover Letter Generation
posthog.capture('generation_started', {
  job_title: 'Software Engineer',
  job_id: 'job_001'
});

posthog.capture('generation_viewed', {
  letter_id: 'letter_001',
  job_title: 'Software Engineer',
  tone: 'professional',
  time_spent: 0 // Will be updated on exit
});

posthog.capture('generation_completed', {
  letter_id: 'letter_001',
  job_title: 'Software Engineer',
  completion_rate: 100,
  time_spent: 1200 // seconds
});

// Assignment Tracking
posthog.capture('assignment_started', {
  export_format: 'PDF',
  job_title: 'Software Engineer'
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
  post_title: 'How to Write a Perfect Cover Letter',
  reading_time: 5,
  scroll_depth: 85
});

// Payment & Conversion Events
posthog.capture('checkout_initiated', {
  plan_name: 'Premium Plan',
  plan_id: 'plan_001',
  price: 19.99,
  currency: 'USD',
  discount_code: null,
  cart_value: 99.00,
  items_count: 1,
  user_type: 'free',
  source: 'pricing_page'
});

posthog.capture('checkout_display', {
  checkout_type: 'subscription_purchase',
  plan_name: 'Premium Plan',
  price: 19.99,
  currency: 'USD',
  discount_applied: false,
  time_to_display: 1250 // ms from page load
});

posthog.capture('payment_init', {
  payment_method: 'stripe',
  amount: 99.00,
  currency: 'USD',
  plan_name: 'Premium Plan',
  discount_applied: false,
  cart_value: 99.00,
  user_type: 'free',
  session_duration: 180 // seconds on site before purchase
});

posthog.capture('payment_completed', {
  transaction_id: 'T_12345',
  plan_name: 'Premium Plan',
  plan_id: 'plan_001',
  revenue: 19.99,
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
  plan_name: 'Premium Plan',
  amount: 19.99,
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
  plan_name: 'Premium Plan',
  plan_id: 'plan_001',
  price: 19.99,
  currency: 'USD',
  category: 'cover_letter_service',
  source: 'landing_page'
});

posthog.capture('add_to_cart', {
  plan_name: 'Premium Plan',
  plan_id: 'plan_001',
  price: 19.99,
  currency: 'USD',
  quantity: 1,
  cart_value: 99.00
});

posthog.capture('checkout_step', {
  step: 'payment_details',
  plan_name: 'Premium Plan',
  cart_value: 19.99,
  currency: 'USD'
});

// Session & User Journey Events
posthog.capture('session_start', {
  session_id: 'sess_12345',
  referrer: 'https://google.com',
  landing_page: '/pricing',
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
- **Funnel Analysis**: Track conversion through signup → generation start → completion
- **Cohort Analysis**: Analyze user behavior by signup month/week
- **Retention Tracking**: Monitor user return patterns and engagement over time
- **A/B Test Integration**: Run experiments and measure impact on key metrics
- **User Segmentation**: Create segments based on behavior, demographics, generation activity
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