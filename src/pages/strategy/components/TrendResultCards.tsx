import { BarChart3, Hash, Sparkles, TrendingUp } from "lucide-react";

import type { TrendAnalyzeResultItem } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { extractInterestValues } from "@/lib/trend-intelligence";
import { cn } from "@/lib/utils";

type TrendResultCardsProps = {
  results: TrendAnalyzeResultItem[];
  selectedKeyword?: string;
  onSelect: (result: TrendAnalyzeResultItem) => void;
  copy?: (en: string, vi: string) => string;
};

function InterestSparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return (
      <div className="h-8 rounded-lg border border-dashed border-border/60 bg-background/50" />
    );
  }

  const width = 170;
  const height = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const denominator = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * (width - 2) + 1;
    const y = height - ((value - min) / denominator) * (height - 6) - 3;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-8 w-full rounded-lg border border-border/60 bg-background/45"
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
      />
    </svg>
  );
}

export function TrendResultCards({
  results,
  selectedKeyword,
  onSelect,
  copy,
}: TrendResultCardsProps) {
  const t = copy ?? ((en: string) => en);

  return (
    <>
      {results.length > 0 ? (
        <ScrollArea className="h-120 pr-3">
          <div className="space-y-3">
            {results.map((result) => {
              const selected = selectedKeyword === result.main_keyword;
              const interestValues = extractInterestValues(result);

              return (
                <button
                  key={`${result.main_keyword}-${result.trend_score}`}
                  type="button"
                  onClick={() => onSelect(result)}
                  className={cn(
                    "w-full rounded-2xl border border-border/60 bg-background/60 p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/6",
                    selected &&
                      "border-primary/35 bg-primary/8 shadow-[0_0_0_1px_rgba(59,130,246,0.2)_inset]",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {result.main_keyword}
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/25"
                    >
                      <TrendingUp data-icon="inline-start" />
                      {result.trend_score.toFixed(1)}
                    </Badge>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {result.why_the_trend_happens ||
                      t(
                        "Insight is updating.",
                        "Đang cập nhật phần diễn giải.",
                      )}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <BarChart3 className="size-3.5" />
                      {Math.round(
                        result.avg_views_per_hour,
                      ).toLocaleString()}{" "}
                      {t("views/hour", "lượt xem/giờ")}
                    </span>
                    {result.top_hashtags.slice(0, 3).map((hashtag) => (
                      <span
                        key={hashtag}
                        className="inline-flex items-center gap-1"
                      >
                        <Hash className="size-3.5" />
                        {hashtag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3">
                    <InterestSparkline values={interestValues} />
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 bg-background/35 p-4 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-2 text-foreground">
            <Sparkles className="size-3.5" />
            {t(
              "No trend results to display yet.",
              "Chưa có kết quả xu hướng để hiển thị.",
            )}
          </p>
        </div>
      )}
    </>
  );
}
