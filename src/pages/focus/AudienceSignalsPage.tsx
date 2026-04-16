import { useMemo } from "react";
import { MessageCircle, Radar, Sparkles, Users } from "lucide-react";

import {
  useGeneratedContentsQuery,
  useTrendGeneralQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

const GENERAL_TREND_QUERY = "xu hướng mạng xã hội tổng quát hôm nay";

export function AudienceSignalsPage() {
  const copy = useBilingual();

  const trendGeneralQuery = useTrendGeneralQuery({
    query: GENERAL_TREND_QUERY,
    limit: 5,
  });
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 20 });

  const allQueries = [
    trendGeneralQuery,
    trendHistoryQuery,
    generatedContentsQuery,
    publishJobsQuery,
  ];

  const anyLoading = allQueries.some((query) => query.isLoading);
  const anyError = allQueries.find((query) => query.error)?.error;

  const trendSignals = trendGeneralQuery.data?.results ?? [];
  const strongestTrend = trendSignals[0];

  const repeatedHashtags = useMemo(() => {
    const buckets = new Map<string, number>();

    for (const result of trendSignals) {
      for (const tag of result.top_hashtags) {
        const normalized = tag.trim();
        if (!normalized) {
          continue;
        }
        buckets.set(normalized, (buckets.get(normalized) ?? 0) + 1);
      }
    }

    return [...buckets.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8);
  }, [trendSignals]);

  const publishJobs = publishJobsQuery.data?.items ?? [];
  const publishedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  );

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Audience Signals", vi: "Tín hiệu khách hàng" }}
        description={{
          en: "Focused lane for audience signal reading based on validated trend and publishing datasets.",
          vi: "Không gian tập trung để đọc tín hiệu khán giả dựa trên bộ dữ liệu trend và xuất bản đã được xác thực.",
        }}
        badge={{ en: "Signal Console", vi: "Bảng điều khiển tín hiệu" }}
        icon={Radar}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load audience signals.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Trend Signals", "Tín hiệu xu hướng")}
            value={formatCompactNumber(trendSignals.length)}
            icon={<Radar className="size-5" />}
            detail={copy(
              "General trend snapshot",
              "Ảnh chụp xu hướng tổng quát",
            )}
          />
          <MetricCard
            label={copy("Repeated Hashtags", "Hashtag lặp lại")}
            value={formatCompactNumber(repeatedHashtags.length)}
            icon={<Sparkles className="size-5" />}
            detail={copy(
              "Cross-signal repetition",
              "Mức lặp giữa các tín hiệu",
            )}
          />
          <MetricCard
            label={copy("Published Posts", "Bài đã xuất bản")}
            value={formatCompactNumber(publishedJobs.length)}
            icon={<Users className="size-5" />}
            detail={copy("Recent publish jobs", "Từ các publish job gần đây")}
          />
          <MetricCard
            label={copy("Content Drafts", "Bản nháp nội dung")}
            value={formatCompactNumber(
              generatedContentsQuery.data?.items.length ?? 0,
            )}
            icon={<MessageCircle className="size-5" />}
            detail={copy(
              "Inputs ready for publish ops",
              "Đầu vào sẵn sàng cho publish ops",
            )}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Top Signal Brief", "Bản tóm tắt tín hiệu chính")}
          description={copy(
            "A quick read of the strongest trend currently detected.",
            "Tóm tắt nhanh tín hiệu trend mạnh nhất hiện tại.",
          )}
          action={
            strongestTrend ? (
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 text-primary"
              >
                {formatPercentValue(strongestTrend.trend_score)}
              </Badge>
            ) : undefined
          }
        >
          {strongestTrend ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {strongestTrend.main_keyword}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy(
                    "Average views per hour",
                    "Lượt xem trung bình mỗi giờ",
                  )}
                  : {formatCompactNumber(strongestTrend.avg_views_per_hour)}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {strongestTrend.why_the_trend_happens}
                </p>
              </div>

              <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Suggested move", "Hành động đề xuất")}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {strongestTrend.recommended_action}
                </p>
              </div>
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend signal is available yet.",
                "Chưa có tín hiệu trend khả dụng.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Hashtag Pulse", "Nhịp hashtag")}
          description={copy(
            "Tags that repeatedly appear across active trend signals.",
            "Các hashtag lặp lại nhiều lần trong nhóm tín hiệu xu hướng.",
          )}
        >
          <div className="space-y-3">
            {anyLoading ? (
              <PanelRowsSkeleton rows={5} />
            ) : repeatedHashtags.length > 0 ? (
              repeatedHashtags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{tag}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Repeated", "Lặp lại")}: {count}{" "}
                    {copy("signals", "tín hiệu")}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No repeated hashtag pattern found.",
                  "Chưa phát hiện mẫu hashtag lặp lại.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <PanelCard
        title={copy(
          "Recent Activity Timeline",
          "Dòng thời gian hoạt động gần đây",
        )}
        description={copy(
          "Latest trend sessions and published jobs to cross-check audience direction.",
          "Các phiên trend và job xuất bản gần nhất để đối chiếu hướng khán giả.",
        )}
      >
        <div className="space-y-3">
          {trendHistoryQuery.data?.items.slice(0, 4).map((record) => (
            <div
              key={record.analysis_id ?? `${record.query}-${record.created_at}`}
              className="rounded-2xl border border-border/65 bg-background/65 p-4"
            >
              <p className="text-sm font-semibold text-foreground">
                {record.query}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy("Trend session", "Phiên trend")}:{" "}
                {formatDateTime(record.created_at)}
              </p>
            </div>
          ))}

          {publishedJobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-border/65 bg-background/65 p-4"
            >
              <p className="text-sm font-semibold text-foreground">
                {job.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy("Published at", "Đăng lúc")}:{" "}
                {formatDateTime(job.schedule_post ?? job.created_at)}
              </p>
            </div>
          ))}

          {(trendHistoryQuery.data?.items.length ?? 0) === 0 &&
          publishedJobs.length === 0 ? (
            <InlineQueryState
              state="empty"
              message={copy(
                "No recent trend or publish activity found.",
                "Chưa có hoạt động trend hoặc xuất bản gần đây.",
              )}
            />
          ) : null}
        </div>
      </PanelCard>
    </div>
  );
}
