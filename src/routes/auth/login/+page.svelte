<script lang="ts">
    export let form;
    let error: string | null = null;

    $: if (form?.error) {
        error = form.error;
    }
</script>

<h1 class="text-3xl font-bold text-center my-8">Log In to cover.me</h1>
<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    {#if error}
        <div class="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
            {error}
        </div>
    {/if}

    <form method="POST" class="space-y-4">
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
            >
            <input
                type="email"
                id="email"
                name="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
        </div>

        <div>
            <label
                for="password"
                class="block text-sm font-medium text-gray-700">Password</label
            >
            <input
                type="password"
                id="password"
                name="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                    for="remember-me"
                    class="ml-2 block text-sm text-gray-900">Remember me</label
                >
            </div>

            <div class="text-sm">
                <a
                    href="/auth/forgot-password"
                    class="font-medium text-primary-600 hover:text-primary-500"
                >
                    Forgot your password?
                </a>
            </div>
        </div>

        <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
            Log In
        </button>
    </form>

    <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
            Don't have an account?
            <a
                href="/auth/signup"
                class="font-medium text-primary-600 hover:text-primary-500"
                >Sign up</a
            >
        </p>
    </div>
</div>
