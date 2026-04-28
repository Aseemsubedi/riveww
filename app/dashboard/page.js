import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/is-admin";
import BusinessSettingsModal from "./business-settings-modal";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
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
  const showAdminLink = isAdminEmail(user.email);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <section className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Welcome, {user.email}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your business profile is active and ready for review generation.
        </p>
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Business profile
              </p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-900">
                {business.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {business.category || "Category not set"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase text-zinc-700">
                {business.default_tone}
              </span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase text-zinc-700">
                {business.default_language}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Public review link
              </p>
              <a
                href={publicReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all text-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-800"
              >
                {publicReviewUrl}
              </a>
              <p className="mt-2 text-xs text-zinc-600">
                Slug: <span className="font-mono">{business.slug}</span>
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Contact details
              </p>
              <div className="mt-2 space-y-1 text-sm text-zinc-700">
                <p>
                  <span className="font-medium text-zinc-900">Contact:</span>{" "}
                  {business.contact_person || "Not set"}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Phone:</span>{" "}
                  {business.phone_number || "Not set"}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">WhatsApp:</span>{" "}
                  {business.whatsapp_number || "Not set"}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Address:</span>{" "}
                  {business.address || "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <BusinessSettingsModal
              business={{
                name: business.name,
                category: business.category,
                contactPerson: business.contact_person,
                phoneNumber: business.phone_number,
                whatsappNumber: business.whatsapp_number,
                address: business.address,
                googleReviewUrl: business.google_review_url,
                keywords: business.keywords || [],
                defaultTone: business.default_tone,
                defaultLanguage: business.default_language,
              }}
            />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold text-zinc-900">Share QR</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Customers can scan this and land directly on your review page.
          </p>
          <p className="mt-3 rounded bg-white px-3 py-2 text-xs text-zinc-700">
            {publicReviewUrl}
          </p>
          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <img
              src={qrUrl}
              alt={`${business.name} review QR code`}
              className="h-32 w-32 rounded border border-zinc-200 bg-white p-2"
            />
            <div className="flex flex-col gap-2">
              <a
                href={qrUrl}
                download={`${business.slug}-review-qr.png`}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Download QR PNG
              </a>
              <a
                href={publicReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
              >
                Open Public Review Page
              </a>
              <a
                href="/dashboard/qr-print"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
              >
                Print QR Poster
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold text-zinc-900">Plan</h2>
          <p className="mt-1 text-sm text-zinc-600">
            You are currently on the free plan. Upgrade controls will be enabled
            after payment integration.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-white p-3">
              <p className="text-sm font-semibold text-zinc-900">Free</p>
              <p className="mt-1 text-xs text-zinc-600">
                Up to 10 AI generations per month
              </p>
            </div>
            <div className="rounded border border-zinc-200 bg-white p-3">
              <p className="text-sm font-semibold text-zinc-900">Pro</p>
              <p className="mt-1 text-xs text-zinc-600">
                More generations and advanced tools
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="mt-4 min-h-11 rounded-md bg-zinc-300 px-4 text-sm font-semibold text-zinc-700"
          >
            Upgrade (coming soon)
          </button>
          <div className="mt-3">
            <a
              href="/dashboard/upgrade"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Submit payment for admin approval
            </a>
          </div>
        </div>

        <div className="mt-6">
          {showAdminLink ? (
            <a
              href="/admin/payments"
              className="mb-3 inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Open Admin Payment Panel
            </a>
          ) : null}
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
