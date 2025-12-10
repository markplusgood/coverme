# Testing Strategy - indigocosmo.club

## Overview

This document outlines the comprehensive testing strategy for the indigocosmo.club spiritual learning platform. Our testing approach ensures code quality, accessibility compliance, cross-browser compatibility, and optimal performance while supporting rapid development cycles.

### Testing Philosophy

We follow the **Testing Pyramid** approach:
- **Unit Tests** (70%): Fast, isolated tests for utilities and logic
- **Component Tests** (20%): UI component behavior and accessibility
- **E2E Tests** (10%): Critical user flows and integrations

### Quality Goals

Aligned with [PRD requirements](./prd.md):
- ✅ **Lighthouse Scores**: Performance 90+, Accessibility 95+, SEO 95+
- ✅ **WCAG 2.1 AA Compliance**: Full accessibility compliance
- ✅ **Page Load**: < 2 seconds for landing page
- ✅ **Responsive Design**: 320px (mobile) to 2560px (4K)
- ✅ **Browser Support**: Chrome, Firefox, Safari, Edge (last 2 versions)

---

## 1. Unit Testing

### Tool: Vitest

Vitest is chosen for its:
- Native ESM support and fast execution
- Excellent TypeScript support
- Compatibility with Bun package manager
- Jest-compatible API for easy migration

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.spec.{js,ts}',
        '**/*.test.{js,ts}',
        '**/types/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  }
});
```

```typescript
// tests/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Supabase client
vi.mock('$lib/server/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }))
  }
}));
```

### Testing Patterns

#### Utility Functions

```typescript
// src/lib/utils/markdown.test.ts
import { describe, it, expect } from 'vitest';
import { parseMarkdown, extractFrontmatter, calculateReadingTime } from './markdown';

describe('parseMarkdown', () => {
  it('should convert markdown to HTML', () => {
    const markdown = '# Hello\n\nThis is **bold** text.';
    const html = parseMarkdown(markdown);
    
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('should sanitize dangerous HTML', () => {
    const markdown = '<script>alert("xss")</script>';
    const html = parseMarkdown(markdown);
    
    expect(html).not.toContain('<script>');
  });
});

describe('extractFrontmatter', () => {
  it('should extract YAML frontmatter', () => {
    const content = `---
title: "Test Post"
slug: "test-post"
---
Content here`;
    
    const { data, content: body } = extractFrontmatter(content);
    
    expect(data.title).toBe('Test Post');
    expect(data.slug).toBe('test-post');
    expect(body.trim()).toBe('Content here');
  });
});

describe('calculateReadingTime', () => {
  it('should calculate reading time correctly', () => {
    const text = 'word '.repeat(300); // 300 words
    const minutes = calculateReadingTime(text);
    
    expect(minutes).toBeGreaterThanOrEqual(1);
    expect(minutes).toBeLessThanOrEqual(2);
  });
});
```

#### Validation Functions

```typescript
// src/lib/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateAccessToken } from './validation';

describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should enforce minimum length', () => {
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('LongEnough123!')).toBe(true);
  });

  it('should require complexity', () => {
    expect(validatePassword('alllowercase123')).toBe(false);
    expect(validatePassword('StrongPass123!')).toBe(true);
  });
});
```

### Mocking Strategies

#### Supabase Client Mocking

```typescript
// tests/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn()
  },
  from: vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null })
  }))
};
```

### Coverage Targets

- **Overall Coverage**: 80% minimum
- **Critical Utilities**: 90% minimum (auth, validation, content parsing)
- **Business Logic**: 85% minimum
- **UI Utilities**: 75% minimum

### Running Unit Tests

```bash
# Run all unit tests
bun test

# Run with coverage
bun test --coverage

# Run in watch mode (development)
bun test --watch

