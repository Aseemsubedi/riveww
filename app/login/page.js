"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <section className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Riveww
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
            Sign in and manage your business profile, customer review flow, QR
            assets, and AI-generated review drafts from one clean dashboard.
          </p>

          <div className="mt-6 space-y-2 text-sm text-zinc-700">
            <p>Built for Nepali businesses.</p>
            <p>Fast onboarding and simple operations.</p>
            <p>Google-first visibility growth workflow.</p>
          </div>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">Sign in to continue</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Use your Google account to access your workspace securely.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.3 0 10.1-2 13.7-5.2l-6.3-5.3c-2.1 1.6-4.7 2.5-7.4 2.5-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.7 39.5 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.3 5.3C39.3 37 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-4 text-xs text-zinc-500">
            By signing in, you allow secure authentication through Google OAuth.
          </p>
        </article>
      </section>
    </main>
  );
}
