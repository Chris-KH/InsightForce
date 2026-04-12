import { useMemo } from "react";
import { MessageCircle, Radar, Sparkles, Users, Video } from "lucide-react";

import {
  useTikTokTrendsQuery,
  useUploadPostCommentsQuery,
  useUploadPostHistoryQuery,
  useYouTubeTrendsQuery,
  type UploadPostComment,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

type UnifiedSegment = {
  platform: "tiktok" | "youtube";
  segment: string;
  affinityScore: number;
  interests: string[];
  rationale: string;
};

type UnifiedComment = {
  platform: "tiktok" | "youtube";
  comment: UploadPostComment;
};

export function AudiencePage() {
  const copy = useBilingual();

  const tikTokTrendsQuery = useTikTokTrendsQuery();
  const youTubeTrendsQuery = useYouTubeTrendsQuery();
  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });

  const historyItems = historyQuery.data?.payload.history ?? [];
  const profileUsername = historyItems[0]?.profile_username;
  const latestTikTokPost = historyItems.find(
    (item) => item.platform === "tiktok",
  );
  const latestYouTubePost = historyItems.find(
    (item) => item.platform === "youtube",
  );

  const tikTokCommentsQuery = useUploadPostCommentsQuery({
    platform: "tiktok",
    user: profileUsername,
    postId: latestTikTokPost?.platform_post_id,
    enabled: Boolean(profileUsername && latestTikTokPost?.platform_post_id),
  });

  const youTubeCommentsQuery = useUploadPostCommentsQuery({
    platform: "youtube",
    user: profileUsername,
    postId: latestYouTubePost?.platform_post_id,
    enabled: Boolean(profileUsername && latestYouTubePost?.platform_post_id),
  });

  const allQueries = [
    tikTokTrendsQuery,
    youTubeTrendsQuery,
    historyQuery,
    tikTokCommentsQuery,
    youTubeCommentsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const firstError = allQueries.find((query) => query.error)?.error;

  const audienceSegments = useMemo<UnifiedSegment[]>(() => {
    const tikTok = (tikTokTrendsQuery.data?.watcher_segments ?? []).map(
      (segment) => ({
        platform: "tiktok" as const,
        segment: segment.segment,
        affinityScore: segment.affinity_score,
        interests: segment.interests,
        rationale: segment.rationale,
      }),
    );

    const youTube = (youTubeTrendsQuery.data?.watcher_segments ?? []).map(
      (segment) => ({
        platform: "youtube" as const,
        segment: segment.segment,
        affinityScore: segment.affinity_score,
        interests: segment.interests,
        rationale: segment.rationale,
      }),
    );

    return [...tikTok, ...youTube].sort(
      (left, right) => right.affinityScore - left.affinityScore,
    );
  }, [
    tikTokTrendsQuery.data?.watcher_segments,
    youTubeTrendsQuery.data?.watcher_segments,
  ]);

  const latestComments = useMemo<UnifiedComment[]>(() => {
    const tikTok = (tikTokCommentsQuery.data?.payload.comments ?? []).map(
      (comment) => ({
        platform: "tiktok" as const,
        comment,
      }),
    );

    const youTube = (youTubeCommentsQuery.data?.payload.comments ?? []).map(
      (comment) => ({
        platform: "youtube" as const,
        comment,
      }),
    );

    return [...tikTok, ...youTube].sort(
      (left, right) =>
        new Date(right.comment.timestamp).getTime() -
        new Date(left.comment.timestamp).getTime(),
    );
  }, [
    tikTokCommentsQuery.data?.payload.comments,
    youTubeCommentsQuery.data?.payload.comments,
  ]);

  const topicSignals = [
    ...(tikTokTrendsQuery.data?.trend_topics ?? []),
    ...(youTubeTrendsQuery.data?.trend_topics ?? []),
  ]
    .sort((left, right) => right.increase_percentage - left.increase_percentage)
    .slice(0, 10);

  const trendingVideos = [
    ...(tikTokTrendsQuery.data?.trending_videos ?? []).map((video) => ({
      platform: "tiktok" as const,
      id: video.video_id,
      title: video.caption,
      url: video.video_url,
      views: video.stats.views,
      engagementRate: video.stats.engagement_rate,
    })),
    ...(youTubeTrendsQuery.data?.trending_videos ?? []).map((video) => ({
      platform: "youtube" as const,
      id: video.video_id,
      title: video.title,
      url: video.video_url,
      views: video.stats.views,
      engagementRate: video.stats.engagement_rate,
    })),
  ]
    .sort((left, right) => right.views - left.views)
    .slice(0, 6);

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Audience Intelligence", "Trí tuệ khách hàng")}
        title={copy("Audience Behavior Map", "Bản đồ hành vi khán giả")}
        description={copy(
          "Live audience segments, comment context, and trend demand signals from TikTok, YouTube, and Upload-Post interactions.",
          "Phân khúc khán giả, ngữ cảnh bình luận và tín hiệu nhu cầu xu hướng theo thời gian thực từ TikTok, YouTube và Upload-Post.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {copy("Audience Sync Active", "Đồng bộ audience đang chạy")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load audience intelligence data.",
          )}
          hint={copy(
            "Audience pipelines depend on /trends and /upload-post/interactions/comments endpoints.",
            "Dữ liệu audience phụ thuộc vào endpoint /trends và /upload-post/interactions/comments.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Audience Segments", "Phân khúc khán giả")}
            value={isLoading ? "--" : String(audienceSegments.length)}
            detail={copy(
              "Combined watcher segment clusters",
              "Tổng cụm phân khúc người xem",
            )}
            icon={<Users className="size-5" />}
          />
          <MetricCard
            label={copy("Trend Signals", "Tín hiệu xu hướng")}
            value={isLoading ? "--" : String(topicSignals.length)}
            detail={copy(
              "Topics ranked by growth percentage",
              "Chủ đề xếp theo phần trăm tăng trưởng",
            )}
            icon={<Radar className="size-5" />}
          />
          <MetricCard
            label={copy("Recent Comments", "Bình luận mới")}
            value={isLoading ? "--" : String(latestComments.length)}
            detail={copy(
              "Fetched from latest posts in history",
              "Lấy từ bài đăng mới nhất trong lịch sử",
            )}
            icon={<MessageCircle className="size-5" />}
          />
          <MetricCard
            label={copy("Trend Video Reach", "Độ phủ video xu hướng")}
            value={
              isLoading
                ? "--"
                : formatCompactNumber(
                    trendingVideos.reduce((sum, item) => sum + item.views, 0),
                  )
            }
            detail={copy(
              "Top cross-platform trend videos",
              "Top video xu hướng đa nền tảng",
            )}
            icon={<Video className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PanelCard
          title={copy("High-Affinity Segments", "Phân khúc ái lực cao")}
          description={copy(
            "Watcher segments from TikTok and YouTube trend endpoints.",
            "Phân khúc người xem từ endpoint xu hướng TikTok và YouTube.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : audienceSegments.length > 0 ? (
              audienceSegments.slice(0, 8).map((segment) => (
                <div
                  key={`${segment.platform}-${segment.segment}`}
                  className="rounded-2xl border border-border/55 bg-background/55 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {segment.segment}
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {segment.platform}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Affinity", "Độ ái lực")}:{" "}
                    {formatPercentFromRatio(segment.affinityScore)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {segment.interests.join(" • ")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {segment.rationale}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No watcher segment data available.",
                  "Chưa có dữ liệu phân khúc người xem.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Conversation Radar", "Radar hội thoại")}
          description={copy(
            "Latest comments from most recent TikTok/YouTube uploads.",
            "Bình luận mới nhất từ các bài đăng TikTok/YouTube gần đây.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : latestComments.length > 0 ? (
              latestComments.map(({ platform, comment }) => (
                <div
                  key={`${platform}-${comment.id}`}
                  className="rounded-2xl border border-border/55 bg-background/55 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {platform}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(comment.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-foreground">
                    "{comment.text}"
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    @{comment.user.username}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No comments found for the latest posts.",
                  "Không tìm thấy bình luận cho các bài đăng mới nhất.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Topic Demand Signals", "Tín hiệu nhu cầu chủ đề")}
          description={copy(
            "Search demand and growth velocity by topic.",
            "Nhu cầu tìm kiếm và tốc độ tăng trưởng theo chủ đề.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : topicSignals.length > 0 ? (
              topicSignals.map((topic) => (
                <div
                  key={topic.topic_id}
                  className="grid gap-2 rounded-2xl border border-border/55 bg-background/55 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div>
                    <p className="font-medium text-foreground">{topic.topic}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {topic.keyword}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>
                      +{topic.increase_percentage}%{" "}
                      {copy("growth", "tăng trưởng")}
                    </p>
                    <p>{formatCompactNumber(topic.search_volume)} searches</p>
                  </div>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No topic demand signals available.",
                  "Chưa có tín hiệu nhu cầu chủ đề khả dụng.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Trend Videos To Study", "Video xu hướng cần theo dõi")}
          description={copy(
            "High-performing trend videos that shape audience expectations.",
            "Video xu hướng hiệu suất cao định hình kỳ vọng của khán giả.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : trendingVideos.length > 0 ? (
              trendingVideos.map((video) => (
                <a
                  key={`${video.platform}-${video.id}`}
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-border/55 bg-background/55 p-4 transition-colors hover:border-primary/35"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {video.platform}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentFromRatio(video.engagementRate)} engagement
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {video.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Views", "Lượt xem")}:{" "}
                    {formatCompactNumber(video.views)}
                  </p>
                </a>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No trend videos available.",
                  "Chưa có video xu hướng khả dụng.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
