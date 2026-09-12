export interface MetricDefinition {
  label: string;
  blurb: string;
}

/** Plain-English descriptions of every metric surfaced in the UI, keyed by
 * the field name it's read from in test_metrics.json / baseline CSVs. */
export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  roc_auc: {
    label: "ROC AUC",
    blurb:
      "If you show the probe one corrupted hop and one clean hop at random, this is the chance it scores the corrupted one higher. 0.5 = coin flip, 1.0 = perfect.",
  },
  average_precision: {
    label: "Average precision",
    blurb:
      "Rewards ranking corrupted hops near the top of the list while keeping false alarms low. More sensitive to a small positive class than plain accuracy.",
  },
  accuracy: {
    label: "Accuracy",
    blurb:
      "Share of all hops (corrupted or clean) the probe labeled correctly, using its single best threshold.",
  },
  f1: {
    label: "F1 score",
    blurb:
      "Balances catching real errors (recall) against not crying wolf on clean hops (precision) into one number.",
  },
  precision: {
    label: "Precision",
    blurb: "Of the hops the probe flagged as corrupted, the share actually corrupted.",
  },
  recall: {
    label: "Recall",
    blurb: "Of the hops that were actually corrupted, the share the probe caught.",
  },
  exact_injected_hop_localization_percent: {
    label: "Exact hop localization",
    blurb:
      "For corrupted chains, how often the probe's top-ranked hop is exactly the one that was tampered with — not just \"somewhere in this chain.\"",
  },
  top_rank_correct: {
    label: "Top-rank hop correct",
    blurb:
      "Same idea as hop localization, expressed as a 0–1 rate: the probe's single highest-scoring hop in a chain matches the corrupted hop.",
  },
  first_flag_correct: {
    label: "First-flag correct",
    blurb:
      "Reading hops in order, whether the first hop the probe flags as suspicious is the actual corrupted one.",
  },
  clean_false_alarm: {
    label: "Clean false-alarm rate",
    blurb:
      "On chains with no injected error at all, how often the probe raises a flag anyway. Lower is better.",
  },
  positive_prevalence: {
    label: "Positive prevalence",
    blurb:
      "Share of all hops in the test set that are actually corrupted — the base rate the probe has to beat.",
  },
  brier_score: {
    label: "Brier score",
    blurb:
      "Average squared error between the probe's score and the true 0/1 label. Lower is better; 0 is perfect.",
  },
  random_top_baseline: {
    label: "Random top-hop baseline",
    blurb:
      "The hop-localization accuracy you'd expect from picking a hop at random in each chain — a sanity floor to compare against.",
  },
  validation_AP: {
    label: "Validation AP",
    blurb:
      "Average precision of the probe trained on this one layer's activations, measured on the validation split.",
  },
};

export function metricDef(key: string): MetricDefinition {
  return (
    METRIC_DEFINITIONS[key] ?? { label: key, blurb: "" }
  );
}
