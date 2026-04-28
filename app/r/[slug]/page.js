import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewExperienceClient from "./ReviewExperienceClient";

export default async function PublicReviewPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business, error } = await supabase
    .from("businesses")
    .select("name, slug, logo_url, google_review_url, default_language")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-6">
      <section className="mx-auto w-full max-w-xl">
        <header className="mb-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Riveww
          </p>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900">
            Leave a quick review
          </h1>
        </header>
        <ReviewExperienceClient
          business={{
            name: business.name,
            slug: business.slug,
            logoUrl: business.logo_url,
            googleReviewUrl: business.google_review_url,
            defaultLanguage: business.default_language || "english",
          }}
        />
      </section>
    </main>
  );
}
