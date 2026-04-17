import { type ReactNode } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";

import { cn } from "@/lib/utils";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
);

const axisTickColor = "rgba(148, 163, 184, 0.92)";
const gridColor = "rgba(148, 163, 184, 0.16)";
const tooltipBackground = "rgba(8, 15, 33, 0.94)";

function ChartShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/65 bg-linear-to-br from-card/86 via-card/72 to-primary/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_20px_42px_rgba(15,23,42,0.12)] dark:from-card/92 dark:via-card/82 dark:to-primary/14 dark:shadow-[inset_0_1px_0_rgba(148,163,184,0.08),0_20px_44px_rgba(2,6,23,0.4)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-6 top-3 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute -top-18 -right-14 size-40 rounded-full bg-chart-2/20 blur-3xl dark:bg-chart-2/14" />
        <div className="absolute -bottom-22 -left-12 size-44 rounded-full bg-primary/20 blur-3xl dark:bg-primary/12" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

type BarChartProps = {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  className?: string;
};

const defaultBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        color: axisTickColor,
        usePointStyle: true,
        boxHeight: 8,
        boxWidth: 8,
      },
    },
    tooltip: {
      displayColors: false,
      backgroundColor: tooltipBackground,
      bodyColor: "#e2e8f0",
      titleColor: "#ffffff",
      borderColor: "rgba(59, 130, 246, 0.35)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: axisTickColor,
        font: { size: 10 },
      },
    },
    y: {
      ticks: {
        color: axisTickColor,
        font: { size: 10 },
      },
      grid: { color: gridColor },
      beginAtZero: true,
    },
  },
};

export function BarTrendChart({ data, options, className }: BarChartProps) {
  return (
    <ChartShell className={className}>
      <div className="h-64">
        <Bar data={data} options={options ?? defaultBarOptions} />
      </div>
    </ChartShell>
  );
}

type LineChartProps = {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
  className?: string;
};

const defaultLineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        color: axisTickColor,
        usePointStyle: true,
        boxHeight: 8,
        boxWidth: 8,
      },
    },
    tooltip: {
      displayColors: false,
      backgroundColor: tooltipBackground,
      bodyColor: "#e2e8f0",
      titleColor: "#ffffff",
      borderColor: "rgba(56, 189, 248, 0.35)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: axisTickColor,
        font: { size: 10 },
      },
    },
    y: {
      ticks: {
        color: axisTickColor,
        font: { size: 10 },
      },
      grid: { color: gridColor },
      beginAtZero: true,
    },
  },
};

export function LineTrendChart({ data, options, className }: LineChartProps) {
  return (
    <ChartShell className={className}>
      <div className="h-64">
        <Line data={data} options={options ?? defaultLineOptions} />
      </div>
    </ChartShell>
  );
}

type DoughnutChartProps = {
  data: ChartData<"doughnut">;
  options?: ChartOptions<"doughnut">;
  className?: string;
};

const defaultDoughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "66%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: axisTickColor,
        boxWidth: 10,
        boxHeight: 10,
      },
    },
    tooltip: {
      displayColors: false,
      backgroundColor: tooltipBackground,
      bodyColor: "#e2e8f0",
      titleColor: "#ffffff",
      borderColor: "rgba(16, 185, 129, 0.35)",
      borderWidth: 1,
    },
  },
};

export function DoughnutTrendChart({
  data,
  options,
  className,
}: DoughnutChartProps) {
  return (
    <ChartShell className={className}>
      <div className="h-64">
        <Doughnut data={data} options={options ?? defaultDoughnutOptions} />
      </div>
    </ChartShell>
  );
}

type RadarChartProps = {
  data: ChartData<"radar">;
  options?: ChartOptions<"radar">;
  className?: string;
};

const defaultRadarOptions: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: axisTickColor,
      },
    },
    tooltip: {
      displayColors: false,
      backgroundColor: tooltipBackground,
      bodyColor: "#e2e8f0",
      titleColor: "#ffffff",
      borderColor: "rgba(59, 130, 246, 0.35)",
      borderWidth: 1,
    },
  },
  scales: {
    r: {
      ticks: {
        display: false,
      },
      grid: { color: gridColor },
      angleLines: { color: gridColor },
      pointLabels: {
        color: axisTickColor,
        font: { size: 10 },
      },
    },
  },
};

export function RadarTrendChart({ data, options, className }: RadarChartProps) {
  return (
    <ChartShell className={className}>
      <div className="h-64">
        <Radar data={data} options={options ?? defaultRadarOptions} />
      </div>
    </ChartShell>
  );
}

type HeatMatrixProps = {
  rows: string[];
  columns: string[];
  values: number[][];
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function HeatMatrix({
  rows,
  columns,
  values,
  valueFormatter,
  className,
}: HeatMatrixProps) {
  const flatValues = values.flat();
  const maxValue = Math.max(...flatValues, 1);
  const firstColumnWidth = 126;
  const minTableWidth = Math.max(500, firstColumnWidth + columns.length * 94);

  return (
    <div
      className={cn(
        "relative overflow-x-auto rounded-3xl border border-border/65 bg-linear-to-br from-card/88 via-card/72 to-primary/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_42px_rgba(15,23,42,0.11)] dark:from-card/92 dark:via-card/82 dark:to-primary/14 dark:shadow-[inset_0_1px_0_rgba(148,163,184,0.08),0_20px_44px_rgba(2,6,23,0.38)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-6 top-3 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute -top-20 -right-14 size-40 rounded-full bg-chart-2/22 blur-3xl dark:bg-chart-2/14" />
      </div>
      <div style={{ minWidth: `${minTableWidth}px` }}>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `minmax(${firstColumnWidth}px, 1.35fr) repeat(${columns.length}, minmax(84px, 1fr))`,
          }}
        >
          <div />
          {columns.map((column) => (
            <div
              key={column}
              className="min-w-0 px-1 text-center text-xs font-medium text-muted-foreground"
              title={column}
            >
              <span className="block truncate">{column}</span>
            </div>
          ))}

          {rows.map((row, rowIndex) => (
            <div key={row} className="contents">
              <div
                className="min-w-0 pr-2 text-xs font-medium text-muted-foreground"
                title={row}
              >
                <span className="block truncate">{row}</span>
              </div>
              {columns.map((column, columnIndex) => {
                const value = values[rowIndex]?.[columnIndex] ?? 0;
                const ratio = Math.max(value / maxValue, 0);
                const hue =
                  188 + (columnIndex / Math.max(columns.length - 1, 1)) * 128;
                const alpha = 0.14 + ratio * 0.76;
                const shadowAlpha = ratio > 0.55 ? 0.28 : 0;

                return (
                  <div
                    key={`${row}-${column}`}
                    className="rounded-lg border border-border/55 px-2 py-2 text-center text-xs font-semibold text-foreground"
                    style={{
                      backgroundColor: `hsla(${hue}, 88%, 58%, ${alpha})`,
                      boxShadow:
                        shadowAlpha > 0
                          ? `0 0 0 1px hsla(${hue}, 84%, 56%, 0.36), 0 12px 20px hsla(${hue}, 90%, 34%, ${shadowAlpha})`
                          : undefined,
                    }}
                  >
                    {valueFormatter ? valueFormatter(value) : value.toFixed(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
