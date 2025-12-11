# Error Handling & Monitoring Documentation

## Overview

This document provides comprehensive error handling and monitoring guidelines for the cover.me AI cover letter writer platform. It consolidates error management strategies, monitoring setup, and best practices to ensure robust error tracking, user-friendly error experiences, and proactive issue resolution.

**Platform Stack**:
- **Frontend**: SvelteKit + TypeScript
- **Deployment**: Cloudflare Pages
- **Database**: Supabase (PostgreSQL)
- **Error Tracking**: Sentry (5k errors/month free tier)
- **Analytics**: Cloudflare Analytics, PostHog
- **User Language**: Russian (all user-facing content)

**Monitoring Services**:
- Sentry for error tracking and crash reporting
- Cloudflare Analytics for performance metrics and Real User Monitoring (RUM)
- Supabase Dashboard for backend monitoring
- PostHog for user behavior analytics

---

## Table of Contents

1. [Error Logging Strategy](#error-logging-strategy)
2. [User-Facing Error Messages](#user-facing-error-messages)
3. [Error Recovery Patterns](#error-recovery-patterns)
4. [Monitoring and Alerting Setup](#monitoring-and-alerting-setup)
5. [Performance Monitoring](#performance-monitoring)

---

## Error Logging Strategy

### Sentry Integration

**Purpose**: Centralized error tracking for frontend and backend errors with context, stack traces, and user information.

**Free Tier Limits**: 5,000 errors/month

#### Installation

```bash
# Install Sentry SDK
bun add @sentry/sveltekit
```

#### Configuration

**File**: `src/hooks.client.ts`

```typescript
// Client-side Sentry initialization
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';

if (!dev) {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.MODE, // 'production' or 'preview'
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Session replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0,  // 100% of sessions with errors
    
    // Privacy settings
    beforeSend(event, hint) {
      // Don't send errors in development
      if (dev) return null;
      
      // Sanitize sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      return event;
    },
    
    // Ignore known third-party errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Add other known benign errors
    ],
    
    // Tag errors with user context
    initialScope: {
      tags: {
        platform: 'web'
      }
    }
  });
}

export const handleError = Sentry.handleErrorWithSentry();
```

**File**: `src/hooks.server.ts`

```typescript
// Server-side Sentry initialization
import * as Sentry from '@sentry/sveltekit';
import { dev } from '$app/environment';
import type { HandleServerError } from '@sveltejs/kit';

if (!dev) {
  Sentry.init({
    dsn: process.env.PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.2, // 20% of server transactions
    
    beforeSend(event, hint) {
      // Don't log expected errors
      const error = hint.originalException;
      if (error instanceof Error && error.message.includes('EXPECTED_ERROR')) {
        return null;
      }
      
      return event;
    }
  });
}

export const handleError: HandleServerError = ({ error, event }) => {
  // Log to Sentry in production
  if (!dev) {
    Sentry.captureException(error, {
      contexts: {
        sveltekit: {
          event,
          request: {
            url: event.url.toString(),
            method: event.request.method,
          }
        }
      }
    });
  }
  
  // Log to console in development
  console.error('Server error:', error);
  
  // Return user-friendly message
  return {
    message: 'Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.'
  };
};
```

#### Environment Variables

```env
# .env
PUBLIC_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
```

#### Error Context Enrichment

**Attach user context to errors:**

```typescript
// src/lib/utils/sentry.ts
import * as Sentry from '@sentry/sveltekit';

export function identifyUser(user: { id: string; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name
  });
}

export function clearUser() {
  Sentry.setUser(null);
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data
  });
}

// Usage in auth flow
// src/routes/auth/login/+page.svelte
import { identifyUser } from '$lib/utils/sentry';

async function handleLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (data?.user) {
    identifyUser({
      id: data.user.id,
      email: data.user.email
    });
  }
}
```

#### Custom Error Tracking

**Track specific business logic errors:**

```typescript
// src/lib/utils/error-tracking.ts
import * as Sentry from '@sentry/sveltekit';

export function trackError(
  error: Error | string,
  context?: {
    severity?: 'fatal' | 'error' | 'warning' | 'info';
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  Sentry.captureException(
    typeof error === 'string' ? new Error(error) : error,
    {
      level: context?.severity || 'error',
      tags: context?.tags,
      extra: context?.extra
    }
  );
}

// Usage examples
trackError('Payment processing failed', {
  severity: 'fatal',
  tags: { component: 'checkout' },
  extra: { orderId: '12345', amount: 5000 }
});

```

### Cloudflare Insights

**Cloudflare Analytics** provides automatic monitoring without additional code:

- Page load times
- Performance metrics (Core Web Vitals)
- Traffic analytics
- Bot detection
- Security events

**Access**: Cloudflare Dashboard → Analytics → Web Analytics

**No code changes required** - automatically enabled for all Cloudflare Pages deployments.

### Structured Logging

**Console logging best practices:**

```typescript
// src/lib/utils/logger.ts
import { dev } from '$app/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };
    
    // Pretty print in development
    if (dev) {
      console[level === 'debug' ? 'log' : level](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        context || ''
      );
    } else {
      // Structured JSON in production
      console[level === 'debug' ? 'log' : level](JSON.stringify(logEntry));
    }
  }
  
  debug(message: string, context?: LogContext) {
    if (dev) this.log('debug', message, context);
  }
  
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }
  
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }
  
  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();

// Usage
logger.info('User logged in', {
  component: 'auth',
  userId: user.id,
  action: 'login'
});

logger.error('Database query failed', {
  component: 'cover-letter-generation',
  metadata: { query: 'generate_letter', jobId: 'job-123' }
});
```

### Error Categorization

**Classify errors by severity:**

| Severity | Description | Examples | Action |
|----------|-------------|----------|--------|
| **Fatal** | Critical errors breaking core functionality | Payment processing failure, auth system down, database connection lost | Immediate alert, page to on-call |
| **Error** | Significant issues affecting user experience | Failed API request, cover letter generation failure | Alert within 30 min, investigate |
| **Warning** | Recoverable issues | Network timeout (retried successfully), deprecated API usage | Log for analysis, no alert |
| **Info** | Expected errors or informational messages | User entered invalid email, 404 for blog post | Log only, no action |

**Implementation:**

```typescript
// src/lib/utils/error-severity.ts
export enum ErrorSeverity {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export function classifyError(error: Error): ErrorSeverity {
  const message = error.message.toLowerCase();
  
  // Fatal errors
  if (
    message.includes('database') ||
    message.includes('payment') ||
    message.includes('auth') && message.includes('failed')
  ) {
    return ErrorSeverity.FATAL;
  }
  
  // Regular errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('api')
  ) {
    return ErrorSeverity.ERROR;
  }
  
  // Warnings
  if (
    message.includes('deprecated') ||
    message.includes('retry')
  ) {
    return ErrorSeverity.WARNING;
  }
  
  // Default to error
  return ErrorSeverity.ERROR;
}
```

---

## User-Facing Error Messages

### Language Requirement

**All user-facing error messages MUST be in Russian** per project requirements (see [AGENTS.md](../../AGENTS.md) and [content/editing-guide-ru.md](../content/editing-guide-ru.md)).

### Error Message Standards

**Principles:**
1. ✅ **Clear and concise** - User understands what went wrong
2. ✅ **Actionable** - User knows what to do next
3. ✅ **Empathetic** - Acknowledge inconvenience
4. ✅ **No technical jargon** - Avoid error codes, stack traces
5. ✅ **Consistent tone** - Calm, helpful, professional

**Error Message Template:**

```
[Что произошло] + [Что делать дальше]
```

### Common Error Messages (Russian)

**File**: `src/lib/constants/error-messages.ts`

```typescript
// Russian error messages for user-facing errors
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'Неверный email или пароль. Пожалуйста, проверьте данные и попробуйте снова.',
  AUTH_EMAIL_NOT_VERIFIED: 'Пожалуйста, подтвердите ваш email адрес. Проверьте папку входящих.',
  AUTH_ACCOUNT_EXISTS: 'Аккаунт с этим email уже существует. Попробуйте войти.',
  AUTH_WEAK_PASSWORD: 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы и цифры.',
  AUTH_SESSION_EXPIRED: 'Ваша сессия истекла. Пожалуйста, войдите снова.',
  
  // Network errors
  NETWORK_ERROR: 'Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.',
  NETWORK_TIMEOUT: 'Запрос занял слишком много времени. Пожалуйста, попробуйте позже.',
  

  // Payment errors
  PAYMENT_FAILED: 'Оплата не прошла. Проверьте данные карты или попробуйте другой способ оплаты.',
  PAYMENT_DECLINED: 'Платёж отклонён. Обратитесь в ваш банк.',
  
  // File upload errors
  FILE_TOO_LARGE: 'Файл слишком большой. Максимальный размер: 5 МБ.',
  FILE_INVALID_TYPE: 'Неподдерживаемый формат файла. Используйте JPEG, PNG или WebP.',
  
  // Generic errors
  GENERIC_ERROR: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
  SERVER_ERROR: 'Проблема на сервере. Мы уже работаем над решением.',
  MAINTENANCE: 'Проводятся технические работы. Пожалуйста, вернитесь через несколько минут.',
  
  // Form validation
  VALIDATION_REQUIRED: 'Это поле обязательно для заполнения.',
  VALIDATION_EMAIL: 'Введите корректный email адрес.',
  VALIDATION_MIN_LENGTH: 'Минимальное количество символов: {min}.',
  VALIDATION_MAX_LENGTH: 'Максимальное количество символов: {max}.',
} as const;

// Helper to replace template variables
export function formatErrorMessage(
  template: string,
  variables?: Record<string, string | number>
): string {
  if (!variables) return template;
  
  return Object.entries(variables).reduce(
    (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
    template
  );
}
```

### Error-to-Message Mapping

**Convert technical errors to user-friendly Russian messages:**

```typescript
// src/lib/utils/error-mapper.ts
import { ERROR_MESSAGES, formatErrorMessage } from '$lib/constants/error-messages';

export function getUserFriendlyError(error: any): string {
  // Supabase authentication errors
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials') || message.includes('invalid password')) {
      return ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS;
    }
    
    if (message.includes('email not confirmed')) {
      return ERROR_MESSAGES.AUTH_EMAIL_NOT_VERIFIED;
    }
    
    if (message.includes('user already registered') || message.includes('duplicate')) {
      return ERROR_MESSAGES.AUTH_ACCOUNT_EXISTS;
    }
    
    if (message.includes('password') && message.includes('weak')) {
      return ERROR_MESSAGES.AUTH_WEAK_PASSWORD;
    }
    
    if (message.includes('jwt expired') || message.includes('token')) {
      return ERROR_MESSAGES.AUTH_SESSION_EXPIRED;
    }
  }
  
  // Network errors
  if (error?.name === 'NetworkError' || error?.code === 'ERR_NETWORK') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  if (error?.name === 'TimeoutError' || error?.code === 'ETIMEDOUT') {
    return ERROR_MESSAGES.NETWORK_TIMEOUT;
  }
  
  // HTTP status codes
  if (error?.status) {
    switch (error.status) {
      case 401:
        return ERROR_MESSAGES.AUTH_SESSION_EXPIRED;
      case 403:
        return ERROR_MESSAGES.ACCESS_DENIED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 413:
        return ERROR_MESSAGES.FILE_TOO_LARGE;
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }
  
  // Zod validation errors
  if (error?.name === 'ZodError') {
    const firstError = error.errors?.[0];
    if (firstError?.message) {
      return firstError.message; // Zod errors should already be in Russian
    }
  }
  
  // Default fallback
  return ERROR_MESSAGES.GENERIC_ERROR;
}

// Usage example
try {
  await supabase.auth.signInWithPassword({ email, password });
} catch (error) {
  const userMessage = getUserFriendlyError(error);
  toast.error(userMessage);
}
```

### Toast Notification System

**Display errors to users via toast notifications:**

**File**: `src/lib/stores/toast.ts`

```typescript
import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  
  function show(type: ToastType, message: string, duration = 5000) {
    const id = crypto.randomUUID();
    
    update(toasts => [...toasts, { id, type, message, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        update(toasts => toasts.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }
  
  function dismiss(id: string) {
    update(toasts => toasts.filter(t => t.id !== id));
  }
  
  return {
    subscribe,
    success: (message: string, duration?: number) => show('success', message, duration),
    error: (message: string, duration?: number) => show('error', message, duration),
    warning: (message: string, duration?: number) => show('warning', message, duration),
    info: (message: string, duration?: number) => show('info', message, duration),
    dismiss
  };
}

export const toast = createToastStore();
```

**Component**: `src/lib/components/shared/Toast.svelte`

```svelte
<script lang="ts">
  import { toast } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
  import { XIcon, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-svelte';
  
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
</script>

<div class="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
  {#each $toast as item (item.id)}
    <div
      transition:fly={{ x: 300, duration: 300 }}
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md {colors[item.type]}"
      role="alert"
    >
      <svelte:component this={icons[item.type]} class="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p class="flex-1 text-sm font-medium">{item.message}</p>
      <button
        on:click={() => toast.dismiss(item.id)}
        class="flex-shrink-0 hover:opacity-70"
        aria-label="Закрыть уведомление"
      >
        <XIcon class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>
```

### Error Pages

**Custom error pages for common HTTP errors:**

**File**: `src/routes/+error.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/button/button.svelte';
  
  $: status = $page.status;
  $: message = getErrorMessage(status);
  
  function getErrorMessage(status: number): { title: string; description: string } {
    switch (status) {
      case 404:
        return {
          title: 'Страница не найдена',
          description: 'К сожалению, запрашиваемая страница не существует.'
        };
      case 403:
        return {
          title: 'Доступ запрещён',
          description: 'У вас нет прав для просмотра этой страницы.'
        };
      case 500:
        return {
          title: 'Ошибка сервера',
          description: 'Произошла внутренняя ошибка. Мы уже работаем над её устранением.'
        };
      default:
        return {
          title: 'Что-то пошло не так',
          description: 'Пожалуйста, попробуйте обновить страницу.'
        };
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="text-center max-w-md">
    <h1 class="text-6xl font-bold text-primary-500 mb-4">{status}</h1>
    <h2 class="text-2xl font-semibold text-neutral-900 mb-2">
      {message.title}
    </h2>
    <p class="text-neutral-600 mb-8">
      {message.description}
    </p>
    <div class="flex gap-4 justify-center">
      <Button href="/" variant="default">
        На главную
      </Button>
      <Button on:click={() => window.history.back()} variant="outline">
        Назад
      </Button>
    </div>
  </div>
</div>
```

---

## Error Recovery Patterns

### Retry Mechanisms

**Automatically retry failed requests with exponential backoff:**

```typescript
// src/lib/utils/retry.ts
export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    retryableErrors = ['NetworkError', 'TimeoutError', 'ECONNREFUSED']
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const isRetryable = retryableErrors.some(
        errType => error instanceof Error && 
        (error.name.includes(errType) || error.message.includes(errType))
      );
      
      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt - 1),
        maxDelay
      );
      
      console.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Usage example
const letterGeneration = await retryWithBackoff(
  () => supabase
    .from('letters')
    .select('*')
    .eq('user_id', userId),
  { maxAttempts: 3, initialDelay: 500 }
);
```

### Graceful Degradation

**Provide fallback functionality when features fail:**

```typescript
// src/lib/utils/feature-flags.ts
import { writable } from 'svelte/store';

interface FeatureAvailability {
  videoPlayer: boolean;
  analytics: boolean;
  recommendations: boolean;
}

export const featureAvailability = writable<FeatureAvailability>({
  videoPlayer: true,
  analytics: true,
  recommendations: true
});

export function disableFeature(feature: keyof FeatureAvailability) {
  featureAvailability.update(state => ({
    ...state,
    [feature]: false
  }));
}

export function enableFeature(feature: keyof FeatureAvailability) {
  featureAvailability.update(state => ({
    ...state,
    [feature]: true
  }));
}

// Usage in component
// src/routes/app/letters/[id]/+page.svelte
import { featureAvailability } from '$lib/utils/feature-flags';

{#if $featureAvailability.videoPlayer}
  <VideoPlayer {videoUrl} />
{:else}
  <!-- Fallback to text content -->
  <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
    <p class="text-yellow-800">
      Видеоплеер временно недоступен. Пожалуйста, ознакомьтесь с текстовой версией урока ниже.
    </p>
  </div>
{/if}
```

### Offline Handling

**Detect and handle offline state:**

```typescript
// src/lib/stores/online.ts
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const online = readable(true, (set) => {
  if (!browser) return;
  
  const updateOnlineStatus = () => set(navigator.onLine);
  
  updateOnlineStatus();
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
});

// Usage in layout
// src/routes/portal/+layout.svelte
import { online } from '$lib/stores/online';
import { toast } from '$lib/stores/toast';

$: if (!$online) {
  toast.warning(
    'Нет подключения к интернету. Некоторые функции могут быть недоступны.',
    0 // Don't auto-dismiss
  );
}
```

### Optimistic UI Updates

**Update UI immediately, rollback on error:**

```typescript
// src/lib/utils/optimistic-update.ts
export async function optimisticUpdate<T>(
  updateFn: () => Promise<T>,
  optimisticState: () => void,
  rollbackState: () => void,
  onError?: (error: Error) => void
): Promise<T | null> {
  // Apply optimistic update immediately
  optimisticState();
  
  try {
    // Perform actual update
    const result = await updateFn();
    return result;
  } catch (error) {
    // Rollback on error
    rollbackState();
    
    if (onError) {
      onError(error as Error);
    }
    
    return null;
  }
}

// Usage example
// Mark letter as generated
async function toggleLetterGenerated(letterId: string, currentState: boolean) {
  const newState = !currentState;
  
  await optimisticUpdate(
    // Update function
    () => supabase
      .from('letters')
      .upsert({
        user_id: userId,
        letter_id: letterId,
        generated: newState
      }),
    
    // Optimistic update
    () => { isComplete = newState },
    
    // Rollback
    () => { isComplete = currentState },
    
    // Error handler
    (error) => {
      toast.error('Не удалось сохранить прогресс. Попробуйте снова.');
    }
  );
}
```

### State Recovery

**Save and restore application state:**

```typescript
// src/lib/utils/state-recovery.ts
import { browser } from '$app/environment';

export function saveState<T>(key: string, state: T): void {
  if (!browser) return;
  
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state:', error);
  }
}

export function loadState<T>(key: string): T | null {
  if (!browser) return null;
  
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load state:', error);
    return null;
  }
}

export function clearState(key: string): void {
  if (!browser) return;
  sessionStorage.removeItem(key);
}

// Usage in letter generation form
// src/routes/app/generate/+page.svelte
import { saveState, loadState, clearState } from '$lib/utils/state-recovery';

let assignmentContent = '';

// Load saved draft on mount
onMount(() => {
  const saved = loadState<string>(`assignment-draft-${assignmentSlug}`);
  if (saved) {
    assignmentContent = saved;
    toast.info('Восстановлен сохранённый черновик');
  }
});

// Auto-save draft
$: if (browser) {
  saveState(`assignment-draft-${assignmentSlug}`, assignmentContent);
}

// Clear on successful submission
async function submitAssignment() {
  const { error } = await supabase
    .from('assignment_submissions')
    .insert({ content: assignmentContent });
  
  if (!error) {
    clearState(`assignment-draft-${assignmentSlug}`);
    toast.success('Задание отправлено!');
  }
}
```

---

## Monitoring and Alerting Setup

### Sentry Alert Configuration

**Configure alerts for critical errors in Sentry dashboard:**

**Alert Rules:**

1. **Fatal Errors**
   - Condition: Error severity = fatal
   - Threshold: 1+ occurrence
   - Action: Send Slack/email notification immediately
   - Frequency: Every occurrence

2. **High Error Rate**
   - Condition: Error rate > 10 errors/minute
   - Threshold: Sustained for 5 minutes
   - Action: Send alert to on-call team
   - Frequency: Once per 30 minutes

3. **New Error Types**
   - Condition: First occurrence of new error
   - Threshold: 1 occurrence
   - Action: Create Sentry issue, notify team
   - Frequency: Once per unique error

4. **Performance Regression**
   - Condition: P95 response time > 3 seconds
   - Threshold: Sustained for 10 minutes
   - Action: Send warning to dev team
   - Frequency: Once per hour

**Sentry Dashboard Configuration:**

```
Settings → Alerts → New Alert Rule

Alert Name: Critical Error - Immediate Response
Environment: production
Conditions:
  - The issue's level is equal to fatal OR error
  - The event's tags match platform equals web
Filters:
  - Ignore errors from bots
Actions:
  - Send notification to #alerts Slack channel
  - Email: team@cover.me
```

### Cloudflare Monitoring

**Monitor performance and availability:**

**Cloudflare Analytics Metrics:**
- Page load time (target: < 2 seconds)
- Core Web Vitals (LCP, FID, CLS)
- HTTP status code distribution
- Geographic traffic distribution
- Bot traffic detection

**Access metrics:**
```
Cloudflare Dashboard → Analytics → Web Analytics
OR
Cloudflare Dashboard → Analytics → Traffic
```

**Set up Notifications:**
```
Cloudflare Dashboard → Notifications → Add

Notification Type: Advanced DDoS Attack Alerter
Notification Name: Security Alert
Delivery Method: Email (team@cover.me)
```

### Health Check Endpoints

**Create endpoint for uptime monitoring:**

**File**: `src/routes/api/health/+server.ts`

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

export const GET: RequestHandler = async () => {
  const checks: Record<string, { status: string; latency?: number }> = {};
  
  // Check Supabase connection
  try {
    const start = Date.now();
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL!,
      process.env.PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.from('profiles').select('count').limit(1).single();
    
    checks.database = {
      status: 'healthy',
      latency: Date.now() - start
    };
  } catch (error) {
    checks.database = { status: 'unhealthy' };
  }
  
  // Overall health
  const healthy = Object.values(checks).every(c => c.status === 'healthy');
  
  return json(
    {
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks
    },
    { status: healthy ? 200 : 503 }
  );
};
```

**Monitor with external service:**
- Use [UptimeRobot](https://uptimerobot.com) (free tier: 50 monitors)
- Monitor endpoint: `https://cover.me/api/health`
- Check interval: Every 5 minutes
- Alert methods: Email, Slack

### Custom Dashboards

**Create monitoring dashboard:**

```typescript
// src/routes/admin/monitoring/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Fetch error stats from Sentry API
  const sentryStats = await fetch(
    `https://sentry.io/api/0/projects/${orgSlug}/${projectSlug}/stats/`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SENTRY_AUTH_TOKEN}`
      }
    }
  ).then(r => r.json());
  
  // Fetch Supabase stats
  const supabaseStats = await fetch(
    `https://api.supabase.io/v1/projects/${projectId}/stats`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  ).then(r => r.json());
  
  return {
    errorRate: sentryStats.errorRate,
    activeUsers: supabaseStats.activeUsers,
    databaseLoad: supabaseStats.databaseLoad
  };
};
```

### On-Call Procedures

**Incident response workflow:**

1. **Alert Received** (0-5 minutes)
   - Check Sentry dashboard for error details
   - Verify issue in Cloudflare Analytics
   - Check health endpoint status
   - Assess severity (Fatal/Error/Warning)

2. **Initial Assessment** (5-15 minutes)
   - Identify affected users (from Sentry tags)
   - Check if issue is widespread or isolated
   - Review recent deployments/changes
   - Check external dependencies (Supabase status page)

3. **Mitigation** (15-30 minutes)
   - For deployment issues: Roll back via Cloudflare Pages
   - For database issues: Check Supabase Dashboard
   - For performance issues: Review recent code changes
   - Enable maintenance mode if critical

4. **Communication** (ASAP)
   - Notify users via in-app banner (if critical)
   - Post status update (if prolonged outage)
   - Update team in Slack

5. **Resolution** (varies)
   - Deploy fix
   - Verify error rate returns to normal
   - Monitor for 30 minutes post-fix
   - Close Sentry issues

6. **Post-Mortem** (within 48 hours)
   - Document root cause
   - Identify preventive measures
   - Update monitoring/alerts if needed

---

## Performance Monitoring

### Core Web Vitals Tracking

**Monitor Core Web Vitals with Cloudflare and Sentry:**

**File**: `src/lib/utils/web-vitals.ts`

```typescript
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';
import * as Sentry from '@sentry/sveltekit';

export function initWebVitals() {
  function sendToAnalytics(metric: any) {
    // Send to Sentry for tracking
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      contexts: {
        webVital: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta
        }
      }
    });
    
    // Also send to custom analytics if needed
    if (window.posthog) {
      window.posthog.capture('web_vital', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    }
  }
  
  // Track all Core Web Vitals
  onCLS(sendToAnalytics);  // Cumulative Layout Shift
  onFID(sendToAnalytics);  // First Input Delay
  onLCP(sendToAnalytics);  // Largest Contentful Paint
  onFCP(sendToAnalytics);  // First Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
}

