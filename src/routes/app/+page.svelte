<script lang="ts">
    import { page } from "$app/stores";
</script>

<h1 class="text-3xl font-bold text-center my-8">Welcome to Your Dashboard</h1>
<div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <p class="mb-4">You are successfully logged in!</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-blue-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold mb-2">Create New Cover Letter</h2>
            <p class="text-gray-600">
                Generate a tailored cover letter for your next job application.
            </p>
            <a
                href="/app/letters/new"
                class="inline-block mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >Create New Letter</a
            >
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
            <h2 class="text-xl font-semibold mb-2">Your Cover Letters</h2>
            <p class="text-gray-600">
                View and manage all your generated cover letters.
            </p>
            <a
                href="/app/letters"
                class="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >View Letters</a
            >
        </div>
    </div>

    <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-2">Account Settings</h2>
        <p class="text-gray-600">Manage your profile and preferences.</p>
        <a
            href="/app/settings"
            class="inline-block mt-3 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >Settings</a
        >
    </div>
</div>
