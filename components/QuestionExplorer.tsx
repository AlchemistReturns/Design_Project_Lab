import HopCard from "./HopCard";
import type { ChainFull, HopJoined } from "@/lib/types";

function highlightReplacement(hopText: string, replacementValue: string) {
  const idx = hopText.indexOf(replacementValue);
  if (idx === -1) return <>{hopText}</>;
  return (
    <>
      {hopText.slice(0, idx)}
      <mark className="rounded bg-red-200 px-0.5 font-semibold text-red-900">
        {hopText.slice(idx, idx + replacementValue.length)}
      </mark>
      {hopText.slice(idx + replacementValue.length)}
    </>
  );
}

export default function QuestionExplorer({
  chain,
  hops,
}: {
  chain: ChainFull;
  hops: HopJoined[];
}) {
  const sortedHops = [...hops].sort((a, b) => a.hop_index - b.hop_index);
  const corruption = chain.corruption;
  const corruptionHopIndex = corruption?.hop_index ?? null;
  const isFinalHopCorrupted =
    corruptionHopIndex !== null && corruptionHopIndex === chain.hops.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-xs text-gray-400">
          {chain.id} · split: {chain.split}
        </div>
        <h2 className="mt-1 text-lg font-semibold">{chain.question}</h2>
        <div className="mt-1 text-sm text-gray-600">
          answer: <span className="font-medium">{chain.answer}</span>
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          source context
        </div>
        <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
          {chain.context}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          the source context is unmodified — any injected error lives in the
          reasoning hop below, not here.
        </div>
      </div>

      {corruption && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            corrupted hop, replacement highlighted
          </div>
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-relaxed">
            {highlightReplacement(
              corruption.corrupted_hop,
              corruption.replacement_value,
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            &quot;{corruption.original_value}&quot; replaced with &quot;
            {corruption.replacement_value}&quot; (strategy:{" "}
            <span className="font-mono">{corruption.strategy}</span>)
          </div>
        </div>
      )}

      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          reasoning trace
        </div>
        <div className="flex flex-col gap-1.5">
          {sortedHops.map((h, i) => (
            <HopCard
              key={h.hop_index}
              hopIndex={h.hop_index}
              text={h.hop}
              score={h.error_score}
              layers={h.layers}
              revealed={true}
              revealDelay={i * 0.06}
              isCorrupted={h.hop_index === corruptionHopIndex}
              corruption={h.hop_index === corruptionHopIndex ? corruption : null}
              compact
            />
          ))}
          <div className="mt-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            <span className="font-semibold text-gray-600">answer: </span>
            {chain.answer}
          </div>
        </div>
      </div>

      {corruptionHopIndex !== null && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <span className="font-semibold">does the error matter? </span>
          {isFinalHopCorrupted
            ? "the injected error is in the final hop, the one that most directly determines the answer — naive reasoning would likely reach a wrong conclusion."
            : "the injected error is in an earlier hop; later hops may still route around it to the correct answer."}{" "}
          (heuristic based on hop position only, not a re-run of the reasoning
          chain)
        </div>
      )}
    </div>
  );
}
