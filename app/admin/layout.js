import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/is-admin";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage businesses and manual payment approvals.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/businesses"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Businesses
            </Link>
            <Link
              href="/admin/payments"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Payments
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
