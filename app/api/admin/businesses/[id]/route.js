import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/is-admin";

const ALLOWED_TONES = ["professional", "friendly", "enthusiastic"];
const ALLOWED_LANGUAGES = ["english", "nepali", "nenglish"];
const ALLOWED_PLANS = ["free", "pro"];

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
      { error: "Only admin can update business controls." },
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const update = {};

  if (typeof payload.plan === "string") {
    if (!ALLOWED_PLANS.includes(payload.plan)) {
      return NextResponse.json({ error: "Invalid plan value." }, { status: 400 });
    }
    update.plan = payload.plan;
  }

  if (typeof payload.defaultTone === "string") {
    if (!ALLOWED_TONES.includes(payload.defaultTone)) {
      return NextResponse.json({ error: "Invalid tone value." }, { status: 400 });
    }
    update.default_tone = payload.defaultTone;
  }

  if (typeof payload.defaultLanguage === "string") {
    if (!ALLOWED_LANGUAGES.includes(payload.defaultLanguage)) {
      return NextResponse.json({ error: "Invalid language value." }, { status: 400 });
    }
    update.default_language = payload.defaultLanguage;
  }

  if (typeof payload.generationsUsedThisMonth !== "undefined") {
    const value = Number(payload.generationsUsedThisMonth);
    if (!Number.isInteger(value) || value < 0) {
      return NextResponse.json(
        { error: "Monthly usage must be a non-negative integer." },
        { status: 400 }
      );
    }
    update.generations_used_this_month = value;
  }

  if (typeof payload.keywords === "string") {
    update.keywords = payload.keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  if (typeof payload.name === "string") {
    const value = payload.name.trim();
    if (!value) {
      return NextResponse.json({ error: "Business name cannot be empty." }, { status: 400 });
    }
    update.name = value;
  }

  if (typeof payload.category === "string") {
    update.category = payload.category.trim() || null;
  }

  if (typeof payload.contactPerson === "string") {
    update.contact_person = payload.contactPerson.trim() || null;
  }

  if (typeof payload.phoneNumber === "string") {
    update.phone_number = payload.phoneNumber.trim() || null;
  }

  if (typeof payload.whatsappNumber === "string") {
    update.whatsapp_number = payload.whatsappNumber.trim() || null;
  }

  if (typeof payload.address === "string") {
    update.address = payload.address.trim() || null;
  }

  if (typeof payload.googleReviewUrl === "string") {
    const value = payload.googleReviewUrl.trim();
    if (!value.startsWith("http")) {
      return NextResponse.json(
        { error: "Google review URL must start with http or https." },
        { status: 400 }
      );
    }
    update.google_review_url = value;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();

  const { error } = await supabase.from("businesses").update(update).eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "Could not update business settings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