# Run specific test file
bun test src/lib/utils/markdown.test.ts
```

---

## 2. Component Testing

### Tool: Svelte Testing Library + Vitest

Testing library provides user-centric testing utilities for Svelte components, focusing on how users interact with the UI rather than implementation details.

### Setup

```bash
# Install dependencies
bun add -D @testing-library/svelte @testing-library/jest-dom @testing-library/user-event
```

### Testing Patterns

#### Button Component

```typescript
// src/lib/components/ui/Button.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Button from './Button.svelte';

describe('Button Component', () => {
  it('should render with text', () => {
    render(Button, { props: { children: 'Click me' } });
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(Button, { props: { onclick: onClick, children: 'Click' } });
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(Button, { props: { disabled: true, children: 'Disabled' } });
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have correct variant classes', () => {
    const { container } = render(Button, { 
      props: { variant: 'primary', children: 'Primary' } 
    });
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('should be keyboard accessible', async () => {
    const onClick = vi.fn();
    render(Button, { props: { onclick: onClick, children: 'Keyboard' } });
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
});
```

#### Form Component with Validation

```typescript
// src/lib/components/auth/LoginForm.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm.svelte';

describe('LoginForm Component', () => {
  it('should render email and password fields', () => {
    render(LoginForm);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(LoginForm);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Trigger blur
    
    await waitFor(() => {
      expect(screen.getByText(/некорректный email/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid credentials', async () => {
    const onSubmit = vi.fn();
    render(LoginForm, { props: { onSubmit } });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });
    
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'StrongPass123!');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'StrongPass123!'
      });
    });
  });

  it('should show loading state during submission', async () => {
    render(LoginForm, { props: { loading: true } });
    
    const submitButton = screen.getByRole('button', { name: /войти/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
  });
});
```

#### Hero Section Component

```typescript
// src/lib/components/landing/Hero.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Hero from './Hero.svelte';

describe('Hero Component', () => {
  it('should render headline and CTA', () => {
    render(Hero);
    
    // Check for Russian language content
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /начать/i })).toBeInTheDocument();
  });

  it('should have accessible structure', () => {
    const { container } = render(Hero);
    
    // Check semantic HTML
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    
    // Check for heading hierarchy
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
  });

  it('should be responsive', () => {
    const { container } = render(Hero);
    
    // Check for responsive classes
    const heroElement = container.querySelector('.hero');
    expect(heroElement).toHaveClass(/responsive/);
  });
});
```

### Accessibility Testing in Components

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/svelte';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(Button, { 
      props: { children: 'Accessible Button' } 
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Running Component Tests

```bash
# Run component tests with UI pattern
bun test --ui

# Run specific component tests
bun test src/lib/components/ui/

# Watch mode for component development
bun test src/lib/components/ --watch
```

---

## 3. E2E Testing

### Tool: Playwright

Playwright provides reliable E2E testing with:
- Multi-browser support (Chromium, Firefox, WebKit)
- Auto-waiting for elements
- Network interception
- Visual regression testing
- Mobile emulation

### Setup

```bash
# Install Playwright
bun add -D @playwright/test

# Install browsers
bunx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    // 4K Desktop
    {
      name: '4K Desktop',
      use: {
        viewport: { width: 2560, height: 1440 }
      }
    }
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

### Critical User Flows

#### 1. Landing Page Flow (Segment 1)

```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load successfully with all sections', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check features section
    await expect(page.getByText(/Особенности/i)).toBeVisible();
    
    // Check CTA buttons
    const ctaButton = page.getByRole('button', { name: /начать/i }).first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test('should have correct Lighthouse scores', async ({ page }) => {
    await page.goto('/');
    
    // Note: Use Lighthouse CI in actual implementation
    const performanceScore = await page.evaluate(() => {
      return window.performance.timing.loadEventEnd - 
             window.performance.timing.navigationStart;
    });
    
    expect(performanceScore).toBeLessThan(2000); // < 2s load time
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu
    const menuButton = page.getByRole('button', { name: /меню/i });
    await expect(menuButton).toBeVisible();
    
    // Check content is not overflowing
    const body = await page.locator('body');
    const box = await body.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('should navigate to checkout on CTA click', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.getByRole('button', { name: /купить/i }).first();
    await ctaButton.click();
    
    // Should redirect to checkout or payment page
    await expect(page).toHaveURL(/checkout|payment/);
  });
});
```

