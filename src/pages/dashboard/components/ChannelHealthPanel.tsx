import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";

const CHANNEL_BARS = [40, 55, 45, 70, 85, 60, 75, 95, 80, 50, 55];

export function ChannelHealthPanel() {
  return (
    <PanelCard
      title="Channel Health"
      description="Engagement volume over the last 30 days"
      action={
        <Button
          variant="outline"
          className="h-9 rounded-full border-border/70 bg-background px-4 text-xs font-semibold text-muted-foreground"
        >
          Last 30 Days
          <ChevronDown data-icon="inline-end" />
        </Button>
      }
    >
      <div className="flex h-72 items-end gap-2 pt-4 sm:gap-3">
        {CHANNEL_BARS.map((bar, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={
                index === 7
                  ? "w-full rounded-t-xl bg-primary shadow-[0_10px_20px_rgba(74,124,89,0.25)]"
                  : index === 4
                    ? "w-full rounded-t-xl bg-primary/60"
                    : "w-full rounded-t-xl bg-primary/20"
              }
              style={{ height: `${bar}%` }}
            />
            <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              {index === 2
                ? "Oct 01"
                : index === 6
                  ? "Oct 15"
                  : index === 10
                    ? "Oct 30"
                    : ""}
            </span>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
