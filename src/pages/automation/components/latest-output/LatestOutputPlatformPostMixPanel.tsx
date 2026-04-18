import { motion } from "motion/react";

import { BarTrendChart } from "@/components/app-data-viz";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatPlatformLabel,
  summarizeCaptionLength,
  type NormalizedGeneratedContent,
} from "@/lib/orchestrator-intelligence";
import { formatCompactNumber } from "@/lib/insight-formatters";
import { AutomationHintTooltip } from "@/pages/automation/components/AutomationHintTooltip";

import type { ChartData, ChartOptions } from "chart.js";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputPlatformPostMixPanelProps = {
  copy: CopyFn;
  latestGeneratedContent: NormalizedGeneratedContent;
  latestPlatformMixData: ChartData<"bar"> | null;
};

const platformPostMixBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 6,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      backgroundColor: "rgba(8, 15, 33, 0.94)",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(59, 130, 246, 0.35)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: false,
        minRotation: 0,
        maxRotation: 28,
        color: "rgba(148, 163, 184, 0.92)",
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: "rgba(148, 163, 184, 0.92)",
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(148, 163, 184, 0.16)",
      },
    },
  },
};

export function LatestOutputPlatformPostMixPanel({
  copy,
  latestGeneratedContent,
  latestPlatformMixData,
}: LatestOutputPlatformPostMixPanelProps) {
  return (
    <PanelCard
      title={copy("Platform Post Mix", "Phân bổ post theo nền tảng")}
      description={copy(
        "Caption package coverage and hashtag volume by platform in generated_content.platform_posts.",
        "Mức độ phủ gói caption và khối lượng hashtag theo từng nền tảng trong generated_content.platform_posts.",
      )}
      className="h-fit"
      contentClassName="pb-4"
    >
      <AutomationHintTooltip
        className="mb-2"
        label={copy(
          "Bar height equals hashtag volume per platform package.",
          "Chiều cao cột tương ứng khối lượng hashtag của từng gói nền tảng.",
        )}
        hint={copy(
          "Axis labels use multi-line wrapping and slight rotation so long platform names stay legible without truncation.",
          "Nhãn trục được tách dòng và xoay nhẹ để tên nền tảng dài vẫn dễ đọc mà không bị cắt mất nội dung.",
        )}
      />

      {latestPlatformMixData ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BarTrendChart
            data={latestPlatformMixData}
            options={platformPostMixBarOptions}
            className="bg-linear-to-br from-violet-100/55 via-card to-fuchsia-100/45 dark:from-violet-500/12 dark:via-card/90 dark:to-fuchsia-500/10"
          />
        </motion.div>
      ) : (
        <InlineQueryState
          state="empty"
          message={copy(
            "No platform post package found in generated content output.",
            "Chưa có gói bài đăng theo nền tảng trong đầu ra nội dung.",
          )}
        />
      )}

      {latestGeneratedContent.platformPosts.length > 0 ? (
        <ScrollArea className="mt-4 h-96 pr-3">
          <div className="space-y-3">
            {latestGeneratedContent.platformPosts.map((post, index) => (
              <motion.div
                key={post.platform}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-border/60 bg-background/65 p-3"
              >
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {formatPlatformLabel(post.platform)}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {post.caption || "--"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {copy("Caption length", "Độ dài caption")}:{" "}
                  {formatCompactNumber(summarizeCaptionLength(post.caption))}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Best posting window", "Khung giờ đăng")}:{" "}
                  {post.bestPostTime || "--"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("CTA", "Kêu gọi hành động (CTA)")}: {post.cta || "--"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <Badge
                      key={`${post.platform}-${tag}`}
                      variant="outline"
                      className="rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </PanelCard>
  );
}
