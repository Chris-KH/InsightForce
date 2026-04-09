import { Eye, MessageCircleMore, Wallet } from "lucide-react";

import { MetricCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function DashboardMetrics() {
  const copy = useBilingual();

  const metrics = [
    {
      label: copy("Views", "Lượt xem"),
      value: "2.4M",
      delta: "+12%",
      detail: copy("Across the last 30 days", "Trong 30 ngày gần nhất"),
      icon: <Eye className="size-4" />,
    },
    {
      label: copy("Revenue", "Doanh thu"),
      value: "$12,450",
      delta: "+5%",
      detail: copy("Creator + agency income", "Thu nhập creator + agency"),
      icon: <Wallet className="size-4" />,
    },
    {
      label: copy("Avg. Sentiment", "Cảm xúc trung bình"),
      value: "88%",
      delta: "+2%",
      detail: copy("Positive audience tone", "Sắc thái tích cực từ khán giả"),
      icon: <MessageCircleMore className="size-4" />,
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
