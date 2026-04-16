import { useMemo } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  RefreshCcw,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  type TrendAnalysisRecordResponse,
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
  formatPercentFromRatio,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

type PipelineEvent = {
  id: string;
  type: "trend" | "content" | "publish";
  title: string;
  createdAt: string;
  status: string;
};

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

function eventTypeClass(type: PipelineEvent["type"]) {
  if (type === "trend") {
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-700";
  }

  if (type === "content") {
    return "border-violet-500/40 bg-violet-500/10 text-violet-700";
  }

  return "border-amber-500/40 bg-amber-500/10 text-amber-700";
}

export function DashboardPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 30 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 30 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });
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

  const trendRecords = trendHistoryQuery.data?.items ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];
  const publishJobs = publishJobsQuery.data?.items ?? [];
  const users = usersQuery.data?.users ?? [];

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
          label: copy("Publish Jobs", "Publish jobs"),
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

  const keywordPulse = useMemo(() => {
    const collector = new Map<string, { score: number; count: number }>();

    for (const record of trendRecords) {
      for (const result of record.results) {
        const current = collector.get(result.main_keyword);

        if (current) {
          current.count += 1;
          current.score = Math.max(current.score, result.trend_score);
        } else {
          collector.set(result.main_keyword, {
            count: 1,
            score: result.trend_score,
          });
        }
      }
    }

    return [...collector.entries()]
      .map(([keyword, stats]) => ({ keyword, ...stats }))
      .sort(
        (left, right) => right.score - left.score || right.count - left.count,
      )
      .slice(0, 8);
  }, [trendRecords]);

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

  const pipelineEvents = useMemo(() => {
    const trendEvents: PipelineEvent[] = trendRecords
      .slice(0, 8)
      .map((item) => ({
        id: item.analysis_id ?? `${item.query}-${item.created_at}`,
        type: "trend",
        title: item.query,
        createdAt: item.created_at,
        status: item.status,
      }));

    const contentEvents: PipelineEvent[] = generatedContents
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        type: "content",
        title: item.main_title || item.selected_keyword || item.id,
        createdAt: item.created_at,
        status: item.status,
      }));

    const publishEvents: PipelineEvent[] = publishJobs
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        type: "publish",
        title: item.title,
        createdAt: item.created_at,
        status: item.status,
      }));

    return [...trendEvents, ...contentEvents, ...publishEvents]
      .sort(
        (left, right) =>
          toTimestamp(right.createdAt) - toTimestamp(left.createdAt),
      )
      .slice(0, 14);
  }, [generatedContents, publishJobs, trendRecords]);

  const handleRefresh = async () => {
    await Promise.all(allQueries.map((query) => query.refetch()));
  };

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Backend Runtime", "Runtime backend")}
        title={copy(
          "Unified Intelligence Dashboard",
          "Dashboard intelligence hợp nhất",
        )}
        description={copy(
          "Overview built from active FastAPI modules: health, agents, trends history, generated contents, users, and publish jobs.",
          "Tổng quan xây trên các module FastAPI đang hoạt động: health, agents, trends history, generated contents, users và publish jobs.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
            >
              <PulseDot className="mr-2" />
              {healthQuery.data?.status === "ok"
                ? copy("Backend Healthy", "Backend ổn định")
                : copy("Health Unknown", "Chưa rõ trạng thái")}
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
            "Unable to load dashboard runtime data.",
          )}
          hint={copy(
            "Check that FastAPI is running and frontend API base URL points to backend app.main service.",
            "Kiểm tra FastAPI đang chạy và API base URL frontend trỏ đúng service app.main của backend.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Service Health", "Sức khỏe dịch vụ")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            detail={healthQuery.data?.service ?? "InsightForce API"}
            icon={<Activity className="size-5" />}
          />
          <MetricCard
            label={copy("Reachable Agents", "Agent khả dụng")}
            value={`${reachableAgents}/${processes.length}`}
            detail={copy(
              "From /api/v1/agents/status",
              "Từ /api/v1/agents/status",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Persisted Records", "Record đã lưu")}
            value={formatCompactNumber(
              trendRecords.length + generatedContents.length,
            )}
            detail={copy(
              "Trend analyses + generated contents",
              "Trend analyses + generated contents",
            )}
            icon={<Database className="size-5" />}
          />
          <MetricCard
            label={copy("Publish Success", "Tỉ lệ publish")}
            value={formatPercentFromRatio(publishSuccessRatio)}
            detail={copy("Completed jobs only", "Tính trên jobs đã hoàn tất")}
            icon={<Workflow className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PanelCard
          title={copy("Trend Momentum", "Đà tăng trend")}
          description={copy(
            "Average trend score from recent analyses in /api/v1/trends/history.",
            "Điểm trend trung bình từ các phân tích gần đây trong /api/v1/trends/history.",
          )}
        >
          {trendRecords.length > 0 ? (
            <LineTrendChart data={trendMomentumChartData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend analysis records available yet.",
                "Chưa có record trend analysis.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy(
            "Publish Status Distribution",
            "Phân bố trạng thái publish",
          )}
          description={copy(
            "Current queue distribution from /api/v1/upload-post/publish-jobs.",
            "Phân bố queue hiện tại từ /api/v1/upload-post/publish-jobs.",
          )}
        >
          {publishJobs.length > 0 ? (
            <BarTrendChart data={publishStatusChartData} />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy("No publish jobs found.", "Không có publish jobs.")}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Keyword Pulse", "Nhịp keyword")}
          description={copy(
            "Most recurring high-score keywords extracted from trend history results.",
            "Các keyword có điểm cao xuất hiện lặp lại từ kết quả trend history.",
          )}
        >
          {keywordPulse.length > 0 ? (
            <div className="space-y-4">
              {keywordPulse.map((item, index) => (
                <div key={item.keyword}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {item.keyword}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentValue(item.score)} • {item.count}x
                    </p>
                  </div>
                  <ProgressBar
                    value={Math.min(item.score, 100)}
                    tone={index % 2 === 0 ? "primary" : "secondary"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No keyword pulse data available.",
                "Không có dữ liệu keyword pulse.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("User Activity Matrix", "Ma trận hoạt động user")}
          description={copy(
            "Per-user activity counters from /api/v1/users.",
            "Chỉ số hoạt động theo user từ /api/v1/users.",
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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <PanelCard
          title={copy("Recent Pipeline Events", "Sự kiện pipeline gần đây")}
          description={copy(
            "Merged event stream across trends, generated contents, and publish jobs.",
            "Luồng sự kiện hợp nhất từ trends, generated contents và publish jobs.",
          )}
        >
          {isLoading && pipelineEvents.length === 0 ? (
            <PanelRowsSkeleton rows={6} />
          ) : pipelineEvents.length > 0 ? (
            <div className="space-y-3">
              {pipelineEvents.map((event) => (
                <div
                  key={`${event.type}-${event.id}`}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full capitalize",
                        eventTypeClass(event.type),
                      )}
                    >
                      {event.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Status: {event.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No events in current runtime window.",
                "Không có sự kiện trong cửa sổ runtime hiện tại.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Agent Reachability", "Khả năng kết nối agent")}
          description={copy(
            "Connectivity status for configured agent runtimes.",
            "Trạng thái kết nối của các runtime agent cấu hình sẵn.",
          )}
        >
          {agentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : processes.length > 0 ? (
            <div className="space-y-3">
              {processes.map((process) => (
                <div
                  key={process.name}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {process.reachable ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <Clock3 className="size-4 text-amber-600" />
                    )}
                    {process.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {process.url}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {process.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No agent process status reported.",
                "Không có trạng thái process agent.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Runtime Snapshot", "Snapshot runtime")}
        description={copy(
          "One-line pulse of backend persistence and queue execution health.",
          "Nhịp nhanh một dòng về dữ liệu lưu trữ backend và sức khỏe queue thực thi.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Trend Analyses", "Trend analyses")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(trendRecords.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Generated Contents", "Generated contents")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(generatedContents.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Publish Jobs", "Publish jobs")}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCompactNumber(publishJobs.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Top Keyword Score", "Điểm keyword cao nhất")}
            </p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Sparkles className="size-5 text-amber-500" />
              {keywordPulse[0]
                ? formatPercentValue(keywordPulse[0].score)
                : "0%"}
            </p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
