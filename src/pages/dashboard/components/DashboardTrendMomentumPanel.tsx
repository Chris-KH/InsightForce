import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import { PanelCard } from "@/components/app-section";

import type { BilingualCopy } from "./dashboard-workspace.types";

type DashboardTrendMomentumPanelProps = {
  copy: BilingualCopy;
  data: ChartData<"line">;
  options: ChartOptions<"line">;
};

export function DashboardTrendMomentumPanel({
  copy,
  data,
  options,
}: DashboardTrendMomentumPanelProps) {
  return (
    <PanelCard
      title={copy("Trend Momentum", "Động lượng xu hướng")}
      description={copy(
        "Head-to-head momentum between two competing trends.",
        "So sánh trực diện động lượng giữa 2 xu hướng cạnh tranh.",
      )}
    >
      <div className="h-80 rounded-2xl border border-border/65 bg-background/60 p-3">
        <div className="h-full rounded-xl bg-linear-to-br from-chart-2/10 via-background to-primary/10 p-2">
          <Line data={data} options={options} />
        </div>
      </div>
    </PanelCard>
  );
}
