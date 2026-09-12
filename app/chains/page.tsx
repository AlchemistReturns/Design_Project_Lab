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
    <div>
      <h1 className="mb-4 text-xl font-semibold">
        Hop &amp; Question Explorer
      </h1>
      <ChainWorkspace chains={chains} hopsByChainId={hopsByChainId} />
    </div>
  );
}
