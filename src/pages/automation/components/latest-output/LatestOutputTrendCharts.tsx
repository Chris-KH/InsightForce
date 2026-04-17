import type { TrendAnalyzeResultItem } from "@/api";
import { BarTrendChart, LineTrendChart } from "@/components/app-data-viz";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";

import type { ChartData } from "chart.js";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputTrendChartsProps = {
  copy: CopyFn;
  latestTrendResults: TrendAnalyzeResultItem[];
  latestTrendBarData: ChartData<"bar">;
  latestInterestLineData: ChartData<"line"> | null;
};

export function LatestOutputTrendCharts({
  copy,
  latestTrendResults,
  latestTrendBarData,
  latestInterestLineData,
}: LatestOutputTrendChartsProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <PanelCard
        title={copy("Trend Score Distribution", "Phân bố điểm trend")}
        description={copy(
          "Score comparison of ranked opportunities returned by orchestrator.",
          "So sánh điểm của các cơ hội đã xếp hạng từ orchestrator.",
        )}
      >
        {latestTrendResults.length > 0 ? (
          <BarTrendChart
            data={latestTrendBarData}
            className="bg-linear-to-br from-sky-100/55 via-card to-indigo-100/45 dark:from-sky-500/12 dark:via-card/90 dark:to-indigo-500/10"
          />
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No trend result returned from latest orchestration run.",
              "Phiên orchestration gần nhất chưa trả về trend result.",
            )}
          />
        )}
      </PanelCard>

      <PanelCard
        title={copy("Interest Pulse Timeline", "Đường xung quan tâm")}
        description={copy(
          "Short-horizon momentum from interest_over_day of the strongest trend signals.",
          "Động lượng ngắn hạn từ interest_over_day của các tín hiệu trend mạnh nhất.",
        )}
      >
        {latestInterestLineData ? (
          <LineTrendChart
            data={latestInterestLineData}
            className="bg-linear-to-br from-emerald-100/55 via-card to-cyan-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-cyan-500/10"
          />
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No interest timeline values available in current output.",
              "Không có giá trị timeline interest trong output hiện tại.",
            )}
          />
        )}
      </PanelCard>
    </div>
  );
}
