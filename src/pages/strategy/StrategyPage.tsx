import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { ExecutionPlanCard } from "@/pages/strategy/components/ExecutionPlanCard";
import { TrendFeed } from "@/pages/strategy/components/TrendFeed";

export function StrategyPage() {
  return (
    <div className="grid gap-8">
      <SectionHeader
        title="Content Strategy Scout"
        description="Bridging real-time trend detection with high-conversion production planning. Your AI scout has identified new opportunities in your niche."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <TrendingUp data-icon="inline-start" />
              Global Trend Feed
            </Button>
            <Badge
              variant="outline"
              className="rounded-full border-amber-500/30 text-amber-700"
            >
              Live
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