#### 2. Payoneer Checkout Flow (Segment 1)

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should initiate Payoneer checkout', async ({ page }) => {
    await page.goto('/');
    
    // Click buy button
    await page.getByRole('button', { name: /купить курс/i }).first().click();
    
    // Should show Payoneer iframe or redirect
    await page.waitForURL(/payoneer|checkout/);
    
    // Verify payment page loaded
    await expect(page.getByText(/payment|оплата/i)).toBeVisible();
  });

  test('should handle successful payment', async ({ page, context }) => {
    // Mock successful payment callback
    await context.route('**/api/payment/callback', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          status: 'success',
          access_token: 'test-token-123'
        })
      });
    });

    await page.goto('/checkout/success?payment_id=test123');
    
    // Should show success message
    await expect(page.getByText(/успешно|спасибо/i)).toBeVisible();
    
    // Should receive access link
    await expect(page.getByText(/ссылка для доступа/i)).toBeVisible();
  });

  test('should handle failed payment', async ({ page }) => {
    await page.goto('/checkout/failed');
    
    // Should show error message
    await expect(page.getByText(/ошибка|не удалось/i)).toBeVisible();
    
    // Should offer retry option
    const retryButton = page.getByRole('button', { name: /попробовать снова/i });
    await expect(retryButton).toBeVisible();
  });
});
```

#### 3. Authentication Flow (Segment 2)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign up with email', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill signup form
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/пароль/i).fill('StrongPass123!');
    await page.getByLabel(/подтвердите пароль/i).fill('StrongPass123!');
    
    // Accept terms
    await page.getByLabel(/принимаю условия/i).check();
    
    // Submit
    await page.getByRole('button', { name: /зарегистрироваться/i }).click();
    
    // Should show verification prompt
    await expect(page.getByText(/проверьте email/i)).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/пароль/i).fill('TestPass123!');
    await page.getByRole('button', { name: /войти/i }).click();
    
    // Should redirect to portal
    await expect(page).toHaveURL(/portal/);
  });

  test('should login with Google OAuth', async ({ page, context }) => {
    await page.goto('/auth/login');
    
    // Click Google login button
    const googleButton = page.getByRole('button', { name: /Google/i });
    
    // Handle OAuth popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      googleButton.click()
    ]);
    
    // Should open Google OAuth page
    await expect(popup).toHaveURL(/accounts.google.com/);
  });

  test('should handle password reset', async ({ page }) => {
    await page.goto('/auth/reset-password');
    
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByRole('button', { name: /сбросить/i }).click();
    
    // Should show confirmation
    await expect(page.getByText(/письмо отправлено/i)).toBeVisible();
  });
});
```

#### 4. Course Access Flow (Segment 2)

```typescript
// tests/e2e/course.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Course Access', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill('testuser@example.com');
    await page.getByLabel(/пароль/i).fill('TestPass123!');
    await page.getByRole('button', { name: /войти/i }).click();
    await page.waitForURL(/portal/);
  });

  test('should display course lessons', async ({ page }) => {
    await page.goto('/portal/course/lessons');
    
    // Should show course list
    await expect(page.getByText(/Курс/i)).toBeVisible();
    
    // Should show first lesson
    const firstLesson = page.getByRole('link', { name: /Урок 1/i });
    await expect(firstLesson).toBeVisible();
  });

  test('should view lesson and mark complete', async ({ page }) => {
    await page.goto('/portal/course/lessons/course-01/lesson-01');
    
    // Lesson content should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Mark as complete
    const completeButton = page.getByRole('button', { name: /завершить урок/i });
    await completeButton.click();
    
    // Should update progress
    await expect(page.getByText(/урок завершён/i)).toBeVisible();
  });

  test('should submit assignment', async ({ page }) => {
    await page.goto('/portal/course/assignments/assignment-01');
    
    // Fill assignment form
    await page.getByRole('textbox').fill('Это моё задание...');
    
    // Submit
    await page.getByRole('button', { name: /отправить/i }).click();
    
    // Should show confirmation
    await expect(page.getByText(/задание отправлено/i)).toBeVisible();
  });

  test('should track progress', async ({ page }) => {
    await page.goto('/portal/course');
    
    // Should show progress bar
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Should show percentage
    await expect(page.getByText(/%/)).toBeVisible();
  });
});
```

### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('landing page hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.hero');
    await expect(hero).toHaveScreenshot('hero-section.png');
  });

  test('portal dashboard', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    // ... login steps
    await page.goto('/portal');
    await expect(page).toHaveScreenshot('portal-dashboard.png');
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
bunx playwright test

# Run specific browser
bunx playwright test --project=chromium

# Run in headed mode (see browser)
bunx playwright test --headed

# Run in UI mode (debugging)
bunx playwright test --ui

# Generate test report
bunx playwright show-report

# Update visual snapshots
bunx playwright test --update-snapshots
```

---

## 4. Accessibility Testing

### WCAG 2.1 AA Compliance Checklist

Per [PRD accessibility requirements](./prd.md#accessibility-requirements), we must ensure WCAG 2.1 AA compliance.

#### Automated Testing Tools

1. **axe-core** (via jest-axe and Playwright)
2. **Pa11y** (CI integration)
3. **Lighthouse CI** (performance + accessibility)

### Automated Accessibility Tests

```bash
# Install accessibility testing tools
bun add -D jest-axe @axe-core/playwright pa11y-ci
```

#### Component-Level Accessibility

```typescript
// src/lib/components/ui/Button.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(Button, { props: { children: 'Click' } });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### E2E Accessibility Tests

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('landing page should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('portal should be keyboard navigable', async ({ page }) => {
    await page.goto('/portal');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocusable);
  });

  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/auth/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    const labelViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'label'
    );
    expect(labelViolations).toHaveLength(0);
  });
});
```

### Manual Accessibility Testing Procedures

#### 1. Keyboard Navigation Testing

**Test Checklist:**
- [ ] All interactive elements accessible via Tab
- [ ] Tab order is logical and follows visual flow
- [ ] Shift+Tab navigates backwards
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns
- [ ] Arrow keys navigate menus and lists
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps

**Testing Steps:**
1. Disconnect mouse/trackpad
2. Navigate entire page using only keyboard
3. Verify all functionality accessible
4. Check focus indicator visibility on all elements

#### 2. Screen Reader Testing

**Tools:**
- **Windows**: NVDA (free), JAWS (paid)
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca

**Test Checklist:**
- [ ] All text content is announced
- [ ] Images have meaningful alt text
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Page title is descriptive
- [ ] Headings create logical outline
- [ ] ARIA labels present where needed
- [ ] Dynamic content changes announced (aria-live)
- [ ] Russian language content pronounced correctly

**Testing Steps:**
1. Enable screen reader
2. Navigate page from top to bottom
3. Test all interactive elements
4. Verify form submission flow
5. Check error handling announcements

#### 3. Color Contrast Verification

**Requirements:**
- Normal text (< 18pt): Minimum 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

**Tools:**
- Chrome DevTools Contrast Checker
- WebAIM Contrast Checker
- Colour Contrast Analyser (desktop app)

**Test Checklist:**
- [ ] Body text meets 4.5:1 ratio
- [ ] Heading text meets appropriate ratio
- [ ] Button text readable
- [ ] Form labels and inputs meet ratio
- [ ] Error messages meet ratio
- [ ] Link text distinguishable
- [ ] Focus indicators have sufficient contrast

#### 4. Focus Management

**Test Checklist:**
- [ ] Focus order is logical
- [ ] Focus visible at all times
- [ ] Modal dialogs trap focus
- [ ] Closing modal returns focus
- [ ] Skip navigation links present
- [ ] No focus on hidden elements
- [ ] Custom components manage focus

### Pa11y CI Configuration

```json
// .pa11yci.json
{
  "defaults": {
    "standard": "WCAG2AA",
    "runners": ["axe", "htmlcs"],
    "chromeLaunchConfig": {
      "args": ["--no-sandbox"]
    }
  },
  "urls": [
    "http://localhost:5173/",
    "http://localhost:5173/auth/login",
    "http://localhost:5173/auth/signup",
    "http://localhost:5173/portal",
    "http://localhost:5173/portal/blog",
    "http://localhost:5173/portal/course"
  ]
}
```

```bash
# Run Pa11y accessibility audit
bunx pa11y-ci
```

### Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'bun run preview',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/auth/login',
        'http://localhost:4173/portal'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

---

## 5. Browser Compatibility Testing

### Browser Support Matrix

| Browser | Versions | Priority | Coverage |
|---------|----------|----------|----------|
| **Chrome** | Last 2 versions | High | Desktop + Mobile |
| **Firefox** | Last 2 versions | High | Desktop |
| **Safari** | Last 2 versions | High | Desktop + iOS |
| **Edge** | Last 2 versions | Medium | Desktop |
| **Samsung Internet** | Latest | Low | Mobile |

### Mobile Browser Support

| Device | Browser | Viewport |
|--------|---------|----------|
| iPhone 13/14/15 | Safari | 390x844 |
| iPhone 13/14/15 Pro Max | Safari | 428x926 |
| iPad Pro | Safari | 1024x1366 |
| Samsung Galaxy S21 | Chrome | 360x800 |
| Google Pixel 5 | Chrome | 393x851 |

### Testing Approach

#### 1. Automated Cross-Browser Testing (Playwright)

Already configured in [E2E Testing section](#3-e2e-testing):

```typescript
// Tests run on:
// - Chromium (Chrome/Edge)
// - Firefox
// - WebKit (Safari)
// - Mobile Chrome
// - Mobile Safari
```

#### 2. BrowserStack Integration (Optional)

For real device testing:

```bash
# Install BrowserStack local testing
bun add -D browserstack-local
```

```typescript
// playwright.config.ts (BrowserStack)
export default defineConfig({
  use: {
    browserName: 'chromium',
    connectOptions: {
      wsEndpoint: process.env.BROWSERSTACK_WS_ENDPOINT
    }
  }
});
```

#### 3. Feature Detection Strategy

```typescript
// src/lib/utils/feature-detection.ts

