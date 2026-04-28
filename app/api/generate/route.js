import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FREE_PLAN_LIMIT = 10;

function languageInstruction(defaultLanguage) {
  if (defaultLanguage === "nepali") {
    return "Write in natural Nepali (Devanagari script).";
  }
  if (defaultLanguage === "nenglish") {
    return "Write in Nenglish (Roman-script Nepali mixed with easy English).";
  }
  return "Write in natural English.";
}

function toneInstruction(defaultTone) {
  if (defaultTone === "professional") {
    return "Use a professional, concise tone.";
  }
  if (defaultTone === "enthusiastic") {
    return "Use an enthusiastic and energetic tone.";
  }
  return "Use a friendly and approachable tone.";
}

function extractTextFromGeminiResponse(result) {
  const raw =
    result?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("\n")
      .trim() || "";

  if (!raw) {
    return "";
  }

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  return raw;
}

function parseVariants(modelText) {
  try {
    const parsed = JSON.parse(modelText);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
        .slice(0, 3);
    }
  } catch {
    // Fall through to regex-based extraction.
  }

  const lines = modelText
    .split("\n")
    .map((line) => line.replace(/^\s*(?:\d+[\).\s-]*|[-*]\s*)/, "").trim())
    .filter(Boolean);
  return lines.slice(0, 3);
}

async function generateVariantsWithGemini({
  businessName,
  starRating,
  billItems,
  language,
  tone,
  keywords,
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const keywordLine =
    Array.isArray(keywords) && keywords.length > 0
      ? keywords.join(", ")
      : "No keywords provided";

  const sentimentHint =
    starRating >= 5
      ? "very positive"
      : starRating === 4
      ? "positive with one small improvement point optional"
      : starRating === 3
      ? "balanced and honest"
      : starRating === 2
      ? "mostly critical but respectful"
      : "critical and concise";

  const prompt = `
You are an expert review-writing assistant for a Google Review growth SaaS.
Your job is to generate natural user-written review drafts that avoid repetitive/spammy patterns.

Context:
- Business name: ${businessName}
- Star rating: ${starRating}/5
- Customer details (bill items / experience): ${billItems || "No extra details provided"}
- Business keywords to weave in naturally: ${keywordLine}
- Sentiment target from rating: ${sentimentHint}
- Language rule: ${languageInstruction(language)}
- Tone rule: ${toneInstruction(tone)}

Hard requirements:
1) Return exactly 3 review variants.
2) Each variant must feel clearly different in wording and structure.
3) Each variant should be 35-80 words.
4) Mention at least one concrete detail from customer details or keywords when available.
5) Do not use emojis, hashtags, markdown, or quotation marks.
6) Keep wording human and believable for Google Reviews.
7) Never mention AI, prompt, model, or generated content.

Output format:
- Output ONLY a valid JSON array of 3 strings.
- No additional text before or after JSON.
`.trim();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("gemini_request_failed");
  }

  const result = await response.json();
  const modelText = extractTextFromGeminiResponse(result);
  const variants = parseVariants(modelText);

  if (variants.length < 3) {
    throw new Error("gemini_parse_failed");
  }

  return variants.slice(0, 3);
}

export async function POST(request) {
  const supabase = await createClient();

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Please try again." },
      { status: 400 }
    );
  }

  const slug = payload?.slug?.trim();
  const billItems = payload?.billItems?.trim() || "";
  const starRating = Number(payload?.starRating);
  const requestedLanguage = payload?.language;

  if (!slug) {
    return NextResponse.json({ error: "Missing business slug." }, { status: 400 });
  }

  if (!Number.isInteger(starRating) || starRating < 1 || starRating > 5) {
    return NextResponse.json(
      { error: "Please choose a star rating between 1 and 5." },
      { status: 400 }
    );
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name, plan, default_tone, default_language, keywords")
    .eq("slug", slug)
    .maybeSingle();

  if (businessError || !business) {
    return NextResponse.json(
      { error: "Business not found for this review page." },
      { status: 404 }
    );
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const { count: monthCount, error: countError } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id)
    .gte("created_at", monthStart.toISOString());

  if (countError) {
    return NextResponse.json(
      { error: "Could not check monthly usage right now. Please try again." },
      { status: 500 }
    );
  }

  const generationsThisMonth = monthCount || 0;
  if (business.plan === "free" && generationsThisMonth >= FREE_PLAN_LIMIT) {
    return NextResponse.json(
      {
        error:
          "You have reached the free plan limit of 10 generations this month. Please upgrade to continue.",
      },
      { status: 403 }
    );
  }

  const allowedLanguages = ["english", "nepali", "nenglish"];
  const effectiveLanguage = allowedLanguages.includes(requestedLanguage)
    ? requestedLanguage
    : business.default_language;

  let variants;
  try {
    variants = await generateVariantsWithGemini({
      businessName: business.name,
      starRating,
      billItems,
      language: effectiveLanguage,
      tone: business.default_tone,
      keywords: business.keywords || [],
    });
  } catch (error) {
    if (error.message === "missing_api_key") {
      return NextResponse.json(
        {
          error:
            "Gemini API key is missing. Add GEMINI_API_KEY in local env and Vercel settings.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "AI generation is temporarily unavailable. Please try again in a moment.",
      },
      { status: 502 }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const customerIp = forwardedFor ? forwardedFor.split(",")[0]?.trim() : null;

  const { error: insertError } = await supabase.from("generations").insert({
    business_id: business.id,
    star_rating: starRating,
    bill_items: billItems || null,
    generated_variants: variants,
    customer_ip: customerIp,
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Could not save generated reviews. Please try again." },
      { status: 500 }
    );
  }

  await supabase
    .from("businesses")
    .update({ generations_used_this_month: generationsThisMonth + 1 })
    .eq("id", business.id);

  return NextResponse.json({ variants }, { status: 200 });
}
