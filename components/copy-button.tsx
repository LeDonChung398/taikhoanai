"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Sao chép"
      className="inline-flex h-5 w-5 items-center justify-center rounded text-[#8091ad] transition hover:text-[#2f4b93]"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path d="M5 13l4 4L19 7" fill="none" stroke="#27a243" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  );
}
