import { motion } from "motion/react";
import { Eye, MessageCircleMore, Wallet } from "lucide-react";

import { RevealBlock } from "@/components/app-futuristic";
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
      detail: copy("Positive audience tone", "Phản hồi tích cực từ khách hàng"),
      icon: <MessageCircleMore className="size-4" />,
    },
  ] as const;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <RevealBlock key={metric.label} delay={index * 0.05}>
          <motion.div
            whileHover={{
              y: -4,
              rotateX: 2.5,
              rotateY: index % 2 === 0 ? -2 : 2,
            }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="perspective-distant"
          >
            <MetricCard {...metric} />
          </motion.div>
        </RevealBlock>
      ))}
    </div>
  );
}
