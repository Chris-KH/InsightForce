import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
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
          className="h-9 rounded-full border-border/70 bg-background/85 px-4 text-xs font-semibold text-muted-foreground"
        >
          {copy("Last 30 Days", "30 ngày gần nhất")}
          <ChevronDown data-icon="inline-end" />
        </Button>
      }
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/65 bg-linear-to-br from-background/88 via-background/65 to-muted/30 p-4">
        <SurfaceGrid className="opacity-24 dark:opacity-16" />

        <RevealBlock className="relative">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
            {copy("Live Engagement Flux", "Dòng tương tác trực tiếp")}
          </div>

          <div className="flex h-72 items-end gap-2 sm:gap-3">
            {CHANNEL_BARS.map((bar, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <motion.div
                  initial={{ height: 0, opacity: 0.35 }}
                  whileInView={{ height: `${bar}%`, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className={
                    index === 7
                      ? "w-full rounded-t-xl bg-linear-to-t from-primary/70 to-primary shadow-[0_10px_20px_rgba(59,130,246,0.26)]"
                      : index === 4
                        ? "w-full rounded-t-xl bg-linear-to-t from-chart-2/45 to-chart-2/80"
                        : "w-full rounded-t-xl bg-linear-to-t from-primary/20 to-primary/55"
                  }
                />
                <span className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  {getTickLabel(index)}
                </span>
              </div>
            ))}
          </div>
        </RevealBlock>
      </div>
    </PanelCard>
  );
}
