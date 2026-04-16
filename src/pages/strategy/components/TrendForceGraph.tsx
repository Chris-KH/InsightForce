import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { Minus, Plus, ScanSearch } from "lucide-react";

import type { TrendAnalyzeResultItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  buildTrendGraphData,
  type TrendGraphNode,
} from "@/lib/trend-intelligence";
import { cn } from "@/lib/utils";

type TrendForceGraphProps = {
  results: TrendAnalyzeResultItem[];
  selectedNodeId?: string;
  onSelectNode?: (node: TrendGraphNode) => void;
};

type TrendGraphLinkLike = {
  source: string | TrendGraphNode;
  target: string | TrendGraphNode;
  sharedTags?: string[];
  weight?: number;
};

function resolveNodeId(nodeOrId: string | TrendGraphNode) {
  return typeof nodeOrId === "string" ? nodeOrId : nodeOrId.id;
}

function truncateLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  maxWidth: number,
) {
  if (ctx.measureText(label).width <= maxWidth) {
    return label;
  }

  let end = label.length;
  while (end > 1) {
    const next = `${label.slice(0, end)}…`;
    if (ctx.measureText(next).width <= maxWidth) {
      return next;
    }
    end -= 1;
  }

  return "…";
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.max(0, Math.min(radius, Math.min(width, height) / 2));

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function drawLabelChip({
  ctx,
  node,
  globalScale,
  emphasize,
  isDarkMode,
}: {
  ctx: CanvasRenderingContext2D;
  node: TrendGraphNode;
  globalScale: number;
  emphasize: boolean;
  isDarkMode: boolean;
}) {
  const x = node.x ?? 0;
  const y = node.y ?? 0;
  const fontSize = Math.max(10, 13 / globalScale);
  ctx.font = `600 ${fontSize}px Outfit`;

  const maxTextWidth = (emphasize ? 210 : 136) / globalScale;
  const visibleLabel = truncateLabel(ctx, node.keyword, maxTextWidth);

  const horizontalPadding = 8 / globalScale;
  const verticalPadding = 4 / globalScale;
  const textWidth = ctx.measureText(visibleLabel).width;
  const chipWidth = textWidth + horizontalPadding * 2;
  const chipHeight = fontSize + verticalPadding * 2;
  const chipX = x - chipWidth / 2;
  const chipY = y + node.radius + 10 / globalScale;

  drawRoundedRect(ctx, chipX, chipY, chipWidth, chipHeight, chipHeight / 2);
  ctx.fillStyle = isDarkMode
    ? emphasize
      ? "rgba(15,23,42,0.88)"
      : "rgba(15,23,42,0.72)"
    : emphasize
      ? "rgba(248,250,252,0.92)"
      : "rgba(248,250,252,0.8)";
  ctx.fill();

  ctx.lineWidth = emphasize ? 1.6 / globalScale : 1.1 / globalScale;
  ctx.strokeStyle = isDarkMode
    ? emphasize
      ? "rgba(251,146,60,0.85)"
      : "rgba(148,163,184,0.45)"
    : emphasize
      ? "rgba(245,158,11,0.9)"
      : "rgba(100,116,139,0.38)";
  ctx.stroke();

  ctx.fillStyle = isDarkMode ? "rgba(241,245,249,0.97)" : "rgba(15,23,42,0.9)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(visibleLabel, x, chipY + chipHeight / 2);
}

export function TrendForceGraph({
  results,
  selectedNodeId,
  onSelectNode,
}: TrendForceGraphProps) {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoFittedRef = useRef(false);
  const zoomSyncFrameRef = useRef<number | null>(null);
  const latestZoomRef = useRef(1);
  const [width, setWidth] = useState(920);
  const [zoom, setZoom] = useState(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (zoomSyncFrameRef.current !== null) {
        window.cancelAnimationFrame(zoomSyncFrameRef.current);
      }
    };
  }, []);

  const syncZoomState = useCallback((nextZoom: number) => {
    if (!Number.isFinite(nextZoom)) {
      return;
    }

    latestZoomRef.current = nextZoom;
    if (zoomSyncFrameRef.current !== null) {
      return;
    }

    zoomSyncFrameRef.current = window.requestAnimationFrame(() => {
      zoomSyncFrameRef.current = null;
      setZoom((currentZoom) => {
        if (Math.abs(currentZoom - latestZoomRef.current) < 0.001) {
          return currentZoom;
        }

        return latestZoomRef.current;
      });
    });
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || graphData.nodes.length === 0) {
      return;
    }

    const graphWithTuning = graph as ForceGraphMethods & {
      d3AlphaDecay?: (value: number) => void;
      d3VelocityDecay?: (value: number) => void;
    };

    const nodeCount = graphData.nodes.length;
    const baseDistance = nodeCount <= 4 ? 180 : 136;
    const baseCharge = nodeCount <= 4 ? -430 : -300;

    const linkForce = graph.d3Force?.("link");
    if (linkForce?.distance) {
      linkForce.distance((link: TrendGraphLinkLike) => {
        const sharedTagCount = link.sharedTags?.length ?? 0;
        const weight = link.weight ?? 1;
        return Math.max(96, baseDistance - sharedTagCount * 12 - weight * 8);
      });
    }
    if (linkForce?.strength) {
      linkForce.strength((link: TrendGraphLinkLike) => {
        const sharedTagCount = link.sharedTags?.length ?? 0;
        return Math.min(0.48, 0.1 + sharedTagCount * 0.08);
      });
    }

    const chargeForce = graph.d3Force?.("charge");
    if (chargeForce?.strength) {
      chargeForce.strength((nodeObject: unknown) => {
        const node = nodeObject as TrendGraphNode;
        return baseCharge - node.radius * 10;
      });
    }
    chargeForce?.distanceMax?.(680);
    chargeForce?.distanceMin?.(40);

    graphWithTuning.d3AlphaDecay?.(0.034);
    graphWithTuning.d3VelocityDecay?.(0.26);
    graph.d3ReheatSimulation?.();
  }, [graphData, width]);

  const fitGraphToViewport = useCallback(
    (durationMs = 540) => {
      const graph = graphRef.current;
      if (!graph) {
        return;
      }

      graph.zoomToFit?.(durationMs, 72);
      graph.centerAt?.(0, 0, Math.max(220, Math.floor(durationMs * 0.6)));

      const nextZoom = graph.zoom?.();
      if (typeof nextZoom === "number") {
        syncZoomState(nextZoom);
      }
    },
    [syncZoomState],
  );

  useEffect(() => {
    if (graphData.nodes.length === 0) {
      return;
    }

    hasAutoFittedRef.current = false;

    const timeout = window.setTimeout(() => {
      if (hasAutoFittedRef.current) {
        return;
      }

      hasAutoFittedRef.current = true;
      fitGraphToViewport();
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [fitGraphToViewport, graphData, width]);

  const handleEngineStop = useCallback(() => {
    if (graphData.nodes.length === 0 || hasAutoFittedRef.current) {
      return;
    }

    hasAutoFittedRef.current = true;
    fitGraphToViewport();
  }, [fitGraphToViewport, graphData.nodes.length]);

  const applyZoom = (nextZoom: number) => {
    const safeZoom = Math.max(0.5, Math.min(6, nextZoom));
    latestZoomRef.current = safeZoom;
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
            latestZoomRef.current = 1;
            setZoom(1);
            fitGraphToViewport(500);
          }}
        >
          <ScanSearch data-icon="inline-start" />
          Fit View
        </Button>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-2xl border",
          isDarkMode
            ? "border-primary/25 bg-linear-to-b from-slate-950/95 via-slate-900/92 to-slate-950/96"
            : "border-slate-300/75 bg-linear-to-b from-slate-100/95 via-slate-50/88 to-white",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl",
            isDarkMode ? "bg-sky-400/20" : "bg-sky-300/35",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full blur-3xl",
            isDarkMode ? "bg-amber-400/17" : "bg-orange-300/30",
          )}
        />

        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={440}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          enableNodeDrag
          minZoom={0.55}
          maxZoom={7}
          warmupTicks={80}
          cooldownTicks={180}
          nodeRelSize={5}
          d3AlphaDecay={0.034}
          d3VelocityDecay={0.26}
          linkCurvature={0.1}
          linkWidth={(linkObject) => {
            const link = linkObject as TrendGraphLinkLike;
            const sourceId = resolveNodeId(link.source);
            const targetId = resolveNodeId(link.target);
            const selectedConnection =
              selectedNodeId !== undefined &&
              (sourceId === selectedNodeId || targetId === selectedNodeId);

            if (selectedConnection) {
              return 2.4;
            }

            return 1 + (link.sharedTags?.length ?? 0) * 0.35;
          }}
          linkDirectionalParticles={(link) =>
            ((link as { sharedTags?: string[] }).sharedTags?.length ?? 0) > 0
              ? 1
              : 0
          }
          linkDirectionalParticleSpeed={0.0025}
          linkDirectionalParticleWidth={1.5}
          linkColor={(link) =>
            ((link as { sharedTags?: string[] }).sharedTags?.length ?? 0) > 0
              ? isDarkMode
                ? "rgba(125,211,252,0.4)"
                : "rgba(14,116,144,0.34)"
              : isDarkMode
                ? "rgba(148,163,184,0.24)"
                : "rgba(100,116,139,0.26)"
          }
          nodeCanvasObject={(nodeObject, ctx, globalScale) => {
            const node = nodeObject as TrendGraphNode;
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const radius = node.radius;
            const selected = selectedNodeId === node.id;
            const hovered = hoveredNodeId === node.id;
            const emphasize = selected || hovered;

            const glowRadius = radius + (emphasize ? 18 : 12);
            const glowGradient = ctx.createRadialGradient(
              x,
              y,
              radius * 0.25,
              x,
              y,
              glowRadius,
            );
            glowGradient.addColorStop(0, node.glowColor);
            glowGradient.addColorStop(1, "rgba(15,23,42,0)");

            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = glowGradient;
            ctx.fill();

            const fillGradient = ctx.createRadialGradient(
              x - radius * 0.35,
              y - radius * 0.55,
              Math.max(1, radius * 0.12),
              x,
              y,
              radius * 1.05,
            );
            fillGradient.addColorStop(
              0,
              isDarkMode ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.18)",
            );
            fillGradient.addColorStop(0.24, node.color);
            fillGradient.addColorStop(1, node.strokeColor);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = fillGradient;
            ctx.fill();

            ctx.lineWidth = selected ? 3 : hovered ? 2.2 : 1.4;
            ctx.strokeStyle = selected
              ? "rgba(251,146,60,0.98)"
              : hovered
                ? isDarkMode
                  ? "rgba(248,250,252,0.9)"
                  : "rgba(15,23,42,0.88)"
                : isDarkMode
                  ? "rgba(15,23,42,0.45)"
                  : "rgba(71,85,105,0.55)";
            ctx.stroke();

            if (emphasize || globalScale >= 1.35) {
              drawLabelChip({
                ctx,
                node,
                globalScale,
                emphasize,
                isDarkMode,
              });
            }
          }}
          nodePointerAreaPaint={(nodeObject, color, ctx) => {
            const node = nodeObject as TrendGraphNode;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, node.radius + 6, 0, 2 * Math.PI);
            ctx.fill();
          }}
          nodeLabel={(nodeObject) => {
            const node = nodeObject as TrendGraphNode;
            return `${node.keyword}\nTrend score: ${node.trendScore.toFixed(1)}\nAvg views/hour: ${Math.round(node.avgViewsPerHour)}`;
          }}
          onZoom={(transform) => {
            if (typeof transform.k === "number") {
              syncZoomState(transform.k);
            }
          }}
          onNodeHover={(nodeObject) => {
            const node = nodeObject as TrendGraphNode | null;
            setHoveredNodeId(node?.id ?? null);
          }}
          onNodeClick={(nodeObject) => {
            onSelectNode?.(nodeObject as TrendGraphNode);
          }}
          onBackgroundClick={() => setHoveredNodeId(null)}
          onEngineStop={handleEngineStop}
        />
      </div>
    </div>
  );
}
