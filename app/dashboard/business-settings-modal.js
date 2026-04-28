"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessSettingsModal({ business }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: business.name || "",
    category: business.category || "",
    contactPerson: business.contactPerson || "",
    phoneNumber: business.phoneNumber || "",
    whatsappNumber: business.whatsappNumber || "",
    address: business.address || "",
    googleReviewUrl: business.googleReviewUrl || "",
    defaultTone: business.defaultTone || "friendly",
    defaultLanguage: business.defaultLanguage || "english",
    keywords: (business.keywords || []).join(", "),
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/business/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not save settings.");
        setIsSaving(false);
        return;
      }
      setMessage("Business settings updated.");
      setIsSaving(false);
      router.refresh();
    } catch {
      setError("Network issue while saving settings.");
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-11 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
      >
        Edit Business Settings
      </button>
      {message ? <p className="mt-2 text-xs text-green-700">{message}</p> : null}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Business settings
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Keep this simple. Update the essentials only.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Business name</label>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Business name"
                  className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">
                    Contact person
                  </label>
                  <input
                    value={form.contactPerson}
                    onChange={(event) => updateField("contactPerson", event.target.value)}
                    placeholder="Owner or manager name"
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Phone number</label>
                  <input
                    value={form.phoneNumber}
                    onChange={(event) => updateField("phoneNumber", event.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">
                    WhatsApp number
                  </label>
                  <input
                    value={form.whatsappNumber}
                    onChange={(event) => updateField("whatsappNumber", event.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Category</label>
                  <input
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    placeholder="Cafe, Salon, Hotel"
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">Address</label>
                <textarea
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="Business address"
                  className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">
                  Google review URL
                </label>
                <input
                  value={form.googleReviewUrl}
                  onChange={(event) =>
                    updateField("googleReviewUrl", event.target.value)
                  }
                  placeholder="https://g.page/r/..."
                  className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Tone</label>
                  <select
                    value={form.defaultTone}
                    onChange={(event) => updateField("defaultTone", event.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  >
                    <option value="professional">professional</option>
                    <option value="friendly">friendly</option>
                    <option value="enthusiastic">enthusiastic</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-800">Language</label>
                  <select
                    value={form.defaultLanguage}
                    onChange={(event) =>
                      updateField("defaultLanguage", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                  >
                    <option value="english">english</option>
                    <option value="nepali">nepali</option>
                    <option value="nenglish">nenglish</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800">
                  Keywords (comma separated)
                </label>
                <textarea
                  value={form.keywords}
                  onChange={(event) => updateField("keywords", event.target.value)}
                  placeholder="coffee, cozy seating, family friendly"
                  className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="min-h-10 rounded-md bg-zinc-900 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-400"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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
