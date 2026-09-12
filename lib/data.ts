import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type {
  TestMetrics,
  BaselineComparisonRow,
  LayerProfileRow,
  LayerHopScoreRow,
  HopMetadataRow,
  TestHopPredictionRow,
  ChainMetricsRow,
  Chain,
  ChainFull,
  HopJoined,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const N_LAYERS = 24;

function readCsvRaw(filename: string): Record<string, string>[] {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
  return parse(raw, { columns: true, skip_empty_lines: true }) as Record<
    string,
    string
  >[];
}

function readJson<T>(filename: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
}

const toBool = (v: string) => v === "True" || v === "true";
const toNum = (v: string) => (v === "" || v === undefined ? null : Number(v));

export function getMetricsSummary(): TestMetrics {
  return readJson<TestMetrics>("test_metrics.json");
}

export function getBaselineComparison(): BaselineComparisonRow[] {
  return readCsvRaw("h1_baseline_comparison.csv").map((r) => ({
    probe: r.probe,
    roc_auc: Number(r.roc_auc),
    average_precision: Number(r.average_precision),
    accuracy: Number(r.accuracy),
    precision: Number(r.precision),
    recall: Number(r.recall),
    f1: Number(r.f1),
    brier_score: Number(r.brier_score),
    positive_prevalence: Number(r.positive_prevalence),
    top_rank_localization: Number(r.top_rank_localization),
    first_flag_localization: Number(r.first_flag_localization),
    clean_chain_false_alarm: Number(r.clean_chain_false_alarm),
  }));
}

export function getLayerProfile(): LayerProfileRow[] {
  return readCsvRaw("h1_layer_profile.csv")
    .map((r) => ({
      layer: Number(r.layer),
      validation_AP: Number(r.validation_AP),
    }))
    .sort((a, b) => a.layer - b.layer);
}

/** Layer number (1-indexed) with the highest validation AP. Not stored explicitly
 * anywhere in the exported data, so derive it once here from the layer profile. */
export function getBestLayer(): number {
  const profile = getLayerProfile();
  return profile.reduce((best, row) =>
    row.validation_AP > best.validation_AP ? row : best,
  ).layer;
}

export function getLayerHopScores(): LayerHopScoreRow[] {
  return readCsvRaw("layer_hop_scores.csv").map((r) => {
    const layers: number[] = [];
    for (let i = 1; i <= N_LAYERS; i++) {
      layers.push(Number(r[`layer_${i}`]));
    }
    return {
      id: r.id,
      hop_index: Number(r.hop_index),
      split: r.split,
      layers,
    };
  });
}

export function getHopMetadata(): HopMetadataRow[] {
  return readCsvRaw("hop_metadata.csv").map((r) => ({
    id: r.id,
    group_id: r.group_id,
    hop_index: Number(r.hop_index),
    n_hops: Number(r.n_hops),
    hop: r.hop,
    label: Number(r.label),
    question: r.question,
    answer: r.answer,
    source: r.source,
    supporting_title: r.supporting_title,
    supporting_sent_id: Number(r.supporting_sent_id),
    is_injected_error: toBool(r.is_injected_error),
    split: r.split,
  }));
}

export function getTestHopPredictions(): TestHopPredictionRow[] {
  return readCsvRaw("test_hop_predictions.csv").map((r) => ({
    id: r.id,
    group_id: r.group_id,
    hop_index: Number(r.hop_index),
    n_hops: Number(r.n_hops),
    hop: r.hop,
    label: Number(r.label),
    question: r.question,
    answer: r.answer,
    source: r.source,
    supporting_title: r.supporting_title,
    supporting_sent_id: Number(r.supporting_sent_id),
    is_injected_error: toBool(r.is_injected_error),
    split: r.split,
    error_score: Number(r.error_score),
    flagged: toBool(r.flagged),
  }));
}

export function getChainMetrics(): ChainMetricsRow[] {
  return readCsvRaw("test_chain_metrics.csv").map((r) => ({
    id: r.id,
    has_error: toBool(r.has_error),
    exact_injected_hop_correct:
      r.exact_injected_hop_correct === "" ? null : toBool(r.exact_injected_hop_correct),
    top_rank_correct: r.top_rank_correct === "" ? null : toBool(r.top_rank_correct),
    first_flag_correct: r.first_flag_correct === "" ? null : toBool(r.first_flag_correct),
    clean_false_alarm: r.clean_false_alarm === "" ? null : toBool(r.clean_false_alarm),
    random_top_baseline: toNum(r.random_top_baseline),
  }));
}

export function getChains(): Chain[] {
  return readJson<Chain[]>("chains.json");
}

// ---- Derived, joined views ----

export function getChainsFull(): ChainFull[] {
  const chains = getChains();
  const metrics = getChainMetrics();
  const metricsById = new Map(metrics.map((m) => [m.id, m]));
  return chains.map((c) => ({ ...c, metrics: metricsById.get(c.id) ?? null }));
}

export function getHopsJoined(): HopJoined[] {
  const hops = getHopMetadata();
  const preds = getTestHopPredictions();
  const predsByKey = new Map(
    preds.map((p) => [`${p.id}-${p.hop_index}`, p]),
  );
  return hops.map((h) => {
    const pred = predsByKey.get(`${h.id}-${h.hop_index}`);
    return {
      ...h,
      error_score: pred ? pred.error_score : null,
      flagged: pred ? pred.flagged : null,
    };
  });
}

export function getLayerHopScoresById(): Map<string, LayerHopScoreRow> {
  const rows = getLayerHopScores();
  return new Map(rows.map((r) => [`${r.id}-${r.hop_index}`, r]));
}

export interface LayerExplorerHop {
  id: string;
  hop_index: number;
  hop: string;
  question: string;
  is_injected_error: boolean;
  flaggedAtBestLayer: boolean;
  layers: number[];
}

/** Test-split hops joined with their per-layer scores and best-layer flag,
 * for the Layer-Depth Explorer's scrubbing + confusion matrix. */
export function getLayerExplorerHops(): LayerExplorerHop[] {
  const preds = getTestHopPredictions();
  const layerScoresByKey = getLayerHopScoresById();
  return preds.map((p) => {
    const key = `${p.id}-${p.hop_index}`;
    const layers = layerScoresByKey.get(key)?.layers ?? [];
    return {
      id: p.id,
      hop_index: p.hop_index,
      hop: p.hop,
      question: p.question,
      is_injected_error: p.is_injected_error,
      flaggedAtBestLayer: p.flagged,
      layers,
    };
  });
}
