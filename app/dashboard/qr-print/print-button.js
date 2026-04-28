"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 print:hidden"
    >
      Print Poster
    </button>
  );
}
