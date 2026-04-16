import { useMemo } from "react";
import {
  Hash,
  MessageCircle,
  Radar,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import {
  useGeneratedContentsQuery,
  useTrendGeneralQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
} from "@/api";
import { BarTrendChart, DoughnutTrendChart } from "@/components/app-data-viz";
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
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

const GENERAL_TREND_QUERY = "xu hướng mạng xã hội tổng quát hôm nay";

type TrendSignal = {
  keyword: string;
  score: number;
  why: string;
  recommendation: string;
  tags: string[];
  avgViewsPerHour: number;
};

function normalizeTrendSignals(
  raw: ReturnType<typeof useTrendGeneralQuery>["data"],
) {
  const source = raw?.results ?? [];

  return source.map<TrendSignal>((item) => ({
    keyword: item.main_keyword,
    score: item.trend_score,
    why: item.why_the_trend_happens,
    recommendation: item.recommended_action,
    tags: item.top_hashtags,
    avgViewsPerHour: item.avg_views_per_hour,
  }));
}

export function AudiencePage() {
  const copy = useBilingual();

  const trendGeneralQuery = useTrendGeneralQuery({
    query: GENERAL_TREND_QUERY,
    limit: 5,
  });
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 20 });

  const trendSignals = useMemo(
    () => normalizeTrendSignals(trendGeneralQuery.data),
    [trendGeneralQuery.data],
  );

  const topSignal = trendSignals[0];

  const topHashtags = useMemo(
    () =>
      Array.from(
        new Set(
          trendSignals
            .flatMap((item) => item.tags)
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ).slice(0, 12),
    [trendSignals],
  );

  const trendBarData = useMemo(
    () => ({
      labels: trendSignals.map((item) => item.keyword),
      datasets: [
        {
          label: copy("Trend score", "Điểm xu hướng"),
          data: trendSignals.map((item) => item.score),
          backgroundColor: "rgba(20, 184, 166, 0.78)",
          borderRadius: 10,
        },
      ],
    }),
    [copy, trendSignals],
  );

  const publishJobs = publishJobsQuery.data?.items ?? [];
  const publishedJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const pendingJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;
  const failedJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;

  const publishMixData = useMemo(
    () => ({
      labels: [
        copy("Published", "Đã đăng"),
        copy("Pending", "Đang chờ"),
        copy("Failed", "Lỗi"),
      ],
      datasets: [
        {
          data: [publishedJobsCount, pendingJobsCount, failedJobsCount],
          backgroundColor: [
            "rgba(16, 185, 129, 0.82)",
            "rgba(245, 158, 11, 0.78)",
            "rgba(248, 113, 113, 0.75)",
          ],
          borderWidth: 0,
        },
      ],
    }),
    [copy, failedJobsCount, pendingJobsCount, publishedJobsCount],
  );

  const trendHistoryItems = trendHistoryQuery.data?.items ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];

  const allQueries = [
    trendGeneralQuery,
    trendHistoryQuery,
    generatedContentsQuery,
    publishJobsQuery,
  ];

  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const isLoading = allQueries.some((query) => query.isLoading);
  const firstError = allQueries.find((query) => query.error)?.error;

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Audience Intelligence", "Trí tuệ khán giả")}
        title={copy("Audience Behavior Radar", "Radar hành vi khán giả")}
        description={copy(
          "Audience direction synthesized from trend momentum, recent strategy runs, and publishing outcomes.",
          "Định hướng khán giả được tổng hợp từ nhịp xu hướng, các lần chạy chiến lược gần đây và kết quả xuất bản.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {copy("Docs-Aligned Signals", "Tín hiệu đúng theo docs")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Unable To Load Signals", "Không thể tải tín hiệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load audience data right now.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy(
              "Active Trend Signals",
              "Tín hiệu trend đang hoạt động",
            )}
            value={formatCompactNumber(trendSignals.length)}
            detail={copy(
              "General trend map for this session",
              "Bản đồ trend tổng quát cho phiên hiện tại",
            )}
            icon={<Radar className="size-5" />}
          />
          <MetricCard
            label={copy("Top Hashtag Set", "Bộ hashtag nổi bật")}
            value={formatCompactNumber(topHashtags.length)}
            detail={copy(
              "Unique tags across strongest trends",
              "Hashtag duy nhất trong các trend mạnh nhất",
            )}
            icon={<Hash className="size-5" />}
          />
          <MetricCard
            label={copy("Generated Content Packs", "Gói nội dung đã tạo")}
            value={formatCompactNumber(generatedContents.length)}
            detail={copy(
              "Ready for publishing selection",
              "Sẵn sàng cho bước chọn và đăng",
            )}
            icon={<Video className="size-5" />}
          />
          <MetricCard
            label={copy("Published Jobs", "Công việc đã đăng")}
            value={formatCompactNumber(publishedJobsCount)}
            detail={copy(
              "Recent jobs marked as published",
              "Các công việc gần đây có trạng thái published",
            )}
            icon={<Users className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Momentum", "Động lượng xu hướng")}
          description={copy(
            "Score comparison between active trend signals.",
            "So sánh điểm số giữa các tín hiệu xu hướng đang hoạt động.",
          )}
        >
          {trendSignals.length > 0 ? (
            <BarTrendChart
              data={trendBarData}
              className="bg-linear-to-br from-teal-100/60 via-card to-cyan-100/45 dark:from-teal-500/12 dark:via-card/90 dark:to-cyan-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend signals available yet.",
                "Chưa có tín hiệu xu hướng khả dụng.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Publishing Outcome Mix", "Tỷ trọng kết quả đăng bài")}
          description={copy(
            "Distribution of recent publishing outcomes.",
            "Phân bổ kết quả xuất bản gần đây.",
          )}
        >
          {publishJobs.length > 0 ? (
            <DoughnutTrendChart
              data={publishMixData}
              className="bg-linear-to-br from-lime-100/55 via-card to-amber-100/45 dark:from-lime-500/12 dark:via-card/90 dark:to-amber-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No publish jobs found for charting.",
                "Chưa có publish job để dựng biểu đồ.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Audience Cues", "Gợi ý hành vi khán giả")}
          description={copy(
            "Actionable cues from strongest trend context.",
            "Gợi ý có thể hành động từ bối cảnh xu hướng mạnh nhất.",
          )}
        >
          <div className="space-y-3">
            {isLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : topSignal ? (
              <>
                <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {topSignal.keyword}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Trend score", "Điểm xu hướng")}:{" "}
                    {formatPercentValue(topSignal.score)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {topSignal.why}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {copy("Recommended action", "Hành động đề xuất")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {topSignal.recommendation}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {copy(
                      "Average views per hour",
                      "Lượt xem trung bình mỗi giờ",
                    )}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {formatCompactNumber(topSignal.avgViewsPerHour)}
                  </p>
                </div>
              </>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No audience cues available from trend analysis.",
                  "Chưa có gợi ý khán giả từ dữ liệu trend.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy(
            "Recent Strategy Activity",
            "Hoạt động chiến lược gần đây",
          )}
          description={copy(
            "Latest trend sessions and publish outputs.",
            "Các phiên trend và kết quả publish mới nhất.",
          )}
        >
          <div className="space-y-3">
            {isLoading ? (
              <PanelRowsSkeleton rows={5} />
            ) : (
              <>
                {trendHistoryItems.slice(0, 4).map((record) => (
                  <div
                    key={
                      record.analysis_id ??
                      `${record.query}-${record.created_at}`
                    }
                    className="rounded-2xl border border-border/65 bg-background/65 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {record.query}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy("Created", "Khởi tạo")}:{" "}
                      {formatDateTime(record.created_at)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy("Insights", "Số insight")}: {record.results.length}
                    </p>
                  </div>
                ))}

                {publishJobs.slice(0, 4).map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-border/65 bg-background/65 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy("Status", "Trạng thái")}: {job.status}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy("Platforms", "Nền tảng")}:{" "}
                      {job.platforms.join(", ")}
                    </p>
                  </div>
                ))}
              </>
            )}

            {!isLoading &&
            trendHistoryItems.length === 0 &&
            publishJobs.length === 0 ? (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No recent strategy activity available.",
                  "Chưa có hoạt động chiến lược gần đây.",
                )}
              />
            ) : null}
          </div>
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Hashtag Watchlist", "Danh sách theo dõi hashtag")}
        description={copy(
          "Hashtags currently repeated across strongest trend signals.",
          "Các hashtag đang lặp lại trong những tín hiệu xu hướng mạnh nhất.",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {topHashtags.length > 0 ? (
            topHashtags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px]"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No hashtags detected from current trend data.",
                "Chưa có hashtag được phát hiện từ dữ liệu trend hiện tại.",
              )}
            />
          )}
        </div>
      </PanelCard>

      <PanelCard
        title={copy("Comment Signal Note", "Ghi chú tín hiệu bình luận")}
        description={copy(
          "Comment-level endpoints are no longer part of active docs. Use trend and publish outcomes as validated audience proxies.",
          "Các endpoint mức bình luận không còn trong docs hiện hành. Hãy dùng kết quả trend và publish như proxy đã được xác thực cho tín hiệu khán giả.",
        )}
      >
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="size-4 text-primary" />
            {copy("Why this changed", "Vì sao phần này thay đổi")}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy(
              "Legacy TikTok/YouTube and comment lookup APIs are excluded to keep the frontend aligned with backend API documentation.",
              "Các API TikTok/YouTube cũ và tra cứu comment đã được loại bỏ để đảm bảo frontend bám sát tài liệu API backend.",
            )}
          </p>
        </div>
      </PanelCard>
    </div>
  );
}
