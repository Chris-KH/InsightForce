import { useMemo } from "react";
import { Link } from "react-router";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock3,
  Send,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  useAgentsStatusQuery,
  useGeneratedContentsQuery,
  useHealthQuery,
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
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { AutomationLatestOrchestrationOutput } from "@/pages/automation/components/AutomationLatestOrchestrationOutput";
import { AutomationOrchestrationControlSection } from "@/pages/automation/components/AutomationOrchestrationControlSection";
import { PublishWorkspaceSection } from "@/pages/automation/components/PublishWorkspaceSection";

export function AutomationPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsStatusQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });

  const publishJobs = publishJobsQuery.data?.items ?? [];
  const pendingCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;
  const publishedCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const failedCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;

  const doneCount = publishedCount + failedCount;
  const successRatio = doneCount > 0 ? publishedCount / doneCount : 0;

  const processes = agentsStatusQuery.data?.processes ?? [];
  const onlineAgentsCount = processes.filter(
    (process) => process.reachable,
  ).length;

  const queueBarData = {
    labels: [
      copy("Pending", "Đang chờ"),
      copy("Published", "Đã đăng"),
      copy("Failed", "Lỗi"),
    ],
    datasets: [
      {
        label: copy("Jobs", "Công việc"),
        data: [pendingCount, publishedCount, failedCount],
        backgroundColor: [
          "rgba(245, 158, 11, 0.78)",
          "rgba(16, 185, 129, 0.82)",
          "rgba(248, 113, 113, 0.75)",
        ],
        borderRadius: 10,
      },
    ],
  };

  const agentsMixData = useMemo(
    () => ({
      labels: [copy("Online", "Hoạt động"), copy("Unavailable", "Gián đoạn")],
      datasets: [
        {
          data: [
            onlineAgentsCount,
            Math.max(processes.length - onlineAgentsCount, 0),
          ],
          backgroundColor: [
            "rgba(20, 184, 166, 0.8)",
            "rgba(251, 146, 60, 0.75)",
          ],
          borderWidth: 0,
        },
      ],
    }),
    [copy, onlineAgentsCount, processes.length],
  );

  const allQueries = [
    healthQuery,
    agentsStatusQuery,
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
        eyebrow={copy("Automation Ops", "Vận hành tự động")}
        title={copy("Automation Command Center", "Trung tâm điều phối tự động")}
        description={copy(
          "Control creator automation using health checks, agent readiness, orchestration runs, and publishing queue outcomes.",
          "Điều phối tự động hóa cho creator dựa trên health check, trạng thái agent, phiên orchestration và kết quả hàng đợi xuất bản.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {copy("Docs-Compliant Runtime", "Runtime tuân thủ docs")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Automation Data Error", "Lỗi dữ liệu tự động hóa")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load automation metrics.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("System Health", "Sức khỏe hệ thống")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            detail={copy(
              "Backend service heartbeat",
              "Nhịp trạng thái dịch vụ backend",
            )}
            icon={<Server className="size-5" />}
          />
          <MetricCard
            label={copy("Ready Agents", "Agent sẵn sàng")}
            value={`${onlineAgentsCount}/${processes.length}`}
            detail={copy(
              "Agent processes responding",
              "Số process agent phản hồi",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Publish Success", "Tỷ lệ xuất bản thành công")}
            value={formatPercentFromRatio(successRatio)}
            detail={copy(
              "From finished publish jobs",
              "Tính trên các publish job đã hoàn tất",
            )}
            icon={<CheckCircle2 className="size-5" />}
          />
          <MetricCard
            label={copy("Pending Queue", "Hàng đợi chờ xử lý")}
            value={formatCompactNumber(pendingCount)}
            detail={copy(
              "Jobs waiting for completion",
              "Số công việc đang chờ hoàn tất",
            )}
            icon={<Clock3 className="size-5" />}
          />
        </div>
      )}

      <AutomationOrchestrationControlSection />

      <PanelCard
        title={copy("Quick Navigation", "Điều hướng nhanh")}
        description={copy(
          "Open the next core workspace based on your current operation state.",
          "Mở nhanh workspace cốt lõi tiếp theo theo trạng thái vận hành hiện tại.",
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Button asChild>
            <Link to="/app/strategy">
              <Activity data-icon="inline-start" />
              {copy("Open Strategy", "Mở chiến lược")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/audience">
              <Workflow data-icon="inline-start" />
              {copy("Open Audience", "Mở khách hàng")}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="sm:col-span-2 xl:col-span-1"
          >
            <Link to="/app/finance">
              <Send data-icon="inline-start" />
              {copy("Open Finance", "Mở tài chính")}
            </Link>
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-border/65 bg-background/65 p-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Recent Progress", "Tiến độ gần đây")}
          </p>
          <p className="mt-2 text-sm text-foreground">
            {copy("Trend sessions", "Phiên trend")}:{" "}
            {formatCompactNumber(trendHistoryQuery.data?.items.length ?? 0)}
          </p>
          <p className="mt-1 text-sm text-foreground">
            {copy("Generated content", "Nội dung đã tạo")}:{" "}
            {formatCompactNumber(
              generatedContentsQuery.data?.items.length ?? 0,
            )}
          </p>
        </div>
      </PanelCard>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Queue Health", "Sức khỏe hàng đợi")}
          description={copy(
            "Track queue pressure across pending, published, and failed jobs.",
            "Theo dõi áp lực hàng đợi giữa các trạng thái pending, published và failed.",
          )}
        >
          {publishJobs.length > 0 ? (
            <BarTrendChart
              data={queueBarData}
              className="bg-linear-to-br from-cyan-100/60 via-card to-emerald-100/45 dark:from-cyan-500/12 dark:via-card/90 dark:to-emerald-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No publish jobs found.",
                "Chưa có publish job nào.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Agent Readiness", "Mức sẵn sàng của agent")}
          description={copy(
            "Online versus recovering agent processes.",
            "Tỷ lệ process agent đang online và đang khôi phục.",
          )}
        >
          {processes.length > 0 ? (
            <DoughnutTrendChart
              data={agentsMixData}
              className="bg-linear-to-br from-indigo-100/55 via-card to-cyan-100/45 dark:from-indigo-500/12 dark:via-card/90 dark:to-cyan-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No process state available.",
                "Chưa có dữ liệu trạng thái process.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <AutomationLatestOrchestrationOutput />

      <PanelCard
        title={copy("Recent Publish Queue", "Hàng đợi xuất bản gần đây")}
        description={copy(
          "Latest publish jobs with status and planned schedule.",
          "Các publish job gần nhất với trạng thái và lịch dự kiến.",
        )}
      >
        {isLoading ? (
          <PanelRowsSkeleton rows={5} />
        ) : publishJobs.length > 0 ? (
          <div className="space-y-3">
            {publishJobs.slice(0, 8).map((job) => (
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
                  {copy("Platforms", "Nền tảng")}: {job.platforms.join(", ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Time", "Thời gian")}:{" "}
                  {formatDateTime(job.schedule_post ?? job.created_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No publish jobs available yet.",
              "Chưa có publish job khả dụng.",
            )}
          />
        )}
      </PanelCard>

      <PublishWorkspaceSection />
    </div>
  );
}
