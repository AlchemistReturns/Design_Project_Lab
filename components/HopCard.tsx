"use client";

import { useState } from "react";
import ScoreBadge from "./ScoreBadge";
import { scoreToColors } from "@/lib/color";
import type { Corruption } from "@/lib/types";

export default function HopCard({
  hopIndex,
  text,
  score,
  revealed,
  isCorrupted,
  corruption,
  compact = false,
}: {
  hopIndex: number;
  text: string;
  score: number | null;
  revealed: boolean;
  isCorrupted: boolean;
  corruption: Corruption | null;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const colors =
    revealed && score !== null
      ? scoreToColors(score)
      : { background: "#f9fafb", border: "#e5e7eb", text: "#374151" };

  return (
    <div
      className={`rounded-lg border-2 transition-colors duration-500 ${
        compact ? "p-2" : "p-3"
      }`}
      style={{
        backgroundColor: colors.background,
        borderColor: isCorrupted && revealed ? "#dc2626" : colors.border,
        outline: isCorrupted && revealed ? "2px solid #dc2626" : undefined,
        outlineOffset: isCorrupted && revealed ? "1px" : undefined,
      }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 rounded bg-white/70 px-1.5 py-0.5 text-xs font-mono text-gray-500">
            hop {hopIndex}
          </span>
          <span className={compact ? "text-sm" : "text-sm leading-relaxed"}>
            {text}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isCorrupted && revealed && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              injected error
            </span>
          )}
          {revealed && <ScoreBadge score={score} />}
          <span className="text-gray-400">{expanded ? "▾" : "▸"}</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-200 pt-2 text-sm">
          {isCorrupted && corruption ? (
            <>
              <div>
                <span className="font-semibold text-gray-600">strategy: </span>
                <span className="font-mono">{corruption.strategy}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">original: </span>
                <span className="line-through decoration-red-500">
                  {corruption.original_hop}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">corrupted: </span>
                <span>{corruption.corrupted_hop}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  replaced &quot;{corruption.original_value}&quot; with{" "}
                </span>
                <span className="font-semibold text-red-700">
                  &quot;{corruption.replacement_value}&quot;
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">no injected error in this hop</div>
          )}
        </div>
      )}
    </div>
  );
}
