import type { TrendAnalyzeResultItem } from "@/api";
import { HeatMatrix } from "@/components/app-data-viz";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard, ProgressBar } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import {
  formatPlatformLabel,
  toPublishingWindowTokens,
  type NormalizedGeneratedContent,
} from "@/lib/orchestrator-intelligence";
import {
  formatCompactNumber,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { AutomationHintTooltip } from "@/pages/automation/components/AutomationHintTooltip";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputCreatorOptimizationPanelProps = {
  copy: CopyFn;
  latestGeneratedContent: NormalizedGeneratedContent;
  latestTrendResults: TrendAnalyzeResultItem[];
};

type PlatformReadinessRow = {
  platformLabel: string;
  captionLength: number;
  hashtagCount: number;
  score: number;
  windows: string[];
  hasCta: boolean;
};

function parseHourFromWindow(value: string): number | null {
  const match = value.match(/(\d{1,2})(?::\d{2})?/);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return null;
  }

  return hour;
}

function getTimeBucketIndex(hour: number): number {
  if (hour >= 5 && hour < 11) {
    return 0;
  }

  if (hour >= 11 && hour < 14) {
    return 1;
  }

  if (hour >= 14 && hour < 18) {
    return 2;
  }

  if (hour >= 18 && hour < 22) {
    return 3;
  }

  return 4;
}

function computeReadinessScore(
  captionLength: number,
  hashtagCount: number,
  hasCta: boolean,
  windowCount: number,
) {
  const captionScore = captionLength > 0 ? 35 : 0;
  const hashtagScore = Math.min(30, hashtagCount * 5);
  const ctaScore = hasCta ? 20 : 0;
  const windowScore = Math.min(15, windowCount * 8);

  return Math.min(100, captionScore + hashtagScore + ctaScore + windowScore);
}

function toProgressTone(score: number): "primary" | "secondary" | "tertiary" {
  if (score >= 75) {
    return "primary";
  }

  if (score >= 55) {
    return "secondary";
  }

  return "tertiary";
}

function toReadinessRows(
  latestGeneratedContent: NormalizedGeneratedContent,
): PlatformReadinessRow[] {
  return latestGeneratedContent.platformPosts.map((post) => {
    const windows = toPublishingWindowTokens(post.bestPostTime);
    const captionLength = post.caption.trim().length;
    const hashtagCount = post.hashtags.length;
    const hasCta = post.cta.trim().length > 0;

    return {
      platformLabel: formatPlatformLabel(post.platform),
      captionLength,
      hashtagCount,
      score: computeReadinessScore(
        captionLength,
        hashtagCount,
        hasCta,
        windows.length,
      ),
      windows,
      hasCta,
    };
  });
}

