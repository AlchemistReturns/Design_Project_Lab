import Link from "next/link";
import Hero from "@/components/Hero";
import ChainWorkspace from "@/components/ChainWorkspace";
import { getChainsFull, getHopsJoined, getMetricsSummary } from "@/lib/data";
import { metricDef } from "@/lib/metricDefinitions";
import type { HopJoined } from "@/lib/types";

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
  const hops = getHopsJoined();
  const testChains = chains.filter((c) => c.split === "test");
  const corruptedTestChains = testChains.filter((c) => c.corruption !== null);

  const hopsByChainId: Record<string, HopJoined[]> = {};
  for (const h of hops) {
    (hopsByChainId[h.id] ??= []).push(h);
  }

  return (
    <div className="flex flex-col">
      <Hero
        rocAuc={metrics.roc_auc}
        hopLocalizationPercent={metrics.exact_injected_hop_localization_percent}
        nTestChains={testChains.length}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-14">
        <section id="try-it" className="scroll-mt-24">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                See it catch an error, live
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Pick a chain on the left, hit{" "}
                <span className="font-medium text-indigo-700">reveal</span>,
                and watch the probe score every hop. The chain below is
                pre-loaded so you can start right away.
              </p>
            </div>
            <Link
              href="/chains"
              className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              open full screen →
            </Link>
          </div>
          <div className="mt-5">
            <ChainWorkspace chains={chains} hopsByChainId={hopsByChainId} />
          </div>
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
          <p className="mb-4 max-w-3xl text-sm text-gray-500">
            Measured on the held-out test split: {corruptedTestChains.length}{" "}
            corrupted chains and{" "}
            {testChains.length - corruptedTestChains.length} clean chains.
          </p>
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
          <Link
            href="/layers"
            className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md sm:flex-row sm:items-center"
          >
            <div>
              <div className="text-lg font-semibold">
                Where in the network does this signal live?
              </div>
              <p className="mt-1 max-w-xl text-sm text-gray-600">
                Scrub through all 24 transformer layers and watch validation
                AP, baseline comparisons, and example hops update at each
                depth.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-indigo-700">
              Open Layer-Depth Explorer →
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
