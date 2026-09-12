# H1 Probe Dashboard

## What is this?

Imagine an AI reading a chain of clues to answer a question — like a detective
following breadcrumbs. Sometimes one of those clues is wrong (either by
accident, or in this case, on purpose, to test the AI). This project asks:
**can we tell, just by looking inside the AI's "brain" while it reads, which
clue was the wrong one?**

Every clue the AI reads leaves a trace of internal activity (its "hidden
state"). We trained a simple detector on those traces to guess, clue by clue,
"does this one look wrong?" This dashboard lets you explore how well that
detector actually worked.

## Why does it matter?

If this works well, it means we could catch an AI's mistakes by watching how
it "thinks," instead of only checking its final answer after the fact — which
matters for building AI systems people can trust.

## What can you do here?

This is a read-only results viewer — a report you can click through, not a
live tool. Everything shown already happened; nothing here re-runs the AI.
Three things to explore:

1. **Layer-Depth Explorer** — An AI reads text in stages ("layers"), refining
   its understanding as it goes. This page lets you scrub through those
   stages and see at which point the detector was best at spotting the wrong
   clue.
2. **Hop-by-Hop "Spot the Error" Viewer** — Pick one chain of clues, and see
   each one lit up green (looks fine) to red (looks suspicious). Reveal the
   answer to check whether the detector actually found the clue that was
   secretly changed.
3. **Question Explorer** — See the full question and background reading in
   context, with the exact word or phrase that was swapped in highlighted,
   plus the same clue-by-clue coloring.

There's also a plain-language heads-up on the Layer-Depth page: in this run,
a much simpler method (just checking how "surprising" the wording of a clue
sounds) actually did as well as, or better than, the detector reading the
AI's internal traces. That doesn't mean the internal-trace idea is a dead
end — it likely means the fake clues were injected in a way that was already
easy to spot from the wording alone, before even looking inside the AI.

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Under the hood (for the curious)

- Built with Next.js + TypeScript + Tailwind CSS.
- All data is pre-computed and static (JSON/CSV files in `data/`) — the app
  just reads and displays it, no model runs live.
- No accounts, no database, no write operations.
