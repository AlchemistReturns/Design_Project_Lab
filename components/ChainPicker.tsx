"use client";

import { useMemo, useState } from "react";

export interface ChainPickerItem {
  id: string;
  split: string;
  question: string;
  hasCorruption: boolean;
}

export default function ChainPicker({
  chains,
  selectedId,
  onSelect,
}: {
  chains: ChainPickerItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [split, setSplit] = useState<string>("test");
  const [corruptedOnly, setCorruptedOnly] = useState(true);

  const splits = useMemo(
    () => Array.from(new Set(chains.map((c) => c.split))).sort(),
    [chains],
  );

  const filtered = useMemo(() => {
    return chains.filter((c) => {
      if (split !== "all" && c.split !== split) return false;
      if (corruptedOnly && !c.hasCorruption) return false;
      if (query && !c.question.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [chains, split, corruptedOnly, query]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Chain picker
      </div>

      <input
        type="text"
        placeholder="search question…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={split}
          onChange={(e) => setSplit(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="all">all splits</option>
          {splits.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={corruptedOnly}
            onChange={(e) => setCorruptedOnly(e.target.checked)}
            className="accent-indigo-600"
          />
          corrupted only
        </label>
      </div>

      <div className="text-xs text-gray-400">{filtered.length} chains</div>

      <div className="flex max-h-[420px] flex-col gap-1 overflow-y-auto">
        {filtered.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`flex items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  c.hasCorruption ? "bg-red-500" : "bg-emerald-500"
                }`}
              />
              <span className="flex-1 leading-snug">
                <span className="mr-1 text-xs text-gray-400">
                  [{c.split}]
                </span>
                {c.question}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-2.5 py-4 text-center text-xs text-gray-400">
            no chains match these filters
          </div>
        )}
      </div>
    </div>
  );
}
