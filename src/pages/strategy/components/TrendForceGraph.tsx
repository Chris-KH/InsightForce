import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Minus, Plus, ScanSearch } from "lucide-react";

import type { TrendAnalyzeResultItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  buildTrendGraphData,
  type TrendGraphNode,
} from "@/lib/trend-intelligence";

type TrendForceGraphProps = {
  results: TrendAnalyzeResultItem[];
  selectedNodeId?: string;
  onSelectNode?: (node: TrendGraphNode) => void;
};

export function TrendForceGraph({
  results,
  selectedNodeId,
  onSelectNode,
}: TrendForceGraphProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(920);
  const [zoom, setZoom] = useState(1);

  const graphData = useMemo(() => buildTrendGraphData(results), [results]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = () => {
      setWidth(Math.max(320, Math.floor(container.clientWidth)));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const applyZoom = (nextZoom: number) => {
    const safeZoom = Math.max(0.5, Math.min(6, nextZoom));
    setZoom(safeZoom);
    graphRef.current?.zoom?.(safeZoom, 300);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => applyZoom(zoom - 0.25)}
          aria-label="Zoom out"
        >
          <Minus />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => applyZoom(zoom + 0.25)}
          aria-label="Zoom in"
        >
          <Plus />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1);
            graphRef.current?.zoomToFit?.(400, 60);
          }}
        >
          <ScanSearch data-icon="inline-start" />
          Fit View
        </Button>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl border border-border/65 bg-background/55"
      >
        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={440}
          graphData={graphData}
          backgroundColor="rgba(2,6,23,0.03)"
          enableNodeDrag
          cooldownTicks={80}
          nodeRelSize={5}
          d3AlphaDecay={0.06}
          linkDirectionalParticles={(link) =>
            ((link as { sharedTags?: string[] }).sharedTags?.length ?? 0) > 0
              ? 2
              : 0
          }
          linkDirectionalParticleSpeed={0.0035}
          linkColor={(link) =>
            ((link as { sharedTags?: string[] }).sharedTags?.length ?? 0) > 0
              ? "rgba(14,165,233,0.52)"
              : "rgba(100,116,139,0.32)"
          }
          nodeCanvasObject={(nodeObject, ctx, globalScale) => {
            const node = nodeObject as TrendGraphNode;
            const label = node.keyword;
            const radius = node.radius;
            const selected = selectedNodeId === node.id;

            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            ctx.lineWidth = selected ? 3 : 1.2;
            ctx.strokeStyle = selected ? "#f97316" : "rgba(2,6,23,0.2)";
            ctx.stroke();

            const fontSize = Math.max(10, 14 / globalScale);
            ctx.font = `600 ${fontSize}px Inter Variable`;
            ctx.fillStyle = "rgba(15,23,42,0.92)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const maxLabelChars = radius > 20 ? 18 : 12;
            const shortLabel =
              label.length > maxLabelChars
                ? `${label.slice(0, maxLabelChars - 1)}…`
                : label;

            ctx.fillText(shortLabel, node.x ?? 0, node.y ?? 0);
          }}
          onNodeClick={(nodeObject) => {
            onSelectNode?.(nodeObject as TrendGraphNode);
          }}
        />
      </div>
    </div>
  );
}
