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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={split}
          onChange={(e) => setSplit(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
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
          />
          corrupted only
        </label>
        <input
          type="text"
          placeholder="search question…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px] flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <span className="text-xs text-gray-400">{filtered.length} chains</span>
      </div>

      <select
        size={6}
        value={selectedId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded border border-gray-300 text-sm"
      >
        {filtered.map((c) => (
          <option key={c.id} value={c.id} className="px-2 py-1">
            {c.hasCorruption ? "🔴" : "🟢"} [{c.split}] {c.question.slice(0, 90)}
          </option>
        ))}
      </select>
    </div>
  );
}
