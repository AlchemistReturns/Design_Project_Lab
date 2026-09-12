import Link from "next/link";

export default function Hero({
  rocAuc,
  hopLocalizationPercent,
  nTestChains,
}: {
  rocAuc: number;
  hopLocalizationPercent: number;
  nTestChains: number;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950">
      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      {/* subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-200 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          H1 · error-localization probe
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Can a model&apos;s hidden states catch its own factual mistakes?
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100/80">
          We trained a linear probe on a transformer&apos;s internal
          activations to spot deliberately corrupted facts hidden inside
          multi-hop reasoning chains — without ever reading the final answer.
          This is what we found.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#try-it"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-950 shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-50"
          >
            Explore a reasoning chain
          </a>
          <Link
            href="/layers"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See where the signal lives →
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="text-2xl font-semibold text-white">
              {rocAuc.toFixed(3)}
            </div>
            <div className="text-xs text-indigo-200/70">ROC AUC</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="text-2xl font-semibold text-white">
              {hopLocalizationPercent.toFixed(0)}%
            </div>
            <div className="text-xs text-indigo-200/70">
              exact hop localization
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="text-2xl font-semibold text-white">
              N={nTestChains}
            </div>
            <div className="text-xs text-indigo-200/70">test chains</div>
          </div>
        </div>
      </div>
    </section>
  );
}
