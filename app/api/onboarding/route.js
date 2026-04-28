import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function makeSlugBase(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function randomSuffix(length = 4) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again to continue onboarding." },
      { status: 401 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid form submission. Please try again." },
      { status: 400 }
    );
  }

  const name = payload?.name?.trim();
  const category = payload?.category?.trim() || null;
  const googleReviewUrl = payload?.googleReviewUrl?.trim();
  const defaultTone = payload?.defaultTone;
  const defaultLanguage = payload?.defaultLanguage;
  const keywordInput = payload?.keywords?.trim() || "";

  if (!name) {
    return NextResponse.json(
      { error: "Business name is required." },
      { status: 400 }
    );
  }

  if (!googleReviewUrl || !googleReviewUrl.startsWith("http")) {
    return NextResponse.json(
      { error: "Please enter a valid Google review URL." },
      { status: 400 }
    );
  }

  const allowedTones = ["professional", "friendly", "enthusiastic"];
  const allowedLanguages = ["english", "nepali", "nenglish"];

  if (!allowedTones.includes(defaultTone)) {
    return NextResponse.json(
      { error: "Please choose a valid tone." },
      { status: 400 }
    );
  }

  if (!allowedLanguages.includes(defaultLanguage)) {
    return NextResponse.json(
      { error: "Please choose a valid language." },
      { status: 400 }
    );
  }

  const keywords = keywordInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);

  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existingBusiness) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const base = makeSlugBase(name) || "business";
  let insertError = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = `${base}-${randomSuffix(4)}`;
    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name,
      category,
      google_review_url: googleReviewUrl,
      slug,
      keywords,
      default_tone: defaultTone,
      default_language: defaultLanguage,
    });

    if (!error) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    insertError = error;
    if (error.code !== "23505") {
      break;
    }
  }

  if (insertError?.code === "42501") {
    return NextResponse.json(
      {
        error:
          "Permission denied while saving business details. Please check Supabase RLS insert policy for businesses.",
      },
      { status: 403 }
    );
  }

  if (insertError?.code === "23514") {
    return NextResponse.json(
      {
        error:
          "Database constraint rejected one field. If you selected Nenglish, update the businesses.default_language check constraint to allow 'nenglish'.",
      },
      { status: 400 }
    );
  }

  if (insertError?.code === "23502") {
    return NextResponse.json(
      {
        error:
          "A required business field is missing in the database schema. Please verify required columns on businesses.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error:
        "We could not save onboarding due to a database configuration issue. Please verify table constraints and RLS policies.",
    },
    { status: 500 }
  );
}
