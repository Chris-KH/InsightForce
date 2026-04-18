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
        "Interest-over-time movement for the top five active keywords today.",
        "Biến động interest over time cho 5 keyword nổi bật trong ngày.",
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
