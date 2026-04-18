import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import type { StoryboardFrame } from "@/lib/orchestrator-intelligence";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputStoryboardPanelProps = {
  copy: CopyFn;
  sections: StoryboardFrame[];
};

export function LatestOutputStoryboardPanel({
  copy,
  sections,
}: LatestOutputStoryboardPanelProps) {
  return (
    <PanelCard
      title={copy(
        "Storyboard Preview Gallery",
        "Thư viện xem trước storyboard",
      )}
      description={copy(
        "Visual references generated for each script segment.",
        "Bộ khung hình tham chiếu tương ứng với từng phân đoạn kịch bản.",
      )}
      className="h-fit"
      contentClassName="pb-4"
    >
      {sections.length > 0 ? (
        <ScrollArea className="h-128 pr-3">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {sections.map((section, index) => (
              <motion.article
                key={`storyboard-${section.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.01 }}
                className="overflow-hidden rounded-2xl border border-border/65 bg-background/70"
              >
                <img
                  src={section.imageUrl}
                  alt={copy(
                    `${section.label} mock preview`,
                    `${section.label} bản xem trước mô phỏng`,
                  )}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-1.5 p-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                    {section.timestamp}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {section.label}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {section.thumbnailPrompt || section.narration || "--"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {copy("Output path", "Đường dẫn đầu ra")}:{" "}
                    {section.thumbnailOutputPath ||
                      copy("(mock-only)", "(chỉ mô phỏng)")}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <InlineQueryState
          state="empty"
          message={copy(
            "No storyboard sections available to preview yet.",
            "Chưa có phân đoạn storyboard để xem trước.",
          )}
        />
      )}
    </PanelCard>
  );
}
