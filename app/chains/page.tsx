import ChainWorkspace from "@/components/ChainWorkspace";
import { getChainsFull, getHopsJoined } from "@/lib/data";
import type { HopJoined } from "@/lib/types";

export default function ChainsPage() {
  const chains = getChainsFull();
  const hops = getHopsJoined();

  const hopsByChainId: Record<string, HopJoined[]> = {};
  for (const h of hops) {
    (hopsByChainId[h.id] ??= []).push(h);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hop &amp; Question Explorer
        </h1>
        <p className="mt-2 max-w-3xl text-gray-600">
          Pick a reasoning chain on the left. The <strong>Hop Viewer</strong>{" "}
          lets you reveal each hop&apos;s probe score one chain at a time; the{" "}
          <strong>Question Explorer</strong> shows the same chain in full
          context, with the corrupted fact highlighted inline.
        </p>
      </div>
      <ChainWorkspace chains={chains} hopsByChainId={hopsByChainId} />
    </div>
  );
}
