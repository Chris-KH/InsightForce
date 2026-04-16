import { Activity, Bot, Database, RefreshCcw, Workflow } from "lucide-react";

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
import { MetricCard, SectionHeader } from "@/components/app-section";
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
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const completedPublishJobs = publishedJobs + failedJobs;
  const publishSuccessRatio =
    completedPublishJobs > 0 ? publishedJobs / completedPublishJobs : 0;

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
