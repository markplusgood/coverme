# Content Platform Page Layouts & Structure

## Overview

The content platform encompasses all authenticated user experiences after landing page conversion. It includes the portal dashboard, course content, blog, settings, and supporting pages. All layouts follow mobile-first responsive design with sacred geometry principles and focus on usability for spiritual practitioners.

**Base URL**: `https://indigocosmo.club/portal/*`
**Authentication**: Required for all portal routes
**Layout**: Sidebar navigation with responsive mobile drawer

---

## Global Portal Layout (`+layout.svelte`)

### Structure
```svelte
<!-- Portal Layout Template -->
<div class="portal-layout">
  <!-- Sidebar Navigation -->
  <Sidebar {currentPath} {user} />

  <!-- Main Content Area -->
  <main class="portal-main">
    <!-- Breadcrumb Navigation -->
    <Breadcrumbs {items} />

    <!-- Page Content -->
    <div class="page-content">
      <slot />
    </div>
  </main>

  <!-- Mobile Sidebar Overlay -->
  {#if mobileSidebarOpen}
    <MobileSidebar {open} {onClose} />
  {/if}
</div>

<style>
  .portal-layout {
    display: flex;
    min-height: 100vh;
    background: var(--neutral-50);
  }

  .portal-main {
    flex: 1;
    margin-left: 280px; /* Sidebar width */
    transition: margin-left 0.3s ease;
  }

  .page-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Mobile responsive */
  @media (max-width: 1024px) {
    .portal-main {
      margin-left: 0;
    }
  }
</style>
```

### Components Used
- `Sidebar.svelte` - Main navigation
- `MobileSidebar.svelte` - Mobile navigation overlay
- `Breadcrumbs.svelte` - Navigation breadcrumbs
- `UserMenu.svelte` - User dropdown (in sidebar)

### Responsive Behavior
- **Desktop (1024px+)**: Fixed sidebar, full content area
- **Tablet (768px-1023px)**: Collapsible sidebar, adjusted margins
- **Mobile (< 768px)**: Hidden sidebar, hamburger menu trigger

---

## 1. Portal Dashboard (`/portal`)

### Overview
**Purpose**: Central hub for authenticated users showing progress, recent activity, and quick access to features
**URL**: `/portal` (redirects from `/portal/dashboard`)
**Components**: Dashboard widgets, progress cards, quick actions

### Layout Structure
```svelte
<div class="dashboard">
  <!-- Welcome Header -->
  <div class="dashboard-header">
    <h1>Добро пожаловать, {user.full_name || 'Ученик'}</h1>
    <p>Продолжите ваше духовное развитие</p>
  </div>

  <!-- Progress Overview -->
  <div class="progress-section">
    <ProgressOverview {userProgress} />
  </div>

  <!-- Quick Actions Grid -->
  <div class="quick-actions">
    <ActionCard
      title="Продолжить урок"
      description="Вернитесь к последнему уроку"
      href="/portal/course/lessons/{nextLesson.slug}"
      icon="Play"
    />
    <ActionCard
      title="Новое задание"
      description="Проверьте доступные задания"
      href="/portal/course/assignments"
      icon="FileText"
      badge={pendingAssignments}
    />
    <ActionCard
      title="Читать блог"
      description="Новые статьи о духовном развитии"
      href="/portal/blog"
      icon="BookOpen"
    />
    <ActionCard
      title="Библиотека"
      description="Доступ к ресурсам и материалам"
      href="/portal/course/library"
      icon="Library"
    />
  </div>

  <!-- Recent Activity -->
  <div class="recent-activity">
    <h2>Недавняя активность</h2>
    <ActivityFeed {recentActivities} />
  </div>

  <!-- Course Progress Cards -->
  <div class="course-cards">
    <CourseCard
      course="course-1"
      title="Курс 1: Основы Духовного Развития"
      progress={course1Progress}
      nextLesson={course1NextLesson}
    />
    <CourseCard
      course="course-2"
      title="Курс 2: Активация Чакр"
      status="locked"
      requirements="Завершите Курс 1"
    />
  </div>
</div>
```

### Key Components