// Initialize in root layout
// src/routes/+layout.svelte
import { browser } from '$app/environment';
import { onMount } from 'svelte';

onMount(() => {
  if (browser) {
    initWebVitals();
  }
});
```

**Install Web Vitals library:**
```bash
bun add web-vitals
```

**Target Metrics:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### API Response Time Monitoring

**Track API performance:**

```typescript
// src/lib/utils/api-monitor.ts
import { logger } from './logger';
import * as Sentry from '@sentry/sveltekit';

export async function monitoredFetch<T>(
  url: string,
  options?: RequestInit,
  context?: { endpoint: string; method: string }
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow API request', {
        component: 'api-monitor',
        metadata: {
          url,
          duration,
          status: response.status
        }
      });
      
      Sentry.captureMessage('Slow API Request', {
        level: 'warning',
        tags: {
          endpoint: context?.endpoint || url,
          method: context?.method || 'GET'
        },
        contexts: {
          performance: {
            duration,
            threshold: 1000
          }
        }
      });
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logger.error('API request failed', {
      component: 'api-monitor',
      metadata: { url, duration, error }
    });
    
    throw error;
  }
}

// Usage
const progress = await monitoredFetch(
  '/api/progress',
  {
    method: 'POST',
    body: JSON.stringify({ letterId: 'letter-123', generated: true })
  },
  { endpoint: '/api/progress', method: 'POST' }
);
```

### Database Query Performance

**Monitor Supabase query performance:**

```typescript
// src/lib/server/db/monitored-client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';
import { logger } from '$lib/utils/logger';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function monitoredQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  queryName: string
) {
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;
    
    // Log slow queries
    if (duration > 500) {
      logger.warn('Slow database query', {
        component: 'database',
        metadata: {
          query: queryName,
          duration
        }
      });
    }
    
    if (result.error) {
      logger.error('Database query error', {
        component: 'database',
        metadata: {
          query: queryName,
          error: result.error
        }
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Database query exception', {
      component: 'database',
      metadata: {
        query: queryName,
        error
      }
    });
    throw error;
  }
}

