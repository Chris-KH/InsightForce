import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Gauge,
  ShieldCheck,
  Sparkles,
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
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

type StatusFilter = "all" | "pending" | "published" | "failed";

function getAssistantDisplayName(name: string) {
  if (name === "routing_orchestrator") {
    return "Điều phối chiến dịch";
  }

  if (name === "trend_agent") {
    return "Trợ lý xu hướng";
  }

  if (name === "content_agent") {
    return "Trợ lý nội dung";
  }

  if (name === "posting_agent") {
    return "Trợ lý đăng bài";
  }

  return name.replaceAll("_", " ");
}

export function OpsControlPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 20 });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") {
      return publishJobs;
    }

    return publishJobs.filter(
      (job) => job.status.toLowerCase() === statusFilter,
    );
  }, [publishJobs, statusFilter]);

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Operations Control", vi: "Điều phối vận hành" }}
        description={{
          en: "A simple control board for creators: check team readiness, watch posting flow, and act fast when something needs attention.",
          vi: "Bảng điều phối đơn giản cho creator: kiểm tra đội trợ lý, theo dõi tiến độ đăng bài và xử lý nhanh khi có việc cần chú ý.",
        }}
        badge={{ en: "Creator Control Board", vi: "Bảng điều phối creator" }}
        icon={Activity}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load operations data right now.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("System Pulse", "Nhịp hệ thống")}
            value={(healthQuery.data?.status ?? "unknown").toUpperCase()}
            icon={<ShieldCheck className="size-5" />}
            detail={copy(
              "Everything needed for daily work",
              "Mức sẵn sàng cho công việc hằng ngày",
            )}
          />
          <MetricCard
            label={copy("Ready Assistants", "Trợ lý sẵn sàng")}
            value={`${reachableCount}/${processes.length}`}
            icon={<Bot className="size-5" />}
            detail={copy(
              "Your support team is online",
              "Đội hỗ trợ của bạn đang trực tuyến",
            )}
          />
          <MetricCard
            label={copy("Posting Quality", "Chất lượng đăng bài")}
            value={formatPercentFromRatio(publishSuccessRatio)}
            icon={<Gauge className="size-5" />}
            detail={copy(
              "Based on recent publishing outcomes",
              "Tính theo kết quả đăng gần đây",
            )}
          />
          <MetricCard
            label={copy("Needs Attention", "Mục cần xử lý")}
            value={formatCompactNumber(pendingJobs.length + failedJobs.length)}
            icon={<Clock3 className="size-5" />}
            detail={copy(
              "Pending and failed tasks",
              "Các mục chờ và lỗi cần theo dõi",
            )}
          />
        </div>
      ) : null}

      <PanelCard
        title={copy("Quick Actions", "Hành động nhanh")}
        description={copy(
          "Jump to the actions creators care about most.",
          "Đi nhanh vào những thao tác creator quan tâm nhất.",
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Button asChild>
            <Link to="/app/strategy-lab">
              <Sparkles data-icon="inline-start" />
              {copy("Create New Strategy", "Tạo chiến lược mới")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/publish-ops">
              <Clock3 data-icon="inline-start" />
              {copy("Open Publish Board", "Mở bảng đăng bài")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/automation">
              <Activity data-icon="inline-start" />
              {copy("Review Automation", "Xem tự động hóa")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/dashboard">
              <Gauge data-icon="inline-start" />
              {copy("Back To Overview", "Về trang tổng quan")}
            </Link>
          </Button>
        </div>
      </PanelCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Assistant Readiness", "Mức sẵn sàng trợ lý")}
          description={copy(
            "See which assistants are ready to help your campaign today.",
            "Xem trợ lý nào đã sẵn sàng hỗ trợ chiến dịch của bạn hôm nay.",
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
                    {getAssistantDisplayName(process.name)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {process.reachable
                      ? copy(
                          "Sẵn sàng xử lý yêu cầu ngay bây giờ.",
                          "Sẵn sàng xử lý yêu cầu ngay bây giờ.",
                        )
                      : copy(
                          "Tạm thời gián đoạn, hệ thống sẽ tự thử lại.",
                          "Tạm thời gián đoạn, hệ thống sẽ tự thử lại.",
                        )}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium",
                      process.reachable ? "text-emerald-600" : "text-amber-600",
                    )}
                  >
                    {process.reachable
                      ? copy("Online", "Đang hoạt động")
                      : copy("Recovering", "Đang khôi phục")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Publishing Flow", "Dòng chảy đăng bài")}
          description={copy(
            "Follow your recent posting tasks and focus on what needs action first.",
            "Theo dõi các tác vụ đăng bài gần đây và ưu tiên phần cần xử lý trước.",
          )}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {(["all", "pending", "published", "failed"] as const).map(
              (status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/45 bg-primary/10 text-primary"
                        : "border-border/70 bg-background/70 text-muted-foreground",
                    )}
                  >
                    {status}
                  </button>
                );
              },
            )}
          </div>

          {publishJobsQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.slice(0, 8).map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Channel", "Kênh")}: {job.platforms.join(", ")}
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
                "No posting task found for this filter.",
                "Không có tác vụ đăng bài phù hợp với bộ lọc này.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Activity", "Hoạt động xu hướng")}
          description={copy(
            "Recent trend analyses your team has completed.",
            "Các lần phân tích xu hướng gần đây đội của bạn đã hoàn thành.",
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
                    {copy("Created", "Khởi tạo")}:{" "}
                    {formatDateTime(record.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Insights", "Số insight")}: {record.results.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend activity yet.",
                "Chưa có hoạt động phân tích xu hướng.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Content Activity", "Hoạt động nội dung")}
          description={copy(
            "Latest generated content entries ready for publishing steps.",
            "Những nội dung mới tạo, sẵn sàng cho bước đăng bài tiếp theo.",
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
                    {record.main_title ||
                      record.selected_keyword ||
                      copy("Untitled", "Chưa đặt tiêu đề")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Khởi tạo")}:{" "}
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
                "No content activity yet.",
                "Chưa có hoạt động tạo nội dung.",
              )}
            />
          )}
        </PanelCard>
      </div>
    </div>
  );
}
