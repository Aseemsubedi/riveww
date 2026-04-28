import { createClient } from "@/lib/supabase/server";
import PaymentActions from "./payment-actions";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("payment_requests")
    .select(
      "id, amount_npr, payment_method, reference_code, note, status, created_at, businesses(name)"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <section className="rounded-xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">Admin Payment Approvals</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Approve or reject manual payment requests from businesses.
      </p>

      <div className="mt-6 space-y-3">
        {(requests || []).length === 0 ? (
          <p className="text-sm text-zinc-600">No payment requests found.</p>
        ) : (
          requests.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <p className="text-sm font-semibold text-zinc-900">
                {item.businesses?.name || "Unknown business"} • NPR {item.amount_npr}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                Method: {item.payment_method} • Ref: {item.reference_code}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                Status: <span className="font-medium uppercase">{item.status}</span>
              </p>
              {item.note ? (
                <p className="mt-1 text-sm text-zinc-600">Note: {item.note}</p>
              ) : null}
              <div className="mt-3">
                {item.status === "pending" ? (
                  <PaymentActions paymentId={item.id} />
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
