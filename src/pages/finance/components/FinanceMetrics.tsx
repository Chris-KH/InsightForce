import { Banknote, Calculator, Wallet } from "lucide-react";

import { MetricCard } from "@/components/app-section";

const METRICS = [
  {
    label: "Available Budget",
    value: "$142,500.00",
    delta: "+12.5%",
    detail: "Updated 4 mins ago",
    icon: <Wallet className="size-4" />,
  },
  {
    label: "Expected ROI",
    value: "3.8x",
    delta: "Projected",
    detail: "Optimized by Scout",
    icon: <Calculator className="size-4" />,
  },
  {
    label: "Total Agent Commissions",
    value: "$11,402.50",
    delta: "8.2% Avg",
    detail: "Across 12 active agents",
    icon: <Banknote className="size-4" />,
  },
] as const;

export function FinanceMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {METRICS.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
