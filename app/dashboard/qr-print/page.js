import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "./print-button";

export default async function QrPrintPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    redirect("/onboarding");
  }

  const headerStore = await headers();
  const protocol = headerStore.get("x-forwarded-proto") || "http";
  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host") ||
    "localhost:3000";
  const baseUrl = `${protocol}://${host}`;
  const publicReviewUrl = `${baseUrl}/r/${business.slug}`;
  const qrUrl = `/api/qr/${business.slug}`;

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 print:bg-white print:py-0">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h1 className="text-xl font-semibold text-zinc-900">QR Poster</h1>
          <div className="flex gap-2">
            <a
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Back to Dashboard
            </a>
            <PrintButton />
          </div>
        </div>

        <article className="rounded-2xl border border-zinc-300 bg-white p-8 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Riveww
          </p>
          <h2 className="mt-3 text-center text-4xl font-bold tracking-tight text-zinc-900 print:text-5xl">
            {business.name}
          </h2>
          <p className="mt-4 text-center text-xl font-medium text-zinc-800 print:text-2xl">
            Scan to leave a review
          </p>
          <p className="mt-2 text-center text-sm text-zinc-600 print:text-base">
            Your feedback helps us improve and serve you better.
          </p>

          <div className="mx-auto mt-8 w-fit rounded-2xl border border-zinc-200 bg-white p-4 print:mt-10 print:p-5">
            <img
              src={qrUrl}
              alt={`${business.name} review QR code`}
              className="h-72 w-72 print:h-[360px] print:w-[360px]"
            />
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500 print:text-sm">
            If scanning fails, open: {publicReviewUrl}
          </p>
        </article>
      </section>
    </main>
  );
}
