import { PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";

const SENTIMENT_BARS = [24, 32, 26, 44, 58, 42, 66];

export function VideoLabPanel() {
  return (
    <PanelCard
      title="Multimodal Video Lab"
      description="Frame-level timeline with audience sentiment spikes."
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 text-primary"
        >
          Live Syncing
        </Badge>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-zinc-950 shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="size-24 text-white/75" />
          </div>
          <div className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            04:12 / 12:45
          </div>
          <div className="absolute top-4 right-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
            Peak Sentiment Window
          </div>
          <div className="absolute right-4 bottom-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            Video Preview
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Sentiment Timeline
          </p>
          <div className="flex h-12 items-end gap-1 rounded-full bg-primary/10 px-2 py-2">
            {SENTIMENT_BARS.map((bar, index) => (
              <div
                key={index}
                className={
                  index === 3
                    ? "flex-1 rounded-full bg-primary"
                    : index === 4
                      ? "flex-1 rounded-full bg-amber-500/70"
                      : "flex-1 rounded-full bg-primary/60"
                }
                style={{ height: `${bar}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Positive
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-500" />
              Negative
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              Neutral
            </span>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
