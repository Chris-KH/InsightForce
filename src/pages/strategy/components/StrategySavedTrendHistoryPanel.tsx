import { CalendarClock, Hash } from "lucide-react";

import type { TrendAnalysisRecordResponse } from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime, formatPercentValue } from "@/lib/insight-formatters";
import { extractInterestValues } from "@/lib/trend-intelligence";
import { cn } from "@/lib/utils";

import type { BilingualCopy } from "./strategy-workspace.types";

type StrategySavedTrendHistoryPanelProps = {
  copy: BilingualCopy;
  records: TrendAnalysisRecordResponse[];
  selectedKeyword?: string;
  isFetching: boolean;
  onSelectKeyword: (keyword: string) => void;
};

function normalizeStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "completed") {
    return "completed";
  }

  if (normalized === "failed") {
    return "failed";
  }

  return "pending";
}

function statusBadgeClass(status: string) {
  const tone = normalizeStatus(status);

  if (tone === "completed") {
    return "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (tone === "failed") {
    return "border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  }

  return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function toInterestPreview(values: number[]) {
  if (values.length === 0) {
    return "--";
  }

  return values
    .slice(0, 6)
    .map((value) => value.toFixed(2))
    .join(" • ");
}

export function StrategySavedTrendHistoryPanel({
  copy,
  records,
  selectedKeyword,
  isFetching,
  onSelectKeyword,
}: StrategySavedTrendHistoryPanelProps) {
  return (
    <PanelCard
      title={copy("Saved Trend Sessions", "Lịch sử phân tích xu hướng")}
      description={copy(
        "Rendered directly from GET /api/v1/trends/history with all key item fields.",
        "Render trực tiếp từ GET /api/v1/trends/history với đầy đủ các trường chính của item.",
      )}
    >
      {records.length === 0 ? (
        <InlineQueryState
          state={isFetching ? "loading" : "empty"}
          message={
            isFetching
              ? copy(
                  "Loading saved trend history...",
                  "Đang tải lịch sử phân tích xu hướng...",
                )
              : copy(
                  "No saved trend analysis yet for this user.",
                  "Chưa có dữ liệu trend đã lưu cho user này.",
                )
          }
        />
      ) : (
        <ScrollArea className="max-h-120 pr-2">
          <div className="grid gap-3">
            {records.map((record, index) => {
              const topResult = record.results[0];
              const keyword = topResult?.main_keyword;
              const trendScore = topResult?.trend_score;
              const interestPreview = topResult
                ? toInterestPreview(extractInterestValues(topResult))
                : "--";
              const hashTags = topResult?.top_hashtags?.join(" ") || "--";
              const canSelect = Boolean(keyword);
              const isSelected = selectedKeyword === keyword;

              return (
                <article
                  key={record.analysis_id ?? `${record.created_at}-${index}`}
                  className={cn(
                    "rounded-2xl border border-border/65 bg-background/60 p-4 text-sm transition-colors",
                    canSelect && "cursor-pointer hover:bg-background/85",
                    isSelected &&
                      "border-primary/35 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset]",
                  )}
                  onClick={() => {
                    if (keyword) {
                      onSelectKeyword(keyword);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!keyword) {
                      return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectKeyword(keyword);
                    }
                  }}
                  role={canSelect ? "button" : undefined}
                  tabIndex={canSelect ? 0 : undefined}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Hash className="size-3" />
                      {record.analysis_id ?? "--"}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full",
                          statusBadgeClass(record.status),
                        )}
                      >
                        {record.status}
                      </Badge>
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="size-3" />
                        {formatDateTime(record.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-base font-semibold text-foreground">
                    {record.query || "--"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {record.markdown_summary ||
                      copy(
                        "No markdown summary provided for this analysis.",
                        "Phân tích này chưa có markdown summary.",
                      )}
                  </p>

                  <div className="mt-3 grid gap-2 rounded-xl border border-border/55 bg-background/55 p-3 text-xs sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">
                        {copy("main_keyword", "main_keyword")}
                      </span>
                      : {keyword ?? "--"}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        {copy("trend_score", "trend_score")}
                      </span>
                      :{" "}
                      {typeof trendScore === "number"
                        ? formatPercentValue(trendScore)
                        : "--"}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-semibold text-foreground">
                        {copy("interest_over_day", "interest_over_day")}
                      </span>
                      : {interestPreview}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-semibold text-foreground">
                        {copy("recommended_action", "recommended_action")}
                      </span>
                      : {topResult?.recommended_action || "--"}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-semibold text-foreground">
                        {copy("top_hashtags", "top_hashtags")}
                      </span>
                      : {hashTags}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </PanelCard>
  );
}
