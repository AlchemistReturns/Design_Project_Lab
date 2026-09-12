import Link from "next/link";
import { getChainsFull, getMetricsSummary } from "@/lib/data";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Home() {
  const metrics = getMetricsSummary();
  const chains = getChainsFull();
  const testChains = chains.filter((c) => c.split === "test");
  const corruptedTestChains = testChains.filter((c) => c.corruption !== null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Does a linear probe on hidden-state activations detect injected
          factual errors?
        </h1>
        <p className="mt-2 max-w-3xl text-gray-600">
          Results from the H1 experiment: a linear probe trained on
          transformer hidden states, evaluated on HotpotQA multi-hop
          reasoning chains with synthetically injected factual errors. Static
          results viewer — no live model inference.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          results based on N={testChains.length} test chains (
          {corruptedTestChains.length} corrupted, {testChains.length - corruptedTestChains.length}{" "}
          clean)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ROC AUC" value={metrics.roc_auc.toFixed(3)} />
        <Stat
          label="Average precision"
          value={metrics.average_precision.toFixed(3)}
        />
        <Stat label="Accuracy" value={metrics.accuracy.toFixed(3)} />
        <Stat label="F1" value={metrics.f1.toFixed(3)} />
        <Stat
          label="Exact hop localization"
          value={`${metrics.exact_injected_hop_localization_percent.toFixed(1)}%`}
        />
        <Stat
          label="Top-rank hop correct"
          value={metrics.top_rank_correct.toFixed(3)}
        />
        <Stat
          label="Clean false-alarm rate"
          value={metrics.clean_false_alarm.toFixed(3)}
        />
        <Stat
          label="Positive prevalence"
          value={metrics.positive_prevalence.toFixed(3)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/layers"
          className="rounded-md border border-gray-200 bg-white p-5 transition hover:border-gray-400 hover:shadow-sm"
        >
          <div className="text-lg font-semibold">Layer-Depth Explorer</div>
          <p className="mt-1 text-sm text-gray-600">
            Scrub through transformer layers, see validation AP, baseline
            comparisons, and example hops update live at each layer.
          </p>
        </Link>
        <Link
          href="/chains"
          className="rounded-md border border-gray-200 bg-white p-5 transition hover:border-gray-400 hover:shadow-sm"
        >
          <div className="text-lg font-semibold">
            Hop &amp; Question Explorer
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Pick a chain, spot the injected error hop-by-hop, or view it in
            full question context with the corrupted span highlighted.
          </p>
        </Link>
      </div>
    </div>
  );
}
