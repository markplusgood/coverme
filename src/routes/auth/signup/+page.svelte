<script lang="ts">
    export let form;
    let error: string | null = null;

    $: if (form?.error) {
        error = form.error;
    }
</script>

<h1 class="text-3xl font-bold text-center my-8">Sign Up for cover.me</h1>
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
                minlength="8"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
        </div>

        <div>
            <label
                for="confirm-password"
                class="block text-sm font-medium text-gray-700"
                >Confirm Password</label
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
            Sign Up
        </button>
    </form>

    <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
            Already have an account?
            <a
                href="/auth/login"
                class="font-medium text-primary-600 hover:text-primary-500"
                >Log in</a
            >
        </p>
    </div>
</div>