#### ProgressOverview Component
```svelte
<script lang="ts">
  export let userProgress: UserProgress;

  $: overallProgress = calculateOverallProgress(userProgress);
  $: completedLessons = userProgress.completedLessons;
  $: totalLessons = userProgress.totalLessons;
</script>

<div class="progress-overview">
  <div class="progress-header">
    <h2>Ваш прогресс</h2>
    <div class="progress-stats">
      <span>{completedLessons}/{totalLessons} уроков</span>
      <span>{Math.round(overallProgress)}% завершено</span>
    </div>
  </div>

  <ProgressBar progress={overallProgress} />

  <div class="progress-details">
    <div class="detail-item">
      <span class="label">Текущий курс:</span>
      <span class="value">{userProgress.currentCourse}</span>
    </div>
    <div class="detail-item">
      <span class="label">Следующий урок:</span>
      <span class="value">{userProgress.nextLesson.title}</span>
    </div>
  </div>
</div>
```

#### ActionCard Component
```svelte
<script lang="ts">
  export let title: string;
  export let description: string;
  export let href: string;
  export let icon: string;
  export let badge?: number;
</script>

<a {href} class="action-card">
  <div class="card-icon">
    <Icon name={icon} />
    {#if badge}
      <span class="badge">{badge}</span>
    {/if}
  </div>
  <div class="card-content">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
  <div class="card-arrow">
    <ChevronRight />
  </div>
</a>
```

### Mobile Responsive
- Cards stack vertically on mobile
- Progress overview collapses to summary
- Quick actions become touch-friendly buttons

---

## 2. Course Section Layouts

### Course Overview (`/portal/course`)

**Purpose**: Course selection and high-level progress tracking
**Components**: Course cards, progress visualization

```svelte
<div class="course-overview">
  <div class="course-header">
    <h1>Курсы обучения</h1>
    <p>Структурированная программа духовного развития</p>
  </div>

  <div class="courses-grid">
    <CourseOverviewCard
      courseId="course-1"
      title="Курс 1: Основы Духовного Развития"
      description="Фундамент мировоззрения и безопасные практики"
      duration="4 месяца"
      lessons={17}
      progress={userProgress.course1}
      status="active"
    />

    <CourseOverviewCard
      courseId="course-2"
      title="Курс 2: Активация Чакр"
      description="Практическая работа с энергетическими центрами"
      duration="4 месяца"
      lessons={7}
      progress={0}
      status="locked"
      requirements="Завершите Курс 1"
    />
  </div>
</div>
```

### Lessons Listing (`/portal/course/lessons`)

**Purpose**: Browse and access course lessons
**Layout**: Filterable list with progress indicators

```svelte
<div class="lessons-page">
  <!-- Filters and Search -->
  <div class="lessons-controls">
    <div class="filter-tabs">
      <button class="tab active">Все уроки</button>
      <button class="tab">Незавершенные</button>
      <button class="tab">Завершенные</button>
    </div>

    <div class="search-bar">
      <input type="search" placeholder="Поиск уроков..." />
    </div>
  </div>

  <!-- Lessons List -->
  <div class="lessons-list">
    {#each lessons as lesson (lesson.slug)}
      <LessonCard
        {lesson}
        progress={getLessonProgress(lesson.slug)}
        isCompleted={isLessonCompleted(lesson.slug)}
        isLocked={isLessonLocked(lesson)}
      />
    {/each}
  </div>

  <!-- Course Progress Summary -->
  <div class="course-progress">
    <h2>Прогресс курса</h2>
    <ProgressBar progress={courseProgress} />
    <p>{completedLessons} из {totalLessons} уроков завершено</p>
  </div>
</div>
```

### Individual Lesson Page (`/portal/course/lessons/[slug]`)

**Purpose**: Lesson content delivery and interaction
**Layout**: Content-focused with navigation and notes

