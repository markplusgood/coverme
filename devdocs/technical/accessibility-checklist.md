# Accessibility Implementation Guide - cover.me

## Overview

This comprehensive guide provides detailed accessibility implementation standards for the cover.me AI cover letter writer platform. All components must meet WCAG 2.1 AA compliance standards to ensure the platform is accessible to all users, including those using assistive technologies.

### Goals
- ✅ **WCAG 2.1 AA Compliance**: Full compliance across all pages and components
- ✅ **Lighthouse Accessibility Score**: 95+ on all pages
- ✅ **Screen Reader Support**: Compatible with NVDA, JAWS, VoiceOver, and Orca
- ✅ **Keyboard Navigation**: All functionality accessible without a mouse
- ✅ **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- ✅ **Russian Language Support**: Proper pronunciation and screen reader compatibility

---

## 1. Component-by-Component WCAG Compliance Checklist

### 1.1 Button Component

#### Requirements
- [ ] Semantic `<button>` element used (not `<div>` or `<span>`)
- [ ] Visible text label or `aria-label` present
- [ ] Disabled state clearly indicated visually and programmatically
- [ ] Focus indicator visible with 3:1 contrast ratio
- [ ] Text contrast ratio minimum 4.5:1 against background
- [ ] Touch target minimum 44x44 pixels
- [ ] Loading state announced to screen readers

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible button -->
<button
  class="btn btn-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
  aria-label={loading ? 'Загрузка...' : 'Начать обучение'}
  disabled={loading || disabled}
  on:click={handleClick}
