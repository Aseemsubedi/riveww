import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Browser-safe client that uses public env vars.
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey);
}