```svelte
<div class="lesson-page">
  <!-- Lesson Header -->
  <div class="lesson-header">
    <div class="lesson-meta">
      <span class="course-badge">Курс {lesson.course}</span>
      <span class="duration">{lesson.duration}</span>
    </div>

    <h1>{lesson.title}</h1>

    <div class="lesson-actions">
      <Button
        on:click={markComplete}
        disabled={isCompleted}
        variant={isCompleted ? 'secondary' : 'default'}
      >
        {#if isCompleted}
          <CheckCircle class="w-4 h-4 mr-2" />
          Завершено
        {:else}
          <Circle class="w-4 h-4 mr-2" />
          Отметить как завершенное
        {/if}
      </Button>
    </div>
  </div>

  <!-- Learning Objectives -->
  {#if lesson.objectives}
    <div class="objectives-section">
      <h2>Цели урока</h2>
      <ul class="objectives-list">
        {#each lesson.objectives as objective}
          <li>{objective}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Video Content -->
  {#if lesson.videoUrl}
    <div class="video-section">
      <YouTubeEmbed videoId={lesson.videoId} title={lesson.title} />
    </div>
  {/if}

  <!-- Lesson Content -->
  <div class="lesson-content">
    {@html lesson.htmlContent}
  </div>

  <!-- Personal Notes -->
  <div class="notes-section">
    <h2>Личные заметки</h2>
    <textarea
      bind:value={notes}
      placeholder="Добавьте свои мысли и наблюдения..."
      rows="6"
    />
    <Button on:click={saveNotes} variant="outline">
      Сохранить заметки
    </Button>
  </div>

  <!-- Navigation -->
  <div class="lesson-navigation">
    {#if lesson.prevLesson}
      <Button href="/portal/course/lessons/{lesson.prevLesson}" variant="outline">
        <ChevronLeft class="w-4 h-4 mr-2" />
        Предыдущий урок
      </Button>
    {/if}

    {#if lesson.nextLesson}
      <Button href="/portal/course/lessons/{lesson.nextLesson}">
        Следующий урок
        <ChevronRight class="w-4 h-4 mr-2" />
      </Button>
    {:else}
      <Button href="/portal/course/assignments" variant="outline">
        Перейти к заданиям
      </Button>
    {/if}
  </div>
</div>
```

### Assignments Section (`/portal/course/assignments`)

**Purpose**: Assignment browsing, submission, and tracking
**Layout**: Tabbed interface with status filtering

```svelte
<div class="assignments-page">
  <!-- Assignment Tabs -->
  <div class="assignment-tabs">
    <button class="tab active" on:click={() => filterStatus('all')}>
      Все задания ({totalAssignments})
    </button>
    <button class="tab" on:click={() => filterStatus('pending')}>
      Ожидают ({pendingAssignments})
    </button>
    <button class="tab" on:click={() => filterStatus('submitted')}>
      Отправлены ({submittedAssignments})
    </button>
    <button class="tab" on:click={() => filterStatus('completed')}>
      Завершенные ({completedAssignments})
    </button>
  </div>

  <!-- Assignments List -->
  <div class="assignments-list">
    {#each filteredAssignments as assignment (assignment.slug)}
      <AssignmentCard
        {assignment}
        status={getAssignmentStatus(assignment.slug)}
        dueDate={getDueDate(assignment)}
        onSchedule={() => openScheduleModal(assignment)}
      />
    {/each}
  </div>

  <!-- Schedule Modal -->
  {#if showScheduleModal}
    <ScheduleModal
      assignment={selectedAssignment}
      onSave={handleScheduleSave}
      onClose={() => showScheduleModal = false}
    />
  {/if}
</div>
```

### Assignment Detail Page (`/portal/course/assignments/[slug]`)

**Purpose**: Assignment instructions, submission form, and history
**Layout**: Instructions + submission interface

