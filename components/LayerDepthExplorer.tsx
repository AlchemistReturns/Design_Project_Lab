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
import CaveatBanner from "./CaveatBanner";
import ScoreBadge from "./ScoreBadge";
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

  const real = baseline.find((b) => /real/i.test(b.probe));
  const lexical = baseline.find((b) => /lexical/i.test(b.probe));
  const shuffled = baseline.find((b) => /shuffled/i.test(b.probe));
  const showLexicalCaveat =
    real && lexical && lexical.average_precision >= real.average_precision;

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
      {showLexicalCaveat && real && lexical && (
        <CaveatBanner dismissible={false} tone="warning">
          The lexical / hop log-probability baseline scored{" "}
          <strong>{lexical.average_precision.toFixed(3)} AP</strong>, at or
          above the hidden-state probe&apos;s{" "}
          <strong>{real.average_precision.toFixed(3)} AP</strong> in this run.
          Read this as a limitation of the current error-injection method
          (injected errors may be lexically obvious), not as confirmed
          evidence that hidden states carry no signal.
        </CaveatBanner>
      )}

      <div className="rounded-md border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={layerProfile}
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
                label={{
                  value: "shuffled-label baseline",
                  position: "insideTopRight",
                  fill: "#6b7280",
                  fontSize: 11,
                }}
              />
            )}
            {lexical && (
              <ReferenceLine
                y={lexical.average_precision}
                stroke="#d97706"
                strokeDasharray="4 4"
                label={{
                  value: "lexical baseline",
                  position: "insideBottomRight",
                  fill: "#b45309",
                  fontSize: 11,
                }}
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
            <ReferenceLine x={layer} stroke="#2563eb" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="validation_AP"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">jump to layer:</span>
          {layerProfile.map((r) => (
            <button
              key={r.layer}
              onClick={() => setSliderLayer(r.layer)}
              className={`rounded px-1.5 py-0.5 text-xs ${
                r.layer === sliderLayer
                  ? "bg-gray-900 text-white"
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
          className="mt-2 w-full"
        />
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-baseline gap-4">
          <div className="text-lg font-semibold">layer {layer}</div>
          <div className="text-sm text-gray-500">
            validation AP:{" "}
            <span className="font-mono font-medium text-gray-800">
              {currentProfile?.validation_AP.toFixed(3) ?? "—"}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            based on N={nTestChains} test chains
          </div>
        </div>

        {isBestLayer && confusion ? (
          <div className="mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              confusion matrix (best layer, thresholded)
            </div>
            <div className="grid max-w-sm grid-cols-2 gap-1 text-center text-sm">
              <div className="rounded bg-green-50 p-2">
                <div className="font-semibold text-green-800">
                  {confusion.tp}
                </div>
                <div className="text-xs text-green-700">true positive</div>
              </div>
              <div className="rounded bg-red-50 p-2">
                <div className="font-semibold text-red-800">
                  {confusion.fp}
                </div>
                <div className="text-xs text-red-700">false positive</div>
              </div>
              <div className="rounded bg-red-50 p-2">
                <div className="font-semibold text-red-800">
                  {confusion.fn}
                </div>
                <div className="text-xs text-red-700">false negative</div>
              </div>
              <div className="rounded bg-green-50 p-2">
                <div className="font-semibold text-green-800">
                  {confusion.tn}
                </div>
                <div className="text-xs text-green-700">true negative</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            a classification threshold was only selected at the best layer
            (layer {bestLayer}). Showing raw score separation here instead of
            a confusion matrix would imply a threshold that was never
            properly calibrated at this layer — switch to layer {bestLayer}{" "}
            for a full confusion matrix.
          </div>
        )}

        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            example hops at this layer
          </div>
          <div className="flex flex-col gap-1.5">
            {examples.map((ex) => (
              <div
                key={`${ex.id}-${ex.hop_index}`}
                className="flex items-start gap-2 rounded border border-gray-200 p-2 text-sm"
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
