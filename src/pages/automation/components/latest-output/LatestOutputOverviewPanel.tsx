import type { TrendAnalyzeResultItem } from "@/api";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { type NormalizedGeneratedContent } from "@/lib/orchestrator-intelligence";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputOverviewPanelProps = {
  copy: CopyFn;
  latestTrendResults: TrendAnalyzeResultItem[];
  latestGeneratedContent: NormalizedGeneratedContent;
  averageLatestTrendScore: number;
  latestTopTrend?: TrendAnalyzeResultItem;
  latestHashtags: string[];
  markdownSummary?: string;
};

export function LatestOutputOverviewPanel({
  copy,
  latestTrendResults,
  latestGeneratedContent,
  averageLatestTrendScore,
  latestTopTrend,
  latestHashtags,
  markdownSummary,
}: LatestOutputOverviewPanelProps) {
  return (
    <PanelCard
      title={copy(
        "Latest Orchestration Output",
        "Output orchestration mới nhất",
      )}
      description={copy(
        "Freshly generated trend intelligence and content package from your latest run.",
        "Gói trend intelligence và nội dung vừa được tạo từ phiên chạy gần nhất.",
      )}
      contentClassName="pb-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
          <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
            {copy("Trend signals", "Tín hiệu trend")}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {formatCompactNumber(latestTrendResults.length)}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
          <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
            {copy("Average score", "Điểm trung bình")}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {formatPercentFromRatio(averageLatestTrendScore / 100)}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
          <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
            {copy("Image cards", "Số ảnh")}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {formatCompactNumber(latestGeneratedContent.sections.length)}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
          <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
            {copy("Platform packs", "Gói nền tảng")}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {formatCompactNumber(latestGeneratedContent.platformPosts.length)}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-primary/22 bg-primary/7 p-3">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          {copy("Selected keyword", "Keyword được chọn")}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {latestGeneratedContent.selectedKeyword ||
            latestTopTrend?.main_keyword ||
            "--"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {latestGeneratedContent.mainTitle ||
            latestGeneratedContent.description ||
            latestGeneratedContent.videoScriptTitle ||
            "--"}
        </p>
      </div>

      {markdownSummary ? (
        <div className="mt-3 rounded-2xl border border-border/55 bg-background/60 p-3 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold tracking-[0.12em] uppercase">
            {copy("Narrative summary", "Tóm tắt diễn giải")}
          </p>
          <p className="whitespace-pre-wrap">{markdownSummary}</p>
        </div>
      ) : null}

      {latestHashtags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {latestHashtags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </PanelCard>
  );
}
