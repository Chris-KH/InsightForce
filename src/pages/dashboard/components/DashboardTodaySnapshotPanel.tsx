import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import type {
  GeneratedContentResponse,
  PublishJobResponse,
  TrendAnalysisRecordResponse,
} from "@/api";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentValue,
} from "@/lib/insight-formatters";

type DashboardTodaySnapshotPanelProps = {
  trendRecords: TrendAnalysisRecordResponse[];
  generatedContents: GeneratedContentResponse[];
  publishJobs: PublishJobResponse[];
};

export function DashboardTodaySnapshotPanel({
  trendRecords,
  generatedContents,
  publishJobs,
}: DashboardTodaySnapshotPanelProps) {
  const copy = useBilingual();

  const topKeywordScore = useMemo(() => {
    let highestScore = 0;

    for (const record of trendRecords) {
      for (const result of record.results) {
        if (result.trend_score > highestScore) {
          highestScore = result.trend_score;
        }
      }
    }

    return highestScore;
  }, [trendRecords]);

  return (
    <PanelCard
      title={copy("Today Snapshot", "Snapshot hôm nay")}
      description={copy(
        "A quick pulse so you know where to act next.",
        "Nhịp nhanh để bạn biết bước hành động tiếp theo.",
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="text-xs text-muted-foreground">
            {copy("Trend Analyses", "Phân tích xu hướng")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCompactNumber(trendRecords.length)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="text-xs text-muted-foreground">
            {copy("Generated Contents", "Nội dung đã tạo")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCompactNumber(generatedContents.length)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="text-xs text-muted-foreground">
            {copy("Publishing Tasks", "Tác vụ đăng bài")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCompactNumber(publishJobs.length)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="text-xs text-muted-foreground">
            {copy("Top Keyword Strength", "Độ mạnh keyword cao nhất")}
          </p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Sparkles className="size-5 text-amber-500" />
            {formatPercentValue(topKeywordScore)}
          </p>
        </div>
      </div>
    </PanelCard>
  );
}
