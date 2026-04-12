import { useMemo } from "react";
import {
  Activity,
  Eye,
  RefreshCcw,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

import {
  useHealthQuery,
  useTikTokChannelStatusQuery,
  useTikTokTrendsQuery,
  useTikTokVideosQuery,
  useYouTubeChannelStatusQuery,
  useYouTubeTrendsQuery,
  useYouTubeVideosQuery,
  type TikTokVideo,
  type YouTubeVideo,
} from "@/api";
import { PulseDot } from "@/components/app-futuristic";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import {
  MetricCard,
  PanelCard,
  ProgressBar,
  SectionHeader,
} from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatDuration,
  formatPercentFromRatio,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

type UnifiedVideo = {
  id: string;
  platform: "tiktok" | "youtube";
  title: string;
  postedAt: string;
  durationSeconds: number;
  url: string;
  views: number;
  engagementRate: number;
  trendScore: number;
};

function mapTikTokVideo(video: TikTokVideo): UnifiedVideo {
  return {
    id: video.video_id,
    platform: "tiktok",
    title: video.caption,
    postedAt: video.posted_at,
    durationSeconds: video.duration_seconds,
    url: video.video_url,
    views: video.stats.views,
    engagementRate: video.stats.engagement_rate,
    trendScore: video.stats.trend_score,
  };
}

function mapYouTubeVideo(video: YouTubeVideo): UnifiedVideo {
  return {
    id: video.video_id,
    platform: "youtube",
    title: video.title,
    postedAt: video.published_at,
    durationSeconds: video.duration_seconds,
    url: video.video_url,
    views: video.stats.views,
    engagementRate: video.stats.engagement_rate,
    trendScore: video.stats.trend_score,
  };
}

export function DashboardPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const tikTokChannelQuery = useTikTokChannelStatusQuery();
  const youTubeChannelQuery = useYouTubeChannelStatusQuery();
  const tikTokVideosQuery = useTikTokVideosQuery();
  const youTubeVideosQuery = useYouTubeVideosQuery();
  const tikTokTrendsQuery = useTikTokTrendsQuery();
  const youTubeTrendsQuery = useYouTubeTrendsQuery();

  const allQueries = [
    healthQuery,
    tikTokChannelQuery,
    youTubeChannelQuery,
    tikTokVideosQuery,
    youTubeVideosQuery,
    tikTokTrendsQuery,
    youTubeTrendsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );

  const firstError = allQueries.find((query) => query.error)?.error;

  const topVideos = useMemo(() => {
    const tikTok = (tikTokVideosQuery.data?.videos ?? []).map(mapTikTokVideo);
    const youTube = (youTubeVideosQuery.data?.videos ?? []).map(
      mapYouTubeVideo,
    );

    return [...tikTok, ...youTube]
      .sort((left, right) => right.views - left.views)
      .slice(0, 6);
  }, [tikTokVideosQuery.data?.videos, youTubeVideosQuery.data?.videos]);

  const tikTokChannel = tikTokChannelQuery.data?.channel;
  const youTubeChannel = youTubeChannelQuery.data?.channel;

  const audienceSize =
    (tikTokChannel?.followers ?? 0) + (youTubeChannel?.subscribers ?? 0);

  const totalViews =
    (tikTokChannel?.total_views ?? 0) + (youTubeChannel?.total_views ?? 0);

  const avgContentPerformance =
    (tikTokVideosQuery.data?.averages.average_views ?? 0) +
    (youTubeVideosQuery.data?.averages.average_views ?? 0);

  const blendedEngagement =
    ((tikTokChannel?.engagement_rate ?? 0) +
      (youTubeChannel?.engagement_rate ?? 0)) /
    2;

  const trendHighlights = [
    tikTokTrendsQuery.data?.overview_summary,
    youTubeTrendsQuery.data?.overview_summary,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const opportunityTopics = [
    ...(tikTokTrendsQuery.data?.trend_topics ?? []),
    ...(youTubeTrendsQuery.data?.trend_topics ?? []),
  ]
    .sort((left, right) => right.trend_score - left.trend_score)
    .slice(0, 8);

  const handleRefresh = async () => {
    await Promise.all(allQueries.map((query) => query.refetch()));
  };

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Control Center", "Trung tâm điều phối")}
        title={copy("Live Channel Overview", "Tổng quan kênh thời gian thực")}
        description={copy(
          "Operational view powered by FastAPI endpoints across TikTok, YouTube, and Upload-Post analytics.",
          "Giao diện vận hành lấy dữ liệu trực tiếp từ FastAPI cho TikTok, YouTube và phân tích Upload-Post.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
            >
              <PulseDot className="mr-2" />
              {healthQuery.data?.status === "ok"
                ? copy("Backend Healthy", "Backend hoạt động tốt")
                : copy("Health Unknown", "Chưa xác định trạng thái")}
            </Badge>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                void handleRefresh();
              }}
            >
              <RefreshCcw data-icon="inline-start" />
              {copy("Refresh", "Làm mới")}
            </Button>
          </div>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load dashboard data.",
          )}
          hint={copy(
            "Check that the backend is running and the Vite proxy points to the API service.",
            "Kiểm tra backend đã chạy và cấu hình proxy Vite đang trỏ đúng API.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Audience Footprint", "Quy mô khán giả")}
            value={isLoading ? "--" : formatCompactNumber(audienceSize)}
            detail={copy(
              "TikTok followers + YouTube subscribers",
              "Follower TikTok + subscriber YouTube",
            )}
            icon={<Users className="size-5" />}
          />
          <MetricCard
            label={copy("Total Channel Views", "Tổng lượt xem kênh")}
            value={isLoading ? "--" : formatCompactNumber(totalViews)}
            detail={copy("Cross-platform lifetime", "Lũy kế đa nền tảng")}
            icon={<Eye className="size-5" />}
          />
          <MetricCard
            label={copy("Average Video Reach", "Độ phủ video trung bình")}
            value={
              isLoading ? "--" : formatCompactNumber(avgContentPerformance)
            }
            detail={copy(
              "Combined mean views per published video",
              "Lượt xem trung bình trên mỗi video đã xuất bản",
            )}
            icon={<Video className="size-5" />}
          />
          <MetricCard
            label={copy("Blended Engagement", "Tương tác tổng hợp")}
            value={isLoading ? "--" : formatPercentFromRatio(blendedEngagement)}
            detail={copy(
              "Average engagement rate from both channels",
              "Tỷ lệ tương tác trung bình của 2 kênh",
            )}
            icon={<Activity className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,1fr)]">
        <PanelCard
          title={copy("Channel Health Snapshot", "Ảnh chụp sức khỏe kênh")}
          description={copy(
            "Real metrics from /channel/status endpoints.",
            "Chỉ số thực lấy từ endpoint /channel/status.",
          )}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  TikTok
                </p>
                <Badge variant="outline" className="rounded-full text-xs">
                  {tikTokChannel?.handle ?? "--"}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <p className="font-heading text-2xl font-semibold text-foreground">
                  {tikTokChannel
                    ? formatCompactNumber(tikTokChannel.followers)
                    : "--"}
                </p>
                <p className="text-muted-foreground">
                  {copy("Followers", "Follower")}
                </p>
                <ProgressBar
                  value={(tikTokChannel?.engagement_rate ?? 0) * 100}
                  tone="primary"
                />
                <p className="text-xs text-muted-foreground">
                  {copy("Engagement", "Tương tác")}:{" "}
                  {tikTokChannel
                    ? formatPercentFromRatio(tikTokChannel.engagement_rate)
                    : "--"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  YouTube
                </p>
                <Badge variant="outline" className="rounded-full text-xs">
                  {youTubeChannel?.handle ?? "--"}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <p className="font-heading text-2xl font-semibold text-foreground">
                  {youTubeChannel
                    ? formatCompactNumber(youTubeChannel.subscribers)
                    : "--"}
                </p>
                <p className="text-muted-foreground">
                  {copy("Subscribers", "Người đăng ký")}
                </p>
                <ProgressBar
                  value={(youTubeChannel?.engagement_rate ?? 0) * 100}
                  tone="secondary"
                />
                <p className="text-xs text-muted-foreground">
                  {copy("Engagement", "Tương tác")}:{" "}
                  {youTubeChannel
                    ? formatPercentFromRatio(youTubeChannel.engagement_rate)
                    : "--"}
                </p>
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Trend Pulse", "Nhịp xu hướng")}
          description={copy(
            "Summaries from /trends for fast strategic checks.",
            "Tóm tắt từ /trends để kiểm tra chiến lược nhanh.",
          )}
        >
          <div className="space-y-4">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={2} />
            ) : trendHighlights.length > 0 ? (
              trendHighlights.map((summary, index) => (
                <div
                  key={`${summary.hottest_topic}-${index}`}
                  className="rounded-2xl border border-border/55 bg-background/55 p-4"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {index === 0 ? "TikTok" : "YouTube"}
                  </p>
                  <p className="mt-2 font-heading text-lg font-semibold text-foreground">
                    {summary.hottest_topic}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Avg potential views", "Lượt xem tiềm năng TB")}:{" "}
                    {formatCompactNumber(summary.average_potential_views)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Rising topics", "Chủ đề tăng trưởng")}:{" "}
                    {summary.rising_topic_count}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No trend summary available.",
                  "Chưa có tóm tắt xu hướng khả dụng.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Top Videos Across Platforms", "Video nổi bật đa nền tảng")}
        description={copy(
          "Unified ranking from /api/v1/tiktok/videos and /api/v1/youtube/videos.",
          "Bảng xếp hạng hợp nhất từ /api/v1/tiktok/videos và /api/v1/youtube/videos.",
        )}
      >
        <div className="space-y-3">
          {isInitialLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : topVideos.length > 0 ? (
            topVideos.map((video) => (
              <a
                key={`${video.platform}-${video.id}`}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="grid gap-2 rounded-2xl border border-border/55 bg-background/55 p-4 transition-colors hover:border-primary/35"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="rounded-full capitalize">
                    {video.platform}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(video.postedAt)}
                  </p>
                </div>

                <p className="font-medium text-foreground">{video.title}</p>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                  <p>
                    {copy("Views", "Lượt xem")}:{" "}
                    {formatCompactNumber(video.views)}
                  </p>
                  <p>
                    {copy("Engagement", "Tương tác")}:{" "}
                    {formatPercentFromRatio(video.engagementRate)}
                  </p>
                  <p>
                    {copy("Trend score", "Điểm xu hướng")}:{" "}
                    {formatPercentValue(video.trendScore)}
                  </p>
                  <p>
                    {copy("Duration", "Thời lượng")}:{" "}
                    {formatDuration(video.durationSeconds)}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No videos available yet from backend feeds.",
                "Chưa có video khả dụng từ feed backend.",
              )}
            />
          )}
        </div>
      </PanelCard>

      <PanelCard
        title={copy("Strategist Notes", "Ghi chú chiến lược")}
        description={copy(
          "Actionable hints generated by each platform trend summary.",
          "Gợi ý hành động từ phần tóm tắt xu hướng theo từng nền tảng.",
        )}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              TikTok
            </p>
            <p className="text-sm leading-6 text-foreground">
              {tikTokTrendsQuery.data?.overview_summary.strategist_note ??
                copy(
                  "Waiting for trend summary.",
                  "Đang chờ tóm tắt xu hướng.",
                )}
            </p>
          </div>
          <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
            <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              YouTube
            </p>
            <p className="text-sm leading-6 text-foreground">
              {youTubeTrendsQuery.data?.overview_summary.strategist_note ??
                copy(
                  "Waiting for trend summary.",
                  "Đang chờ tóm tắt xu hướng.",
                )}
            </p>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title={copy("Opportunity Signals", "Tín hiệu cơ hội")}
        description={copy(
          "Cross-platform trend topics ranked by trend score.",
          "Chủ đề xu hướng đa nền tảng được xếp theo điểm xu hướng.",
        )}
      >
        {isInitialLoading ? (
          <PanelRowsSkeleton rows={4} />
        ) : opportunityTopics.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {opportunityTopics.map((topic) => (
              <div
                key={topic.topic_id}
                className="rounded-2xl border border-border/55 bg-background/55 p-4"
              >
                <p className="text-xs text-muted-foreground">{topic.keyword}</p>
                <p className="mt-1 font-medium text-foreground">
                  {topic.topic}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 inline-flex size-3" />+
                  {topic.increase_percentage}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No opportunity signals available.",
              "Chưa có tín hiệu cơ hội khả dụng.",
            )}
          />
        )}
      </PanelCard>
    </div>
  );
}
