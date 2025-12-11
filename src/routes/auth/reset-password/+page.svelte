<script lang="ts">
    import { page } from "$app/stores";
    export let form: any;
    let error: string | null = null;
    let success: string | null = null;

    $: if (form?.error) {
        error = form.error;
    }

    $: if (form?.success && form?.message) {
        success = form.message;
    }

    // Check for password updated message from URL
    $: {
        const urlParams = $page.url.searchParams;
        if (urlParams.get("message") === "password-updated") {
            success =
                "Password updated successfully! Please log in with your new password.";
        }
    }
</script>

<h1 class="text-3xl font-bold text-center my-8">Reset Your Password</h1>
<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    {#if error}
        <div class="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
            {error}
        </div>
    {/if}

    {#if success}
        <div class="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">
            {success}
        </div>

        <div class="mt-4 text-center">
            <a
                href="/auth/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Go to Login
            </a>
        </div>
    {:else}
        <form method="POST" class="space-y-4">
            <div>
                <p class="text-sm text-gray-600 mb-4">
                    Enter your new password below.
                </p>

                <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                    >New Password</label
                >
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minlength="8"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label
                    for="confirm-password"
                    class="block text-sm font-medium text-gray-700"
                    >Confirm New Password</label
                >
                <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    required
                    minlength="8"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Update Password
            </button>
        </form>
    {/if}

    <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
            Remember your password?
            <a
                href="/auth/login"
                class="font-medium text-primary-600 hover:text-primary-500"
                >Back to login</a
            >
        </p>
    </div>
</div>
