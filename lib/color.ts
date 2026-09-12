/** Map a [0,1] probe error-score to a background/border color pair.
 * Low score (looks clean) -> green, high score (looks corrupted) -> red. */
export function scoreToColors(score: number) {
  const clamped = Math.max(0, Math.min(1, score));
  const hue = 130 - clamped * 130; // 130 = green, 0 = red
  return {
    background: `hsl(${hue}, 70%, 93%)`,
    border: `hsl(${hue}, 65%, 55%)`,
    text: `hsl(${hue}, 60%, 25%)`,
  };
}
