import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/is-admin";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Only admin can approve or reject payments." },
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid action payload." }, { status: 400 });
  }

  const action = payload?.action;
  const adminNote = payload?.adminNote?.trim() || null;
  if (!["approved", "rejected"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid action. Use approved or rejected." },
      { status: 400 }
    );
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payment_requests")
    .select("id, business_id, status")
    .eq("id", id)
    .maybeSingle();

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: "Payment request not found." },
      { status: 404 }
    );
  }

  if (payment.status !== "pending") {
    return NextResponse.json(
      { error: "This payment request is already processed." },
      { status: 409 }
    );
  }

  const { error: updateError } = await supabase
    .from("payment_requests")
    .update({
      status: action,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      admin_note: adminNote,
    })
    .eq("id", payment.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Could not update payment request." },
      { status: 500 }
    );
  }

  if (action === "approved") {
    await supabase
      .from("businesses")
      .update({ plan: "pro" })
      .eq("id", payment.business_id);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
