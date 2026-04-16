import { useMemo } from "react";
import {
  Activity,
  Bot,
  Database,
  RefreshCcw,
  Sparkles,
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
  BarTrendChart,
  HeatMatrix,
  LineTrendChart,
} from "@/components/app-data-viz";
import {
  InlineQueryState,
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
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { DashboardKeywordPriorityPanel } from "@/pages/dashboard/components/DashboardKeywordPriorityPanel";
import { DashboardRecentActivityFeedPanel } from "@/pages/dashboard/components/DashboardRecentActivityFeedPanel";

const EMPTY_TREND_RECORDS: TrendAnalysisRecordResponse[] = [];
const EMPTY_GENERATED_CONTENTS: GeneratedContentResponse[] = [];
const EMPTY_PUBLISH_JOBS: PublishJobResponse[] = [];
const EMPTY_USERS: UserSummaryResponse[] = [];

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getTrendAverageScore(record: TrendAnalysisRecordResponse) {
  if (record.results.length === 0) {
    return 0;
  }

  const totalScore = record.results.reduce(
    (sum, item) => sum + item.trend_score,
    0,
  );

  return totalScore / record.results.length;
}

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
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const pendingJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;

  const completedPublishJobs = publishedJobs + failedJobs;
  const publishSuccessRatio =
    completedPublishJobs > 0 ? publishedJobs / completedPublishJobs : 0;

  const trendMomentumChartData = useMemo(() => {
    const points = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(left.created_at) - toTimestamp(right.created_at),
      )
      .slice(-10);

    return {
      labels: points.map((point) => {
        const date = new Date(point.created_at);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: copy("Average Trend Score", "Điểm trend trung bình"),
          data: points.map((point) => getTrendAverageScore(point)),
          borderColor: "rgba(14, 165, 233, 0.92)",
          backgroundColor: "rgba(14, 165, 233, 0.22)",
          tension: 0.38,
          fill: true,
          pointRadius: 3,
        },
      ],
    };
  }, [copy, trendRecords]);

  const publishStatusChartData = useMemo(
    () => ({
      labels: [
        copy("Pending", "Đang chờ"),
        copy("Published", "Đã đăng"),
        copy("Failed", "Thất bại"),
      ],
      datasets: [
        {
          label: copy("Publishing Tasks", "Tác vụ đăng"),
          data: [pendingJobs, publishedJobs, failedJobs],
          backgroundColor: [
            "rgba(245, 158, 11, 0.78)",
            "rgba(16, 185, 129, 0.78)",
            "rgba(244, 63, 94, 0.78)",
          ],
          borderRadius: 10,
        },
      ],
    }),
    [copy, failedJobs, pendingJobs, publishedJobs],
  );

  const userHeatMatrix = useMemo(() => {
    const limitedUsers = users.slice(0, 6);

    if (limitedUsers.length === 0) {
      return {
        rows: [copy("No User", "Chưa có user")],
        columns: [
          copy("Trend", "Trend"),
          copy("Content", "Nội dung"),
          copy("Publish", "Publish"),
        ],
        values: [[0, 0, 0]],
      };
    }

    return {
      rows: limitedUsers.map((user) => user.email),
      columns: [
        copy("Trend", "Trend"),
        copy("Content", "Nội dung"),
        copy("Publish", "Publish"),
      ],
      values: limitedUsers.map((user) => [
        user.trend_analysis_count,
        user.generated_content_count,
        user.publish_job_count,
      ]),
    };
  }, [copy, users]);

  const topKeywordScore = useMemo(() => {
    let highestScore = 0;

    for (const record of trendRecords) {
      for (const result of record.results) {
        if (result.trend_score > highestScore) {
          highestScore = result.trend_score;
        }
      }
    }

    return highestScore;
  }, [trendRecords]);

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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PanelCard
          title={copy("Trend Momentum", "Đà tăng xu hướng")}
          description={copy(
            "See how hot your recent trend opportunities are moving.",
            "Xem mức độ tăng nhiệt của các cơ hội xu hướng gần đây.",
          )}
        >
          {trendRecords.length > 0 ? (
            <LineTrendChart data={trendMomentumChartData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend activity yet.",
                "Chưa có hoạt động xu hướng.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Publishing Mix", "Tình hình đăng bài")}
          description={copy(
            "Distribution of pending, successful, and failed posting tasks.",
            "Phân bố tác vụ đăng: chờ xử lý, thành công và thất bại.",
          )}
        >
          {publishJobs.length > 0 ? (
            <BarTrendChart data={publishStatusChartData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No publishing tasks yet.",
                "Chưa có tác vụ đăng bài.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <DashboardKeywordPriorityPanel trendRecords={trendRecords} />

        <PanelCard
          title={copy("User Activity Matrix", "Ma trận hoạt động user")}
          description={copy(
            "Understand which account is producing trends, content, and publishing output.",
            "Xem tài khoản nào đang đóng góp nhiều nhất cho xu hướng, nội dung và đăng bài.",
          )}
        >
          <HeatMatrix
            rows={userHeatMatrix.rows}
            columns={userHeatMatrix.columns}
            values={userHeatMatrix.values}
            valueFormatter={(value) => formatCompactNumber(value)}
          />
        </PanelCard>
      </div>

      <div className="grid gap-8">
        <DashboardRecentActivityFeedPanel
          trendRecords={trendRecords}
          generatedContents={generatedContents}
          publishJobs={publishJobs}
          isLoading={isLoading}
        />
      </div>

      <PanelCard
        title={copy("Today Snapshot", "Snapshot hôm nay")}
        description={copy(
          "A quick pulse so you know where to act next.",
          "Nhịp nhanh để bạn biết bước hành động tiếp theo.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Trend Analyses", "Phân tích xu hướng")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(trendRecords.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Generated Contents", "Nội dung đã tạo")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(generatedContents.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Publishing Tasks", "Tác vụ đăng bài")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(publishJobs.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Top Keyword Strength", "Độ mạnh keyword cao nhất")}
            </p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Sparkles className="size-5 text-amber-500" />
              {formatPercentValue(topKeywordScore)}
            </p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
