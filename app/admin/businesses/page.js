import { createClient } from "@/lib/supabase/server";
import BusinessControls from "./business-controls";

export default async function AdminBusinessesPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const plan = (params?.plan || "all").trim();

  let query = supabase
    .from("businesses")
    .select(
      "id, owner_id, name, category, contact_person, phone_number, whatsapp_number, address, google_review_url, slug, keywords, default_tone, default_language, plan, generations_used_this_month, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (plan === "free" || plan === "pro") {
    query = query.eq("plan", plan);
  }

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,slug.ilike.%${q}%,category.ilike.%${q}%,owner_id::text.ilike.%${q}%`
    );
  }

  const { data: businesses, error } = await query;
  const businessIds = (businesses || []).map((item) => item.id);

  let paymentSummaryMap = {};
  if (businessIds.length > 0) {
    const { data: paymentRows } = await supabase
      .from("payment_requests")
      .select("business_id, status, created_at")
      .in("business_id", businessIds)
      .order("created_at", { ascending: false });

    paymentSummaryMap = (paymentRows || []).reduce((acc, row) => {
      if (!acc[row.business_id]) {
        acc[row.business_id] = {
          latestStatus: row.status,
          totalRequests: 0,
          pendingCount: 0,
        };
      }
      acc[row.business_id].totalRequests += 1;
      if (row.status === "pending") {
        acc[row.business_id].pendingCount += 1;
      }
      return acc;
    }, {});
  }

  const allBusinesses = businesses || [];
  const totalBusinesses = allBusinesses.length;
  const proCount = allBusinesses.filter((item) => item.plan === "pro").length;
  const freeCount = allBusinesses.filter((item) => item.plan === "free").length;
  const totalMonthlyUsage = allBusinesses.reduce(
    (sum, item) => sum + (item.generations_used_this_month || 0),
    0
  );

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total businesses
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {totalBusinesses}
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Pro plan
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{proCount}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Free plan
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{freeCount}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Monthly generations
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {totalMonthlyUsage}
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            Business Management
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Search, filter, and control plan, limits, keywords, and core business settings.
          </p>
        </div>

        <form action="/admin/businesses" className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium text-zinc-700" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="name, slug, category, owner id"
              className="mt-1 h-11 w-80 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700" htmlFor="plan">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              defaultValue={plan}
              className="mt-1 h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            >
              <option value="all">All plans</option>
              <option value="free">Free only</option>
              <option value="pro">Pro only</option>
            </select>
          </div>
          <button
            type="submit"
            className="min-h-11 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Apply
          </button>
          <a
            href="/admin/businesses"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
          >
            Reset
          </a>
        </form>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Could not load businesses. Please check RLS policy for admin access.
        </p>
      ) : null}

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
          Total shown: {allBusinesses.length}
        </div>

        {allBusinesses.length === 0 ? (
          <p className="text-sm text-zinc-600">No businesses found for this filter.</p>
        ) : (
          <div className="space-y-4">
            {allBusinesses.map((business) => (
            <article
              key={business.id}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-zinc-900">{business.name}</p>
                  <p className="mt-1 text-sm text-zinc-700">
                    Category: {business.category || "Not set"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-zinc-700">
                  {business.plan}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <p className="rounded bg-white px-3 py-2 text-sm text-zinc-700">
                  Slug: <span className="font-medium">{business.slug}</span>
                </p>
                <p className="rounded bg-white px-3 py-2 text-sm text-zinc-700">
                  Monthly usage:{" "}
                  <span className="font-medium">{business.generations_used_this_month}</span>
                </p>
                <p className="rounded bg-white px-3 py-2 text-sm text-zinc-700">
                  Tone: <span className="font-medium">{business.default_tone}</span> | Language:{" "}
                  <span className="font-medium">{business.default_language}</span>
                </p>
                <p className="rounded bg-white px-3 py-2 text-sm text-zinc-700">
                  Payments: {paymentSummaryMap[business.id]?.totalRequests || 0} total,{" "}
                  {paymentSummaryMap[business.id]?.pendingCount || 0} pending
                </p>
              </div>

              <p className="mt-3 text-sm text-zinc-700">
                Keywords:{" "}
                {(business.keywords || []).length > 0
                  ? business.keywords.join(", ")
                  : "None"}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                Contact: {business.contact_person || "Not set"} | Phone:{" "}
                {business.phone_number || "Not set"} | WhatsApp:{" "}
                {business.whatsapp_number || "Not set"}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                Address: {business.address || "Not set"}
              </p>
              <p className="mt-1 break-all text-sm text-zinc-700">
                Google review URL: {business.google_review_url}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Owner ID: <span className="font-mono">{business.owner_id}</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Created: {new Date(business.created_at).toLocaleString()} | Updated:{" "}
                {new Date(business.updated_at).toLocaleString()}
              </p>
              <BusinessControls business={business} />
            </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
