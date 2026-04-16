import { useMemo } from "react";
import { BarChart3, Coins, Eye, History, Sparkles, Wallet } from "lucide-react";

import {
  useGeneratedContentsQuery,
  useTrendGeneralQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import {
  BarTrendChart,
  DoughnutTrendChart,
  LineTrendChart,
} from "@/components/app-data-viz";
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
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

const GENERAL_TREND_QUERY = "xu hướng mạng xã hội tổng quát hôm nay";

function groupJobsByDay(items: Array<{ created_at: string }>) {
  const buckets = new Map<string, number>();

  for (const item of items) {
    const date = item.created_at.slice(0, 10);
    buckets.set(date, (buckets.get(date) ?? 0) + 1);
  }

  return [...buckets.entries()].sort((left, right) =>
    left[0].localeCompare(right[0]),
  );
}

export function FinancePage() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const trendGeneralQuery = useTrendGeneralQuery({
    query: GENERAL_TREND_QUERY,
    limit: 5,
  });
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 40 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 60 });

  const allQueries = [
    usersQuery,
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

  const publishJobs = publishJobsQuery.data?.items ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];
  const trendSignals = trendGeneralQuery.data?.results ?? [];

  const publishedJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const failedJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const pendingJobsCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;

  const completedJobs = publishedJobsCount + failedJobsCount;
  const publishSuccessRatio =
    completedJobs > 0 ? publishedJobsCount / completedJobs : 0;

  const averageTrendScore = trendSignals.length
    ? trendSignals.reduce((sum, item) => sum + item.trend_score, 0) /
      trendSignals.length
    : 0;

  const jobsTimeline = groupJobsByDay(publishJobs).slice(-10);

  const jobsTimelineData = useMemo(
    () => ({
      labels: jobsTimeline.map(([date]) => date.slice(5)),
      datasets: [
        {
          label: copy("Jobs", "Công việc"),
          data: jobsTimeline.map(([, value]) => value),
          borderColor: "rgba(6, 182, 212, 0.9)",
          backgroundColor: "rgba(6, 182, 212, 0.2)",
          tension: 0.36,
          fill: true,
          pointRadius: 3,
        },
      ],
    }),
    [copy, jobsTimeline],
  );

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
            "rgba(248, 113, 113, 0.74)",
          ],
          borderWidth: 0,
        },
      ],
    }),
    [copy, failedJobsCount, pendingJobsCount, publishedJobsCount],
  );

  const trendBarData = useMemo(
    () => ({
      labels: trendSignals.map((item) => item.main_keyword),
      datasets: [
        {
          label: copy("Trend score", "Điểm xu hướng"),
          data: trendSignals.map((item) => item.trend_score),
          backgroundColor: "rgba(59, 130, 246, 0.76)",
          borderRadius: 10,
        },
      ],
    }),
    [copy, trendSignals],
  );

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Finance Intelligence", "Trí tuệ tài chính")}
        title={copy("Creator Finance Control", "Điều phối tài chính creator")}
        description={copy(
          "Financial health from delivery outcomes, throughput, and trend momentum instead of deprecated profile/account endpoints.",
          "Sức khỏe tài chính được đo từ kết quả xuất bản, thông lượng nội dung và động lượng trend thay vì các endpoint profile/account đã loại bỏ.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {copy("Clean API Surface", "Bề mặt API đã làm sạch")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Finance Data Error", "Lỗi dữ liệu tài chính")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load finance metrics.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Accounts", "Tài khoản")}
            value={formatCompactNumber(usersQuery.data?.users.length ?? 0)}
            icon={<Wallet className="size-5" />}
            detail={copy(
              "Available workspace identities",
              "Danh tính workspace khả dụng",
            )}
          />
          <MetricCard
            label={copy("Publishing Success", "Tỷ lệ xuất bản thành công")}
            value={formatPercentFromRatio(publishSuccessRatio)}
            icon={<Coins className="size-5" />}
            detail={copy(
              "Published / completed jobs",
              "Published trên tổng job đã hoàn tất",
            )}
          />
          <MetricCard
            label={copy("Content Throughput", "Thông lượng nội dung")}
            value={formatCompactNumber(generatedContents.length)}
            icon={<History className="size-5" />}
            detail={copy(
              "Generated content in current window",
              "Nội dung đã tạo trong cửa sổ hiện tại",
            )}
          />
          <MetricCard
            label={copy("Trend Momentum", "Động lượng xu hướng")}
            value={formatPercentValue(averageTrendScore)}
            icon={<Eye className="size-5" />}
            detail={copy(
              "Average score from live trend map",
              "Điểm trung bình từ bản đồ trend trực tiếp",
            )}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Publishing Trendline", "Đường xu hướng xuất bản")}
          description={copy(
            "Daily number of publish jobs to monitor execution rhythm.",
            "Số lượng publish job theo ngày để theo dõi nhịp thực thi.",
          )}
        >
          {jobsTimeline.length > 0 ? (
            <LineTrendChart
              data={jobsTimelineData}
              className="bg-linear-to-br from-cyan-100/60 via-card to-sky-100/45 dark:from-cyan-500/12 dark:via-card/90 dark:to-sky-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No timeline data for publish jobs yet.",
                "Chưa có dữ liệu timeline cho publish job.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Publish Outcome Mix", "Tỷ trọng kết quả xuất bản")}
          description={copy(
            "Share of published, pending, and failed jobs.",
            "Tỷ trọng các job published, pending và failed.",
          )}
        >
          {publishJobs.length > 0 ? (
            <DoughnutTrendChart
              data={publishMixData}
              className="bg-linear-to-br from-emerald-100/55 via-card to-amber-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-amber-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No publish jobs available.",
                "Chưa có publish job khả dụng.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Investment Priority", "Ưu tiên đầu tư theo trend")}
          description={copy(
            "Use trend score to decide which themes deserve production budget first.",
            "Dùng điểm trend để quyết định chủ đề nào nên ưu tiên ngân sách sản xuất.",
          )}
        >
          {trendSignals.length > 0 ? (
            <BarTrendChart
              data={trendBarData}
              className="bg-linear-to-br from-indigo-100/55 via-card to-blue-100/45 dark:from-indigo-500/12 dark:via-card/90 dark:to-blue-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend score data available.",
                "Chưa có dữ liệu điểm trend.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy(
            "Recent Financially Relevant Activity",
            "Hoạt động gần đây liên quan tài chính",
          )}
          description={copy(
            "Recent publish jobs and trend sessions that can impact your spending decisions.",
            "Các publish job và phiên trend gần đây có thể ảnh hưởng quyết định chi phí.",
          )}
        >
          {isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : (
            <div className="space-y-3">
              {publishJobs.slice(0, 5).map((job) => (
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
                    {copy("Created", "Tạo lúc")}:{" "}
                    {formatDateTime(job.created_at)}
                  </p>
                </div>
              ))}

              {trendHistoryQuery.data?.items.slice(0, 3).map((record) => (
                <div
                  key={
                    record.analysis_id ?? `${record.query}-${record.created_at}`
                  }
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {record.query}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Trend session", "Phiên trend")}:{" "}
                    {formatDateTime(record.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Insights", "Số insight")}: {record.results.length}
                  </p>
                </div>
              ))}

              {publishJobs.length === 0 &&
              (trendHistoryQuery.data?.items.length ?? 0) === 0 ? (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No activity found yet.",
                    "Chưa có hoạt động nào.",
                  )}
                />
              ) : null}
            </div>
          )}
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Finance Notes", "Ghi chú tài chính")}
        description={copy(
          "Deprecated Upload-Post account/profile endpoints were removed from this view to match backend documentation.",
          "Các endpoint Upload-Post account/profile đã bị loại khỏi trang này để khớp với tài liệu backend.",
        )}
      >
        <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="size-4 text-primary" />
            {copy("Current source of truth", "Nguồn dữ liệu hiện hành")}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy(
              "This page now uses users, trends, generated contents, and publish jobs only.",
              "Trang này hiện chỉ dùng users, trends, generated contents và publish jobs.",
            )}
          </p>
        </div>
      </PanelCard>
    </div>
  );
}
