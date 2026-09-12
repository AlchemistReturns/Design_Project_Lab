"use client";

import { useMemo, useState } from "react";
import ChainPicker, { type ChainPickerItem } from "./ChainPicker";
import HopViewer from "./HopViewer";
import QuestionExplorer from "./QuestionExplorer";
import type { ChainFull, HopJoined } from "@/lib/types";

export default function ChainWorkspace({
  chains,
  hopsByChainId,
}: {
  chains: ChainFull[];
  hopsByChainId: Record<string, HopJoined[]>;
}) {
  const pickerItems: ChainPickerItem[] = useMemo(
    () =>
      chains.map((c) => ({
        id: c.id,
        split: c.split,
        question: c.question,
        hasCorruption: c.corruption !== null,
      })),
    [chains],
  );

  const defaultId = useMemo(() => {
    const testCorrupted = chains.find(
      (c) => c.split === "test" && c.corruption !== null,
    );
    return testCorrupted?.id ?? chains[0]?.id ?? null;
  }, [chains]);

  const [selectedId, setSelectedId] = useState<string | null>(defaultId);
  const [tab, setTab] = useState<"hops" | "question">("hops");

  const chainsById = useMemo(
    () => new Map(chains.map((c) => [c.id, c])),
    [chains],
  );

  const selectedChain = selectedId ? chainsById.get(selectedId) ?? null : null;
  const selectedHops = selectedId ? hopsByChainId[selectedId] ?? [] : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="lg:sticky lg:top-4 lg:self-start">
        <ChainPicker
          chains={pickerItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <div>
        <div className="mb-4 flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setTab("hops")}
            className={`px-3 py-2 text-sm font-medium ${
              tab === "hops"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Hop Viewer
          </button>
          <button
            onClick={() => setTab("question")}
            className={`px-3 py-2 text-sm font-medium ${
              tab === "question"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Question Explorer
          </button>
        </div>

        {selectedChain ? (
          tab === "hops" ? (
            <HopViewer
              key={selectedChain.id}
              chain={selectedChain}
              hops={selectedHops}
              onViewInContext={() => setTab("question")}
            />
          ) : (
            <QuestionExplorer chain={selectedChain} hops={selectedHops} />
          )
        ) : (
          <div className="text-sm text-gray-400">no chain selected</div>
        )}
      </div>
    </div>
  );
}
