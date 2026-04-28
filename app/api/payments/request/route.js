import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to submit a payment request." },
      { status: 401 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid payment request payload." },
      { status: 400 }
    );
  }

  const paymentMethod = payload?.paymentMethod?.trim();
  const referenceCode = payload?.referenceCode?.trim() || null;
  const note = payload?.note?.trim() || null;
  const amountNpr = Number(payload?.amountNpr);

  if (!paymentMethod || !Number.isFinite(amountNpr) || amountNpr <= 0) {
    return NextResponse.json(
      {
        error: "Please provide payment method and amount.",
      },
      { status: 400 }
    );
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json(
      { error: "Business profile not found. Complete onboarding first." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("payment_requests").insert({
    business_id: business.id,
    owner_id: user.id,
    amount_npr: amountNpr,
    payment_method: paymentMethod,
    reference_code: referenceCode || "manual-note",
    note,
    status: "pending",
  });

  if (!error) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  if (error.code === "42P01") {
    return NextResponse.json(
      {
        error:
          "Payment table is missing. Run the payment setup SQL before using admin approval flow.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Could not submit payment request. Please try again." },
    { status: 500 }
  );
}
