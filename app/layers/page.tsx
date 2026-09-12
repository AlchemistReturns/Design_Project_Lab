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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Layer-Depth Explorer
        </h1>
        <p className="mt-2 max-w-3xl text-gray-600">
          A transformer refines its understanding of a hop across many
          layers. A separate probe was trained at each layer, so the
          strength of the error-detection signal can differ layer to layer.
          Drag the marker below, click a layer number, or click anywhere on
          the chart to see how well the probe performs at that depth in the
          network.
        </p>
      </div>
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
