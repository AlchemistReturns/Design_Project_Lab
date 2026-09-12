import Link from "next/link";
import { getChainsFull, getMetricsSummary } from "@/lib/data";
import { metricDef } from "@/lib/metricDefinitions";

function Stat({ metricKey, value }: { metricKey: string; value: string }) {
  const def = metricDef(metricKey);
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      title={def.blurb}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {def.label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1.5 text-xs leading-snug text-gray-400">
        {def.blurb}
      </div>
    </div>
  );
}

export default function Home() {
  const metrics = getMetricsSummary();
  const chains = getChainsFull();
  const testChains = chains.filter((c) => c.split === "test");
  const corruptedTestChains = testChains.filter((c) => c.corruption !== null);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          H1 · error-localization probe
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Does a linear probe on hidden-state activations detect injected
          factual errors?
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          A model answers HotpotQA questions by chaining together multiple
          reasoning hops. In some chains, one hop has been deliberately
          corrupted — a fact swapped for a wrong one. This experiment trains
          a linear probe on the model&apos;s hidden-state activations at each
          hop and asks whether that probe can flag the corrupted hop, and at
          which layer of the network that signal is strongest. Results below
          are from the held-out test split.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          results based on N={testChains.length} test chains (
          {corruptedTestChains.length} corrupted,{" "}
          {testChains.length - corruptedTestChains.length} clean)
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Headline metrics
          </h2>
          <span className="text-xs text-gray-400">
            hover any card for a plain-English definition
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat metricKey="roc_auc" value={metrics.roc_auc.toFixed(3)} />
          <Stat
            metricKey="average_precision"
            value={metrics.average_precision.toFixed(3)}
          />
          <Stat metricKey="accuracy" value={metrics.accuracy.toFixed(3)} />
          <Stat metricKey="f1" value={metrics.f1.toFixed(3)} />
          <Stat
            metricKey="exact_injected_hop_localization_percent"
            value={`${metrics.exact_injected_hop_localization_percent.toFixed(1)}%`}
          />
          <Stat
            metricKey="top_rank_correct"
            value={metrics.top_rank_correct.toFixed(3)}
          />
          <Stat
            metricKey="clean_false_alarm"
            value={metrics.clean_false_alarm.toFixed(3)}
          />
          <Stat
            metricKey="positive_prevalence"
            value={metrics.positive_prevalence.toFixed(3)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Explore the results
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/layers"
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Layer-Depth Explorer
              </div>
              <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">
                →
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Scrub through transformer layers and watch validation AP,
              baseline comparisons, and example hops update live at each
              layer.
            </p>
          </Link>
          <Link
            href="/chains"
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                Hop &amp; Question Explorer
              </div>
              <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">
                →
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Pick a chain, spot the injected error hop-by-hop, or view it in
              full question context with the corrupted span highlighted.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