```svelte
<div class="assignment-detail">
  <!-- Assignment Header -->
  <div class="assignment-header">
    <div class="assignment-meta">
      <span class="course-badge">Курс {assignment.course}</span>
      <span class="assignment-number">Задание {assignment.assignment}</span>
      {#if assignment.dueInDays}
        <span class="due-date">Срок: {assignment.dueInDays} дней</span>
      {/if}
    </div>

    <h1>{assignment.title}</h1>
    <p class="assignment-description">{assignment.description}</p>
  </div>

  <!-- Assignment Content -->
  <div class="assignment-content">
    <div class="instructions-section">
      <h2>Инструкции</h2>
      <div class="instructions-content">
        {@html assignment.instructions}
      </div>
    </div>

    <!-- Practice Exercises -->
    {#if assignment.exercises}
      <div class="exercises-section">
        <h2>Практические упражнения</h2>
        {#each assignment.exercises as exercise, index (index)}
          <div class="exercise-item">
            <h3>{index + 1}. {exercise.name}</h3>
            <p class="exercise-duration">{exercise.duration}</p>
            <div class="exercise-instructions">
              {@html exercise.instructions}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Rubric -->
    {#if assignment.rubric}
      <div class="rubric-section">
        <h2>Критерии оценки</h2>
        {#each assignment.rubric as criterion}
          <div class="rubric-item">
            <span class="criterion-name">{criterion.criteria}</span>
            <span class="criterion-points">{criterion.points} баллов</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Submission Section -->
  <div class="submission-section">
    <h2>Отправка задания</h2>

    {#if existingSubmission}
      <div class="existing-submission">
        <h3>Ваша отправка</h3>
        <div class="submission-content">
          {@html existingSubmission.content}
        </div>
        <div class="submission-meta">
          <span>Отправлено: {formatDate(existingSubmission.submitted_at)}</span>
          <span>Статус: {existingSubmission.status}</span>
        </div>
      </div>
    {:else}
      <AssignmentSubmission
        {assignment}
        onSubmit={handleSubmission}
        {loading}
      />
    {/if}
  </div>
</div>
```

### Library Section (`/portal/course/library`)

**Purpose**: Access to downloadable resources and reference materials
**Layout**: Categorized grid with search and filtering

```svelte
<div class="library-page">
  <!-- Library Header -->
  <div class="library-header">
    <h1>Библиотека ресурсов</h1>
    <p>Дополнительные материалы для вашего духовного развития</p>
  </div>

  <!-- Search and Filters -->
  <div class="library-controls">
    <div class="search-bar">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Поиск ресурсов..."
      />
    </div>

    <div class="category-filters">
      <button class="filter active" on:click={() => setCategory('all')}>
        Все
      </button>
      {#each categories as category}
        <button class="filter" on:click={() => setCategory(category.slug)}>
          {category.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Resources Grid -->
  <div class="resources-grid">
    {#each filteredResources as resource (resource.slug)}
      <LibraryCard
        {resource}
        downloaded={isDownloaded(resource.slug)}
        onDownload={() => handleDownload(resource)}
      />
    {/each}
  </div>

  <!-- Download Modal -->
  {#if showDownloadModal}
    <DownloadModal
      resource={selectedResource}
      onConfirm={confirmDownload}
      onClose={() => showDownloadModal = false}
    />
  {/if}
</div>
```

---

## 3. Blog Section Layouts

### Blog Listing (`/portal/blog`)

**Purpose**: Browse and discover blog articles
**Layout**: Card-based grid with filtering and pagination

```svelte
<div class="blog-page">
  <!-- Blog Header -->
  <div class="blog-header">
    <h1>Блог</h1>
    <p>Статьи о духовном развитии и практиках</p>
  </div>

  <!-- Featured Post -->
  {#if featuredPost}
    <div class="featured-post">
      <PostCard {featuredPost} featured={true} />
    </div>
  {/if}

  <!-- Filters and Search -->
  <div class="blog-controls">
    <div class="tag-filters">
      <button class="tag active" on:click={() => setTag('all')}>
        Все статьи
      </button>
      {#each availableTags as tag}
        <button class="tag" on:click={() => setTag(tag)}>
          {tag}
        </button>
      {/each}
    </div>

    <div class="search-bar">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Поиск статей..."
      />
    </div>
  </div>

  <!-- Posts Grid -->
  <div class="posts-grid">
    {#each posts as post (post.slug)}
      <PostCard {post} />
    {/each}
  </div>

  <!-- Pagination -->
  {#if hasMorePages}
    <div class="pagination">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        on:click={() => goToPage(currentPage - 1)}
      >
        Предыдущая
      </Button>

      <span class="page-info">
        Страница {currentPage} из {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        on:click={() => goToPage(currentPage + 1)}
      >
        Следующая
      </Button>
    </div>
  {/if}
</div>
```

