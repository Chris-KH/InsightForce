import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { PanelCard } from "@/components/app-section";

import type { BilingualCopy } from "./dashboard-workspace.types";

type DashboardTrendScoreBarPanelProps = {
  copy: BilingualCopy;
  data: ChartData<"bar">;
  options: ChartOptions<"bar">;
};

export function DashboardTrendScoreBarPanel({
  copy,
  data,
  options,
}: DashboardTrendScoreBarPanelProps) {
  return (
    <PanelCard
      title={copy("Keyword Trend Scores", "Trend score theo keyword")}
      description={copy(
        "Bar chart ranking the latest trend score for active keywords.",
        "Biểu đồ cột xếp hạng trend score mới nhất của các keyword.",
      )}
    >
      <div className="h-80 rounded-2xl border border-border/65 bg-background/60 p-3">
        <div className="h-full rounded-xl bg-linear-to-br from-primary/8 via-background to-chart-3/10 p-2">
          <Bar data={data} options={options} />
        </div>
      </div>
    </PanelCard>
  );
}
