import { Brain, Compass, Lightbulb, Sparkles, Target } from "lucide-react";

import {
  useTikTokRecommendationsQuery,
  useTikTokTrendsQuery,
  useYouTubeRecommendationsQuery,
  useYouTubeTrendsQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";
import { getQueryErrorMessage } from "@/lib/query-error";

type UnifiedRecommendation = {
  id: string;
  platform: "tiktok" | "youtube";
  contentIdea: string;
  hookLine: string;
  confidenceScore: number;
  reasoning: string;
};

export function StrategyLabPage() {
  const copy = useBilingual();

  const tikTokRecommendationsQuery = useTikTokRecommendationsQuery();
  const youTubeRecommendationsQuery = useYouTubeRecommendationsQuery();
  const tikTokTrendsQuery = useTikTokTrendsQuery();
  const youTubeTrendsQuery = useYouTubeTrendsQuery();

  const anyLoading =
    tikTokRecommendationsQuery.isLoading ||
    youTubeRecommendationsQuery.isLoading ||
    tikTokTrendsQuery.isLoading ||
    youTubeTrendsQuery.isLoading;

  const anyError =
    tikTokRecommendationsQuery.error ||
    youTubeRecommendationsQuery.error ||
    tikTokTrendsQuery.error ||
    youTubeTrendsQuery.error;

  const recommendations: UnifiedRecommendation[] = [
    ...(tikTokRecommendationsQuery.data?.recommendations ?? []).map((item) => ({
      id: item.recommendation_id,
      platform: "tiktok" as const,
      contentIdea: item.content_idea,
      hookLine: item.hook,
      confidenceScore: item.confidence_score,
      reasoning: item.reasoning,
    })),
    ...(youTubeRecommendationsQuery.data?.recommendations ?? []).map(
      (item) => ({
        id: item.recommendation_id,
        platform: "youtube" as const,
        contentIdea: item.content_idea,
        hookLine: item.title_idea,
        confidenceScore: item.confidence_score,
        reasoning: item.reasoning,
      }),
    ),
  ].sort((a, b) => b.confidenceScore - a.confidenceScore);

  const avgConfidence =
    recommendations.length > 0
      ? recommendations.reduce(
          (total, item) => total + item.confidenceScore,
          0,
        ) / recommendations.length
      : 0;

  const risingTopicsCount =
    (tikTokTrendsQuery.data?.overview_summary.rising_topic_count ?? 0) +
    (youTubeTrendsQuery.data?.overview_summary.rising_topic_count ?? 0);

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Strategy Lab", vi: "Phòng lab chiến lược" }}
        description={{
          en: "Dedicated zone to validate recommendation confidence, lane mix, and execution risk before shipping plans.",
          vi: "Khu vực chuyên biệt để kiểm tra confidence của đề xuất, phối lane và rủi ro thực thi trước khi triển khai.",
        }}
        badge={{ en: "Planning Mode", vi: "Chế độ hoạch định" }}
        icon={Brain}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load strategy lab data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Total Ideas", "Tổng ý tưởng")}
            value={formatCompactNumber(recommendations.length)}
            icon={<Lightbulb className="size-5" />}
            detail={copy("Cross-platform backlog", "Backlog đa nền tảng")}
          />
          <MetricCard
            label={copy("Avg Confidence", "Độ tin cậy trung bình")}
            value={formatPercentFromRatio(avgConfidence)}
            icon={<Target className="size-5" />}
            detail={copy("Recommendation quality", "Chất lượng đề xuất")}
          />
          <MetricCard
            label={copy("Rising Topics", "Topic tăng trưởng")}
            value={formatCompactNumber(risingTopicsCount)}
            icon={<Compass className="size-5" />}
            detail={copy("TikTok + YouTube", "TikTok + YouTube")}
          />
          <MetricCard
            label={copy("Top Confidence", "Đề xuất mạnh nhất")}
            value={
              recommendations[0]
                ? formatPercentFromRatio(recommendations[0].confidenceScore)
                : "--"
            }
            icon={<Sparkles className="size-5" />}
            detail={recommendations[0]?.platform.toUpperCase() ?? "--"}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Recommendation Queue", "Hàng đợi đề xuất")}
          description={copy(
            "Ranked by confidence to prioritize which content lanes should be tested first.",
            "Xếp hạng theo confidence để ưu tiên lane nội dung cần test trước.",
          )}
        >
          {tikTokRecommendationsQuery.isLoading ||
          youTubeRecommendationsQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {item.contentIdea}
                  </p>
                  <p className="mt-1 text-xs text-primary">{item.hookLine}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.reasoning}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.platform.toUpperCase()} -{" "}
                    {formatPercentFromRatio(item.confidenceScore)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Risk Guardrails", "Rào chắn rủi ro")}
          description={copy(
            "Practical checks to keep strategic recommendations actionable and balanced.",
            "Các bước kiểm tra để đảm bảo đề xuất chiến lược có thể triển khai và cân bằng.",
          )}
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Avoid Single-Lane Bias", "Tránh lệch một lane")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Do not assign all capacity to one topic even when confidence is high.",
                  "Không dồn toàn bộ công suất cho một topic dù confidence cao.",
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Validate Source Quality", "Xác thực chất lượng nguồn")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Cross-check recommendation reasoning with trend source freshness before execution.",
                  "Đối chiếu reasoning của đề xuất với độ mới của trend source trước khi triển khai.",
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Bridge To Automation", "Bàn giao sang automation")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Only move plans to automation after lane-level risk review is complete.",
                  "Chỉ bàn giao kế hoạch sang automation sau khi hoàn tất review rủi ro theo lane.",
                )}
              </p>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