### Individual Blog Post (`/portal/blog/[slug]`)

**Purpose**: Full blog post reading experience
**Layout**: Article layout with table of contents and sharing

```svelte
<div class="blog-post-page">
  <!-- Post Header -->
  <PostHeader {post} />

  <!-- Table of Contents (Desktop) -->
  {#if post.tableOfContents}
    <div class="toc-sidebar">
      <TableOfContents content={post.htmlContent} />
    </div>
  {/if}

  <!-- Post Content -->
  <article class="post-content">
    <!-- Featured Image -->
    {#if post.coverImage}
      <div class="post-image">
        <img src={post.coverImage} alt={post.title} />
      </div>
    {/if}

    <!-- Article Body -->
    <div class="post-body">
      {@html post.htmlContent}
    </div>

    <!-- Tags -->
    {#if post.tags}
      <div class="post-tags">
        {#each post.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}

    <!-- Share Buttons -->
    <div class="post-share">
      <ShareButtons {post} />
    </div>

    <!-- Related Posts -->
    <div class="related-posts">
      <h2>Похожие статьи</h2>
      <div class="related-grid">
        {#each relatedPosts as relatedPost}
          <PostCard {relatedPost} compact={true} />
        {/each}
      </div>
    </div>
  </article>

  <!-- Comments Section (Future) -->
  <!-- <CommentsSection {post} /> -->
</div>
```

---

## 4. Settings & Profile Pages

### Settings Index (`/portal/settings`)

**Purpose**: Navigation hub for all account settings
**Layout**: Tabbed interface with settings categories

```svelte
<div class="settings-page">
  <div class="settings-header">
    <h1>Настройки аккаунта</h1>
    <p>Управляйте своим профилем и настройками</p>
  </div>

  <SettingsTabs {activeTab} {tabs} />

  <div class="settings-content">
    {#if activeTab === 'profile'}
      <ProfileForm {user} onSave={handleProfileSave} />
    {:else if activeTab === 'billing'}
      <BillingSettings {user} />
    {:else if activeTab === 'security'}
      <SecuritySettings {user} onSave={handleSecuritySave} />
    {/if}
  </div>
</div>
```

### Profile Settings (`/portal/settings/profile`)

**Purpose**: User profile management and avatar upload
**Components**: Form with avatar upload, validation

```svelte
<div class="profile-settings">
  <div class="profile-header">
    <h2>Профиль</h2>
    <p>Обновите информацию о себе</p>
  </div>

  <div class="profile-content">
    <!-- Avatar Section -->
    <div class="avatar-section">
      <AvatarUpload
        currentAvatar={user.avatar_url}
        onUpload={handleAvatarUpload}
      />
    </div>

    <!-- Profile Form -->
    <ProfileForm
      initialData={user}
      onSave={handleProfileSave}
      {loading}
    />
  </div>
</div>
```

### Security Settings (`/portal/settings/security`)

**Purpose**: Password changes and account security
**Components**: Password forms, session management

```svelte
<div class="security-settings">
  <div class="security-header">
    <h2>Безопасность</h2>
    <p>Управляйте безопасностью вашего аккаунта</p>
  </div>

  <div class="security-sections">
    <!-- Change Password -->
    <div class="security-section">
      <h3>Изменить пароль</h3>
      <PasswordForm onSave={handlePasswordChange} />
    </div>

    <!-- Active Sessions -->
    <div class="security-section">
      <h3>Активные сессии</h3>
      <SessionsList {sessions} onRevoke={handleSessionRevoke} />
    </div>

    <!-- Danger Zone -->
    <div class="security-section danger-zone">
      <h3>Опасная зона</h3>
      <DangerZone onDeleteAccount={handleAccountDeletion} />
    </div>
  </div>
</div>
```

---

## 5. Authentication Pages

### Login Page (`/auth/login`)

**Purpose**: User authentication entry point
**Layout**: Centered form with social login options

