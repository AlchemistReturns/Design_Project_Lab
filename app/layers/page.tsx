import LayerDepthExplorer from "@/components/LayerDepthExplorer";
import {
  getBaselineComparison,
  getBestLayer,
  getChainsFull,
  getLayerExplorerHops,
  getLayerProfile,
} from "@/lib/data";

export default function LayersPage() {
  const layerProfile = getLayerProfile();
  const baseline = getBaselineComparison();
  const bestLayer = getBestLayer();
  const testHops = getLayerExplorerHops();
  const nTestChains = getChainsFull().filter((c) => c.split === "test").length;

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Layer-Depth Explorer</h1>
      <LayerDepthExplorer
        layerProfile={layerProfile}
        baseline={baseline}
        bestLayer={bestLayer}
        testHops={testHops}
        nTestChains={nTestChains}
      />
    </div>
  );
}