export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

export function supportsIntersectionObserver(): boolean {
  return 'IntersectionObserver' in window;
}

export function supportsLocalStorage(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Usage in components
if (!supportsIntersectionObserver()) {
  // Fallback: load all images immediately
}
```

#### 4. Polyfill Strategy

```typescript
// src/lib/polyfills.ts

// Only load polyfills if features are missing
async function loadPolyfills() {
  const polyfills = [];

  if (!('IntersectionObserver' in window)) {
    polyfills.push(import('intersection-observer'));
  }

  if (!('fetch' in window)) {
    polyfills.push(import('whatwg-fetch'));
  }

  await Promise.all(polyfills);
}

export default loadPolyfills;
```

### CSS Browser Compatibility

```css
/* Use autoprefixer for vendor prefixes */
/* postcss.config.js */
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 Edge versions',
        'iOS >= 13'
      ]
    }
  }
};
```

### Graceful Degradation Checklist

- [ ] WebP images with JPEG/PNG fallbacks
- [ ] CSS Grid with flexbox fallback
- [ ] Modern JS features transpiled (via Vite)
- [ ] localStorage fallback to memory
- [ ] Intersection Observer polyfill for lazy loading
- [ ] Smooth scroll with instant fallback

### Manual Testing Checklist

For each major release, manually test on:

- [ ] Chrome (latest, Windows)
- [ ] Firefox (latest, Windows)
- [ ] Safari (latest, macOS)
- [ ] Safari (iOS, iPhone)
- [ ] Chrome (Android)
- [ ] Edge (latest, Windows)

**Test scenarios:**
1. Landing page responsiveness
2. Form submissions
3. Authentication flows
4. Course content rendering
5. Video playback
6. File downloads

---

## 6. Performance Testing & Benchmarks

### Performance Budget

Per [PRD performance targets](./prd.md):

| Metric | Target | Budget |
|--------|--------|--------|
| **First Contentful Paint (FCP)** | < 1.8s | Critical |
| **Largest Contentful Paint (LCP)** | < 2.5s | Critical |
| **Time to Interactive (TTI)** | < 3.8s | Important |
| **Total Blocking Time (TBT)** | < 200ms | Important |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Critical |
| **Speed Index** | < 3.4s | Important |
| **Total Page Size** | < 1.5MB | Target |
| **JavaScript Bundle** | < 300KB | Target |
| **Image Sizes** | WebP, optimized | Required |

### Lighthouse CI

```bash
# Install Lighthouse CI
bun add -D @lhci/cli
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'bun run preview',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/portal',
        'http://localhost:4173/portal/course/lessons/course-01/lesson-01'
      ],
      numberOfRuns: 5 // Average of 5 runs
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Performance
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // Resource optimization
        'uses-webp-images': 'error',
        'uses-optimized-images': 'error',
        'modern-image-formats': 'error',
        'uses-text-compression': 'error',
        'unminified-css': 'error',
        'unminified-javascript': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

