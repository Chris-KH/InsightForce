import { Eye, MessageCircleMore, Wallet } from "lucide-react";

import { MetricCard } from "@/components/app-section";

const METRICS = [
  {
    label: "Views",
    value: "2.4M",
    delta: "+12%",
    detail: "Across the last 30 days",
    icon: <Eye className="size-4" />,
  },
  {
    label: "Revenue",
    value: "$12,450",
    delta: "+5%",
    detail: "Creator + agency income",
    icon: <Wallet className="size-4" />,
  },
  {
    label: "Avg. Sentiment",
    value: "88%",
    delta: "+2%",
    detail: "Positive audience tone",
    icon: <MessageCircleMore className="size-4" />,
  },
] as const;

export function DashboardMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {METRICS.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
