import { PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

const SENTIMENT_BARS = [24, 32, 26, 44, 58, 42, 66];

export function VideoLabPanel() {
  const copy = useBilingual();

  return (
    <PanelCard
      title={copy("Multimodal Video Lab", "Phòng lab video đa phương thức")}
      description={copy(
        "Frame-level timeline with audience sentiment spikes.",
        "Timeline theo từng frame cùng các điểm bùng nổ cảm xúc của khán giả.",
      )}
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 text-primary"
        >
          {copy("Live Syncing", "Đồng bộ trực tiếp")}
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
            {copy("Peak Sentiment Window", "Khung thời gian cảm xúc đỉnh")}
          </div>
          <div className="absolute right-4 bottom-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            {copy("Video Preview", "Xem trước video")}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {copy("Sentiment Timeline", "Timeline cảm xúc")}
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
              {copy("Positive", "Tích cực")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-500" />
              {copy("Negative", "Tiêu cực")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              {copy("Neutral", "Trung tính")}
            </span>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
