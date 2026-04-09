import { motion } from "motion/react";
import { PlayCircle } from "lucide-react";

import {
  FloatingOrb,
  PulseDot,
  RevealBlock,
  SurfaceGrid,
} from "@/components/app-futuristic";
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

const SENTIMENT_BARS = [24, 32, 26, 44, 58, 42, 66];

export function VideoLabPanel() {
  const copy = useBilingual();

  return (
    <PanelCard
      title={copy("Multimodal Video Lab", "Trình xử lý video")}
      description={copy(
        "Frame-level timeline with audience sentiment spikes.",
        "Timeline theo từng frame cùng các điểm cao trào cảm xúc của khách hàng.",
      )}
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 bg-background/80 text-primary"
        >
          <PulseDot className="mr-1" />
          {copy("Live Syncing", "Đồng bộ trực tiếp")}
        </Badge>
      }
    >
      <div className="flex flex-col gap-6">
        <RevealBlock>
          <div className="group relative aspect-video overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_26px_40px_rgba(15,23,42,0.35)]">
            <SurfaceGrid className="bg-size-[24px_24px] opacity-20" />
            <FloatingOrb className="-top-20 -left-14 size-44 bg-primary/30" />
            <FloatingOrb
              className="-right-16 -bottom-16 size-48 bg-chart-2/25"
              delay={0.3}
              duration={10}
            />

            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_82%_78%,rgba(56,189,248,0.22),transparent_38%)]"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 5.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="relative grid size-26 place-items-center rounded-full border border-white/35 bg-white/12 text-white backdrop-blur"
                aria-label={copy("Play video preview", "Phát xem trước video")}
              >
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/50"
                  animate={{ scale: [1, 1.16, 1], opacity: [0.65, 0.1, 0.65] }}
                  transition={{
                    duration: 2.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <PlayCircle className="size-16" />
              </motion.button>
            </div>

            <div className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              04:12 / 12:45
            </div>
            <div className="absolute top-4 right-4 rounded-full border border-primary/30 bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30">
              {copy(
                "Peak Sentiment Window",
                "Khung thời gian cảm xúc cao nhất",
              )}
            </div>
            <div className="absolute right-4 bottom-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {copy("Video Preview", "Xem trước video")}
            </div>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.08}>
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/25 p-4">
            <SurfaceGrid className="opacity-30" />

            <p className="relative mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {copy("Sentiment Timeline", "Timeline cảm xúc")}
            </p>

            <div className="relative flex h-16 items-end gap-1.5 rounded-2xl border border-primary/10 bg-background/80 px-3 py-3">
              {SENTIMENT_BARS.map((bar, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0, opacity: 0.35 }}
                  whileInView={{ height: `${bar}%`, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                    ease: "easeOut",
                  }}
                  className={
                    index === 3
                      ? "flex-1 rounded-full bg-linear-to-t from-primary/65 to-primary"
                      : index === 4
                        ? "flex-1 rounded-full bg-linear-to-t from-chart-3/55 to-chart-3"
                        : "flex-1 rounded-full bg-linear-to-t from-primary/35 to-primary/70"
                  }
                />
              ))}
            </div>

            <div className="relative mt-3 flex flex-wrap items-center gap-4 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                {copy("Positive", "Tích cực")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-destructive" />
                {copy("Negative", "Tiêu cực")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-chart-3" />
                {copy("Neutral", "Trung tính")}
              </span>
            </div>
          </div>
        </RevealBlock>
      </div>
    </PanelCard>
  );
}
