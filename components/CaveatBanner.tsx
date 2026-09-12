"use client";

import { useState } from "react";

export default function CaveatBanner({
  children,
  tone = "warning",
  dismissible = true,
}: {
  children: React.ReactNode;
  tone?: "warning" | "info";
  dismissible?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const toneClasses =
    tone === "warning"
      ? "border-amber-300 bg-amber-50 text-amber-900"
      : "border-blue-300 bg-blue-50 text-blue-900";

  return (
    <div
      role="note"
      className={`relative flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${toneClasses}`}
    >
      <span className="mt-0.5">⚠</span>
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss note"
          className="ml-2 shrink-0 rounded px-1.5 py-0.5 text-xs opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
