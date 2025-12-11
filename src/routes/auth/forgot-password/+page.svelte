<script lang="ts">
    export let form;
    let error: string | null = null;
    let success: string | null = null;

    $: if (form?.error) {
        error = form.error;
    }

    $: if (form?.success && form?.message) {
        success = form.message;
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
            <p class="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or
                <a
                    href="/auth/forgot-password"
                    class="font-medium text-primary-600 hover:text-primary-500"
                    >try again</a
                >.
            </p>
        </div>
    {:else}
        <form method="POST" class="space-y-4">
            <div>
                <p class="text-sm text-gray-600 mb-4">
                    Enter your email address and we'll send you a link to reset
                    your password.
                </p>

                <label
                    for="email"
                    class="block text-sm font-medium text-gray-700">Email</label
                >
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Send Reset Email
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
