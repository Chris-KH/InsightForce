import { Flame } from "lucide-react";

import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatPercentValue } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

import type { BilingualCopy, TrendTopic } from "./strategy-workspace.types";

type StrategyTrendDiscoveryPanelProps = {
  copy: BilingualCopy;
  topics: TrendTopic[];
  selectedKeyword?: string;
  isPending: boolean;
  onSelectKeyword: (keyword: string) => void;
};

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

function heatLabel(score: number, copy: BilingualCopy) {
  if (score >= 85) {
    return copy("Very Hot", "Rất nóng");
  }

  if (score >= 70) {
    return copy("Hot", "Nóng");
  }

  if (score >= 55) {
    return copy("Rising", "Đang tăng");
  }

  return copy("Watch", "Theo dõi");
}

export function StrategyTrendDiscoveryPanel({
  copy,
  topics,
  selectedKeyword,
  isPending,
  onSelectKeyword,
}: StrategyTrendDiscoveryPanelProps) {
  return (
    <PanelCard
      title={copy("Trend Discovery", "Khám phá xu hướng")}
      description={copy(
        "Tap one topic card to reveal deeper insight and instant actions.",
        "Chọn một thẻ chủ đề để xem insight sâu hơn và hành động ngay.",
      )}
    >
      {topics.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {topics.map((topic) => {
            const isActive = selectedKeyword === topic.keyword;

            return (
              <button
                key={topic.keyword}
                type="button"
                onClick={() => {
                  onSelectKeyword(topic.keyword);
                }}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  "bg-background/65 hover:bg-background/90",
                  isActive
                    ? "border-primary/40 shadow-[0_0_0_1px_rgba(59,130,246,0.18)_inset]"
                    : "border-border/65",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {copy("Topic", "Chủ đề")}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {topic.keyword}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/25 bg-primary/10 text-primary"
                  >
                    <Flame className="mr-1.5 size-3.5" />
                    {heatLabel(topic.trendScore, copy)}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
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
                      points={sparklinePoints(topic.sparkline)}
                      className="text-chart-2"
                    />
                  </svg>
                  <Badge
                    variant="outline"
                    className="rounded-full border-emerald-500/35 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    +{formatPercentValue(topic.growthPercent)}
                  </Badge>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {copy("Views/hour", "Lượt xem/giờ")}: {formatCompactNumber(topic.avgViewsPerHour)}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <InlineQueryState
          state={isPending ? "loading" : "empty"}
          message={
            isPending
              ? copy(
                  "AI Trend Scout is building your topic map...",
                  "AI Trend Scout đang xây dựng bản đồ chủ đề cho bạn...",
                )
              : copy(
                  "Run a trend scout prompt to populate the trending topics grid.",
                  "Hãy chạy một prompt để hiển thị lưới chủ đề đang thịnh hành.",
                )
          }
        />
      )}
    </PanelCard>
  );
}
