import { MessageCircle, Radar, Sparkles, Users } from "lucide-react";

import {
  type ContentPlatform,
  useTikTokTrendsQuery,
  useUploadPostCommentsQuery,
  useUploadPostHistoryQuery,
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
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";
import { getQueryErrorMessage } from "@/lib/query-error";

export function AudienceSignalsPage() {
  const copy = useBilingual();

  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });
  const tikTokTrendsQuery = useTikTokTrendsQuery();
  const youTubeTrendsQuery = useYouTubeTrendsQuery();

  const latestHistoryItem = historyQuery.data?.payload.history[0];
  const latestCommentPlatform: ContentPlatform | undefined =
    latestHistoryItem?.platform === "tiktok"
      ? "tiktok"
      : latestHistoryItem?.platform === "youtube"
        ? "youtube"
        : undefined;

  const commentsQuery = useUploadPostCommentsQuery({
    platform: latestCommentPlatform,
    user: latestHistoryItem?.profile_username,
    postId: latestHistoryItem?.platform_post_id || undefined,
    postUrl: latestHistoryItem?.post_url || undefined,
    enabled: Boolean(
      latestCommentPlatform &&
      latestHistoryItem?.profile_username &&
      (latestHistoryItem?.platform_post_id || latestHistoryItem?.post_url),
    ),
  });

  const anyLoading =
    historyQuery.isLoading ||
    tikTokTrendsQuery.isLoading ||
    youTubeTrendsQuery.isLoading;

  const anyError =
    historyQuery.error ||
    tikTokTrendsQuery.error ||
    youTubeTrendsQuery.error ||
    commentsQuery.error;

  const comments = commentsQuery.data?.payload.comments ?? [];
  const tikTokSegments = tikTokTrendsQuery.data?.watcher_segments ?? [];
  const youTubeSegments = youTubeTrendsQuery.data?.watcher_segments ?? [];

  const strongestSegment = [...tikTokSegments, ...youTubeSegments].sort(
    (a, b) => b.affinity_score - a.affinity_score,
  )[0];

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Audience Signals", vi: "Tín hiệu khách hàng" }}
        description={{
          en: "Focused lane for comments, persona signals, and trend sentiment before changing targeting strategy.",
          vi: "Luồng tập trung cho comments, tín hiệu persona và sentiment trước khi điều chỉnh targeting.",
        }}
        badge={{ en: "Signal Analysis", vi: "Phân tích tín hiệu" }}
        icon={Radar}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load audience signal data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Recent Posts", "Bài gần đây")}
            value={formatCompactNumber(historyQuery.data?.payload.total ?? 0)}
            icon={<Users className="size-5" />}
            detail={copy(
              "From upload-post history",
              "Lấy từ upload-post history",
            )}
          />
          <MetricCard
            label={copy("Fetched Comments", "Comment đã tải")}
            value={formatCompactNumber(comments.length)}
            icon={<MessageCircle className="size-5" />}
            detail={copy("Latest post scope", "Theo phạm vi bài mới nhất")}
          />
          <MetricCard
            label={copy("Strongest Segment", "Segment mạnh nhất")}
            value={strongestSegment?.segment ?? "--"}
            icon={<Sparkles className="size-5" />}
            detail={copy(
              strongestSegment
                ? `Affinity ${formatPercentFromRatio(strongestSegment.affinity_score)}`
                : "No segment signal yet",
              strongestSegment
                ? `Độ phù hợp ${formatPercentFromRatio(strongestSegment.affinity_score)}`
                : "Chưa có tín hiệu segment",
            )}
          />
          <MetricCard
            label={copy("Trend Topics", "Topic xu hướng")}
            value={formatCompactNumber(
              (tikTokTrendsQuery.data?.trend_topics.length ?? 0) +
                (youTubeTrendsQuery.data?.trend_topics.length ?? 0),
            )}
            icon={<Radar className="size-5" />}
            detail={copy("TikTok + YouTube", "TikTok + YouTube")}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Comment Pulse", "Nhịp bình luận")}
          description={copy(
            "Inspect the latest post comments before rewriting persona assumptions.",
            "Xem bình luận bài gần nhất trước khi thay đổi giả định persona.",
          )}
        >
          {commentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {comments.slice(0, 8).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm text-foreground">{comment.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    @{comment.user.username} -{" "}
                    {formatDateTime(comment.timestamp)}
                  </p>
                </div>
              ))}
              {comments.length === 0 ? (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No comments returned for the latest scope.",
                    "Chưa có bình luận trong phạm vi mới nhất.",
                  )}
                />
              ) : null}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Audience Guidance", "Hướng dẫn khách hàng")}
          description={copy(
            "Practical guardrails to avoid overfitting when one channel has partial data.",
            "Các rào chắn thực tế để tránh overfit khi một kênh thiếu dữ liệu.",
          )}
        >
          <div className="space-y-3">
            {[...tikTokSegments, ...youTubeSegments]
              .slice(0, 5)
              .map((segment, index) => (
                <div
                  key={`${segment.segment}-${index}`}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {segment.segment}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Affinity", "Độ phù hợp")}:{" "}
                    {formatPercentFromRatio(segment.affinity_score)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {segment.rationale}
                  </p>
                </div>
              ))}

            {latestHistoryItem ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {copy("Scope Reminder", "Nhắc phạm vi")}
                </p>
                <p className="mt-1.5">
                  {copy(
                    "Current comments pulled from",
                    "Bình luận hiện lấy từ",
                  )}
                  : {latestHistoryItem.platform} /{" "}
                  {latestHistoryItem.profile_username}
                </p>
              </div>
            ) : null}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