```bash
# Run Lighthouse CI
bunx lhci autorun
```

### Bundle Size Monitoring

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-svelte': ['svelte'],
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Route-based splitting
          'landing': ['$lib/components/landing'],
          'portal': ['$lib/components/portal'],
          'auth': ['$lib/components/auth']
        }
      }
    }
  }
});
```

```bash
# Analyze bundle
bun run build
# Opens stats.html with bundle visualization
```

### Database Query Performance

```typescript
// tests/performance/database.test.ts
import { describe, it, expect } from 'vitest';
import { supabase } from '$lib/server/supabase';

describe('Database Performance', () => {
  it('course progress query should execute quickly', async () => {
    const startTime = performance.now();
    
    const { data } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', 'test-user-id');
    
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(100); // < 100ms
  });

  it('should use indexes efficiently', async () => {
    // Verify indexes exist
    const { data: indexes } = await supabase
      .rpc('get_table_indexes', { table_name: 'course_progress' });
    
    expect(indexes).toContainEqual(
      expect.objectContaining({ column_name: 'user_id' })
    );
  });
});
```

### API Endpoint Performance

```typescript
// tests/performance/api.test.ts
import { test, expect } from '@playwright/test';

test.describe('API Performance', () => {
  test('progress API should respond quickly', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get('/api/progress', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    const duration = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(500); // < 500ms
  });
});
```

### Load Testing

```bash
# Install Artillery for load testing
bun add -D artillery
```

```yaml
# artillery.yml
config:
  target: 'http://localhost:5173'
  phases:
    # Warm up
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    # Ramp up load
    - duration: 300
      arrivalRate: 10
      rampTo: 50
      name: "Ramp up load"
    # Sustained load
    - duration: 600
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "Landing page visit"
    weight: 70
    flow:
      - get:
          url: "/"
      - think: 5
      - get:
          url: "/auth/login"

  - name: "Authenticated user flow"
    weight: 30
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "test@example.com"
            password: "TestPass123!"
      - get:
          url: "/portal"
      - get:
          url: "/portal/course/lessons"
      - think: 10
      - get:
          url: "/portal/course/lessons/course-01/lesson-01"
```

```bash
# Run load test
bunx artillery run artillery.yml
```

### Performance Monitoring in Production

```typescript
// src/lib/utils/performance-monitoring.ts

// Track Core Web Vitals
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to Google Analytics, Sentry, or custom endpoint
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta
    });
  }
}

