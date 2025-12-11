<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  // File upload state
  let resumeFile: File | null = null;
  let coverLetterExamples: File[] = [];
  let jobListingFile: File | null = null;

  // Text input state
  let resumeText = "";
  let coverLetterExamplesText = "";
  let jobListingText = "";
  let jobTitle = "";
  let company = "";

  // UI state
  let isDragging = false;
  let activeTab = "files"; // 'files' or 'text'
  let isGenerating = false;
  let generatedLetter = "";
  let error = "";

  // Tone and language options
  let selectedTone = "concise";
  let selectedLanguage = "english";

  const toneOptions = [
    { value: "concise", label: "Concise" },
    { value: "professional", label: "Professional" },
    { value: "enthusiastic", label: "Enthusiastic" },
  ];

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "russian", label: "Русский" },
  ];

  // Supported file types
  const supportedTypes = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/msword": ".doc",
    "text/plain": ".txt",
    "text/markdown": ".md",
  };

  onMount(() => {
    // Initialize any needed browser-only functionality
  });

  // File handling functions
  function handleFileSelect(event: Event, type: "resume" | "job" | "example") {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    if (files.length > 0) {
      const file = files[0];
      if (isFileSupported(file)) {
        if (type === "resume") {
          resumeFile = file;
          processFile(file, "resume");
        } else if (type === "job") {
          jobListingFile = file;
          processFile(file, "job");
        } else if (type === "example") {
          coverLetterExamples = [...coverLetterExamples, file];
          processFile(file, "example");
        }
      } else {
        error =
          "Unsupported file type. Please use PDF, DOC, DOCX, TXT, or MD files.";
        setTimeout(() => (error = ""), 5000);
      }
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
  }

  function handleDrop(event: DragEvent, type: "resume" | "job" | "example") {
    event.preventDefault();
    isDragging = false;

    const files = Array.from(event.dataTransfer?.files || []);

    if (files.length > 0) {
      const file = files[0];
      if (isFileSupported(file)) {
        if (type === "resume") {
          resumeFile = file;
          processFile(file, "resume");
        } else if (type === "job") {
          jobListingFile = file;
          processFile(file, "job");
        } else if (type === "example") {
          coverLetterExamples = [...coverLetterExamples, file];
          processFile(file, "example");
        }
      } else {
        error =
          "Unsupported file type. Please use PDF, DOC, DOCX, TXT, or MD files.";
        setTimeout(() => (error = ""), 5000);
      }
    }
  }

  function isFileSupported(file: File): boolean {
    return Object.keys(supportedTypes).includes(file.type);
  }

  async function processFile(file: File, type: "resume" | "job" | "example") {
    try {
      const text = await extractTextFromFile(file);

      if (type === "resume") {
        resumeText = text;
      } else if (type === "job") {
        jobListingText = text;
      } else if (type === "example") {
        coverLetterExamplesText = coverLetterExamplesText
          ? `${coverLetterExamplesText}\n\n--- Example ${coverLetterExamples.length} ---\n${text}`
          : text;
      }
    } catch (err) {
      error = `Failed to extract text from ${file.name}`;
      setTimeout(() => (error = ""), 5000);
    }
  }

  async function extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;

          if (file.type === "text/plain" || file.type === "text/markdown") {
            resolve(content);
          } else if (file.type === "application/pdf") {
            // For PDF files, we'll use a simple approach
            // In a real implementation, you'd use pdf-parse
            resolve("[PDF content would be extracted here]");
          } else if (
            file.type.includes("wordprocessingml") ||
            file.type === "application/msword"
          ) {
            // For Word documents, we'll use mammoth in a real implementation
            resolve("[Word document content would be extracted here]");
          } else {
            resolve(content);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  function handleExampleFilesChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    files.forEach((file: File) => {
      if (isFileSupported(file)) {
        coverLetterExamples = [...coverLetterExamples, file];
        processFile(file, "example");
      }
    });
  }

  function removeFile(type: "resume" | "job" | "example", index?: number) {
    if (type === "resume") {
      resumeFile = null;
      resumeText = "";
    } else if (type === "job") {
      jobListingFile = null;
      jobListingText = "";
    } else if (type === "example" && index !== undefined) {
      coverLetterExamples.splice(index, 1);
      if (coverLetterExamples.length === 0) {
        coverLetterExamplesText = "";
      }
    }
  }

  async function generateCoverLetter() {
    if (!resumeText.trim()) {
      error = "Please provide your resume (text or file)";
      return;
    }

    if (!jobListingText.trim()) {
      error = "Please provide the job listing (text or file)";
      return;
    }

    isGenerating = true;
    error = "";

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobListingText.trim(),
          jobTitle: jobTitle.trim() || "Position",
          company: company.trim() || "Company",
          tone: selectedTone,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || "Failed to generate cover letter");
      }

      const data = (await response.json()) as GenerateLetterResponse;
      generatedLetter = data.letter;

      // Scroll to generated letter
      setTimeout(() => {
        const element = document.getElementById("generated-letter");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      error =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      isGenerating = false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedLetter);
    // You could add a toast notification here
  }

  function downloadLetter() {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${company || "company"}-${jobTitle || "position"}-cover-letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  interface GenerateLetterResponse {
    success: boolean;
    letter: string;
    message?: string;
  }
</script>

<svelte:head>
  <title>Cover Letter Generator - cover.me</title>
  <meta
    name="description"
    content="Generate tailored cover letters with AI. Upload your resume and job description to get started."
  />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">
          AI Cover Letter Generator
        </h1>
        <a href="/" class="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Home
        </a>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Input Section -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Your Information
          </h2>

          <!-- Tab Selection -->
          <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors {activeTab ===
              'files'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}"
              on:click={() => (activeTab = "files")}
            >
              Upload Files
            </button>
            <button
              class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors {activeTab ===
              'text'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}"
              on:click={() => (activeTab = "text")}
            >
              Paste Text
            </button>
          </div>

          {#if activeTab === "files"}
            <!-- File Upload Tabs -->
            <div class="space-y-6">
              <!-- Resume Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Resume/CV *</label
                >
                <div
                  class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                  on:dragover={handleDragOver}
                  on:dragleave={handleDragLeave}
                  on:drop={(e) => handleDrop(e, "resume")}
                >
                  {#if resumeFile}
                    <div
                      class="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <div class="flex items-center">
                        <svg
                          class="w-5 h-5 text-gray-400 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span class="text-sm text-gray-600"
                          >{resumeFile.name}</span
                        >
                      </div>
                      <button
                        type="button"
                        class="text-red-500 hover:text-red-700"
                        on:click={() => removeFile("resume")}
                      >
                        <svg
                          class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  {:else}
                    <div>
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <div class="mt-4">
                        <label for="resume-upload" class="cursor-pointer">
                          <span
                            class="mt-2 block text-sm font-medium text-gray-900"
                            >Drop your resume here or click to browse</span
                          >
                          <input
                            id="resume-upload"
                            name="resume-upload"
                            type="file"
                            class="sr-only"
                            accept=".pdf,.doc,.docx,.txt,.md"
                            on:change={(e) => handleFileSelect(e, "resume")}
                          />
                        </label>
                        <p class="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, or MD up to 10MB
                        </p>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Job Listing Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Job Listing *</label
                >
                <div
                  class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                  on:dragover={handleDragOver}
                  on:dragleave={handleDragLeave}
                  on:drop={(e) => handleDrop(e, "job")}
                >
                  {#if jobListingFile}
                    <div
                      class="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                      <div class="flex items-center">
                        <svg
                          class="w-5 h-5 text-gray-400 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <span class="text-sm text-gray-600"
                          >{jobListingFile.name}</span
                        >
                      </div>
                      <button
                        type="button"
                        class="text-red-500 hover:text-red-700"
                        on:click={() => removeFile("job")}
                      >
                        <svg
                          class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  {:else}
                    <div>
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <div class="mt-4">
                        <label for="job-upload" class="cursor-pointer">
                          <span
                            class="mt-2 block text-sm font-medium text-gray-900"
                            >Drop job listing here or click to browse</span
                          >
                          <input
                            id="job-upload"
                            name="job-upload"
                            type="file"
                            class="sr-only"
                            accept=".pdf,.doc,.docx,.txt,.md"
                            on:change={(e) => handleFileSelect(e, "job")}
                          />
                        </label>
                        <p class="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, or MD up to 10MB
                        </p>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Cover Letter Examples Upload (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Cover Letter Examples (Optional)</label
                >
                <div
                  class="border-2 border-dashed rounded-lg p-6 text-center transition-colors {isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                  on:dragover={handleDragOver}
                  on:dragleave={handleDragLeave}
                  on:drop={(e) => handleDrop(e, "example")}
                >
                  {#if coverLetterExamples.length > 0}
                    <div class="space-y-2">
                      {#each coverLetterExamples as file, index}
                        <div
                          class="flex items-center justify-between bg-gray-50 p-3 rounded"
                        >
                          <div class="flex items-center">
                            <svg
                              class="w-5 h-5 text-gray-400 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span class="text-sm text-gray-600"
                              >{file.name}</span
                            >
                          </div>
                          <button
                            type="button"
                            class="text-red-500 hover:text-red-700"
                            on:click={() => removeFile("example", index)}
                          >
                            <svg
                              class="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div>
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                      <div class="mt-4">
                        <label for="example-upload" class="cursor-pointer">
                          <span
                            class="mt-2 block text-sm font-medium text-gray-900"
                            >Drop cover letter examples here or click to browse</span
                          >
                          <input
                            id="example-upload"
                            name="example-upload"
                            type="file"
                            class="sr-only"
                            accept=".pdf,.doc,.docx,.txt,.md"
                            multiple
                            on:change={handleExampleFilesChange}
                          />
                        </label>
                        <p class="mt-1 text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, or MD up to 10MB each
                        </p>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {:else}
            <!-- Text Input Tabs -->
            <div class="space-y-6">
              <div>
                <label
                  for="resume-text"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Resume/CV Text *</label
                >
                <textarea
                  id="resume-text"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste your resume or CV content here..."
                  bind:value={resumeText}
                ></textarea>
              </div>

              <div>
                <label
                  for="job-text"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Job Description *</label
                >
                <textarea
                  id="job-text"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste the job description here..."
                  bind:value={jobListingText}
                ></textarea>
              </div>

              <div>
                <label
                  for="examples-text"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Cover Letter Examples (Optional)</label
                >
                <textarea
                  id="examples-text"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste any cover letter examples you'd like the AI to consider..."
                  bind:value={coverLetterExamplesText}
                ></textarea>
              </div>
            </div>
          {/if}
        </div>

        <!-- Job Details -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                for="job-title"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Job Title</label
              >
              <input
                type="text"
                id="job-title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Software Engineer"
                bind:value={jobTitle}
              />
            </div>

            <div>
              <label
                for="company"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Company</label
              >
              <input
                type="text"
                id="company"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Google"
                bind:value={company}
              />
            </div>
          </div>

          <!-- Tone and Language Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="tone"
                class="block text-sm font-medium text-gray-700 mb-2">Tone</label
              >
              <select
                id="tone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                bind:value={selectedTone}
              >
                {#each toneOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>

            <div>
              <label
                for="language"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Language</label
              >
              <select
                id="language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                bind:value={selectedLanguage}
              >
                {#each languageOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <button
          on:click={generateCoverLetter}
          disabled={isGenerating ||
            !resumeText.trim() ||
            !jobListingText.trim()}
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating
            ? "Generating Cover Letter..."
            : "Generate Cover Letter"}
        </button>

        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <svg
                class="w-5 h-5 text-red-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p class="text-sm text-red-800">{error}</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Output Section -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              Generated Cover Letter
            </h2>
            {#if generatedLetter}
              <div class="flex space-x-2">
                <button
                  on:click={copyToClipboard}
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Copy
                </button>
                <button
                  on:click={downloadLetter}
                  class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                >
                  Download
                </button>
              </div>
            {/if}
          </div>

          {#if generatedLetter}
            <div
              id="generated-letter"
              class="bg-gray-50 border border-gray-200 rounded-lg p-6"
            >
              <pre
                class="whitespace-pre-wrap text-sm text-gray-800 font-sans">{generatedLetter}</pre>
            </div>
          {:else}
            <div
              class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center"
            >
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No cover letter generated yet
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Fill in your information and click "Generate Cover Letter" to
                get started.
              </p>
            </div>
          {/if}
        </div>

        <!-- Attached Files/Text Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Attached Content
          </h3>

          <div class="space-y-3">
            {#if resumeText}
              <div class="flex items-start space-x-3">
                <div
                  class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Resume/CV</p>
                  <p class="text-xs text-gray-500">
                    {resumeText.length} characters
                  </p>
                </div>
              </div>
            {/if}

            {#if jobListingText}
              <div class="flex items-start space-x-3">
                <div
                  class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Job Listing</p>
                  <p class="text-xs text-gray-500">
                    {jobListingText.length} characters
                  </p>
                </div>
              </div>
            {/if}

            {#if coverLetterExamplesText}
              <div class="flex items-start space-x-3">
                <div
                  class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    Cover Letter Examples
                  </p>
                  <p class="text-xs text-gray-500">
                    {coverLetterExamplesText.length} characters
                  </p>
                </div>
              </div>
            {/if}

            {#if !resumeText && !jobListingText && !coverLetterExamplesText}
              <p class="text-sm text-gray-500">No content attached yet.</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      Arial, sans-serif;
  }
</style>
