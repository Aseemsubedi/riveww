"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessControls({ business }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: business.name || "",
    category: business.category || "",
    contactPerson: business.contact_person || "",
    phoneNumber: business.phone_number || "",
    whatsappNumber: business.whatsapp_number || "",
    address: business.address || "",
    googleReviewUrl: business.google_review_url || "",
    plan: business.plan || "free",
    defaultTone: business.default_tone || "friendly",
    defaultLanguage: business.default_language || "english",
    generationsUsedThisMonth: String(business.generations_used_this_month ?? 0),
    keywords: (business.keywords || []).join(", "),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (overrides = {}) => {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/businesses/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          generationsUsedThisMonth: Number(form.generationsUsedThisMonth),
          ...overrides,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not save business settings.");
        setIsSaving(false);
        return;
      }

      setMessage("Business settings updated.");
      setIsSaving(false);
      router.refresh();
    } catch {
      setError("Network issue while saving business settings.");
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }
    setIsOpen(false);
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="min-h-10 rounded-md bg-zinc-900 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Open controls
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            updateField("generationsUsedThisMonth", "0");
            save({ generationsUsedThisMonth: 0 });
          }}
          className="min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          Reset monthly usage
        </button>
      </div>

      {message ? <p className="mt-2 text-xs text-green-700">{message}</p> : null}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-zinc-900">
                  Edit business controls
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Update plan, limits, keywords, and personalization settings.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Business name"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <input
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Category"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <input
                value={form.contactPerson}
                onChange={(event) => updateField("contactPerson", event.target.value)}
                placeholder="Contact person"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <input
                value={form.phoneNumber}
                onChange={(event) => updateField("phoneNumber", event.target.value)}
                placeholder="Phone number"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <input
                value={form.whatsappNumber}
                onChange={(event) => updateField("whatsappNumber", event.target.value)}
                placeholder="WhatsApp number"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <input
                value={form.googleReviewUrl}
                onChange={(event) => updateField("googleReviewUrl", event.target.value)}
                placeholder="Google review URL"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2 sm:col-span-2"
              />
              <select
                value={form.plan}
                onChange={(event) => updateField("plan", event.target.value)}
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              >
                <option value="free">free</option>
                <option value="pro">pro</option>
              </select>
              <input
                type="number"
                min="0"
                value={form.generationsUsedThisMonth}
                onChange={(event) =>
                  updateField("generationsUsedThisMonth", event.target.value)
                }
                placeholder="Monthly usage"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              />
              <select
                value={form.defaultTone}
                onChange={(event) => updateField("defaultTone", event.target.value)}
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              >
                <option value="professional">professional</option>
                <option value="friendly">friendly</option>
                <option value="enthusiastic">enthusiastic</option>
              </select>
              <select
                value={form.defaultLanguage}
                onChange={(event) => updateField("defaultLanguage", event.target.value)}
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
              >
                <option value="english">english</option>
                <option value="nepali">nepali</option>
                <option value="nenglish">nenglish</option>
              </select>
              <input
                value={form.keywords}
                onChange={(event) => updateField("keywords", event.target.value)}
                placeholder="Keywords (comma separated)"
                className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2 sm:col-span-2"
              />
              <textarea
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Business address"
                className="min-h-20 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:ring-2 sm:col-span-2"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => save()}
                className="min-h-10 rounded-md bg-zinc-900 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-400"
              >
                {isSaving ? "Saving..." : "Save controls"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
              >
                Cancel
              </button>
            </div>

            {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
            {message ? <p className="mt-2 text-xs text-green-700">{message}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
