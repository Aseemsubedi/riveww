import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TONES = ["professional", "friendly", "enthusiastic"];
const ALLOWED_LANGUAGES = ["english", "nepali", "nenglish"];

export async function PATCH(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const update = {};

  if (typeof payload.name === "string") {
    const name = payload.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Business name cannot be empty." }, { status: 400 });
    }
    update.name = name;
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
    const url = payload.googleReviewUrl.trim();
    if (!url.startsWith("http")) {
      return NextResponse.json(
        { error: "Google review URL must start with http or https." },
        { status: 400 }
      );
    }
    update.google_review_url = url;
  }

  if (typeof payload.defaultTone === "string") {
    if (!ALLOWED_TONES.includes(payload.defaultTone)) {
      return NextResponse.json({ error: "Invalid tone selection." }, { status: 400 });
    }
    update.default_tone = payload.defaultTone;
  }

  if (typeof payload.defaultLanguage === "string") {
    if (!ALLOWED_LANGUAGES.includes(payload.defaultLanguage)) {
      return NextResponse.json({ error: "Invalid language selection." }, { status: 400 });
    }
    update.default_language = payload.defaultLanguage;
  }

  if (typeof payload.keywords === "string") {
    update.keywords = payload.keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No settings to update." }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json(
      { error: "Business profile not found. Complete onboarding first." },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("businesses")
    .update(update)
    .eq("id", business.id)
    .eq("owner_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Could not update business settings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
