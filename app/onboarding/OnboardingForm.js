"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "nepali", label: "Nepali" },
  { value: "nenglish", label: "Nenglish" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    googleReviewUrl: "",
    keywords: "",
    defaultTone: "friendly",
    defaultLanguage: "english",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not save details. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong while saving. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          Business basics
        </h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="name">
            Business name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            placeholder="Test Cafe"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-800"
            htmlFor="category"
          >
            Category
          </label>
          <input
            id="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            placeholder="Cafe"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          Google review URL
        </h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="url">
            Review link
          </label>
          <input
            id="url"
            type="url"
            value={form.googleReviewUrl}
            onChange={(event) =>
              updateField("googleReviewUrl", event.target.value)
            }
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            placeholder="https://g.page/r/example"
            required
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          Personalization
        </h2>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-800"
            htmlFor="keywords"
          >
            Keywords (comma separated)
          </label>
          <input
            id="keywords"
            value={form.keywords}
            onChange={(event) => updateField("keywords", event.target.value)}
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            placeholder="coffee, thamel, cozy"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-800">Default tone</p>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => updateField("defaultTone", tone.value)}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition ${
                  form.defaultTone === tone.value
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-800">
            Default language
          </p>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language.value}
                type="button"
                onClick={() => updateField("defaultLanguage", language.value)}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition ${
                  form.defaultLanguage === language.value
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 w-full rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSubmitting ? "Saving..." : "Save and continue"}
      </button>
    </form>
  );
}
