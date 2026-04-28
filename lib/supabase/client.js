import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Browser-safe client that uses public env vars.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
