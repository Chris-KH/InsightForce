import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

const CHANNEL_BARS = [40, 55, 45, 70, 85, 60, 75, 95, 80, 50, 55];

export function ChannelHealthPanel() {
  const copy = useBilingual();

  const getTickLabel = (index: number) => {
    if (index === 2) {
      return copy("Oct 01", "01 Th10");
    }

    if (index === 6) {
      return copy("Oct 15", "15 Th10");
    }

    if (index === 10) {
      return copy("Oct 30", "30 Th10");
    }

    return "";
  };

  return (
    <PanelCard
      title={copy("Channel Health", "Sức khỏe kênh")}
      description={copy(
        "Engagement volume over the last 30 days",
        "Khối lượng tương tác trong 30 ngày gần nhất",
      )}
      action={
        <Button
          variant="outline"
          className="h-9 rounded-full border-border/70 bg-background px-4 text-xs font-semibold text-muted-foreground"
        >
          {copy("Last 30 Days", "30 ngày gần nhất")}
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
              {getTickLabel(index)}
            </span>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