// Usage
const result = await monitoredQuery(
  () => supabase
    .from('letters')
    .select('*')
    .eq('user_id', userId),
  'get_user_progress'
);
```

### Real User Monitoring (RUM)

**Cloudflare's built-in RUM is automatically enabled** for all Pages deployments.

**Access RUM data:**
```
Cloudflare Dashboard → Speed → Overview
```

**Metrics tracked automatically:**
- Page load time
- Time to first byte (TTFB)
- First contentful paint (FCP)
- Largest contentful paint (LCP)
- Geographic performance breakdown
- Device type performance

**No code changes required** - metrics are collected via Cloudflare's edge network.

### Performance Budgets

**Set performance targets:**

**File**: `.lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:5173/"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }]
      }
    }
  }
}
```

**Run Lighthouse CI in GitHub Actions:**

See [deployment.md](./deployment.md#L490-L495) for CI/CD integration.

### Monitoring Quick Reference

**Key Metrics to Track:**

| Metric | Target | Tool | Alert Threshold |
|--------|--------|------|-----------------|
| Error Rate | < 0.1% | Sentry | > 1% for 5 min |
| P95 Response Time | < 1s | Sentry | > 3s for 10 min |
| LCP | < 2.5s | Cloudflare | > 4s |
| FID | < 100ms | Cloudflare | > 300ms |
| CLS | < 0.1 | Cloudflare | > 0.25 |
| Database Query Time | < 500ms | Supabase | > 2s |
| Uptime | > 99.9% | UptimeRobot | < 99% |
| Active Users | Monitor | Supabase | N/A |

---

## Summary

This document provides comprehensive error handling and monitoring guidelines for the cover.me platform :

1. **Error Logging Strategy**: Sentry integration for frontend/backend errors, Cloudflare insights for performance
2. **User-Facing Error Messages**: Russian-language, user-friendly error messages with clear actions
3. **Error Recovery Patterns**: Retry mechanisms, graceful degradation, offline handling, optimistic updates
4. **Monitoring & Alerting**: Sentry alerts, Cloudflare monitoring, health checks, on-call procedures
5. **Performance Monitoring**: Core Web Vitals, API/database performance tracking, RUM

**Key Integrations:**
- ✅ Sentry for error tracking (5k errors/month free)
- ✅ Cloudflare Analytics for performance (automatic)
- ✅ Supabase Dashboard for backend monitoring
- ✅ PostHog for user behavior analytics
- ✅ UptimeRobot for uptime monitoring (50 monitors free)

**Related Documentation:**
- [PRD - Analytics & Tracking](../prd.md#L1590-L1650)
- [Deployment Guide - Monitoring](./deployment.md#L640-L645)
- [AGENTS.md - Error Handling Patterns](../../AGENTS.md#L778-L834)
- [Security & Privacy](./security-privacy.md)
- [Testing Strategy](./testing-strategy.md)

---

**Last Updated**: December 2025  
**Version**: 1.0  
**Platform**: cover.me