export function initPerformanceMonitoring() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initPerformanceMonitoring } from '$lib/utils/performance-monitoring';
  
  onMount(() => {
    initPerformanceMonitoring();
  });
</script>
```

---

## 7. Test Organization & File Structure

### Recommended Structure

```
indigocosmo/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Button.test.ts           # Colocated component tests
│   │   │   │   ├── Input.svelte
│   │   │   │   └── Input.test.ts
│   │   │   ├── landing/
│   │   │   │   ├── Hero.svelte
│   │   │   │   ├── Hero.test.ts
│   │   │   │   ├── Features.svelte
│   │   │   │   └── Features.test.ts
│   │   │   └── portal/
│   │   │       ├── Sidebar.svelte
│   │   │       └── Sidebar.test.ts
│   │   ├── utils/
│   │   │   ├── markdown.ts
│   │   │   ├── markdown.test.ts             # Colocated utility tests
│   │   │   ├── validation.ts
│   │   │   └── validation.test.ts
│   │   └── server/
│   │       └── db/
│   │           ├── queries.ts
│   │           └── queries.test.ts
│   └── routes/
│       └── api/
│           └── progress/
│               └── +server.test.ts          # API route tests
├── tests/
│   ├── setup.ts                             # Global test setup
│   ├── fixtures/                            # Test data
│   │   ├── blog-posts.json
│   │   ├── lessons.json
│   │   └── users.json
│   ├── mocks/                               # Shared mocks
│   │   ├── supabase.ts
│   │   └── cloudflare.ts
│   ├── unit/                                # Standalone unit tests
│   │   └── content-loader.test.ts
│   ├── integration/                         # Integration tests
│   │   ├── auth-flow.test.ts
│   │   └── checkout-flow.test.ts
│   ├── e2e/                                 # Playwright E2E tests
│   │   ├── landing.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── checkout.spec.ts
│   │   ├── course.spec.ts
│   │   ├── accessibility.spec.ts
│   │   └── visual.spec.ts
│   └── performance/                         # Performance tests
│       ├── lighthouse.test.ts
│       └── load-tests.yml
├── vitest.config.ts                         # Vitest configuration
├── playwright.config.ts                     # Playwright configuration
├── lighthouserc.js                          # Lighthouse CI config
└── .pa11yci.json                            # Pa11y config
```

### Naming Conventions

- **Unit/Component Tests**: `*.test.ts` or `*.spec.ts`
- **E2E Tests**: `*.spec.ts`
- **Test Suites**: Descriptive names matching feature (e.g., `auth.spec.ts`, `checkout.spec.ts`)
- **Fixtures**: `*.json` or `*.ts` (typed fixtures)
- **Mocks**: `mock-*.ts` or in `mocks/` directory

---

## 8. CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-and-component-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run unit and component tests
        run: bun test --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Install Playwright browsers
        run: bunx playwright install --with-deps
      
      - name: Build application
        run: bun run build
      
      - name: Run E2E tests
        run: bunx playwright test
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build application
        run: bun run build
      
      - name: Run Pa11y accessibility audit
        run: |
          bun run preview &
          sleep 5
          bunx pa11y-ci

  lighthouse-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build application
        run: bun run build
      
      - name: Run Lighthouse CI
        run: |
          bunx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Pre-commit Hooks (Husky)

```bash
# Install Husky
bun add -D husky

# Initialize Husky
bunx husky install
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run type checking
bun run check

# Run linting
bun run lint

# Run quick tests (unit only)
bun test --run --coverage=false

