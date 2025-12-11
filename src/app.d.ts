/// <reference types="@cloudflare/workers-types" />
import type { Session, User } from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            getSession: () => Promise<Session | null>;
            getUser: () => Promise<User | null>;
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
        }
        // interface Error {}
        // interface PageData {}
        // interface Platform {}
    }
}

export { };