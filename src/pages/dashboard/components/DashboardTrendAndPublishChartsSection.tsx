import { useMemo } from "react";

import type { PublishJobResponse, TrendAnalysisRecordResponse } from "@/api";
import { BarTrendChart, LineTrendChart } from "@/components/app-data-viz";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getTrendAverageScore(record: TrendAnalysisRecordResponse) {
  if (record.results.length === 0) {
    return 0;
  }

  const totalScore = record.results.reduce(
    (sum, item) => sum + item.trend_score,
    0,
  );

  return totalScore / record.results.length;
}

type DashboardTrendAndPublishChartsSectionProps = {
  trendRecords: TrendAnalysisRecordResponse[];
  publishJobs: PublishJobResponse[];
};

export function DashboardTrendAndPublishChartsSection({
  trendRecords,
  publishJobs,
}: DashboardTrendAndPublishChartsSectionProps) {
  const copy = useBilingual();

  const publishedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const pendingJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;

  const trendMomentumChartData = useMemo(() => {
    const points = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(left.created_at) - toTimestamp(right.created_at),
      )
      .slice(-10);

    return {
      labels: points.map((point) => {
        const date = new Date(point.created_at);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: copy("Average Trend Score", "Điểm trend trung bình"),
          data: points.map((point) => getTrendAverageScore(point)),
          borderColor: "rgba(14, 165, 233, 0.92)",
          backgroundColor: "rgba(14, 165, 233, 0.22)",
          tension: 0.38,
          fill: true,
          pointRadius: 3,
        },
      ],
    };
  }, [copy, trendRecords]);

  const publishStatusChartData = useMemo(
    () => ({
      labels: [
        copy("Pending", "Đang chờ"),
        copy("Published", "Đã đăng"),
        copy("Failed", "Thất bại"),
      ],
      datasets: [
        {
          label: copy("Publishing Tasks", "Tác vụ đăng"),
          data: [pendingJobs, publishedJobs, failedJobs],
          backgroundColor: [
            "rgba(245, 158, 11, 0.78)",
            "rgba(16, 185, 129, 0.78)",
            "rgba(244, 63, 94, 0.78)",
          ],
          borderRadius: 10,
        },
      ],
    }),
    [copy, failedJobs, pendingJobs, publishedJobs],
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <PanelCard
        title={copy("Trend Momentum", "Đà tăng xu hướng")}
        description={copy(
          "See how hot your recent trend opportunities are moving.",
          "Xem mức độ tăng nhiệt của các cơ hội xu hướng gần đây.",
        )}
      >
        {trendRecords.length > 0 ? (
          <LineTrendChart data={trendMomentumChartData} />
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No trend activity yet.",
              "Chưa có hoạt động xu hướng.",
            )}
          />
        )}
      </PanelCard>

      <PanelCard
        title={copy("Publishing Mix", "Tình hình đăng bài")}
        description={copy(
          "Distribution of pending, successful, and failed posting tasks.",
          "Phân bố tác vụ đăng: chờ xử lý, thành công và thất bại.",
        )}
      >
        {publishJobs.length > 0 ? (
          <BarTrendChart data={publishStatusChartData} />
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No publishing tasks yet.",
              "Chưa có tác vụ đăng bài.",
            )}
          />
        )}
      </PanelCard>
    </div>
  );
}