# Run Prettier
bun run format
```

---

## 9. Testing Best Practices

### General Principles

1. **AAA Pattern** (Arrange, Act, Assert)
   ```typescript
   test('should validate email', () => {
     // Arrange
     const email = 'user@example.com';
     
     // Act
     const isValid = validateEmail(email);
     
     // Assert
     expect(isValid).toBe(true);
   });
   ```

2. **Test Independence**
   - Tests should not depend on each other
   - Use `beforeEach` for setup, `afterEach` for cleanup
   - Avoid shared mutable state

3. **Descriptive Test Names**
   ```typescript
   // ❌ Bad
   test('test1', () => { ... });
   
   // ✅ Good
   test('should reject password shorter than 8 characters', () => { ... });
   ```

4. **DRY (Don't Repeat Yourself)**
   ```typescript
   // Create test utilities
   function createMockUser(overrides = {}) {
     return {
       id: 'test-id',
       email: 'test@example.com',
       ...overrides
     };
   }
   ```

5. **Avoid Test Interdependencies**
   ```typescript
   // ❌ Bad - tests depend on execution order
   test('create user', () => { ... });
   test('update user', () => { /* assumes user exists */ });
   
   // ✅ Good - each test is independent
   test('should create user', () => {
     // Setup, act, assert
   });
   
   test('should update user', () => {
     // Create user first, then update
   });
   ```

### Russian Language Content Testing

Since all content is in Russian:

```typescript
// Use Russian in test assertions
test('должен отображать сообщение об ошибке', async () => {
  render(LoginForm);
  
  await userEvent.click(screen.getByRole('button', { name: /войти/i }));
  
  expect(screen.getByText(/заполните все поля/i)).toBeInTheDocument();
});
```

### Mock Data Management

```typescript
// tests/fixtures/users.ts
export const mockUsers = {
  authenticated: {
    id: '123',
    email: 'user@example.com',
    full_name: 'Тестовый Пользователь',
    avatar_url: '/avatars/test.jpg'
  },
  unauthenticated: null
};

// tests/fixtures/lessons.ts
export const mockLessons = [
  {
    slug: 'lesson-01',
    title: 'Введение в ясновидение',
    course: 1,
    duration: '15 мин'
  }
];
```

### Testing Error States

Always test error scenarios:

```typescript
test('should handle network error gracefully', async () => {
  // Mock network failure
  vi.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Network error'));
  
  render(CourseContent);
  
  // Should show error message
  await waitFor(() => {
    expect(screen.getByText(/ошибка загрузки/i)).toBeInTheDocument();
  });
});
```

---

## 10. Continuous Improvement

### Test Metrics to Track

1. **Code Coverage**: Target 80%+ overall
2. **Test Execution Time**: Keep under 5 minutes for CI
3. **Flaky Test Rate**: < 1%
4. **Accessibility Violations**: Zero tolerance
5. **Performance Regressions**: Alert on >10% degradation

### Quarterly Review

Every quarter, review and update:
- [ ] Browser support matrix
- [ ] Performance budgets
- [ ] Accessibility standards
- [ ] Test coverage gaps
- [ ] Testing tools and dependencies

### Documentation Updates

Keep this strategy document updated when:
- New testing tools are adopted
- Browser support requirements change
- Performance targets are adjusted
- New testing patterns emerge
- Framework versions upgrade

---

## Summary

This comprehensive testing strategy ensures the indigocosmo.club platform delivers:
- ✅ **High Quality**: 80%+ code coverage, robust testing at all levels
- ✅ **Accessibility**: WCAG 2.1 AA compliance, tested with automated and manual methods
- ✅ **Performance**: Lighthouse 90+ scores, sub-2s page loads
- ✅ **Compatibility**: Works across all major browsers and devices
- ✅ **Reliability**: Automated CI/CD pipeline catches issues early

### Quick Reference

| Test Type | Tool | When to Run |
|-----------|------|-------------|
| Unit Tests | Vitest | Every commit, pre-commit hook |
| Component Tests | Vitest + Testing Library | Every commit |
| E2E Tests | Playwright | Every PR, before merge |
| Accessibility | axe-core, Pa11y | Every PR |
| Performance | Lighthouse CI | Every deployment |
| Load Testing | Artillery | Before major releases |

**Next Steps:**
1. Set up testing infrastructure (install tools, configure CI/CD)
2. Write initial test suites for existing components
3. Establish baseline performance metrics
4. Integrate tests into development workflow
5. Continuously expand test coverage as features are added
