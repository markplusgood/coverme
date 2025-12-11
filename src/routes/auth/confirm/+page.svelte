<script lang="ts">
    export let data;
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    {#if data?.error}
        <div class="text-center">
            <div
                class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Confirmation Failed
            </h1>
            <p class="text-gray-600 mb-6">{data.error}</p>
            <a
                href="/auth/signup"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Try Signing Up Again
            </a>
        </div>
    {:else if data?.success}
        <div class="text-center">
            <div
                class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
                <svg
                    class="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Email Confirmed!
            </h1>
            <p class="text-gray-600 mb-6">
                Your email has been successfully confirmed. You can now log in
                to your account.
            </p>
            <a
                href="/auth/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Log In Now
            </a>
        </div>
    {:else}
        <div class="text-center">
            <div
                class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center animate-spin"
            >
                <svg
                    class="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Confirming Your Email...
            </h1>
            <p class="text-gray-600">
                Please wait while we confirm your email address.
            </p>
        </div>
    {/if}
</div>
