import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock3,
  Loader2,
  PlayCircle,
  Send,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  useAgentsOrchestrateMutation,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

const DEFAULT_AUTOMATION_PROMPT =
  "Hãy đề xuất kế hoạch nội dung 7 ngày để tăng tương tác tự nhiên cho creator lifestyle.";

export function AutomationPage() {
  const copy = useBilingual();

  const [prompt, setPrompt] = useState(DEFAULT_AUTOMATION_PROMPT);
  const [userId, setUserId] = useState("");
  const [saveFiles, setSaveFiles] = useState(true);

  const healthQuery = useHealthQuery();
  const agentsStatusQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });
  const orchestrateMutation = useAgentsOrchestrateMutation();

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

  const queueBarData = useMemo(
    () => ({
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
    }),
    [copy, failedCount, pendingCount, publishedCount],
  );

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || orchestrateMutation.isPending) {
      return;
    }

    await orchestrateMutation.mutateAsync({
      prompt: normalizedPrompt,
      save_files: saveFiles,
      user_id: userId.trim() || undefined,
    });
  };

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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <PanelCard
          title={copy("Run Orchestration", "Chạy orchestration")}
          description={copy(
            "Kick off one end-to-end run from prompt to trend and content outputs.",
            "Khởi chạy một phiên end-to-end từ prompt đến đầu ra trend và nội dung.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="automation-prompt">
                {copy("Prompt", "Prompt")}
              </Label>
              <Textarea
                id="automation-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="automation-user-id">
                  {copy(
                    "Workspace User (optional)",
                    "User workspace (tùy chọn)",
                  )}
                </Label>
                <Input
                  id="automation-user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder={copy("User id", "Mã user")}
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={saveFiles}
                    onChange={(event) => setSaveFiles(event.target.checked)}
                    className="size-4 rounded border-border"
                  />
                  {copy("Save run files", "Lưu file kết quả")}
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy(
                    "Keep artifacts for later review by the operations team.",
                    "Giữ lại artifacts để đội vận hành xem lại sau.",
                  )}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={orchestrateMutation.isPending || !prompt.trim()}
            >
              {orchestrateMutation.isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <PlayCircle data-icon="inline-start" />
              )}
              {orchestrateMutation.isPending
                ? copy("Running...", "Đang chạy...")
                : copy("Run Automation", "Chạy tự động hóa")}
            </Button>

            {orchestrateMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  orchestrateMutation.error,
                  "Unable to complete orchestration run.",
                )}
              />
            ) : null}

            {orchestrateMutation.data ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {copy(
                    "Automation run completed",
                    "Phiên tự động hóa đã hoàn tất",
                  )}
                </p>
                <p className="mt-1.5">
                  {copy(
                    "Trend and content outputs were generated successfully.",
                    "Trend và nội dung đã được tạo thành công.",
                  )}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Quick Navigation", "Điều hướng nhanh")}
          description={copy(
            "Open the next workspace based on your current operation state.",
            "Mở nhanh workspace tiếp theo theo trạng thái vận hành hiện tại.",
          )}
        >
          <div className="grid gap-3">
            <Button asChild>
              <Link to="/app/strategy-lab">
                <Activity data-icon="inline-start" />
                {copy("Open Strategy Lab", "Mở Strategy Lab")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/publish-ops">
                <Workflow data-icon="inline-start" />
                {copy("Open Publish Ops", "Mở Publish Ops")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/ops-control">
                <Send data-icon="inline-start" />
                {copy("Open Ops Control", "Mở Ops Control")}
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
      </div>

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
    </div>
  );
}
