"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function StarButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 min-w-12 rounded-xl border px-4 text-lg font-semibold transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
      }`}
      aria-label={label}
    >
      ★
    </button>
  );
}

export default function ReviewExperienceClient({ business }) {
  const [starRating, setStarRating] = useState(0);
  const [billItems, setBillItems] = useState("");
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    business.defaultLanguage || "english"
  );

  const canGenerate = useMemo(() => starRating >= 1 && !isLoading, [starRating, isLoading]);
  const ratingLabel =
    starRating > 0 ? `${starRating} star${starRating > 1 ? "s" : ""} selected` : "No rating selected yet";

  const handleGenerate = async () => {
    setError("");
    setIsLoading(true);
    setVariants([]);
    setCopiedIndex(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: business.slug,
          starRating,
          billItems,
          language: selectedLanguage,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not generate review options right now.");
        setIsLoading(false);
        return;
      }

      setVariants(result.variants || []);
      setIsLoading(false);
    } catch {
      setError("Network issue while generating reviews. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
    } catch {
      setError("Could not copy text automatically. Please copy it manually.");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          {business.logoUrl ? (
            <Image
              src={business.logoUrl}
              alt={`${business.name} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-sm font-semibold text-zinc-700">
              {business.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-semibold text-zinc-900">{business.name}</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Share your experience and we will draft review text for you.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          How was your experience?
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarButton
              key={value}
              active={starRating >= value}
              onClick={() => setStarRating(value)}
              label={`${value} star${value > 1 ? "s" : ""}`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-zinc-600">{ratingLabel}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          Review language
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "english", label: "English" },
            { value: "nepali", label: "Nepali" },
            { value: "nenglish", label: "Nenglish" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedLanguage(option.value)}
              className={`min-h-11 rounded-xl border px-4 text-sm font-medium transition ${
                selectedLanguage === option.value
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {starRating > 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
            What did you experience?
          </h3>
          <textarea
            value={billItems}
            onChange={(event) => setBillItems(event.target.value)}
            placeholder="Example: coffee, momos, rooftop seating, quick service"
            className="mt-3 min-h-32 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm leading-6 outline-none ring-zinc-900/10 transition focus:ring-2"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="mt-4 min-h-12 w-full rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isLoading ? "Generating..." : "Generate Review"}
          </button>
          {isLoading ? (
            <p className="mt-3 text-sm text-zinc-600">
              Creating review options for your selected rating...
            </p>
          ) : null}
        </section>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {variants.length > 0 ? (
        <section className="space-y-3">
          <p className="text-sm font-medium text-zinc-700">Choose one review draft:</p>
          {variants.map((variant, index) => (
            <article key={index} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-6 text-zinc-800">{variant}</p>
              <button
                type="button"
                onClick={() => handleCopy(variant, index)}
                className="mt-4 min-h-11 rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                {copiedIndex === index ? "Copied" : "Copy"}
              </button>
            </article>
          ))}
          <a
            href={business.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Open Google Review
          </a>
        </section>
      ) : null}
    </div>
  );
}
