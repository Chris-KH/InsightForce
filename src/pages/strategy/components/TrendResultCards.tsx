import { BarChart3, Hash, Sparkles, TrendingUp } from "lucide-react";

import type { TrendAnalyzeResultItem } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TrendResultCardsProps = {
  results: TrendAnalyzeResultItem[];
  selectedKeyword?: string;
  onSelect: (result: TrendAnalyzeResultItem) => void;
};

export function TrendResultCards({
  results,
  selectedKeyword,
  onSelect,
}: TrendResultCardsProps) {
  return (
    <div className="space-y-3">
      {results.map((result) => {
        const selected = selectedKeyword === result.main_keyword;

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
              {result.why_the_trend_happens}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BarChart3 className="size-3.5" />
                {Math.round(result.avg_views_per_hour).toLocaleString()} views/h
              </span>
              {result.top_hashtags.slice(0, 3).map((hashtag) => (
                <span key={hashtag} className="inline-flex items-center gap-1">
                  <Hash className="size-3.5" />
                  {hashtag}
                </span>
              ))}
            </div>
          </button>
        );
      })}

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-background/35 p-4 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-2 text-foreground">
            <Sparkles className="size-3.5" />
            Chưa có kết quả trend để hiển thị.
          </p>
        </div>
      ) : null}
    </div>
  );
}
