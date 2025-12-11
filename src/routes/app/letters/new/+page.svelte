<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let resumeText = "";
    let jobDescription = "";
    let jobTitle = "";
    let company = "";
    let tone = "concise";
    let language = "english";
    let isGenerating = false;
    let generatedLetter = "";
    let errorMessage = "";

    // Tone options
    const toneOptions = [
        { value: "concise", label: "Concise" },
        { value: "professional", label: "Professional" },
        { value: "enthusiastic", label: "Enthusiastic" },
    ];

    // Language options
    const languageOptions = [
        { value: "english", label: "English" },
        { value: "russian", label: "Russian" },
    ];

    async function generateCoverLetter() {
        if (!resumeText.trim() || !jobDescription.trim()) {
            errorMessage = "Please provide both resume and job description";
            return;
        }

        isGenerating = true;
        errorMessage = "";
        generatedLetter = "";

        try {
            const response = await fetch("/api/generate-letter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeText,
                    jobDescription,
                    jobTitle,
                    company,
                    tone,
                    language,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate cover letter");
            }

            const data = await response.json();
            generatedLetter = data.letter;
        } catch (error) {
            console.error("Generation error:", error);
            errorMessage = "Failed to generate cover letter. Please try again.";
        } finally {
            isGenerating = false;
        }
    }

    function handleResumeUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;
                // Simple text extraction - for MVP we'll just use raw text
                resumeText = content;
            };

            reader.onerror = () => {
                errorMessage = "Failed to read resume file";
            };

            if (file.type === "application/pdf") {
                reader.readAsText(file);
            } else {
                reader.readAsText(file);
            }
        }
    }
</script>

<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Generate Cover Letter</h1>

    <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <!-- Resume Input -->
        <div class="space-y-2">
            <label
                for="resume-text"
                class="block text-sm font-medium text-gray-700">Resume</label
            >
            <textarea
                id="resume-text"
                bind:value={resumeText}
                placeholder="Paste your resume text here or upload a file..."
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="6"
            ></textarea>
            <div class="flex items-center gap-2">
                <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    on:change={handleResumeUpload}
                    class="text-sm text-gray-500"
                    id="resume-upload"
                />
                <label
                    for="resume-upload"
                    class="cursor-pointer bg-gray-100 px-3 py-1 rounded-md text-sm hover:bg-gray-200"
                >
                    Upload Resume
                </label>
            </div>
        </div>

        <!-- Job Information -->
        <div class="space-y-4">
            <div class="space-y-2">
                <label
                    for="job-title"
                    class="block text-sm font-medium text-gray-700"
                    >Job Title</label
                >
                <input
                    id="job-title"
                    type="text"
                    bind:value={jobTitle}
                    placeholder="e.g., Software Engineer"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            <div class="space-y-2">
                <label
                    for="company"
                    class="block text-sm font-medium text-gray-700"
                    >Company</label
                >
                <input
                    id="company"
                    type="text"
                    bind:value={company}
                    placeholder="e.g., Acme Inc."
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            <div class="space-y-2">
                <label
                    for="job-description"
                    class="block text-sm font-medium text-gray-700"
                    >Job Description</label
                >
                <textarea
                    id="job-description"
                    bind:value={jobDescription}
                    placeholder="Paste the job description here..."
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="8"
                ></textarea>
            </div>
        </div>

        <!-- Generation Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
                <label
                    for="tone"
                    class="block text-sm font-medium text-gray-700">Tone</label
                >
                <select
                    id="tone"
                    bind:value={tone}
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    {#each toneOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>

            <div class="space-y-2">
                <label
                    for="language"
                    class="block text-sm font-medium text-gray-700"
                    >Language</label
                >
                <select
                    id="language"
                    bind:value={language}
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    {#each languageOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- Generate Button -->
        <div class="text-center">
            <button
                on:click={generateCoverLetter}
                disabled={isGenerating ||
                    !resumeText.trim() ||
                    !jobDescription.trim()}
                class="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {isGenerating ? "Generating..." : "Generate Cover Letter"}
            </button>
        </div>

        <!-- Error Message -->
        {#if errorMessage}
            <div
                class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md"
            >
                {errorMessage}
            </div>
        {/if}

        <!-- Generated Letter Output -->
        {#if generatedLetter}
            <div class="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 class="text-xl font-semibold mb-4">Your Cover Letter</h2>
                <div
                    class="prose max-w-none bg-white p-4 rounded-md border border-gray-200"
                >
                    {@html generatedLetter}
                </div>

                <div class="mt-4 flex gap-2">
                    <button
                        on:click={() =>
                            navigator.clipboard.writeText(generatedLetter)}
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                    <button
                        on:click={() => {
                            const blob = new Blob([generatedLetter], {
                                type: "text/plain",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${company}-${jobTitle}-cover-letter.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Download as Text
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