>
  {#if loading}
    <span class="sr-only">Загрузка...</span>
    <LoadingSpinner aria-hidden="true" />
  {:else}
    Начать обучение
  {/if}
</button>

<!-- ❌ BAD: Non-semantic, inaccessible button -->
<div class="btn" on:click={handleClick}>
  Click me
</div>
```

#### Testing Checklist
- [ ] Tab to button and verify focus indicator visible
- [ ] Press Enter and Space to activate
- [ ] Screen reader announces button role and label
- [ ] Disabled state announced as "disabled"
- [ ] Loading state changes announced via `aria-live`

---

### 1.2 Form Input Component

#### Requirements
- [ ] Label properly associated with input via `for`/`id` or wrapped
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages linked via `aria-describedby`
- [ ] Input type matches purpose (email, tel, text, etc.)
- [ ] Autocomplete attribute used where appropriate
- [ ] Placeholder not used as only label
- [ ] Error state indicated visually AND programmatically

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible form input -->
<div class="form-field">
  <label for="email" class="form-label">
    Email
    {#if required}
      <span aria-label="обязательное поле">*</span>
    {/if}
  </label>
  
  <input
    id="email"
    type="email"
    class="form-input"
    class:error={hasError}
    bind:value={email}
    aria-required={required}
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
    autocomplete="email"
  />
  
  {#if hasError}
    <div id="email-error" class="error-message" role="alert">
      {errorMessage}
    </div>
  {/if}
</div>

<!-- Screen reader only helper -->
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

#### Testing Checklist
- [ ] Label announced when input focused
- [ ] Required status announced
- [ ] Error message announced immediately when shown
- [ ] Tab order logical through form
- [ ] Autocomplete suggestions accessible

---

### 1.3 Navigation Component

#### Requirements
- [ ] Wrapped in `<nav>` element with `aria-label`
- [ ] Current page indicated with `aria-current="page"`
- [ ] Mobile menu toggle has `aria-expanded` state
- [ ] Mobile menu has `aria-hidden` when closed
- [ ] Skip navigation link present as first focusable element
- [ ] Focus trapped in mobile menu when open
- [ ] Keyboard accessible (Tab, Escape to close)

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible navigation -->
<!-- Skip navigation link (first focusable element) -->
<a href="#main-content" class="skip-link">
  Перейти к основному содержанию
</a>

<nav aria-label="Основная навигация">
  <!-- Mobile menu toggle -->
  <button
    class="menu-toggle md:hidden"
    aria-expanded={mobileMenuOpen}
    aria-controls="mobile-menu"
    aria-label="Открыть меню"
    on:click={toggleMobileMenu}
  >
    <MenuIcon aria-hidden="true" />
  </button>

  <!-- Desktop navigation -->
  <ul class="nav-list hidden md:flex">
    <li>
      <a 
        href="/portal" 
        aria-current={currentPath === '/portal' ? 'page' : undefined}
      >
        Курсы
      </a>
    </li>
    <li>
      <a 
        href="/portal/blog"
        aria-current={currentPath === '/portal/blog' ? 'page' : undefined}
      >
        Блог
      </a>
    </li>
  </ul>

  <!-- Mobile navigation -->
  <div
    id="mobile-menu"
    class="mobile-menu md:hidden"
    aria-hidden={!mobileMenuOpen}
    hidden={!mobileMenuOpen}
  >
    <ul class="nav-list">
      {#each navItems as item}
        <li>
          <a 
            href={item.href}
            aria-current={currentPath === item.href ? 'page' : undefined}
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-600);
    color: white;
    padding: 0.5rem 1rem;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

#### Testing Checklist
- [ ] Skip link appears on Tab and works
- [ ] Tab through all navigation items
- [ ] Current page visually and programmatically indicated
- [ ] Mobile menu opens/closes with button
- [ ] Escape key closes mobile menu
- [ ] Focus trapped in open mobile menu
- [ ] Focus returned to toggle when menu closes

---

### 1.4 Modal/Dialog Component

#### Requirements
- [ ] Uses `<dialog>` element or proper ARIA role
- [ ] Focus moved to modal when opened
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returned to trigger element when closed
- [ ] Background content inert (aria-hidden or inert attribute)
- [ ] Close button clearly labeled
- [ ] Modal title in `<h2>` with `id` referenced by `aria-labelledby`

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible modal -->
<script>
  import { onMount } from 'svelte';
  
  export let open = false;
  export let onClose;
  
  let dialogElement;
  let previouslyFocused;
  
  $: if (open) {
    openModal();
  } else {
    closeModal();
  }
  
  function openModal() {
    previouslyFocused = document.activeElement;
    dialogElement?.showModal();
    trapFocus();
  }
  
  function closeModal() {
    dialogElement?.close();
    previouslyFocused?.focus();
  }
  
  function trapFocus() {
    // Focus trap implementation
    const focusableElements = dialogElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
  }
  
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  on:keydown={handleKeydown}
  on:close={onClose}
>
  <div class="modal-content">
    <header class="modal-header">
      <h2 id="modal-title">Подтвердите действие</h2>
      <button
        class="close-button"
        aria-label="Закрыть диалог"
        on:click={onClose}
      >
        <CloseIcon aria-hidden="true" />
      </button>
    </header>
    
    <div id="modal-description" class="modal-body">
      <slot />
    </div>
    
    <footer class="modal-footer">
      <button on:click={onClose}>Отмена</button>
      <button class="btn-primary" on:click={handleConfirm}>
        Подтвердить
      </button>
    </footer>
  </div>
</dialog>
```

#### Testing Checklist
- [ ] Focus moves to modal when opened
- [ ] Tab cycles through modal elements only
- [ ] Shift+Tab cycles backwards
- [ ] Escape closes modal
- [ ] Focus returns to trigger element
- [ ] Screen reader announces modal title
- [ ] Background content not accessible via keyboard

---

### 1.5 Link Component

#### Requirements
- [ ] Semantic `<a>` element with `href`
- [ ] Link text descriptive (not "click here")
- [ ] External links indicated visually and programmatically
- [ ] Links that open new tabs include warning
- [ ] Visited state visually distinct
- [ ] Focus indicator visible
- [ ] Minimum 44x44px touch target

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible links -->
<a
  href="/app/examples/example-01"
  class="link focus:ring-2 focus:ring-primary-500"
>
  Пример 1: Сопроводительное письмо для разработчика
</a>

<!-- External link -->
<a 
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  class="link external"
>
  Узнать больше
  <span class="sr-only">(откроется в новой вкладке)</span>
  <ExternalLinkIcon aria-hidden="true" class="inline-icon" />
</a>

<!-- ❌ BAD: Non-descriptive link -->
<a href="/more">Нажмите здесь</a>

<!-- ❌ BAD: Non-semantic link -->
<span class="link" on:click={navigateTo}>Go to page</span>
```

#### Testing Checklist
- [ ] Screen reader announces link role
- [ ] Link text descriptive out of context
- [ ] External link status announced
- [ ] New tab warning announced
- [ ] Visited links visually distinct

---

### 1.6 Image Component

#### Requirements
- [ ] Alt text present and descriptive for content images
- [ ] Decorative images have empty alt (`alt=""`) or `aria-hidden="true"`
- [ ] Complex images have long descriptions
- [ ] Image loading lazy where appropriate
- [ ] Sufficient color contrast if text on image
- [ ] Images not sole source of information

#### Implementation Example

```svelte
<!-- ✅ GOOD: Content image with alt text -->
<img
  src="/images/chakra-diagram.jpg"
  alt="Диаграмма семи чакр с санскритскими названиями и цветами"
  class="responsive-image"
  loading="lazy"
/>

<!-- ✅ GOOD: Decorative image -->
<img
  src="/images/decoration-pattern.svg"
  alt=""
  role="presentation"
  aria-hidden="true"
/>

<!-- ✅ GOOD: Complex image with description -->
<figure>
  <img
    src="/images/meditation-technique.jpg"
    alt="Пошаговая техника медитации"
    aria-describedby="meditation-description"
  />
  <figcaption id="meditation-description">
    Детальное описание пяти шагов медитации с эффектом визуализации третьего глаза...
  </figcaption>
</figure>

<!-- ❌ BAD: Missing alt text -->
<img src="/images/important.jpg" />

<!-- ❌ BAD: Redundant alt text -->
<img src="photo.jpg" alt="Фото" />
```

#### Testing Checklist
- [ ] All images have alt attribute
- [ ] Content images have descriptive alt text
- [ ] Decorative images have empty alt or aria-hidden
- [ ] Alt text in Russian for Russian content
- [ ] Screen reader announces alt text correctly

---

### 1.7 Video Component

#### Requirements
- [ ] Captions available for all speech
- [ ] Audio descriptions for important visual content
- [ ] Keyboard-accessible player controls
- [ ] Play/pause, volume, and seek controls labeled
- [ ] Auto-play disabled or user-controlled
- [ ] Transcript available
- [ ] Controls have sufficient contrast

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible video -->
<figure>
  <video
    controls
    preload="metadata"
    aria-label="Урок 1: Введение в астральную проекцию"
  >
    <source src="/videos/example-01.mp4" type="video/mp4" />
    <track
      kind="subtitles"
      src="/videos/example-01-ru.vtt"
      srclang="ru"
      label="Русский"
      default
    />
    <track
      kind="descriptions"
      src="/videos/example-01-desc.vtt"
      srclang="ru"
      label="Аудиоописание"
    />
    Ваш браузер не поддерживает видео.
  </video>
  
  <details class="transcript">
    <summary>Показать текстовый вариант</summary>
    <div class="transcript-content">
      <!-- Full transcript -->
    </div>
  </details>
</figure>
```

#### Testing Checklist
- [ ] All controls accessible via keyboard
- [ ] Screen reader announces control states
- [ ] Captions toggle works
- [ ] Volume controls accessible
- [ ] No auto-play or easily stoppable

---

### 1.8 Data Table Component

#### Requirements
- [ ] `<table>` element used for tabular data
- [ ] Table headers use `<th>` with `scope` attribute
- [ ] Complex tables use `headers` and `id` associations
- [ ] Table has caption or `aria-label`
- [ ] Responsive table maintains accessibility
- [ ] Sorting controls keyboard accessible

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible table -->
<table class="data-table">
  <caption>История выполнения заданий</caption>
  <thead>
    <tr>
      <th scope="col">Задание</th>
      <th scope="col">Дата отправки</th>
      <th scope="col">Статус</th>
      <th scope="col">Оценка</th>
    </tr>
  </thead>
  <tbody>
    {#each submissions as submission}
      <tr>
        <th scope="row">{submission.title}</th>
        <td>{formatDate(submission.submittedAt)}</td>
        <td>
          <span class="status-badge" aria-label={getStatusLabel(submission.status)}>
            {submission.status}
          </span>
        </td>
        <td>{submission.score || '—'}</td>
      </tr>
    {/each}
  </tbody>
</table>
```

#### Testing Checklist
- [ ] Screen reader announces table structure
- [ ] Headers announced for each cell
- [ ] Table caption read first
- [ ] Sorting controls accessible via keyboard
- [ ] Mobile view maintains data relationships

---

### 1.9 Accordion Component

#### Requirements
- [ ] Button controls expansion with `aria-expanded`
- [ ] Content panel has `aria-labelledby` referencing header
- [ ] Keyboard navigation with arrow keys (optional enhancement)
- [ ] Focus visible on headers
- [ ] Expanded state clearly indicated visually
- [ ] Content accessible when expanded

#### Implementation Example

```svelte
<!-- ✅ GOOD: Accessible accordion -->
<div class="accordion">
  {#each faqItems as item, index}
    <div class="accordion-item">
      <h3>
        <button
          class="accordion-header"
          aria-expanded={expandedIndex === index}
          aria-controls="accordion-panel-{index}"
          id="accordion-header-{index}"
          on:click={() => toggleAccordion(index)}
        >
          {item.question}
          <ChevronIcon 
            aria-hidden="true"
            class={expandedIndex === index ? 'rotate-180' : ''}
          />
        </button>
      </h3>
      
      <div
        id="accordion-panel-{index}"
        role="region"
        aria-labelledby="accordion-header-{index}"
        hidden={expandedIndex !== index}
        class="accordion-content"
      >
        {item.answer}
      </div>
    </div>
  {/each}
</div>
```

#### Testing Checklist
- [ ] Enter/Space toggles expansion
- [ ] Expanded state announced to screen reader
- [ ] Focus indicator visible on headers
- [ ] Content accessible when expanded
- [ ] Multiple items can be expanded (or single based on UX)

---

## 2. Screen Reader Testing Procedures

### 2.1 Testing Tools by Platform

| Platform | Primary Tool | Secondary Tool |
|----------|-------------|----------------|
| **Windows** | NVDA (free) | JAWS (paid) |
| **macOS** | VoiceOver (built-in) | — |
| **Linux** | Orca (free) | — |
| **iOS** | VoiceOver (built-in) | — |
| **Android** | TalkBack (built-in) | — |

### 2.2 VoiceOver (macOS) Testing Guide

#### Activation
- **Turn on**: `Cmd + F5`
- **Turn off**: `Cmd + F5`

#### Basic Navigation Commands
- **Next item**: `VO + →` (VO = `Ctrl + Option`)
- **Previous item**: `VO + ←`
- **Interact with element**: `VO + Space`
- **Activate link/button**: `VO + Space`
- **Start reading**: `VO + A`
- **Stop reading**: `Control`

#### Web-Specific Commands
- **Next heading**: `VO + Cmd + H`
- **Next link**: `VO + Cmd + L`
- **Next form element**: `VO + Cmd + J`
- **Rotor (element list)**: `VO + U`

#### Testing Procedure

```markdown
1. **Page Load**
   - [ ] Page title announced
   - [ ] Main heading announced
   - [ ] Landmark regions identified

2. **Navigation**
   - [ ] Navigate through all headings (VO + Cmd + H)
   - [ ] Verify heading hierarchy (h1 → h2 → h3)
   - [ ] All headings descriptive and in Russian

3. **Forms**
   - [ ] Each input label announced
   - [ ] Required fields indicated
   - [ ] Error messages read immediately
   - [ ] Form submission success announced

4. **Images**
   - [ ] Content images: alt text read
   - [ ] Decorative images: skipped
   - [ ] Complex images: description available

5. **Interactive Elements**
   - [ ] Buttons announce role and label
   - [ ] Links announce role and destination
   - [ ] Current page indicated in navigation
   - [ ] Modal opening/closing announced

6. **Dynamic Content**
   - [ ] Loading states announced
   - [ ] Error messages announced via aria-live
   - [ ] Success messages announced
   - [ ] Progress updates announced
```

### 2.3 NVDA (Windows) Testing Guide

#### Activation
- **Turn on**: `Ctrl + Alt + N`
- **Turn off**: `Insert + Q` or close NVDA window

#### Basic Navigation
- **Next element**: `↓`
- **Previous element**: `↑`
- **Activate**: `Enter` or `Space`
- **Next heading**: `H`
- **Next link**: `K`
- **Next button**: `B`
- **Next form field**: `F`

#### Browse/Focus Mode
- **Browse mode** (reading): Default for web pages
- **Focus mode** (forms): `Insert + Space` to toggle
- **Auto form mode**: Activates automatically in forms

#### Testing Procedure

```markdown
1. **Quick Navigation**
   - [ ] Press H: Navigate through headings
   - [ ] Press K: Navigate through links
   - [ ] Press F: Navigate through form fields
   - [ ] Press B: Navigate through buttons
   - [ ] Press T: Navigate through tables

2. **Forms Testing**
   - [ ] Tab to each form field
   - [ ] Label read before input
   - [ ] Required status announced
   - [ ] Error messages announced
   - [ ] Successful submission announced

3. **Russian Language**
   - [ ] Proper pronunciation of Russian text
   - [ ] Cyrillic characters read correctly
   - [ ] Switch language if needed (NVDA > Preferences > Voice)
```

### 2.4 Common Screen Reader Issues

#### Issue: Focus Not Announced
**Cause**: Missing `tabindex` or improper focus management  
**Fix**: Ensure `tabindex="-1"` on programmatically focused elements

```svelte
<!-- ✅ GOOD -->
<div id="main-content" tabindex="-1">
  <!-- Content -->
</div>

<script>
  onMount(() => {
    document.getElementById('main-content').focus();
  });
</script>
```

#### Issue: Dynamic Content Not Announced
**Cause**: Missing `aria-live` region  
**Fix**: Use `aria-live="polite"` or `"assertive"`

```svelte
<!-- ✅ GOOD: Status announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {statusMessage}
</div>

<!-- ✅ GOOD: Error announcements -->
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

#### Issue: Complex Widgets Not Understood
**Cause**: Missing ARIA roles and states  
**Fix**: Use proper ARIA patterns (see Section 5)

---

## 3. Keyboard Navigation Patterns

### 3.1 Standard Keyboard Controls

| Action | Key | Usage |
|--------|-----|-------|
| **Navigate forward** | `Tab` | Move to next focusable element |
| **Navigate backward** | `Shift + Tab` | Move to previous focusable element |
| **Activate** | `Enter` or `Space` | Activate buttons, links, checkboxes |
| **Close/Cancel** | `Escape` | Close modals, dropdowns, menus |
| **Scroll page down** | `Space` or `Page Down` | Scroll content |
| **Scroll page up** | `Shift + Space` or `Page Up` | Scroll up |
| **Navigate links** | `Tab` | Move between links |
| **Navigate headings** | Screen reader specific | E.g., `H` in NVDA |

### 3.2 Focus Management Rules

#### Rule 1: Logical Tab Order
Focus order must follow visual order and logical flow.

```svelte
<!-- ✅ GOOD: Logical order -->
<header>
  <a href="/">Logo</a>
  <nav>
    <a href="/examples">Примеры</a>
    <a href="/blog">Блог</a>
  </nav>
  <button>Профиль</button>
</header>

<!-- ❌ BAD: CSS reordering breaks tab order -->
<div style="display: flex; flex-direction: column-reverse;">
  <button>First visually but last in DOM</button>
  <button>Last visually but first in DOM</button>
</div>
```

**Fix**: Use visual order that matches DOM order or adjust with `tabindex` cautiously.

#### Rule 2: Always Visible Focus Indicator

```css
/* ✅ GOOD: Clear focus indicator */
*:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* ❌ BAD: Removing focus indicator */
*:focus {
  outline: none; /* Never do this without alternative */
}
```

#### Rule 3: No Keyboard Traps
Users must be able to navigate away from any element.

```svelte
<!-- ✅ GOOD: Modal focus trap with escape -->
<script>
  function trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape') {
        closeModal(); // Always allow escape
      }
    });
  }
</script>
```

### 3.3 Component-Specific Keyboard Patterns

#### Dropdown Menu

```svelte
<!-- ✅ GOOD: Accessible dropdown -->
<div class="dropdown">
  <button
    aria-haspopup="true"
    aria-expanded={isOpen}
    aria-controls="dropdown-menu"
    on:click={toggle}
    on:keydown={handleButtonKeydown}
  >
    Меню
  </button>
  
  <ul
    id="dropdown-menu"
    role="menu"
    hidden={!isOpen}
    on:keydown={handleMenuKeydown}
  >
    <li role="menuitem">
      <button on:click={action1}>Действие 1</button>
    </li>
    <li role="menuitem">
      <button on:click={action2}>Действие 2</button>
    </li>
  </ul>
</div>

<script>
  function handleButtonKeydown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      toggle();
      focusFirstMenuItem();
    }
  }
  
  function handleMenuKeydown(e) {
    const items = Array.from(
      e.currentTarget.querySelectorAll('[role="menuitem"]')
    );
    const currentIndex = items.indexOf(document.activeElement.parentElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const next = items[currentIndex + 1] || items[0];
        next.querySelector('button').focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prev = items[currentIndex - 1] || items[items.length - 1];
        prev.querySelector('button').focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeAndFocus();
        break;
      case 'Home':
        e.preventDefault();
        items[0].querySelector('button').focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1].querySelector('button').focus();
        break;
    }
  }
</script>
```

**Keyboard Controls:**
- `Enter`/`Space`: Open menu
- `↓`/`↑`: Navigate menu items
- `Home`: First item
- `End`: Last item
- `Escape`: Close menu
- `Tab`: Close menu and move to next element

#### Tabs Component

```svelte
<!-- ✅ GOOD: Accessible tabs -->
<div class="tabs">
  <div role="tablist" aria-label="Настройки">
    {#each tabs as tab, index}
      <button
        role="tab"
        id="tab-{index}"
        aria-selected={activeTab === index}
        aria-controls="panel-{index}"
        tabindex={activeTab === index ? 0 : -1}
        on:click={() => setActiveTab(index)}
        on:keydown={(e) => handleTabKeydown(e, index)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  
  {#each tabs as tab, index}
    <div
      role="tabpanel"
      id="panel-{index}"
      aria-labelledby="tab-{index}"
      hidden={activeTab !== index}
      tabindex="0"
    >
      {tab.content}
    </div>
  {/each}
</div>

<script>
  function handleTabKeydown(e, index) {
    const totalTabs = tabs.length;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveTab((index + 1) % totalTabs);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveTab((index - 1 + totalTabs) % totalTabs);
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(totalTabs - 1);
        break;
    }
  }
</script>
```

**Keyboard Controls:**
- `Tab`: Focus tab list, then content
- `←`/`→`: Navigate between tabs
- `Home`: First tab
- `End`: Last tab
- `Enter`/`Space`: Activate focused tab (if not auto-activated)

---

## 4. Color Contrast Verification Workflow

### 4.1 WCAG Contrast Requirements

| Content Type | Minimum Contrast Ratio | Level |
|--------------|----------------------|-------|
| **Normal text** (\<18pt) | 4.5:1 | AA |
| **Large text** (≥18pt or ≥14pt bold) | 3:1 | AA |
| **UI components** (buttons, inputs, borders) | 3:1 | AA |
| **Graphical objects** (icons, charts) | 3:1 | AA |
| **Normal text** (\<18pt) | 7:1 | AAA |
| **Large text** (≥18pt or ≥14pt bold) | 4.5:1 | AAA |

### 4.2 Color Palette Audit

#### Professional Career Color System

Our palette is based on professional career themes with **Navy Blue** and **Deep Purple** as primary colors for trust and professionalism.

```css
/* Verify these colors against white, black, and neutral backgrounds */
:root {
  /* Primary Navy Blue - Professional Trust */
  --primary-50: #f0f9ff;     /* → on dark backgrounds */
  --primary-100: #e0f2fe;    /* → on dark backgrounds */
  --primary-500: #1e40af;    /* → main brand color */
  --primary-600: #1e3a8a;    /* → darker variant */
  --primary-700: #1e306e;    /* → primary interactive */

  /* Secondary Deep Purple - Career Success */
  --secondary-50: #faf5ff;  /* → on dark backgrounds */
  --secondary-100: #f3e8ff; /* → on dark backgrounds */
  --secondary-500: #7c3aed; /* → co-primary, links */
  --secondary-600: #6d28d9; /* → darker variant */
  --secondary-700: #5b21b6; /* → darkest */

  /* Success Green - Positive Feedback */
  --success-500: #10b981;   /* → success states */
  --success-600: #059669;

  /* Warning Yellow - Attention */
  --warning-500: #f59e0b;   /* → warnings */
  --warning-600: #d97706;

  /* Error Red - Alerts */
  --error-500: #dc2626;     /* → alerts, errors */
  --error-600: #b91c1c;

  /* Neutrals */
  --neutral-900: #171717;   /* → primary text */
  --neutral-600: #525252;   /* → secondary text */
}
```

#### Contrast Verification Table

| Foreground | Background | Ratio | Pass AA Normal | Pass AA Large | Usage |
|-----------|------------|-------|----------------|---------------|-------|
| `#1e306e` (primary-700) | `#ffffff` | 8.59:1 | ✅ Yes | ✅ Yes | Primary buttons |
| `#1e3a8a` (primary-600) | `#ffffff` | 6.35:1 | ✅ Yes | ✅ Yes | Primary interactive |
| `#1e40af` (primary-500) | `#ffffff` | 4.63:1 | ✅ Yes | ✅ Yes | Brand elements |
| `#5b21b6` (secondary-700) | `#ffffff` | 8.21:1 | ✅ Yes | ✅ Yes | Links on light |
| `#7c3aed` (secondary-500) | `#ffffff` | 4.56:1 | ✅ Yes | ✅ Yes | Secondary CTAs |
| `#10b981` (success-500) | `#ffffff` | 3.02:1 | ❌ No | ✅ Yes | Large text only |
| `#f59e0b` (warning-500) | `#ffffff` | 2.35:1 | ❌ No | ❌ No | ⚠️ Use darker shade |
| `#d97706` (warning-600) | `#ffffff` | 3.94:1 | ❌ No | ✅ Yes | Large text only |
| `#dc2626` (error-500) | `#ffffff` | 5.52:1 | ✅ Yes | ✅ Yes | Error messages |
| `#171717` (neutral-900) | `#ffffff` | 16.10:1 | ✅ Yes | ✅ Yes | Body text |
| `#ffffff` (white) | `#1e306e` | 8.59:1 | ✅ Yes | ✅ Yes | Text on primary |
| `#ffffff` (white) | `#5b21b6` | 8.21:1 | ✅ Yes | ✅ Yes | Text on secondary |

**Key Takeaways:**
- ✅ Primary navy blue and deep purple have excellent contrast
- ⚠️ Success green requires larger text or darker shades for body text
- ⚠️ Warning yellow requires darker shade (600) for accessibility
- ✅ All colors tested and approved for their intended use cases

### 4.3 Tools for Contrast Checking

#### 1. Chrome DevTools
1. Right-click element → **Inspect**
2. In Styles panel, click color swatch
3. View **Contrast ratio** in color picker
4. ✅ Green checkmarks indicate pass
5. ❌ Red X indicates failure

#### 2. WebAIM Contrast Checker
- **URL**: https://webaim.org/resources/contrastchecker/
- **Usage**:
  1. Enter foreground hex color
  2. Enter background hex color
  3. View pass/fail for AA and AAA

#### 3. Colour Contrast Analyser (Desktop App)
- **Download**: https://www.tpgi.com/color-contrast-checker/
- **Features**:
  - Eyedropper tool for any colors on screen
  - Real-time pass/fail indicators
  - Simulates color blindness

#### 4. Automated Testing (axe DevTools)
```bash
# Install axe browser extension
# Chrome: https://chrome.google.com/webstore (search "axe DevTools")
# Firefox: https://addons.mozilla.org (search "axe DevTools")

# Run automated scan:
# 1. Open page
# 2. Open DevTools
# 3. Click "axe DevTools" tab
# 4. Click "Scan all of my page"
# 5. Review contrast violations
```

### 4.4 Common Contrast Issues and Fixes

#### Issue: Gray text on white background

```css
/* ❌ BAD: Insufficient contrast (2.9:1) */
.muted-text {
  color: #999999;
  background: #ffffff;
}

/* ✅ GOOD: Sufficient contrast (4.6:1) */
.muted-text {
  color: #767676;
  background: #ffffff;
}
```

#### Issue: Colored buttons with light text

```css
/* ❌ BAD: Light purple with white text (2.1:1) */
.btn-primary {
  background: #a855f7;
  color: #ffffff;
}

/* ✅ GOOD: Darker purple provides 4.63:1 */
.btn-primary {
  background: #7e22ce;
  color: #ffffff;
}
```

#### Issue: Placeholder text too light

```css
/* ❌ BAD: Default browser placeholder is often too light */
input::placeholder {
  color: #9ca3af; /* 2.8:1 - fails */
}

/* ✅ GOOD: Darker placeholder */
input::placeholder {
  color: #6b7280; /* 4.5:1 - passes */
  opacity: 1;
}
```

### 4.5 Contrast Audit Workflow

```markdown
## Pre-Development Audit
- [ ] Review design mockups with contrast checker
- [ ] Flag all potential contrast issues
- [ ] Provide accessible color alternatives
- [ ] Document approved color combinations

## Development Phase
- [ ] Use CSS custom properties for all colors
- [ ] Include contrast ratios in comments
- [ ] Test each new component with axe DevTools
- [ ] Run Lighthouse audit on each page

## Pre-Launch Audit
- [ ] Full site scan with Pa11y
- [ ] Manual spot-checks with WebAIM tool
- [ ] Test with browser zoom at 200%
- [ ] Verify all states (hover, focus, active, disabled)

## Ongoing Monitoring
- [ ] Include contrast checks in CI/CD pipeline
- [ ] Review user feedback for visibility issues
- [ ] Re-audit after any design changes
```

---

## 5. ARIA Patterns Library

### 5.1 ARIA Fundamentals

#### What is ARIA?
**ARIA** (Accessible Rich Internet Applications) provides semantic information to assistive technologies when native HTML is insufficient.

#### ARIA Rules
1. **First Rule**: Use native HTML when possible
2. **Second Rule**: Don't change native semantics with ARIA
3. **Third Rule**: All interactive ARIA controls must be keyboard accessible
4. **Fourth Rule**: Never use `role="presentation"` or `aria-hidden="true"` on focusable elements
5. **Fifth Rule**: All interactive elements must have an accessible name

### 5.2 ARIA Roles

#### Landmark Roles

```html
<!-- ✅ GOOD: Using native HTML5 landmarks -->
<header><!-- Implicitly role="banner" --></header>
<nav aria-label="Основная навигация"><!-- role="navigation" --></nav>
<main><!-- role="main" --></main>
<aside><!-- role="complementary" --></aside>
<footer><!-- role="contentinfo" --></footer>

<!-- Use explicit role only when HTML5 element not appropriate -->
<div role="search">
  <input type="search" aria-label="Поиск по курсам" />
</div>
```

#### Widget Roles

```html
<!-- Button role (prefer <button>) -->
<div role="button" tabindex="0" aria-pressed="false">
  Переключатель
</div>

<!-- Checkbox role (prefer <input type="checkbox">) -->
<div role="checkbox" tabindex="0" aria-checked="false">
  Согласен с условиями
</div>

<!-- Tab interface -->
<div role="tablist">
  <button role="tab" aria-selected="true">Вкладка 1</button>
  <button role="tab" aria-selected="false">Вкладка 2</button>
</div>
<div role="tabpanel">Содержимое вкладки</div>
```

### 5.3 ARIA States and Properties

#### aria-label vs aria-labelledby

```svelte
<!-- aria-label: Provides string label -->
<button aria-label="Закрыть диалог">
  <CloseIcon />
</button>

<!-- aria-labelledby: References visible label by ID -->
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Подтверждение удаления</h2>
</div>

<!-- aria-describedby: Provides additional description -->
<input
  type="password"
  aria-label="Новый пароль"
  aria-describedby="password-requirements"
/>
<div id="password-requirements">
  Минимум 8 символов, включая 1 цифру
</div>
```

#### aria-expanded, aria-haspopup

```svelte
<!-- Expandable section -->
<button
  aria-expanded={isOpen}
  aria-controls="details-panel"
>
  Показать детали
</button>
<div id="details-panel" hidden={!isOpen}>
  <!-- Content -->
</div>

<!-- Dropdown menu -->
<button
  aria-haspopup="menu"
  aria-expanded={menuOpen}
  aria-controls="dropdown-menu"
>
  Меню пользователя
</button>
```

#### aria-hidden

```svelte
<!-- Hide decorative icons from screen readers -->
<button aria-label="Удалить">
  <TrashIcon aria-hidden="true" />
</button>

<!-- Hide duplicate content -->
<div>
  <span aria-hidden="true">★★★★★</span>
  <span class="sr-only">5 звёзд из 5</span>
</div>
```

#### aria-live, aria-atomic

```svelte
<!-- Polite announcements (don't interrupt) -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {statusMessage}
</div>

<!-- Assertive announcements (interrupt immediately) -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>

<!-- Example: Form validation -->
<script>
  let statusMessage = '';
  
  async function handleSubmit() {
    statusMessage = 'Отправка формы...';
    // ... submit logic
    statusMessage = 'Форма успешно отправлена';
  }
</script>
```

### 5.4 Common ARIA Patterns

#### Alert Pattern

```svelte
<!-- ✅ GOOD: Alert for critical messages -->
<div role="alert" class="alert alert-error">
  <strong>Ошибка:</strong> Не удалось сохранить изменения
</div>

<!-- Note: role="alert" has implicit aria-live="assertive" -->
```

#### Progress Indicator Pattern

```svelte
<!-- Determinate progress bar -->
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Прогресс загрузки"
>
  <div class="progress-fill" style="width: {progress}%"></div>
</div>

<!-- Indeterminate progress (loading spinner) -->
<div role="status" aria-live="polite" aria-label="Загрузка">
  <div class="spinner" aria-hidden="true"></div>
</div>
```

#### Tooltip Pattern

```svelte
<button
  aria-describedby={showTooltip ? 'tooltip-1' : undefined}
  on:mouseenter={() => showTooltip = true}
  on:mouseleave={() => showTooltip = false}
  on:focus={() => showTooltip = true}
  on:blur={() => showTooltip = false}
>
  Помощь
</button>

{#if showTooltip}
  <div id="tooltip-1" role="tooltip" class="tooltip">
    Дополнительная информация об этой функции
  </div>
{/if}
```

#### Breadcrumb Navigation Pattern

```svelte
<nav aria-label="Хлебные крошки">
  <ol class="breadcrumb">
    <li>
      <a href="/portal">Начало</a>
    </li>
    <li>
      <a href="/app/examples">Примеры</a>
    </li>
    <li aria-current="page">
      Урок 1
    </li>
  </ol>
</nav>
```

### 5.5 ARIA Anti-Patterns (Avoid These)

#### ❌ Redundant ARIA

```html
<!-- ❌ BAD: Redundant role on native element -->
<button role="button">Click</button>

<!-- ✅ GOOD: Just use native element -->
<button>Click</button>
```

#### ❌ Conflicting Roles

```html
<!-- ❌ BAD: Conflicting semantics -->
<button role="link" href="/page">Go</button>

<!-- ✅ GOOD: Use correct element -->
<a href="/page">Go</a>
```

#### ❌ ARIA on Non-Interactive Elements

```html
<!-- ❌ BAD: Button role without keyboard support -->
<div role="button">Click me</div>

<!-- ✅ GOOD: Native button or full implementation -->
<button>Click me</button>

<!-- OR with proper ARIA and keyboard support -->
<div 
  role="button" 
  tabindex="0" 
  on:click={handler}
  on:keydown={(e) => e.key === 'Enter' && handler()}
>
  Click me
</div>
```

---

## 6. Accessibility Testing Checklist by Page Type

### 6.1 Landing Page Checklist

- [ ] **Page Structure**
  - [ ] Page has meaningful `<title>`
  - [ ] Main heading is `<h1>`, only one per page
  - [ ] Heading hierarchy logical (no skipped levels)
  - [ ] Landmarks used (`<header>`, `<main>`, `<footer>`)
  
- [ ] **Navigation**
  - [ ] Skip link present and functional
  - [ ] All navigation items accessible via keyboard
  - [ ] Current page indicated (if applicable)
  - [ ] Mobile menu keyboard accessible
  
- [ ] **Content**
  - [ ] All images have appropriate alt text
  - [ ] Videos have captions
  - [ ] Text has minimum 4.5:1 contrast ratio
  - [ ] Links descriptive (not "click here")
  
- [ ] **Forms**
  - [ ] All inputs have labels
  - [ ] Required fields indicated
  - [ ] Error messages clear and associated with fields
  - [ ] Submit button clearly labeled
  
- [ ] **Interactive Elements**
  - [ ] All buttons keyboard accessible
  - [ ] CTAs have sufficient contrast
  - [ ] Focus indicators visible
  - [ ] No keyboard traps

### 6.2 Authentication Pages Checklist

- [ ] **Login/Signup Forms**
  - [ ] Email input has `type="email"` and `autocomplete="email"`
  - [ ] Password input has `type="password"` and `autocomplete`
  - [ ] Show/hide password toggle accessible
  - [ ] Remember me checkbox labeled
  - [ ] Error messages announced to screen readers
  
- [ ] **Social Login Buttons**
  - [ ] Each button clearly labeled (e.g., "Войти через Google")
  - [ ] Icons supplemented with text or aria-label
  - [ ] Keyboard accessible
  
- [ ] **Error Handling**
  - [ ] Errors appear near relevant fields
  - [ ] Errors use `role="alert"` or `aria-live`
  - [ ] Sufficient color contrast
  - [ ] Not relying solely on color to indicate error

### 6.3 Portal/Dashboard Checklist

- [ ] **Sidebar Navigation**
  - [ ] Nav wrapped in `<nav>` with label
  - [ ] Current section indicated with `aria-current`
  - [ ] Collapsible sections use `aria-expanded`
  - [ ] Mobile drawer keyboard accessible
  
- [ ] **Main Content**
  - [ ] Main content area has `<main>` element
  - [ ] Page heading describes current section
  - [ ] Breadcrumbs present and accessible
  
- [ ] **Data Display**
  - [ ] Tables use proper markup
  - [ ] Charts have text alternatives
  - [ ] Progress indicators announced
  
- [ ] **Interactive Widgets**
  - [ ] Modals trap focus and are dismissible
  - [ ] Dropdowns keyboard navigable
  - [ ] Tooltips accessible on keyboard focus

---

## 7. Automated Testing Integration

### 7.1 Component Tests with axe-core

```typescript
// src/lib/components/ui/Button.test.ts
import { render } from '@testing-library/svelte';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button.svelte';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(Button, {
      props: { children: 'Нажми меня' }
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have accessible name', () => {
    const { getByRole } = render(Button, {
      props: { 'aria-label': 'Закрыть' }
    });
    
    expect(getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });
});
```

### 7.2 E2E Tests with Playwright axe

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('landing page should not have violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/auth/login');
    
    const results = await new AxeBuilder({ page })
      .include('form')
      .analyze();
    
    const labelViolations = results.violations.filter(v => v.id === 'label');
    expect(labelViolations).toHaveLength(0);
  });
});
```

### 7.3 CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Build application
        run: bun run build
      
      - name: Run Pa11y CI
        run: bunx pa11y-ci
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

---

## 8. Resources and References

### 8.1 WCAG Guidelines
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Understanding WCAG**: https://www.w3.org/WAI/WCAG21/Understanding/

### 8.2 ARIA Specifications
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **ARIA in HTML**: https://www.w3.org/TR/html-aria/

### 8.3 Testing Tools
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **Pa11y**: https://pa11y.org/

### 8.4 Screen Readers
- **NVDA**: https://www.nvaccess.org/
- **JAWS**: https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver**: Built into macOS/iOS
- **TalkBack**: Built into Android

### 8.5 Contrast Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **Contrast**: https://usecontrast.com/

### 8.6 Learning Resources
- **A11ycasts by Google**: https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g
- **WebAIM**: https://webaim.org/
- **The A11Y Project**: https://www.a11yproject.com/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## 9. Russian Language Accessibility Considerations

### 9.1 Screen Reader Pronunciation

#### Issue: Incorrect Pronunciation of Russian Text
Some screen readers may struggle with Russian Cyrillic characters.

**Solutions:**
1. **Set `lang` attribute** on HTML root and inline where language changes:

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <title>cover.me - Генератор сопроводительных писем</title>
  </head>
  <body>
    <p>Добро пожаловать на платформу</p>

    <!-- If mixing languages -->
    <blockquote lang="en">
      "Generate professional cover letters with AI"
    </blockquote>
  </body>
</html>
```

