import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { formatPercentValue } from "@/lib/insight-formatters";

import type {
  BilingualCopy,
  TrendPriorityItem,
} from "./dashboard-workspace.types";

type DashboardKeywordPriorityPanelProps = {
  copy: BilingualCopy;
  items: TrendPriorityItem[];
};

function buildKeywordSparklineValues(item: TrendPriorityItem) {
  const baseline = Math.max(item.latestScore - item.momentum * 1.2, 8);
  const midpoint = Math.max(item.latestScore - item.momentum * 0.7, 10);
  const shoulder = Math.max(item.latestScore - item.momentum * 0.35, 12);

  return [
    baseline,
    midpoint,
    shoulder,
    item.latestScore * 0.96,
    item.latestScore,
  ].map((value) => Math.max(Math.min(value, 100), 0));
}

function sparklinePoints(values: number[]) {
  if (values.length === 0) {
    return "";
  }

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(" ");
}

export function DashboardKeywordPriorityPanel({
  copy,
  items,
}: DashboardKeywordPriorityPanelProps) {
  return (
    <PanelCard
      title={copy("Keyword Priority", "Ưu tiên từ khóa")}
      description={copy(
        "Top 3 rising trends ranked by momentum.",
        "Top 3 xu hướng tăng nhanh theo đà tăng.",
      )}
    >
      <div className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.slice(0, 3).map((item, index) => (
            <div
              key={`${item.keyword}-${index}`}
              className="rounded-2xl border border-border/65 bg-background/65 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/65 bg-background text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <p className="truncate text-sm font-semibold text-foreground sm:text-[15px]">
                    {item.keyword}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-emerald-500/35 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  {copy("🔥", "🔥")} +{formatPercentValue(item.momentum)}
                </Badge>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-8 w-24"
                  aria-hidden
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    points={sparklinePoints(buildKeywordSparklineValues(item))}
                    className="text-chart-2"
                  />
                </svg>
                <p className="text-xs text-muted-foreground">
                  {copy(
                    `Strength ${formatPercentValue(item.latestScore)} · ${item.mentions} mentions`,
                    `Độ mạnh ${formatPercentValue(item.latestScore)} · ${item.mentions} lượt nhắc`,
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No trend priorities available.",
              "Chưa có dữ liệu ưu tiên xu hướng.",
            )}
          />
        )}
      </div>
    </PanelCard>
  );
}
