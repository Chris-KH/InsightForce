import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    >
      {sections.length > 0 ? (
        <ScrollArea className="h-120 pr-3">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <article
                key={`storyboard-${section.id}`}
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
              </article>
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
