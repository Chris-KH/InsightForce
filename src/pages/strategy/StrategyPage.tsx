import { Compass, Lightbulb, Radar, Sparkles, TrendingUp } from "lucide-react";

import {
  useTikTokRecommendationsQuery,
  useTikTokTrendsQuery,
  useYouTubeRecommendationsQuery,
  useYouTubeTrendsQuery,
} from "@/api";
import {
  BarTrendChart,
  HeatMatrix,
  LineTrendChart,
} from "@/components/app-data-viz";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { PlatformBadge } from "@/components/platform-badge";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getPlatformSurfaceClassName } from "@/lib/platform-theme";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

type UnifiedTopic = {
  platform: "tiktok" | "youtube";
  topicId: string;
  topic: string;
  keyword: string;
  trendScore: number;
  growth: number;
  potentialViews: number;
  searchVolume: number;
};

type UnifiedRecommendation = {
  platform: "tiktok" | "youtube";
  id: string;
  contentIdea: string;
  hookOrTitle: string;
  confidenceScore: number;
  reasoning: string;
  sourceTopics: string[];
};

export function StrategyPage() {
  const copy = useBilingual();

  const tikTokTrendsQuery = useTikTokTrendsQuery();
  const youTubeTrendsQuery = useYouTubeTrendsQuery();
  const tikTokRecommendationsQuery = useTikTokRecommendationsQuery();
  const youTubeRecommendationsQuery = useYouTubeRecommendationsQuery();

  const allQueries = [
    tikTokTrendsQuery,
    youTubeTrendsQuery,
    tikTokRecommendationsQuery,
    youTubeRecommendationsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const firstError = allQueries.find((query) => query.error)?.error;

  const trendTopics: UnifiedTopic[] = [
    ...(tikTokTrendsQuery.data?.trend_topics ?? []).map((topic) => ({
      platform: "tiktok" as const,
      topicId: topic.topic_id,
      topic: topic.topic,
      keyword: topic.keyword,
      trendScore: topic.trend_score,
      growth: topic.increase_percentage,
      potentialViews: topic.potential_views,
      searchVolume: topic.search_volume,
    })),
    ...(youTubeTrendsQuery.data?.trend_topics ?? []).map((topic) => ({
      platform: "youtube" as const,
      topicId: topic.topic_id,
      topic: topic.topic,
      keyword: topic.keyword,
      trendScore: topic.trend_score,
      growth: topic.increase_percentage,
      potentialViews: topic.potential_views,
      searchVolume: topic.search_volume,
    })),
  ].sort((left, right) => right.trendScore - left.trendScore);

  const recommendations: UnifiedRecommendation[] = [
    ...(tikTokRecommendationsQuery.data?.recommendations ?? []).map((item) => ({
      platform: "tiktok" as const,
      id: item.recommendation_id,
      contentIdea: item.content_idea,
      hookOrTitle: item.hook,
      confidenceScore: item.confidence_score,
      reasoning: item.reasoning,
      sourceTopics: item.source_topics,
    })),
    ...(youTubeRecommendationsQuery.data?.recommendations ?? []).map(
      (item) => ({
        platform: "youtube" as const,
        id: item.recommendation_id,
        contentIdea: item.content_idea,
        hookOrTitle: item.title_idea,
        confidenceScore: item.confidence_score,
        reasoning: item.reasoning,
        sourceTopics: item.source_topics,
      }),
    ),
  ].sort((left, right) => right.confidenceScore - left.confidenceScore);

  const risingTopicsCount =
    (tikTokTrendsQuery.data?.overview_summary.rising_topic_count ?? 0) +
    (youTubeTrendsQuery.data?.overview_summary.rising_topic_count ?? 0);

  const averagePotentialViews = trendTopics.length
    ? trendTopics.reduce((sum, topic) => sum + topic.potentialViews, 0) /
      trendTopics.length
    : 0;

  const highConfidenceIdeas = recommendations.filter(
    (item) => item.confidenceScore >= 0.85,
  ).length;

  const trendScoreBarData = {
    labels: trendTopics.slice(0, 8).map((topic) => topic.keyword),
    datasets: [
      {
        label: copy("Trend score", "Điểm xu hướng"),
        data: trendTopics.slice(0, 8).map((topic) => topic.trendScore),
        backgroundColor: "rgba(59, 130, 246, 0.75)",
        borderRadius: 10,
      },
    ],
  };

  const recommendationConfidenceLineData = {
    labels: recommendations.slice(0, 8).map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: copy("Confidence %", "Độ tin cậy %"),
        data: recommendations
          .slice(0, 8)
          .map((item) => item.confidenceScore * 100),
        borderColor: "rgba(16, 185, 129, 0.95)",
        backgroundColor: "rgba(16, 185, 129, 0.18)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const sourceTopicMatrix = (() => {
    const topItems = recommendations.slice(0, 5);
    const allSourceTopics = Array.from(
      new Set(topItems.flatMap((item) => item.sourceTopics)),
    ).slice(0, 5);

    return {
      rows: topItems.map((item) =>
        item.contentIdea.length > 26
          ? `${item.contentIdea.slice(0, 26)}...`
          : item.contentIdea,
      ),
      columns: allSourceTopics,
      values: topItems.map((item) =>
        allSourceTopics.map((topic) =>
          item.sourceTopics.includes(topic) ? item.confidenceScore * 100 : 0,
        ),
      ),
    };
  })();

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Strategic Radar", "Radar chiến lược")}
        title={copy(
          "Trend-To-Plan Intelligence",
          "Trí tuệ từ xu hướng tới kế hoạch",
        )}
        description={copy(
          "The strategy layer now reflects real trend and recommendation endpoints from TikTok and YouTube services.",
          "Lớp chiến lược hiện phản ánh dữ liệu thật từ endpoint xu hướng và đề xuất của TikTok và YouTube.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {copy("Strategy Feed Live", "Feed chiến lược trực tiếp")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load strategy intelligence data.",
          )}
          hint={copy(
            "This page depends on /trends and /recommendations endpoints for both platforms.",
            "Trang này phụ thuộc vào endpoint /trends và /recommendations của cả hai nền tảng.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Rising Topics", "Chủ đề tăng trưởng")}
            value={isLoading ? "--" : String(risingTopicsCount)}
            detail={copy(
              "From TikTok + YouTube trend summaries",
              "Từ tóm tắt xu hướng TikTok + YouTube",
            )}
            icon={<Radar className="size-5" />}
          />
          <MetricCard
            label={copy("Average Potential Views", "Lượt xem tiềm năng TB")}
            value={
              isLoading ? "--" : formatCompactNumber(averagePotentialViews)
            }
            detail={copy(
              "Mean potential views across ranked topics",
              "Lượt xem tiềm năng trung bình theo chủ đề xếp hạng",
            )}
            icon={<TrendingUp className="size-5" />}
          />
          <MetricCard
            label={copy("High-Confidence Ideas", "Ý tưởng độ tin cậy cao")}
            value={isLoading ? "--" : String(highConfidenceIdeas)}
            detail={copy(
              "Recommendations with confidence >= 85%",
              "Đề xuất có độ tin cậy >= 85%",
            )}
            icon={<Lightbulb className="size-5" />}
          />
          <MetricCard
            label={copy("Total Strategies", "Tổng đề xuất chiến lược")}
            value={isLoading ? "--" : String(recommendations.length)}
            detail={copy(
              "Combined recommendation pool",
              "Kho đề xuất hợp nhất",
            )}
            icon={<Compass className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Score Map", "Bản đồ điểm xu hướng")}
          description={copy(
            "Ranked trend score across top topic keywords.",
            "Điểm xu hướng theo thứ hạng keyword chủ đề nổi bật.",
          )}
        >
          {trendTopics.length > 0 ? (
            <BarTrendChart data={trendScoreBarData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend score data available.",
                "Chưa có dữ liệu điểm xu hướng.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Confidence Curve", "Đường độ tin cậy")}
          description={copy(
            "Confidence trajectory of top strategy recommendations.",
            "Đường biến thiên độ tin cậy của các đề xuất chiến lược hàng đầu.",
          )}
        >
          {recommendations.length > 0 ? (
            <LineTrendChart data={recommendationConfidenceLineData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No recommendation confidence data available.",
                "Chưa có dữ liệu độ tin cậy đề xuất.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelCard
          title={copy("Priority Opportunities", "Cơ hội ưu tiên")}
          description={copy(
            "Trend topics ranked by trend score and growth.",
            "Chủ đề xu hướng được xếp theo điểm xu hướng và tăng trưởng.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : trendTopics.length > 0 ? (
              trendTopics.slice(0, 8).map((topic) => (
                <div
                  key={`${topic.platform}-${topic.topicId}`}
                  className={cn(
                    "rounded-2xl border border-border/55 bg-background/55 p-4",
                    getPlatformSurfaceClassName(topic.platform),
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{topic.topic}</p>
                    <PlatformBadge platform={topic.platform} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {topic.keyword}
                  </p>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <p>
                      {copy("Trend", "Điểm xu hướng")}:{" "}
                      {formatPercentValue(topic.trendScore)}
                    </p>
                    <p>
                      {copy("Growth", "Tăng trưởng")}: +{topic.growth}%
                    </p>
                    <p>
                      {copy("Search", "Lượng tìm kiếm")}:{" "}
                      {formatCompactNumber(topic.searchVolume)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No trend opportunities available yet.",
                  "Chưa có cơ hội xu hướng khả dụng.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy(
            "Recommended Content Plans",
            "Kế hoạch nội dung được đề xuất",
          )}
          description={copy(
            "Generated from recommendation endpoints with confidence and rationale.",
            "Sinh từ endpoint recommendation với độ tin cậy và lập luận đi kèm.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : recommendations.length > 0 ? (
              recommendations.slice(0, 8).map((item) => (
                <div
                  key={`${item.platform}-${item.id}`}
                  className={cn(
                    "rounded-2xl border border-border/55 bg-background/55 p-4",
                    getPlatformSurfaceClassName(item.platform),
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <PlatformBadge platform={item.platform} />
                    <p className="text-xs text-muted-foreground">
                      {formatPercentFromRatio(item.confidenceScore)} confidence
                    </p>
                  </div>

                  <p className="mt-2 font-medium text-foreground">
                    {item.contentIdea}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.hookOrTitle}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.reasoning}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.sourceTopics.map((sourceTopic) => (
                      <Badge
                        key={`${item.id}-${sourceTopic}`}
                        variant="outline"
                        className="rounded-full text-[11px]"
                      >
                        {sourceTopic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No recommendation plans available.",
                  "Chưa có kế hoạch đề xuất khả dụng.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <PanelCard
        title={copy(
          "Platform Strategist Notes",
          "Ghi chú chiến lược theo nền tảng",
        )}
        description={copy(
          "Direct strategist notes from each trend overview summary.",
          "Ghi chú chiến lược trực tiếp từ phần tóm tắt xu hướng của từng nền tảng.",
        )}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className={cn(
              "rounded-2xl border border-border/55 bg-background/55 p-4",
              getPlatformSurfaceClassName("tiktok"),
            )}
          >
            <div className="mb-3">
              <PlatformBadge platform="tiktok" />
            </div>
            {tikTokTrendsQuery.data?.overview_summary.strategist_note ? (
              <p className="text-sm leading-6 text-foreground">
                {tikTokTrendsQuery.data.overview_summary.strategist_note}
              </p>
            ) : (
              <InlineQueryState
                state="loading"
                message={copy(
                  "Waiting for strategist note.",
                  "Đang chờ ghi chú chiến lược.",
                )}
                className="p-3"
              />
            )}
          </div>
          <div
            className={cn(
              "rounded-2xl border border-border/55 bg-background/55 p-4",
              getPlatformSurfaceClassName("youtube"),
            )}
          >
            <div className="mb-3">
              <PlatformBadge platform="youtube" />
            </div>
            {youTubeTrendsQuery.data?.overview_summary.strategist_note ? (
              <p className="text-sm leading-6 text-foreground">
                {youTubeTrendsQuery.data.overview_summary.strategist_note}
              </p>
            ) : (
              <InlineQueryState
                state="loading"
                message={copy(
                  "Waiting for strategist note.",
                  "Đang chờ ghi chú chiến lược.",
                )}
                className="p-3"
              />
            )}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title={copy("Source Topic Matrix", "Ma trận chủ đề nguồn")}
        description={copy(
          "Relationship matrix between top recommendations and their source topics.",
          "Ma trận tương quan giữa đề xuất hàng đầu và chủ đề nguồn tương ứng.",
        )}
      >
        {sourceTopicMatrix.rows.length > 0 &&
        sourceTopicMatrix.columns.length > 0 ? (
          <HeatMatrix
            rows={sourceTopicMatrix.rows}
            columns={sourceTopicMatrix.columns}
            values={sourceTopicMatrix.values}
            valueFormatter={(value) => `${Math.round(value)}%`}
          />
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No source-topic relationships available.",
              "Chưa có dữ liệu quan hệ chủ đề nguồn.",
            )}
          />
        )}
      </PanelCard>
    </div>
  );
}
