export interface TestMetrics {
  roc_auc: number;
  average_precision: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  brier_score: number;
  positive_prevalence: number;
  always_correct_accuracy: number;
  top_rank_correct: number;
  first_flag_correct: number;
  clean_false_alarm: number;
  random_top_baseline: number;
  exact_injected_hop_localization_accuracy: number;
  exact_injected_hop_localization_percent: number;
}

export interface BaselineComparisonRow {
  probe: string;
  roc_auc: number;
  average_precision: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  brier_score: number;
  positive_prevalence: number;
  top_rank_localization: number;
  first_flag_localization: number;
  clean_chain_false_alarm: number;
}

export interface LayerProfileRow {
  layer: number;
  validation_AP: number;
}

export interface LayerHopScoreRow {
  id: string;
  hop_index: number;
  split: string;
  layers: number[]; // index 0 => layer_1 ... index 23 => layer_24
}

export interface HopMetadataRow {
  id: string;
  group_id: string;
  hop_index: number;
  n_hops: number;
  hop: string;
  label: number;
  question: string;
  answer: string;
  source: string;
  supporting_title: string;
  supporting_sent_id: number;
  is_injected_error: boolean;
  split: string;
}

export interface TestHopPredictionRow extends HopMetadataRow {
  error_score: number;
  flagged: boolean;
}

export interface ChainMetricsRow {
  id: string;
  has_error: boolean;
  exact_injected_hop_correct: boolean | null;
  top_rank_correct: boolean | null;
  first_flag_correct: boolean | null;
  clean_false_alarm: boolean | null;
  random_top_baseline: number | null;
}

export interface Corruption {
  strategy: string;
  original_hop: string;
  corrupted_hop: string;
  original_value: string;
  replacement_value: string;
  span_start: number;
  span_end: number;
  hop_index: number;
}

export interface Chain {
  id: string;
  group_id: string;
  split: string;
  question: string;
  answer: string;
  context: string;
  hops: string[];
  labels: number[];
  corruption: Corruption | null;
}

export interface ChainFull extends Chain {
  metrics: ChainMetricsRow | null;
}

export interface HopJoined extends HopMetadataRow {
  error_score: number | null;
  flagged: boolean | null;
}