```svelte
<div class="auth-page login-page">
  <div class="auth-container">
    <div class="auth-header">
      <h1>Войти в аккаунт</h1>
      <p>Добро пожаловать обратно</p>
    </div>

    <AuthForm mode="login" onSubmit={handleLogin} />

    <div class="auth-links">
      <a href="/auth/reset-password">Забыли пароль?</a>
      <span>Нет аккаунта? <a href="/auth/signup">Зарегистрироваться</a></span>
    </div>
  </div>
</div>
```

### Signup Page (`/auth/signup`)

**Purpose**: New user registration with consent
**Layout**: Multi-step form with terms acceptance

```svelte
<div class="auth-page signup-page">
  <div class="auth-container">
    <div class="auth-header">
      <h1>Создать аккаунт</h1>
      <p>Начните ваше духовное путешествие</p>
    </div>

    <SignupForm onSubmit={handleSignup} />

    <div class="auth-links">
      <span>Уже есть аккаунт? <a href="/auth/login">Войти</a></span>
    </div>
  </div>
</div>
```

### Password Reset Flow

**Reset Request** (`/auth/reset-password`):
```svelte
<div class="auth-page reset-page">
  <div class="auth-container">
    <h1>Сброс пароля</h1>
    <p>Введите email для получения инструкций</p>
    <ResetForm onSubmit={handleResetRequest} />
  </div>
</div>
```

**Reset Confirmation** (`/auth/update-password`):
```svelte
<div class="auth-page update-password-page">
  <div class="auth-container">
    <h1>Новый пароль</h1>
    <p>Введите новый пароль для вашего аккаунта</p>
    <UpdatePasswordForm onSubmit={handlePasswordUpdate} />
  </div>
</div>
```

---

## Mobile Responsiveness

### Breakpoint Strategy
- **Mobile (< 640px)**: Single column, stacked layouts
- **Tablet (640px-1023px)**: Two-column grids, condensed sidebars
- **Desktop (1024px+)**: Full layouts with sidebars

### Touch Interactions
- Swipe gestures for navigation
- Touch-friendly button sizes (44px minimum)
- Pull-to-refresh on feed-like pages

### Performance Considerations
- Lazy loading for long lists
- Optimized images for mobile networks
- Reduced animation complexity on low-end devices

---

## Accessibility Features

### Navigation
- Skip links for screen readers
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals

### Content
- Semantic HTML structure
- Alt text for all images
- Proper heading hierarchy
- Color contrast compliance

### Forms
- Field labels and descriptions
- Error announcements
- Success confirmations
- Progressive enhancement

---

## Component Integration

All layouts use components from the established library:

- **UI Components**: Button, Input, Card, Dialog, etc.
- **Layout Components**: Sidebar, Header, Footer, Breadcrumbs
- **Feature Components**: ProgressBar, LessonCard, PostCard, etc.
- **Form Components**: AuthForm, ProfileForm, AssignmentSubmission

---

## Performance Optimizations

### Loading Strategies
- Route-based code splitting
- Lazy loading for heavy components
- Progressive image loading
- Service worker caching

### Data Management
- Svelte stores for client state
- Optimistic updates for better UX
- Background sync for offline capabilities
- Efficient re-rendering with keyed lists

---

## Error Handling

### Global Error Boundary
```svelte
<script>
  import { onError } from '$app/stores';

  onError(({ error, event }) => {
    // Log error
    console.error('Portal error:', error);

    // Show user-friendly message
    showToast('Произошла ошибка. Попробуйте перезагрузить страницу.');
  });
</script>
```

### Page-Level Errors
- 404 pages for invalid routes
- Error states for failed API calls
- Retry mechanisms for transient failures
- Fallback UI for degraded functionality

---

## Future Enhancements

### Phase 2 Additions
- Real-time notifications
- Collaborative features
- Advanced progress analytics
- Mobile app integration
- Offline content access

### Gamification Features
- Achievement badges
- Progress streaks
- Leaderboards
- Reward system

---

## Related Documentation

- [`component-library.md`](../component-library.md) - Component specifications
- [`user-flows.md`](../user-flows.md) - User journey documentation
- [`api-reference.md`](../api-reference.md) - Backend API documentation
- [`database-diagram.md`](../database-diagram.md) - Data structure reference