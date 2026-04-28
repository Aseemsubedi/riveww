"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentActions({ paymentId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (action) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not process payment action.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.refresh();
    } catch {
      setError("Network issue while processing this payment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleAction("approved")}
          className="min-h-10 rounded-md bg-green-600 px-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleAction("rejected")}
          className="min-h-10 rounded-md bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          Reject
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
