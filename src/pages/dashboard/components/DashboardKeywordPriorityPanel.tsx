import { useMemo, useState } from "react";

import type { TrendAnalysisRecordResponse } from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard, ProgressBar } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatPercentValue } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

type KeywordSortMode = "score" | "frequency";

type DashboardKeywordPriorityPanelProps = {
  trendRecords: TrendAnalysisRecordResponse[];
};

export function DashboardKeywordPriorityPanel({
  trendRecords,
}: DashboardKeywordPriorityPanelProps) {
  const copy = useBilingual();
  const [keywordSortMode, setKeywordSortMode] =
    useState<KeywordSortMode>("score");

  const keywordPulseRaw = useMemo(() => {
    const collector = new Map<string, { score: number; count: number }>();

    for (const record of trendRecords) {
      for (const result of record.results) {
        const current = collector.get(result.main_keyword);

        if (current) {
          current.count += 1;
          current.score = Math.max(current.score, result.trend_score);
        } else {
          collector.set(result.main_keyword, {
            count: 1,
            score: result.trend_score,
          });
        }
      }
    }

    return [...collector.entries()].map(([keyword, stats]) => ({
      keyword,
      ...stats,
    }));
  }, [trendRecords]);

  const keywordPulse = useMemo(() => {
    const items = [...keywordPulseRaw];

    if (keywordSortMode === "frequency") {
      items.sort(
        (left, right) => right.count - left.count || right.score - left.score,
      );
    } else {
      items.sort(
        (left, right) => right.score - left.score || right.count - left.count,
      );
    }

    return items.slice(0, 8);
  }, [keywordPulseRaw, keywordSortMode]);

  return (
    <PanelCard
      title={copy("Keyword Priority", "Ưu tiên keyword")}
      description={copy(
        "Switch sorting mode to discover top keywords by strength or repetition.",
        "Chuyển chế độ sắp xếp để xem keyword mạnh nhất hoặc xuất hiện nhiều nhất.",
      )}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "score", label: copy("By Strength", "Theo độ mạnh") },
            {
              key: "frequency",
              label: copy("By Frequency", "Theo tần suất"),
            },
          ] as const
        ).map((mode) => {
          const active = keywordSortMode === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setKeywordSortMode(mode.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary/45 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/70 text-muted-foreground",
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {keywordPulse.length > 0 ? (
        <div className="space-y-4">
          {keywordPulse.map((item, index) => (
            <div key={item.keyword}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {item.keyword}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentValue(item.score)} • {item.count}x
                </p>
              </div>
              <ProgressBar
                value={Math.min(item.score, 100)}
                tone={index % 2 === 0 ? "primary" : "secondary"}
              />
            </div>
          ))}
        </div>
      ) : (
        <InlineQueryState
          state="empty"
          message={copy(
            "No keyword signal available.",
            "Chưa có tín hiệu keyword.",
          )}
        />
      )}
    </PanelCard>
  );
}
