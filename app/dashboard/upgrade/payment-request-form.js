"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    amountNpr: "299",
    paymentMethod: "Manual QR",
    referenceCode: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountNpr: Number(form.amountNpr),
          paymentMethod: form.paymentMethod,
          referenceCode: form.referenceCode,
          note: form.note,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not submit payment request.");
        setIsSubmitting(false);
        return;
      }

      setMessage("Payment request submitted. Admin will review and approve soon.");
      setIsSubmitting(false);
      setForm((prev) => ({ ...prev, referenceCode: "", note: "" }));
      router.refresh();
    } catch {
      setError("Network issue while submitting payment request.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="amountNpr">
            Amount (NPR)
          </label>
          <input
            id="amountNpr"
            type="number"
            min="1"
            value={form.amountNpr}
            onChange={(event) => updateField("amountNpr", event.target.value)}
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="paymentMethod">
            Payment method
          </label>
          <select
            id="paymentMethod"
            value={form.paymentMethod}
            onChange={(event) => updateField("paymentMethod", event.target.value)}
            className="h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none ring-zinc-900/10 focus:ring-2"
          >
            <option value="Manual QR">Manual QR</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-800" htmlFor="note">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={form.note}
          onChange={(event) => updateField("note", event.target.value)}
          placeholder="Write your email here to get upgrade approval"
          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 focus:ring-2"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSubmitting ? "Submitting..." : "Submit for manual approval"}
      </button>
    </form>
  );
}
