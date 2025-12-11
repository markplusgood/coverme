SvelteKit Cloudflare configuration
To use SvelteKit with Cloudflare Pages, you need to add the Cloudflare adapter ↗ to your application.

Note

If using create-cloudflare (C3) ↗, you can bypass adding an adapter as C3 automatically installs any necessary adapters and configures them when creating your project.

Install the Cloudflare Adapter by running npm i --save-dev @sveltejs/adapter-cloudflare in your terminal.
Include the adapter in svelte.config.js:
 import adapter from '@sveltejs/adapter-auto';
 import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // ... truncated ...
  }
};

export default config;

(Needed if you are using TypeScript) Include support for environment variables. The env object, containing KV namespaces and other storage objects, is passed to SvelteKit via the platform property along with context and caches, meaning you can access it in hooks and endpoints. For example:
declare namespace App {
    interface Locals {}

   interface Platform {
       env: {
           COUNTER: DurableObjectNamespace;
       };
       context: {
           waitUntil(promise: Promise<any>): void;
       };
       caches: CacheStorage & { default: Cache }
   }

    interface Session {}

    interface Stuff {}
}

Access the added KV or Durable objects (or generally any binding) in your endpoint with env:
JavaScript
export async function post(context) {
  const counter = context.platform.env.COUNTER.idFromName("A");
}