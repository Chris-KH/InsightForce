import {
  Activity,
  Bot,
  Clock3,
  Database,
  RefreshCcw,
  Target,
  Users,
  Workflow,
} from "lucide-react";

import {
  type GeneratedContentResponse,
  type PublishJobResponse,
  type TrendAnalysisRecordResponse,
  type UserSummaryResponse,
  useAgentsStatusQuery,
  useGeneratedContentsQuery,
  useHealthQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import { PulseDot } from "@/components/app-futuristic";
import {
  MetricCardsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { DashboardKeywordPriorityPanel } from "@/pages/dashboard/components/DashboardKeywordPriorityPanel";
import { DashboardRecentActivityFeedPanel } from "@/pages/dashboard/components/DashboardRecentActivityFeedPanel";
import { DashboardTodaySnapshotPanel } from "@/pages/dashboard/components/DashboardTodaySnapshotPanel";
import { DashboardTrendAndPublishChartsSection } from "@/pages/dashboard/components/DashboardTrendAndPublishChartsSection";
import { DashboardUserActivityMatrixPanel } from "@/pages/dashboard/components/DashboardUserActivityMatrixPanel";

const EMPTY_TREND_RECORDS: TrendAnalysisRecordResponse[] = [];
const EMPTY_GENERATED_CONTENTS: GeneratedContentResponse[] = [];
const EMPTY_PUBLISH_JOBS: PublishJobResponse[] = [];
const EMPTY_USERS: UserSummaryResponse[] = [];

export function DashboardPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 12 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 12 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 12 });
  const usersQuery = useUsersQuery();

  const allQueries = [
    healthQuery,
    agentsQuery,
    trendHistoryQuery,
    generatedContentsQuery,
    publishJobsQuery,
    usersQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );

  const firstError = allQueries.find((query) => query.error)?.error;

  const processes = agentsQuery.data?.processes ?? [];
  const reachableAgents = processes.filter(
    (process) => process.reachable,
  ).length;

  const trendRecords = trendHistoryQuery.data?.items ?? EMPTY_TREND_RECORDS;
  const generatedContents =
    generatedContentsQuery.data?.items ?? EMPTY_GENERATED_CONTENTS;
  const publishJobs = publishJobsQuery.data?.items ?? EMPTY_PUBLISH_JOBS;
  const users = usersQuery.data?.users ?? EMPTY_USERS;

  const publishedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const pendingJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const completedPublishJobs = publishedJobs + failedJobs;
  const publishSuccessRatio =
    completedPublishJobs > 0 ? publishedJobs / completedPublishJobs : 0;

  const topTrendSignal = (() => {
    let keyword: string | undefined;
    let score = 0;

    for (const record of trendRecords) {
      for (const result of record.results) {
        if (result.trend_score > score) {
          score = result.trend_score;
          keyword = result.main_keyword;
        }
      }
    }

    return { keyword, score };
  })();

  const topOperator = users.reduce<UserSummaryResponse | undefined>(
    (currentTop, candidate) => {
      const candidateTotal =
        candidate.trend_analysis_count +
        candidate.generated_content_count +
        candidate.publish_job_count;

      if (!currentTop) {
        return candidate;
      }

      const currentTotal =
        currentTop.trend_analysis_count +
        currentTop.generated_content_count +
        currentTop.publish_job_count;

      return candidateTotal > currentTotal ? candidate : currentTop;
    },
    undefined,
  );

  const operationVolume =
    trendRecords.length + generatedContents.length + publishJobs.length;

  const handleRefresh = async () => {
    await Promise.all([
      healthQuery.refetch(),
      agentsQuery.refetch(),
      trendHistoryQuery.refetch(),
      generatedContentsQuery.refetch(),
      publishJobsQuery.refetch(),
    ]);
  };

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Daily Creator View", "Góc nhìn creator mỗi ngày")}
        title={copy(
          "Your Campaign Command Center",
          "Trung tâm điều phối chiến dịch",
        )}
        description={copy(
          "Track what is trending, what is ready to publish, and where your team should focus next.",
          "Theo dõi chủ đề đang lên, nội dung sẵn sàng đăng và nơi đội của bạn cần tập trung tiếp theo.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
            >
              <PulseDot className="mr-2" />
              {healthQuery.data?.status === "ok"
                ? copy("Everything Is Running", "Mọi thứ đang hoạt động")
                : copy("Checking System", "Đang kiểm tra hệ thống")}
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
            "Unable to load dashboard data right now.",
          )}
          hint={copy(
            "You can keep working, then refresh this page in a moment.",
            "Bạn vẫn có thể làm việc, sau đó thử làm mới lại trang sau ít phút.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("System Readiness", "Mức sẵn sàng hệ thống")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            detail={copy(
              "Core services for your daily flow",
              "Các thành phần cốt lõi cho luồng làm việc hằng ngày",
            )}
            icon={<Activity className="size-5" />}
          />
          <MetricCard
            label={copy("Ready Assistants", "Trợ lý sẵn sàng")}
            value={`${reachableAgents}/${processes.length}`}
            detail={copy(
              "Support team currently online",
              "Đội trợ lý đang trực tuyến",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Idea Inventory", "Kho ý tưởng")}
            value={formatCompactNumber(
              trendRecords.length + generatedContents.length,
            )}
            detail={copy(
              "Trend insights and generated drafts",
              "Insight xu hướng và bản nháp đã tạo",
            )}
            icon={<Database className="size-5" />}
          />
          <MetricCard
            label={copy("Publishing Health", "Sức khỏe đăng bài")}
            value={formatPercentFromRatio(publishSuccessRatio)}
            detail={copy(
              "Quality of recent publishing tasks",
              "Chất lượng các tác vụ đăng gần đây",
            )}
            icon={<Workflow className="size-5" />}
          />
        </div>
      )}

      <PanelCard
        title={copy("Campaign Focus Board", "Bảng điều phối ưu tiên")}
        description={copy(
          "A fast decision layer combining strongest trend signal, execution backlog, and top operator activity.",
          "Lớp ra quyết định nhanh kết hợp tín hiệu trend mạnh nhất, backlog thực thi và tài khoản vận hành tích cực nhất.",
        )}
        className="border-primary/25 bg-linear-to-br from-primary/8 via-card/96 to-chart-2/12"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div className="rounded-2xl border border-primary/25 bg-background/70 p-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {copy("Primary Signal", "Tín hiệu ưu tiên")}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              {topTrendSignal.keyword ||
                copy("Awaiting trend signal", "Đang chờ tín hiệu xu hướng")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {topTrendSignal.keyword
                ? copy(
                    "Use this keyword as today's lead angle for your next publishing sprint.",
                    "Dùng keyword này làm góc khai thác chính cho sprint xuất bản kế tiếp trong hôm nay.",
                  )
                : copy(
                    "Run a trend analysis to reveal the strongest opportunity for this cycle.",
                    "Hãy chạy phân tích trend để mở ra cơ hội mạnh nhất cho chu kỳ hiện tại.",
                  )}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-primary/35 bg-primary/10 text-primary"
              >
                <Target className="mr-1.5 size-3.5" />
                {copy("Trend score", "Điểm trend")}:{" "}
                {formatCompactNumber(topTrendSignal.score)}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-amber-500/35 bg-amber-500/10 text-amber-700"
              >
                <Clock3 className="mr-1.5 size-3.5" />
                {copy("Pending jobs", "Job đang chờ")}:{" "}
                {formatCompactNumber(pendingJobs)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {copy("Top Operator", "Tài khoản vận hành dẫn đầu")}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                {topOperator?.email || "--"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy("Total outputs", "Tổng đầu ra")}:{" "}
                {formatCompactNumber(
                  (topOperator?.trend_analysis_count ?? 0) +
                    (topOperator?.generated_content_count ?? 0) +
                    (topOperator?.publish_job_count ?? 0),
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {copy("Current Volume", "Khối lượng hiện tại")}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatCompactNumber(operationVolume)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                {copy(
                  "Trend, content, and publish records in this window.",
                  "Tổng record trend, nội dung và publish trong cửa sổ hiện tại.",
                )}
              </p>
            </div>
          </div>
        </div>
      </PanelCard>

      <DashboardTrendAndPublishChartsSection
        trendRecords={trendRecords}
        publishJobs={publishJobs}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <DashboardKeywordPriorityPanel trendRecords={trendRecords} />
        <DashboardUserActivityMatrixPanel users={users} />
      </div>

      <div className="grid gap-8">
        <DashboardRecentActivityFeedPanel
          trendRecords={trendRecords}
          generatedContents={generatedContents}
          publishJobs={publishJobs}
          isLoading={isLoading}
        />
      </div>

      <DashboardTodaySnapshotPanel
        trendRecords={trendRecords}
        generatedContents={generatedContents}
        publishJobs={publishJobs}
      />
    </div>
  );
}
