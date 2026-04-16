import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Gauge,
  ShieldCheck,
} from "lucide-react";

import {
  useAgentsStatusQuery,
  useGeneratedContentsQuery,
  useHealthQuery,
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
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

export function OpsControlPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 20 });

  const anyLoading =
    healthQuery.isLoading ||
    agentsQuery.isLoading ||
    trendHistoryQuery.isLoading ||
    generatedContentsQuery.isLoading ||
    publishJobsQuery.isLoading;

  const anyError =
    healthQuery.error ||
    agentsQuery.error ||
    trendHistoryQuery.error ||
    generatedContentsQuery.error ||
    publishJobsQuery.error;

  const processes = agentsQuery.data?.processes ?? [];
  const reachableCount = processes.filter(
    (process) => process.reachable,
  ).length;

  const trendRecords = trendHistoryQuery.data?.items ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];
  const publishJobs = publishJobsQuery.data?.items ?? [];

  const publishedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  );
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  );
  const pendingJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  );

  const completedJobs = publishedJobs.length + failedJobs.length;
  const publishSuccessRatio =
    completedJobs > 0 ? publishedJobs.length / completedJobs : 0;

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Operations Control", vi: "Điều phối vận hành" }}
        description={{
          en: "Unified monitoring lane for API health, agent connectivity, and publish queue execution built on the newest FastAPI backend routes.",
          vi: "Luồng giám sát hợp nhất cho sức khỏe API, kết nối agent và tiến độ publish queue dựa trên route FastAPI mới nhất.",
        }}
        badge={{ en: "Backend Runtime Board", vi: "Bảng runtime backend" }}
        icon={Activity}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load operations control data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Service Status", "Trạng thái dịch vụ")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            icon={<ShieldCheck className="size-5" />}
            detail={healthQuery.data?.service ?? "InsightForce API"}
          />
          <MetricCard
            label={copy("Reachable Agents", "Agent khả dụng")}
            value={`${reachableCount}/${processes.length}`}
            icon={<Bot className="size-5" />}
            detail={copy(
              "From /api/v1/agents/status",
              "Từ /api/v1/agents/status",
            )}
          />
          <MetricCard
            label={copy("Queue Success", "Tỉ lệ queue thành công")}
            value={formatPercentFromRatio(publishSuccessRatio)}
            icon={<Gauge className="size-5" />}
            detail={copy(
              "Published vs failed jobs",
              "Published so với failed jobs",
            )}
          />
          <MetricCard
            label={copy("Pending Jobs", "Job đang chờ")}
            value={formatCompactNumber(pendingJobs.length)}
            icon={<Clock3 className="size-5" />}
            detail={copy(
              "From /api/v1/upload-post/publish-jobs",
              "Từ /api/v1/upload-post/publish-jobs",
            )}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Agent Reachability", "Khả năng kết nối agent")}
          description={copy(
            "Monitor each runtime process before scheduling orchestrator or publishing workloads.",
            "Theo dõi từng process runtime trước khi chạy orchestrator hoặc lên lịch publish.",
          )}
        >
          {agentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : (
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
                      <AlertTriangle className="size-4 text-amber-600" />
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
          )}
        </PanelCard>

        <PanelCard
          title={copy("Publish Queue", "Publish queue")}
          description={copy(
            "Real-time status board for publish jobs created from /api/v1/upload-post/publish.",
            "Bảng trạng thái realtime cho publish jobs tạo từ /api/v1/upload-post/publish.",
          )}
        >
          {publishJobsQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : publishJobs.length > 0 ? (
            <div className="space-y-3">
              {publishJobs.slice(0, 8).map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {job.platforms.join(", ")}
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Scheduled", "Lịch chạy")}:{" "}
                    {formatDateTime(job.schedule_post ?? job.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID: {job.id}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy("No publish jobs found.", "Không có publish jobs.")}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Throughput", "Thông lượng trend")}
          description={copy(
            "Latest persisted analyses from /api/v1/trends/history.",
            "Các bản phân tích mới nhất đã lưu từ /api/v1/trends/history.",
          )}
        >
          {trendHistoryQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : trendRecords.length > 0 ? (
            <div className="space-y-3">
              {trendRecords.slice(0, 6).map((record) => (
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
                    {copy("Created", "Thời gian tạo")}:{" "}
                    {formatDateTime(record.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Result count", "Số kết quả")}:{" "}
                    {record.results.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend analyses found.",
                "Không có trend analysis.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Content Throughput", "Thông lượng nội dung")}
          description={copy(
            "Latest generated content saved by /api/v1/contents.",
            "Nội dung mới nhất được lưu bởi /api/v1/contents.",
          )}
        >
          {generatedContentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : generatedContents.length > 0 ? (
            <div className="space-y-3">
              {generatedContents.slice(0, 6).map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {record.main_title || record.selected_keyword || record.id}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Thời gian tạo")}:{" "}
                    {formatDateTime(record.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Status", "Trạng thái")}: {record.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No generated content found.",
                "Không có nội dung đã tạo.",
              )}
            />
          )}
        </PanelCard>
      </div>

      {!anyLoading && !anyError ? (
        <div className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-[0_16px_28px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Pipeline Snapshot", "Snapshot pipeline")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy("Recent records loaded", "Số record gần đây đã tải")}:{" "}
            {formatCompactNumber(
              trendRecords.length +
                generatedContents.length +
                publishJobs.length,
            )}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy("Published jobs", "Jobs đã publish")}:{" "}
            {formatCompactNumber(publishedJobs.length)}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy("Failed jobs", "Jobs thất bại")}:{" "}
            {formatCompactNumber(failedJobs.length)}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy("Pending jobs", "Jobs chờ xử lý")}:{" "}
            {formatCompactNumber(pendingJobs.length)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
