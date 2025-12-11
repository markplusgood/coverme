<script lang="ts">
  import { page } from "$app/stores";
</script>

<!-- SEO Meta Tags -->
<svelte:head>
  <meta
    name="description"
    content="AI-powered cover letter writer that creates tailored cover letters from your background, resume, and job description. Get hired faster with cover.me."
  />
  <meta
    name="keywords"
    content="cover letter, AI cover letter, job application, resume, career, hiring"
  />
  <meta property="og:title" content="cover.me - AI Cover Letter Writer" />
  <meta
    property="og:description"
    content="Create tailored cover letters instantly with AI. Get hired faster!"
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://cover.me" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="cover.me - AI Cover Letter Writer" />
  <meta
    name="twitter:description"
    content="Create tailored cover letters instantly with AI. Get hired faster!"
  />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
  <div class="max-w-6xl mx-auto px-4 text-center">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
      Get Hired Faster with <span class="text-primary-600"
        >AI-Powered Cover Letters</span
      >
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
      cover.me generates tailored cover letters from your background, resume,
      and job description. Stand out from the competition and land your dream
      job.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <a
        href="/generator"
        class="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
      >
        Try Now - Generate Cover Letter
      </a>
      <a
        href="/auth/signup"
        class="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
      >
        Sign Up Free
      </a>
      <a
        href="#features"
        class="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
      >
        Learn More
      </a>
    </div>

    <!-- Hero Image/Illustration Placeholder -->
    <div class="mt-12">
      <img
        src="/cover-letter-illustration.svg"
        alt="AI generating a cover letter"
        class="mx-auto max-w-2xl w-full"
        on:error={() => {}}
      />
    </div>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-16 bg-white">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
      Why Choose cover.me?
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Feature 1 -->
      <div
        class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-primary-600 mb-4">
          <svg
            class="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">
          Tailored to Each Job
        </h3>
        <p class="text-gray-600 text-center">
          Our AI analyzes job descriptions and your background to create
          personalized cover letters that match each position perfectly.
        </p>
      </div>

      <!-- Feature 2 -->
      <div
        class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-primary-600 mb-4">
          <svg
            class="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">
          ATS-Friendly Format
        </h3>
        <p class="text-gray-600 text-center">
          Our cover letters are optimized for Applicant Tracking Systems to
          ensure they get seen by hiring managers.
        </p>
      </div>

      <!-- Feature 3 -->
      <div
        class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-primary-600 mb-4">
          <svg
            class="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">
          Multiple Tones & Styles
        </h3>
        <p class="text-gray-600 text-center">
          Choose from professional, enthusiastic, or concise tones to match your
          personality and the job requirements.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="py-16 bg-gray-50">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
      How It Works
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Step 1 -->
      <div class="text-center">
        <div
          class="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
        >
          1
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          Upload Your Resume
        </h3>
        <p class="text-gray-600">
          Start by uploading your resume or connecting your LinkedIn profile to
          import your work experience.
        </p>
      </div>

      <!-- Step 2 -->
      <div class="text-center">
        <div
          class="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
        >
          2
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          Paste Job Description
        </h3>
        <p class="text-gray-600">
          Copy and paste the job description from the position you're applying
          for, or provide a link to the job posting.
        </p>
      </div>

      <!-- Step 3 -->
      <div class="text-center">
        <div
          class="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
        >
          3
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          Generate & Customize
        </h3>
        <p class="text-gray-600">
          Our AI generates a tailored cover letter in seconds. Review, edit, and
          download in your preferred format.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-primary-600 text-white">
  <div class="max-w-4xl mx-auto px-4 text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
    <p class="text-xl mb-8 opacity-90">
      Join thousands of professionals who are getting hired faster with
      cover.me.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/generator"
        class="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Try Now - Generate Cover Letter
      </a>
      <a
        href="/auth/signup"
        class="bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold border-2 border-white hover:bg-primary-800 transition-colors"
      >
        Sign Up Free
      </a>
    </div>
  </div>
</section>
