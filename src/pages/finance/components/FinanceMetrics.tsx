import { Banknote, Calculator, Wallet } from "lucide-react";

import { MetricCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function FinanceMetrics() {
  const copy = useBilingual();

  const metrics = [
    {
      label: copy("Available Budget", "Ngân sách khả dụng"),
      value: "$142,500.00",
      delta: "+12.5%",
      detail: copy("Updated 4 mins ago", "Cập nhật 4 phút trước"),
      icon: <Wallet className="size-4" />,
    },
    {
      label: copy("Expected ROI", "ROI kỳ vọng"),
      value: "3.8x",
      delta: copy("Projected", "Dự kiến"),
      detail: copy("Optimized by Scout", "Tối ưu bởi Scout"),
      icon: <Calculator className="size-4" />,
    },
    {
      label: copy("Total Agent Commissions", "Tổng hoa hồng bot"),
      value: "$11,402.50",
      delta: "8.2% Avg",
      detail: copy(
        "Across 12 active agents",
        "Trên 12 bot đang hoạt động",
      ),
      icon: <Banknote className="size-4" />,
    },
  ] as const;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