export function LatestOutputCreatorOptimizationPanel({
  copy,
  latestGeneratedContent,
  latestTrendResults,
}: LatestOutputCreatorOptimizationPanelProps) {
  const readinessRows = toReadinessRows(latestGeneratedContent);

  if (readinessRows.length === 0) {
    return (
      <PanelCard
        title={copy("Creator Optimization Board", "Bảng tối ưu cho creator")}
        description={copy(
          "Readiness cues from generated platform packs and publishing windows.",
          "Tín hiệu sẵn sàng từ gói nội dung nền tảng và khung giờ đăng gợi ý.",
        )}
      >
        <InlineQueryState
          state="empty"
          message={copy(
            "No platform package available to calculate creator optimization insights.",
            "Chưa có gói nền tảng để tính toán insight tối ưu cho creator.",
          )}
        />
      </PanelCard>
    );
  }

  const matrixColumns = [
    copy("Morning", "Sáng"),
    copy("Noon", "Trưa"),
    copy("Afternoon", "Chiều"),
    copy("Evening", "Tối"),
    copy("Late", "Khuya"),
  ];

  const matrixRows = readinessRows.map((item) => item.platformLabel);

  const matrixValues = readinessRows.map((row) => {
    const buckets = [0, 0, 0, 0, 0];

    for (const token of row.windows) {
      const hour = parseHourFromWindow(token);
      if (hour === null) {
        continue;
      }

      const bucketIndex = getTimeBucketIndex(hour);
      buckets[bucketIndex] += 1;
    }

    return buckets;
  });

  const totalHashtags = readinessRows.reduce(
    (total, row) => total + row.hashtagCount,
    0,
  );

  const averageReadiness =
    readinessRows.reduce((total, row) => total + row.score, 0) /
    readinessRows.length;

  const strongestPlatform = [...readinessRows].sort(
    (left, right) => right.score - left.score,
  )[0];

  const topTrendAction =
    latestTrendResults[0]?.recommended_action ||
    copy(
      "No recommended action from trend agent yet.",
      "Chưa có hành động gợi ý từ trend agent.",
    );

  return (
    <PanelCard
      title={copy("Creator Optimization Board", "Bảng tối ưu cho creator")}
      description={copy(
        "Actionable quality and timing signals extracted from orchestration output.",
        "Tín hiệu chất lượng và thời điểm hành động được trích từ output orchestration.",
      )}
      contentClassName="pb-4"
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/25 bg-background/75 text-primary"
        >
          {copy("Creator Utility", "Hữu ích cho creator")}
        </Badge>
      }
    >
      <AutomationHintTooltip
        className="mb-3"
        label={copy(
          "Readiness score combines caption, hashtag, CTA, and posting-window coverage.",
          "Điểm sẵn sàng kết hợp caption, hashtag, CTA và độ phủ khung giờ đăng.",
        )}
        hint={copy(
          "Use this board to decide which platform package should be published first and which one still needs caption/CTA refinement.",
          "Dùng bảng này để quyết định gói nền tảng nào nên đăng trước và gói nào còn cần tối ưu caption/CTA.",
        )}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
              <p className="text-xs text-muted-foreground">
                {copy("Avg readiness", "Điểm sẵn sàng TB")}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatPercentValue(averageReadiness)}
              </p>
            </div>

            <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
              <p className="text-xs text-muted-foreground">
                {copy("Total hashtags", "Tổng hashtag")}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatCompactNumber(totalHashtags)}
              </p>
            </div>

            <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
              <p className="text-xs text-muted-foreground">
                {copy("Strongest platform", "Nền tảng mạnh nhất")}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {strongestPlatform?.platformLabel || "--"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/65 bg-background/65 p-3 text-xs text-muted-foreground">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
              {copy("Top action from trend data", "Hành động ưu tiên từ trend")}
            </p>
            <p className="mt-1 text-sm text-foreground">{topTrendAction}</p>
          </div>

          <div className="space-y-2">
            {readinessRows.map((row) => (
              <div
                key={`readiness-${row.platformLabel}`}
                className="rounded-2xl border border-border/65 bg-background/65 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {row.platformLabel}
                  </p>
                  <Badge variant="outline" className="rounded-full">
                    {formatPercentValue(row.score)}
                  </Badge>
                </div>

                <ProgressBar
                  value={row.score}
                  tone={toProgressTone(row.score)}
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  {copy("Caption chars", "Ký tự caption")}: {row.captionLength}{" "}
                  · {copy("Hashtags", "Hashtag")}: {row.hashtagCount} ·{" "}
                  {copy("CTA", "CTA")}:{" "}
                  {row.hasCta ? copy("Yes", "Có") : copy("No", "Không")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Publishing window heatmap", "Bản đồ nhiệt khung giờ đăng")}
          </p>
          <p className="text-xs text-muted-foreground">
            {copy(
              "Shows where each platform is concentrated across dayparts to avoid posting everything in one time block.",
              "Thể hiện khung giờ tập trung theo từng nền tảng để tránh dồn toàn bộ bài đăng vào một khoảng thời gian.",
            )}
          </p>

          <HeatMatrix
            rows={matrixRows}
            columns={matrixColumns}
            values={matrixValues}
            valueFormatter={(value) => String(Math.round(value))}
            className="min-h-72"
          />
        </div>
      </div>
    </PanelCard>
  );
}
