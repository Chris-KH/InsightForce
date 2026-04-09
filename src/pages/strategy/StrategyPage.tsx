import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { ExecutionPlanCard } from "@/pages/strategy/components/ExecutionPlanCard";
import { TrendFeed } from "@/pages/strategy/components/TrendFeed";

export function StrategyPage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8">
      <SectionHeader
        title={copy("Content Strategy Scout", "Phân tích chiến lược nội dung")}
        description={copy(
          "Bridging real-time trend detection with high-conversion production planning. Your AI scout has identified new opportunities in your niche.",
          "Kết nối phát hiện xu hướng thời gian thực với kế hoạch sản xuất chuyển đổi cao. Trình sát AI đã nhận diện cơ hội mới trong ngách của bạn.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <TrendingUp data-icon="inline-start" />
              {copy("Global Trend Feed", "Luồng xu hướng toàn cầu")}
            </Button>
            <Badge
              variant="outline"
              className="rounded-full border-amber-500/30 text-amber-700"
            >
              {copy("Live", "Trực tiếp")}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <TrendFeed />
        <ExecutionPlanCard />
      </div>
    </div>
  );
}
