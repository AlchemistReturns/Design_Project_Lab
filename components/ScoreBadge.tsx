import { scoreToColors } from "@/lib/color";

export default function ScoreBadge({
  score,
  neutral = false,
}: {
  score: number | null;
  neutral?: boolean;
}) {
  if (score === null) {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-500">
        n/a
      </span>
    );
  }

  const colors = neutral
    ? { background: "#f3f4f6", border: "#d1d5db", text: "#374151" }
    : scoreToColors(score);

  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono font-medium"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {score.toFixed(3)}
    </span>
  );
}
