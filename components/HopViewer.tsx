"use client";

import { useMemo, useState } from "react";
import HopCard from "./HopCard";
import type { ChainFull, HopJoined } from "@/lib/types";

export default function HopViewer({
  chain,
  hops,
  onViewInContext,
}: {
  chain: ChainFull;
  hops: HopJoined[];
  onViewInContext?: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const sortedHops = useMemo(
    () => [...hops].sort((a, b) => a.hop_index - b.hop_index),
    [hops],
  );

  const hasScores = sortedHops.some((h) => h.error_score !== null);
  const corruptionHopIndex = chain.corruption?.hop_index ?? null;

  const topRankedHopIndex = useMemo(() => {
    if (!hasScores) return null;
    let best: HopJoined | null = null;
    for (const h of sortedHops) {
      if (h.error_score === null) continue;
      if (!best || (best.error_score ?? -Infinity) < h.error_score) best = h;
    }
    return best?.hop_index ?? null;
  }, [sortedHops, hasScores]);

  const topRankCorrect =
    corruptionHopIndex !== null && topRankedHopIndex === corruptionHopIndex;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400">
            {chain.id} · split: {chain.split}
          </div>
          <div className="mt-1 font-medium">{chain.question}</div>
          <div className="text-sm text-gray-500">answer: {chain.answer}</div>
        </div>
        <div className="flex shrink-0 gap-2">
          {onViewInContext && (
            <button
              onClick={onViewInContext}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              view in context →
            </button>
          )}
          <button
            onClick={() => setRevealed((r) => !r)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {revealed ? "hide scores" : "reveal"}
          </button>
        </div>
      </div>

      {!hasScores && (
        <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
          no probe score available for this chain — only test-split hops were
          scored by the trained probe.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {sortedHops.map((h) => (
          <HopCard
            key={h.hop_index}
            hopIndex={h.hop_index}
            text={h.hop}
            score={h.error_score}
            revealed={revealed}
            isCorrupted={h.hop_index === corruptionHopIndex}
            corruption={
              h.hop_index === corruptionHopIndex ? chain.corruption : null
            }
          />
        ))}
      </div>

      {revealed && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
          {corruptionHopIndex === null ? (
            <span className="text-gray-600">
              no injected error in this chain — this is a clean chain, useful
              as a false-alarm check.
            </span>
          ) : hasScores ? (
            <span>
              Top-ranked hop:{" "}
              <span
                className={
                  topRankCorrect
                    ? "font-semibold text-green-700"
                    : "font-semibold text-red-700"
                }
              >
                {topRankCorrect ? "✓ correct" : "✗ incorrect"}
              </span>{" "}
              (highest-scored hop is #{topRankedHopIndex}, injected error is at
              hop #{corruptionHopIndex})
            </span>
          ) : (
            <span className="text-gray-500">
              no scores available to rank hops for this chain.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