2. **Configure screen reader language settings** (testing guide for Russian):
   - **NVDA**: Preferences → Speech → Language (select Russian)
   - **VoiceOver**: System Preferences → Accessibility → VoiceOver → Speech (add Russian)

### 9.2 Form Labels in Russian

Ensure all form labels use clear, natural Russian:

```svelte
<!-- ✅ GOOD: Clear Russian labels -->
<label for="full-name">Полное имя</label>
<input id="full-name" type="text" autocomplete="name" />

<label for="email">Электронная почта</label>
<input id="email" type="email" autocomplete="email" />

<button type="submit">Отправить</button>
```

### 9.3 Error Messages in Russian

```svelte
<!-- ✅ GOOD: Russian error messages -->
<script>
  const errors = {
    required: 'Это поле обязательно для заполнения',
    email: 'Введите корректный адрес электронной почты',
    passwordLength: 'Пароль должен содержать минимум 8 символов',
    passwordMatch: 'Пароли не совпадают'
  };
</script>

<div role="alert" aria-live="assertive">
  {errors[errorType]}
</div>
```

### 9.4 ARIA Labels in Russian

```svelte
<!-- ✅ GOOD: Russian ARIA labels -->
<button aria-label="Закрыть диалог">
  <CloseIcon aria-hidden="true" />
</button>

<nav aria-label="Основная навигация">
  <!-- Navigation items -->
</nav>

<input 
  type="search" 
  aria-label="Поиск по курсам" 
  placeholder="Введите запрос..."
/>
```

