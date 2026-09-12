"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ScoreBadge from "./ScoreBadge";
import { metricDef } from "@/lib/metricDefinitions";
import type { BaselineComparisonRow, LayerProfileRow } from "@/lib/types";

export interface LayerHopExample {
  id: string;
  hop_index: number;
  hop: string;
  question: string;
  is_injected_error: boolean;
  flaggedAtBestLayer: boolean;
  layers: number[]; // layers[0] = layer 1 score ... layers[23] = layer 24 score
}

const ACCENT = "#4f46e5";

function ConfusionCell({
  count,
  label,
  title,
  tone,
}: {
  count: number;
  label: string;
  title: string;
  tone: "good" | "bad";
}) {
  const toneClasses =
    tone === "good"
      ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
      : "bg-red-100 text-red-900 ring-1 ring-red-200";
  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 rounded-xl p-4 ${toneClasses}`}
      title={title}
    >
      <div className="text-3xl font-bold tabular-nums">{count}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

export default function LayerDepthExplorer({
  layerProfile,
  baseline,
  bestLayer,
  testHops,
  nTestChains,
}: {
  layerProfile: LayerProfileRow[];
  baseline: BaselineComparisonRow[];
  bestLayer: number;
  testHops: LayerHopExample[];
  nTestChains: number;
}) {
  const nLayers = layerProfile.length;
  const [sliderLayer, setSliderLayer] = useState(bestLayer);
  const [layer, setLayer] = useState(bestLayer);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setLayer(sliderLayer), 60);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sliderLayer]);

  const peakLayer = useMemo(
    () =>
      layerProfile.reduce((best, row) =>
        row.validation_AP > best.validation_AP ? row : best,
      ),
    [layerProfile],
  );

  const currentProfile = layerProfile.find((r) => r.layer === layer);

  const lexical = baseline.find((b) => /lexical/i.test(b.probe));
  const shuffled = baseline.find((b) => /shuffled/i.test(b.probe));

  const scoresAtLayer = useMemo(
    () => testHops.map((h) => ({ ...h, score: h.layers[layer - 1] })),
    [testHops, layer],
  );

  const isBestLayer = layer === bestLayer;

  const confusion = useMemo(() => {
    if (!isBestLayer) return null;
    let tp = 0,
      fp = 0,
      tn = 0,
      fn = 0;
    for (const h of testHops) {
      if (h.is_injected_error && h.flaggedAtBestLayer) tp++;
      else if (!h.is_injected_error && h.flaggedAtBestLayer) fp++;
      else if (!h.is_injected_error && !h.flaggedAtBestLayer) tn++;
      else fn++;
    }
    return { tp, fp, tn, fn };
  }, [isBestLayer, testHops]);

  const examples = useMemo(() => {
    const corrupted = scoresAtLayer.filter((h) => h.is_injected_error);
    const clean = scoresAtLayer.filter((h) => !h.is_injected_error);
    const byScoreDesc = (a: { score: number }, b: { score: number }) =>
      b.score - a.score;

    const highestCorrupted = [...corrupted].sort(byScoreDesc)[0] ?? null;
    const lowestClean = [...clean].sort(byScoreDesc).slice(-1)[0] ?? null;
    const lowestCorrupted = [...corrupted].sort(byScoreDesc).slice(-1)[0] ?? null;
    const highestClean = [...clean].sort(byScoreDesc)[0] ?? null;

    return [
      highestCorrupted && {
        ...highestCorrupted,
        label: "correctly high — actually corrupted",
        good: true,
      },
      lowestClean && {
        ...lowestClean,
        label: "correctly low — actually clean",
        good: true,
      },
      lowestCorrupted &&
        lowestCorrupted.id !== highestCorrupted?.id && {
          ...lowestCorrupted,
          label: "scored low despite being corrupted",
          good: false,
        },
      highestClean &&
        highestClean.id !== lowestClean?.id && {
          ...highestClean,
          label: "scored high despite being clean",
          good: false,
        },
    ].filter(Boolean) as Array<{
      id: string;
      hop_index: number;
      hop: string;
      question: string;
      score: number;
      label: string;
      good: boolean;
    }>;
  }, [scoresAtLayer]);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-gray-700">
            Validation AP by layer
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4 rounded"
                style={{ backgroundColor: ACCENT }}
              />
              probe (real labels)
            </span>
            {shuffled && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-gray-400" />
                shuffled-label baseline ({shuffled.average_precision.toFixed(3)})
              </span>
            )}
            {lexical && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-amber-500" />
                lexical baseline ({lexical.average_precision.toFixed(3)})
              </span>
            )}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={layerProfile}
            margin={{ top: 24, right: 16, bottom: 0, left: 0 }}
            onClick={(e) => {
              if (e && typeof e.activeLabel === "number") {
                setSliderLayer(e.activeLabel);
              }
            }}
          >
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              dataKey="layer"
              type="number"
              domain={[1, nLayers]}
              tickCount={nLayers}
              label={{ value: "layer", position: "insideBottom", offset: -2 }}
            />
            <YAxis
              domain={[0, 1.08]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              label={{
                value: "validation AP",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(v) => Number(v).toFixed(3)}
              labelFormatter={(l) => `layer ${l}`}
            />
            {shuffled && (
              <ReferenceLine
                y={shuffled.average_precision}
                stroke="#9ca3af"
                strokeDasharray="4 4"
              />
            )}
            {lexical && (
              <ReferenceLine
                y={lexical.average_precision}
                stroke="#d97706"
                strokeDasharray="4 4"
              />
            )}
            <ReferenceDot
              x={peakLayer.layer}
              y={peakLayer.validation_AP}
              r={5}
              fill="#111827"
              label={{
                value: `Peak signal at layer ${peakLayer.layer}`,
                position: "top",
                fontSize: 11,
              }}
            />
            <ReferenceLine x={layer} stroke={ACCENT} strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="validation_AP"
              stroke={ACCENT}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">jump to layer:</span>
          {layerProfile.map((r) => (
            <button
              key={r.layer}
              onClick={() => setSliderLayer(r.layer)}
              className={`rounded px-1.5 py-0.5 text-xs transition-colors ${
                r.layer === sliderLayer
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {r.layer}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={nLayers}
          value={sliderLayer}
          onChange={(e) => setSliderLayer(Number(e.target.value))}
          className="mt-3 w-full accent-indigo-600"
        />
      </div>

      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          isBestLayer
            ? "border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-base font-semibold text-gray-800">
              Confusion matrix
            </div>
            <div className="text-xs text-gray-500">
              layer {layer} · N={nTestChains} test hops
            </div>
          </div>
          {isBestLayer && (
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
              ★ best layer
            </span>
          )}
        </div>

        {isBestLayer && confusion ? (
          <div className="grid grid-cols-[64px_1fr_1fr] items-center gap-2 sm:grid-cols-[90px_1fr_1fr]">
            <div />
            <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              flagged
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              not flagged
            </div>

            <div className="pr-1 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
              corrupted
            </div>
            <ConfusionCell
              count={confusion.tp}
              label="true positive"
              tone="good"
              title="Corrupted hops the probe correctly flagged."
            />
            <ConfusionCell
              count={confusion.fn}
              label="false negative"
              tone="bad"
              title="Corrupted hops the probe missed."
            />

            <div className="pr-1 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
              clean
            </div>
            <ConfusionCell
              count={confusion.fp}
              label="false positive"
              tone="bad"
              title="Clean hops the probe incorrectly flagged."
            />
            <ConfusionCell
              count={confusion.tn}
              label="true negative"
              tone="good"
              title="Clean hops the probe correctly left unflagged."
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            <span>
              The classification threshold was only calibrated at the best
              layer.
            </span>
            <button
              onClick={() => setSliderLayer(bestLayer)}
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Jump to layer {bestLayer} →
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline gap-4">
          <div className="text-lg font-semibold">layer {layer}</div>
          <div
            className="text-sm text-gray-500"
            title={metricDef("validation_AP").blurb}
          >
            validation AP:{" "}
            <span className="font-mono font-medium text-gray-800">
              {currentProfile?.validation_AP.toFixed(3) ?? "—"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            example hops at this layer
          </div>
          <div className="flex flex-col gap-1.5">
            {examples.map((ex) => (
              <div
                key={`${ex.id}-${ex.hop_index}`}
                className="flex items-start gap-2 rounded-lg border border-gray-200 p-2.5 text-sm"
              >
                <ScoreBadge score={ex.score} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{ex.label}</div>
                  <div>{ex.hop}</div>
                </div>
              </div>
            ))}
            {examples.length === 0 && (
              <div className="text-xs text-gray-400">
                not enough labeled test hops to pick examples.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
