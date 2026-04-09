import { motion } from "motion/react";
import { ScanSearch } from "lucide-react";

import {
  FloatingOrb,
  PanelOrbital3D,
  RevealBlock,
  SurfaceGrid,
} from "@/components/app-futuristic";
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { cn } from "@/lib/utils";

type ClusterTone = "primary" | "amber" | "neutral";

const CLUSTER_TONE_STYLES: Record<
  ClusterTone,
  { shell: string; title: string; dot: string }
> = {
  primary: {
    shell:
      "border-primary/35 bg-primary/12 shadow-[0_16px_34px_rgba(31,81,59,0.2)] dark:shadow-[0_18px_38px_rgba(37,99,73,0.3)]",
    title: "text-primary",
    dot: "bg-primary",
  },
  amber: {
    shell:
      "border-chart-3/40 bg-chart-3/10 shadow-[0_16px_34px_rgba(167,119,29,0.18)] dark:shadow-[0_18px_38px_rgba(217,119,6,0.28)]",
    title: "text-chart-3",
    dot: "bg-chart-3",
  },
  neutral: {
    shell:
      "border-border/80 bg-card/85 shadow-[0_14px_28px_rgba(15,23,42,0.12)] dark:shadow-[0_14px_28px_rgba(2,6,23,0.32)]",
    title: "text-foreground",
    dot: "bg-muted-foreground",
  },
};

export function SemanticClusterPanel() {
  const copy = useBilingual();

  const clusterNodes = [
    {
      id: "quality",
      title: copy("Video Quality", "Chất lượng video"),
      mention: copy("4.2k Mentions", "4.2k lượt nhắc"),
      tone: "primary" as const,
      className: "top-14 left-5 size-40 sm:top-16 sm:left-10 sm:size-44",
    },
    {
      id: "humor",
      title: copy("Humor", "Hài hước"),
      mention: copy("2.8k Mentions", "2.8k lượt nhắc"),
      tone: "amber" as const,
      className: "top-7 left-1/2 size-36 -translate-x-1/2 sm:size-40",
    },
    {
      id: "pacing",
      title: copy("Pacing", "Nhịp độ"),
      mention: "420",
      tone: "neutral" as const,
      className: "top-24 right-6 size-24 sm:right-10 sm:size-24",
    },
    {
      id: "critiques",
      title: copy("Critiques", "Phê bình"),
      mention: copy("1.5k Mentions", "1.5k lượt nhắc"),
      tone: "neutral" as const,
      className: "right-8 bottom-20 size-32 sm:right-16 sm:size-36",
    },
    {
      id: "editing",
      title: copy("Editing", "Dựng phim"),
      mention: copy("900 Mentions", "900 lượt nhắc"),
      tone: "primary" as const,
      className: "bottom-16 left-1/2 size-24 -translate-x-1/2 sm:size-28",
    },
    {
      id: "audio",
      title: copy("Audio", "Âm thanh"),
      mention: "310",
      tone: "neutral" as const,
      className: "bottom-9 left-6 size-20 sm:left-10 sm:size-20",
    },
  ] as const;

  return (
    <PanelCard
      title={copy("Semantic Cluster Map", "Bản đồ cụm ngữ nghĩa")}
      description={copy(
        "Real-time co-mention clusters from comments, transcripts, and watch-time spikes.",
        "Cụm đồng nhắc theo thời gian thực từ bình luận, transcript và đỉnh thời lượng xem.",
      )}
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 bg-background/80 text-primary"
        >
          <ScanSearch className="size-3.5" />
          {copy("Live Clustering", "Phân cụm trực tiếp")}
        </Badge>
      }
    >
      <div className="relative min-h-110 overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-background via-muted/25 to-background p-6">
        <SurfaceGrid />
        <FloatingOrb className="-top-20 -left-16 size-44 bg-primary/22" />
        <FloatingOrb
          className="-right-16 -bottom-20 size-48 bg-chart-3/18"
          delay={0.4}
          duration={10}
        />
        <PanelOrbital3D className="-top-14 -right-16 bottom-auto left-auto hidden h-56 w-56 opacity-70 md:block" />

        <RevealBlock className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-full border border-border/70 bg-background/85"
          >
            {copy("Comment Topics", "Chủ đề bình luận")}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border border-border/70 bg-background/85"
          >
            {copy("Watch-time Dips", "Điểm rơi thời lượng xem")}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border border-border/70 bg-background/85"
          >
            {copy("Viral Hooks", "Yếu tố thu hút (Hook)")}
          </Badge>
        </RevealBlock>

        <div className="relative z-10 h-92 overflow-hidden rounded-2xl border border-border/70 bg-background/50 backdrop-blur-sm">
          <motion.svg
            className="absolute inset-0 h-full w-full text-primary/40 dark:text-primary/55"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <motion.path
              d="M16 20 C30 10, 44 14, 50 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.path
              d="M50 18 C62 22, 76 16, 84 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
            />
            <motion.path
              d="M50 18 C58 30, 66 38, 72 42"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.14 }}
            />
            <motion.path
              d="M50 18 C42 30, 34 40, 26 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            />
          </motion.svg>

          {clusterNodes.map((node, index) => {
            const toneStyle = CLUSTER_TONE_STYLES[node.tone];

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.86, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                className={cn("absolute", node.className)}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 6 + index,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.03 }}
                  className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center rounded-full border-2 text-center backdrop-blur-sm",
                    toneStyle.shell,
                  )}
                >
                  <span className={cn("font-semibold", toneStyle.title)}>
                    {node.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {node.mention}
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-1.5 size-2 rounded-full border border-background/90",
                      toneStyle.dot,
                    )}
                  />
                </motion.div>
              </motion.div>
            );
          })}

          <div className="absolute right-4 bottom-4 rounded-full border border-border/70 bg-background/85 px-3 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur">
            {copy("142 semantic nodes", "142 nút ngữ nghĩa")}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