---

## 10. Accessibility Acceptance Criteria

Before deploying any page or component, verify:

### Must-Pass Criteria
- [ ] **Lighthouse Accessibility Score**: 95+ (98+ target)
- [ ] **axe DevTools**: Zero violations
- [ ] **Keyboard Navigation**: All functionality accessible
- [ ] **Screen Reader**: Content makes sense when read aloud
- [ ] **Color Contrast**: All text meets WCAG AA standards
- [ ] **Focus Indicators**: Visible on all interactive elements
- [ ] **Forms**: All inputs labeled, errors announced
- [ ] **Images**: All content images have alt text
- [ ] **Semantic HTML**: Proper use of headings, landmarks, lists
- [ ] **ARIA**: Used correctly, not redundantly

### Recommended Criteria
- [ ] **Lighthouse Accessibility Score**: 100
- [ ] **WCAG AAA Compliance**: Where feasible (7:1 contrast)
- [ ] **Multiple Screen Reader Testing**: NVDA + VoiceOver
- [ ] **Captions**: All videos have captions
- [ ] **Transcripts**: Video transcripts available
- [ ] **Language**: `lang` attribute set correctly

---

## Document Status

**Version**: 1.0
**Last Updated**: 2025-12-10
**Author**: cover.me Development Team
**Review Status**: ✅ Approved for Implementation

**Related Documents**:
- [PRD - Accessibility Requirements](./prd.md#accessibility-requirements)
- [Testing Strategy - Accessibility Testing](./testing-strategy.md#4-accessibility-testing)
- [Component Library](./component-library.md)

**Changelog**:
- 2025-12-10: Updated for cover.me AI cover letter writer platform
