import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import PaymentRequestForm from "./payment-request-form";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, plan")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    redirect("/onboarding");
  }

  const { data: recentRequests } = await supabase
    .from("payment_requests")
    .select("id, amount_npr, payment_method, reference_code, status, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <section className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Manual Payment</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Scan the QR below, complete the payment, then submit your details.
          Admin will manually verify and activate your Pro plan.
        </p>

        <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          Current plan for {business.name}:{" "}
          <span className="font-semibold uppercase">{business.plan}</span>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <h2 className="text-base font-semibold text-zinc-900">Scan and pay</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Use this QR to make the payment. Then, in the note field below,
            write your email so we can approve your upgrade manually.
          </p>
          <div className="mt-4 mx-auto w-full max-w-xs overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <Image
              src="/manual-payment-qr.png"
              alt="Manual payment QR"
              width={842}
              height={1000}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        <PaymentRequestForm />

        <div className="mt-8">
          <h2 className="text-base font-semibold text-zinc-900">
            Recent payment requests
          </h2>
          <div className="mt-3 space-y-2">
            {(recentRequests || []).length === 0 ? (
              <p className="text-sm text-zinc-600">No payment requests submitted yet.</p>
            ) : (
              recentRequests.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"
                >
                  <p className="font-medium text-zinc-800">
                    {item.payment_method} • NPR {item.amount_npr}
                  </p>
                  <p className="mt-1 text-zinc-600">
                    Ref: {item.reference_code} • Status:{" "}
                    <span className="font-medium uppercase">{item.status}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
