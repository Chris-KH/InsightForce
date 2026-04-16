import { useEffect, useMemo, useState, type FormEvent } from "react";
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
  type TrendAnalyzeResultItem,
  useAgentsStatusQuery,
  useGeneratedContentsQuery,
  useHealthQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import {
  runAutomationOrchestration,
  setAutomationPrompt,
  setAutomationSaveFiles,
  setAutomationUserId,
} from "@/app/slices/runtime-tasks.slice";
import {
  formatPlatformLabel,
  normalizeGeneratedContent,
  summarizeCaptionLength,
  toPublishingWindowTokens,
} from "@/lib/orchestrator-intelligence";
import { PublishWorkspaceSection } from "@/pages/automation/components/PublishWorkspaceSection";
import { getQueryErrorMessage } from "@/lib/query-error";
import {
  extractInterestValues,
  sanitizeTrendResults,
} from "@/lib/trend-intelligence";
import { ReasoningTimeline } from "@/pages/strategy/components/ReasoningTimeline";

const INTEREST_CURVE_COLORS = [
  {
    border: "rgba(59, 130, 246, 0.95)",
    background: "rgba(59, 130, 246, 0.14)",
  },
  {
    border: "rgba(16, 185, 129, 0.92)",
    background: "rgba(16, 185, 129, 0.14)",
  },
  {
    border: "rgba(249, 115, 22, 0.9)",
    background: "rgba(249, 115, 22, 0.14)",
  },
];

function computeAverageTrendScore(results: TrendAnalyzeResultItem[]) {
  if (results.length === 0) {
    return 0;
  }

  return (
    results.reduce((total, result) => total + result.trend_score, 0) /
    results.length
  );
}

function buildInterestLabels(count: number) {
  return Array.from({ length: count }, (_, index) => `T${index + 1}`);
}

export function AutomationPage() {
  const copy = useBilingual();
  const dispatch = useAppDispatch();

  const automationForm = useAppSelector(
    (state) => state.runtimeTasks.automation.form,
  );
  const orchestrationTask = useAppSelector(
    (state) => state.runtimeTasks.automation.orchestration,
  );

  const [reasoningTick, setReasoningTick] = useState(() => Date.now());

  const prompt = automationForm.prompt;
  const userId = automationForm.userId;
  const saveFiles = automationForm.saveFiles;

  const healthQuery = useHealthQuery();
  const agentsStatusQuery = useAgentsStatusQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });

  const isOrchestrationPending = orchestrationTask.status === "pending";
  const latestOrchestrationResponse = orchestrationTask.data;
  const latestOrchestrationOutput = latestOrchestrationResponse?.output;

  const latestTrendResults = useMemo(
    () =>
      sanitizeTrendResults(latestOrchestrationOutput?.trend_analysis.results),
    [latestOrchestrationOutput?.trend_analysis.results],
  );

  const latestGeneratedContent = useMemo(
    () =>
      normalizeGeneratedContent(latestOrchestrationOutput?.generated_content),
    [latestOrchestrationOutput?.generated_content],
  );

  const averageLatestTrendScore = useMemo(
    () => computeAverageTrendScore(latestTrendResults),
    [latestTrendResults],
  );

  const latestTopTrend = latestTrendResults[0];

  const latestTrendBarData = useMemo(
    () => ({
      labels: latestTrendResults.map((result) => result.main_keyword),
      datasets: [
        {
          label: copy("Trend score", "Điểm trend"),
          data: latestTrendResults.map((result) => result.trend_score),
          borderRadius: 10,
          backgroundColor: [
            "rgba(59, 130, 246, 0.85)",
            "rgba(16, 185, 129, 0.82)",
            "rgba(249, 115, 22, 0.82)",
            "rgba(168, 85, 247, 0.82)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
    }),
    [copy, latestTrendResults],
  );

  const latestInterestLineData = useMemo(() => {
    const trendWithSeries = latestTrendResults
      .slice(0, 3)
      .map((result) => ({
        keyword: result.main_keyword,
        values: extractInterestValues(result),
      }))
      .filter((item) => item.values.length > 0);

    const maxSeriesLength = trendWithSeries.reduce(
      (maxLength, item) => Math.max(maxLength, item.values.length),
      0,
    );

    if (maxSeriesLength === 0) {
      return null;
    }

    return {
      labels: buildInterestLabels(maxSeriesLength),
      datasets: trendWithSeries.map((item, index) => {
        const palette =
          INTEREST_CURVE_COLORS[index % INTEREST_CURVE_COLORS.length];

        return {
          label: item.keyword,
          data: Array.from({ length: maxSeriesLength }, (_, pointIndex) => {
            const value = item.values[pointIndex];
            return Number.isFinite(value) ? value : 0;
          }),
          borderColor: palette.border,
          backgroundColor: palette.background,
          fill: true,
          tension: 0.32,
          pointRadius: 2.6,
          pointHoverRadius: 4,
          borderWidth: 2,
        };
      }),
    };
  }, [latestTrendResults]);

  const latestPlatformMixData = useMemo(() => {
    if (latestGeneratedContent.platformPosts.length === 0) {
      return null;
    }

    return {
      labels: latestGeneratedContent.platformPosts.map((post) =>
        formatPlatformLabel(post.platform),
      ),
      datasets: [
        {
          label: copy("Hashtag volume", "Khối lượng hashtag"),
          data: latestGeneratedContent.platformPosts.map((post) =>
            Math.max(post.hashtags.length, 1),
          ),
          backgroundColor: [
            "rgba(59, 130, 246, 0.82)",
            "rgba(16, 185, 129, 0.82)",
            "rgba(249, 115, 22, 0.82)",
            "rgba(236, 72, 153, 0.78)",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [copy, latestGeneratedContent.platformPosts]);

  const latestPublishingWindows = useMemo(
    () =>
      latestGeneratedContent.platformPosts.flatMap((post) => {
        const windows = toPublishingWindowTokens(post.bestPostTime);

        if (windows.length === 0) {
          return [];
        }

        return windows.map((windowLabel) => ({
          platform: formatPlatformLabel(post.platform),
          windowLabel,
        }));
      }),
    [latestGeneratedContent.platformPosts],
  );

  const latestHashtags = useMemo(() => {
    const allTags = latestTrendResults.flatMap((result) => result.top_hashtags);
    return [...new Set(allTags.map((tag) => tag.trim()).filter(Boolean))].slice(
      0,
      14,
    );
  }, [latestTrendResults]);

  const reasoningElapsedMs = useMemo(() => {
    if (!orchestrationTask.startedAt) {
      return 0;
    }

    if (isOrchestrationPending) {
      return Math.max(0, reasoningTick - orchestrationTask.startedAt);
    }

    const completedAt = orchestrationTask.completedAt ?? reasoningTick;
    return Math.max(0, completedAt - orchestrationTask.startedAt);
  }, [
    isOrchestrationPending,
    orchestrationTask.completedAt,
    orchestrationTask.startedAt,
    reasoningTick,
  ]);

  useEffect(() => {
    if (!isOrchestrationPending || !orchestrationTask.startedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setReasoningTick(Date.now());
    }, 180);

    return () => window.clearInterval(timer);
  }, [isOrchestrationPending, orchestrationTask.startedAt]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || isOrchestrationPending) {
      return;
    }

    await dispatch(
      runAutomationOrchestration({
        prompt: normalizedPrompt,
        saveFiles,
        userId: userId.trim() || undefined,
      }),
    );
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

      <section
        id="run-orchestration"
        className="relative grid scroll-mt-28 gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start"
      >
        <div className="xl:sticky xl:top-24">
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
                  onChange={(event) =>
                    dispatch(setAutomationPrompt(event.target.value))
                  }
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
                    onChange={(event) =>
                      dispatch(setAutomationUserId(event.target.value))
                    }
                    placeholder={copy("User id", "Mã user")}
                  />
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={saveFiles}
                      onChange={(event) =>
                        dispatch(setAutomationSaveFiles(event.target.checked))
                      }
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
                disabled={isOrchestrationPending || !prompt.trim()}
              >
                {isOrchestrationPending ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <PlayCircle data-icon="inline-start" />
                )}
                {isOrchestrationPending
                  ? copy("Running...", "Đang chạy...")
                  : copy("Run Automation", "Chạy tự động hóa")}
              </Button>

              {orchestrationTask.errorMessage ? (
                <InlineQueryState
                  state="error"
                  message={orchestrationTask.errorMessage}
                />
              ) : null}

              {latestOrchestrationResponse ? (
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
        </div>

        <PanelCard
          title={copy("Orchestration Reasoning", "Reasoning orchestration")}
          description={copy(
            "Live simulation of planning, trend synthesis, and content assembly while the run is processing.",
            "Mô phỏng trực tiếp quá trình lập kế hoạch, tổng hợp trend và dựng nội dung trong lúc phiên chạy đang xử lý.",
          )}
        >
          <ReasoningTimeline
            isPending={isOrchestrationPending}
            elapsedMs={reasoningElapsedMs}
            mode="orchestrator"
            promptPreview={prompt}
            copy={copy}
          />
        </PanelCard>
      </section>

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

      {latestOrchestrationResponse ? (
        <>
          <section
            id="latest-orchestration-output"
            className="grid scroll-mt-28 gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          >
            <PanelCard
              title={copy(
                "Latest Orchestration Output",
                "Output orchestration mới nhất",
              )}
              description={copy(
                "Freshly generated trend intelligence and content package from your latest run.",
                "Gói trend intelligence và nội dung vừa được tạo từ phiên chạy gần nhất.",
              )}
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                    {copy("Trend signals", "Tín hiệu trend")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatCompactNumber(latestTrendResults.length)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                    {copy("Average score", "Điểm trung bình")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatPercentFromRatio(averageLatestTrendScore / 100)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                    {copy("Storyboard sections", "Số phân đoạn")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatCompactNumber(
                      latestGeneratedContent.sections.length,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                  <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                    {copy("Platform packs", "Gói nền tảng")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {formatCompactNumber(
                      latestGeneratedContent.platformPosts.length,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/22 bg-primary/7 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                  {copy("Selected keyword", "Keyword được chọn")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {latestGeneratedContent.selectedKeyword ||
                    latestTopTrend?.main_keyword ||
                    "--"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {latestGeneratedContent.mainTitle ||
                    latestGeneratedContent.videoScriptTitle ||
                    "--"}
                </p>
              </div>

              {latestOrchestrationOutput?.trend_analysis.markdown_summary ? (
                <div className="mt-4 rounded-2xl border border-border/55 bg-background/60 p-4 text-sm text-muted-foreground">
                  <p className="mb-1 text-xs font-semibold tracking-[0.12em] uppercase">
                    {copy("Narrative summary", "Tóm tắt diễn giải")}
                  </p>
                  <p className="whitespace-pre-wrap">
                    {latestOrchestrationOutput.trend_analysis.markdown_summary}
                  </p>
                </div>
              ) : null}

              {latestHashtags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {latestHashtags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </PanelCard>

            <PanelCard
              title={copy("Run Metadata", "Metadata phiên chạy")}
              description={copy(
                "Operational identifiers and artifact pointers returned by backend orchestrator.",
                "Định danh vận hành và đường dẫn artifact được trả về từ backend orchestrator.",
              )}
            >
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
                  <p>
                    {copy("Status", "Trạng thái")}:{" "}
                    {latestOrchestrationResponse.status}
                  </p>
                  <p className="mt-1">
                    {copy("Trend Analysis ID", "Trend Analysis ID")}:{" "}
                    {latestOrchestrationResponse.trend_analysis_id ?? "--"}
                  </p>
                  <p className="mt-1">
                    {copy("Generated Content ID", "Generated Content ID")}:{" "}
                    {latestOrchestrationResponse.generated_content_id ?? "--"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
                  <p>
                    {copy("Raw response file", "File raw response")}:{" "}
                    {latestOrchestrationResponse.raw_response_file ?? "--"}
                  </p>
                  <p className="mt-1">
                    {copy("Output file", "File output")}:{" "}
                    {latestOrchestrationResponse.output_file ?? "--"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
                  <p>
                    {copy("Run duration profile", "Hồ sơ thời lượng")}:{" "}
                    {latestGeneratedContent.durationEstimate || "60s"}
                  </p>
                  <p className="mt-1">
                    {copy("Music mood", "Mood nhạc")}:{" "}
                    {latestGeneratedContent.musicMood ||
                      latestGeneratedContent.musicBackground ||
                      "--"}
                  </p>
                  <p className="mt-1">
                    {copy("Captions style", "Phong cách phụ đề")}:{" "}
                    {latestGeneratedContent.captionsStyle || "--"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {copy("Quality signal", "Tín hiệu chất lượng")}
                  </p>
                  <p className="mt-1">
                    {latestGeneratedContent.hasError
                      ? copy(
                          "Generated content includes an error marker. Review output before publishing.",
                          "Generated content có cờ lỗi. Hãy kiểm tra output trước khi xuất bản.",
                        )
                      : copy(
                          "No error marker detected in generated content block.",
                          "Không phát hiện cờ lỗi trong generated content block.",
                        )}
                  </p>
                </div>
              </div>
            </PanelCard>
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PanelCard
              title={copy("Trend Score Distribution", "Phân bố điểm trend")}
              description={copy(
                "Score comparison of ranked opportunities returned by orchestrator.",
                "So sánh điểm của các cơ hội đã xếp hạng từ orchestrator.",
              )}
            >
              {latestTrendResults.length > 0 ? (
                <BarTrendChart
                  data={latestTrendBarData}
                  className="bg-linear-to-br from-sky-100/55 via-card to-indigo-100/45 dark:from-sky-500/12 dark:via-card/90 dark:to-indigo-500/10"
                />
              ) : (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No trend result returned from latest orchestration run.",
                    "Phiên orchestration gần nhất chưa trả về trend result.",
                  )}
                />
              )}
            </PanelCard>

            <PanelCard
              title={copy("Interest Pulse Timeline", "Đường xung quan tâm")}
              description={copy(
                "Short-horizon momentum from interest_over_day of the strongest trend signals.",
                "Động lượng ngắn hạn từ interest_over_day của các tín hiệu trend mạnh nhất.",
              )}
            >
              {latestInterestLineData ? (
                <LineTrendChart
                  data={latestInterestLineData}
                  className="bg-linear-to-br from-emerald-100/55 via-card to-cyan-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-cyan-500/10"
                />
              ) : (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No interest timeline values available in current output.",
                    "Không có giá trị timeline interest trong output hiện tại.",
                  )}
                />
              )}
            </PanelCard>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PanelCard
              title={copy("Platform Post Mix", "Phân bổ post theo nền tảng")}
              description={copy(
                "Caption package readiness for each social platform in generated_content.platform_posts.",
                "Mức sẵn sàng gói caption cho từng nền tảng trong generated_content.platform_posts.",
              )}
            >
              {latestPlatformMixData ? (
                <DoughnutTrendChart
                  data={latestPlatformMixData}
                  className="bg-linear-to-br from-violet-100/55 via-card to-fuchsia-100/45 dark:from-violet-500/12 dark:via-card/90 dark:to-fuchsia-500/10"
                />
              ) : (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No platform post package found in generated content output.",
                    "Chưa có gói post nền tảng trong generated content output.",
                  )}
                />
              )}

              {latestGeneratedContent.platformPosts.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {latestGeneratedContent.platformPosts.map((post) => (
                    <div
                      key={post.platform}
                      className="rounded-2xl border border-border/60 bg-background/65 p-3"
                    >
                      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                        {formatPlatformLabel(post.platform)}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {post.caption || "--"}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {copy("Caption length", "Độ dài caption")}:{" "}
                        {formatCompactNumber(
                          summarizeCaptionLength(post.caption),
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {copy("Best posting window", "Khung giờ đăng")}:{" "}
                        {post.bestPostTime || "--"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {copy("CTA", "CTA")}: {post.cta || "--"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.hashtags.map((tag) => (
                          <Badge
                            key={`${post.platform}-${tag}`}
                            variant="outline"
                            className="rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </PanelCard>

            <PanelCard
              title={copy("Script Blueprint", "Blueprint kịch bản")}
              description={copy(
                "Scene-by-scene script structure generated by the backend content agent.",
                "Cấu trúc kịch bản theo từng cảnh được backend content agent tạo ra.",
              )}
            >
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Hook", "Hook")}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {latestGeneratedContent.hook || "--"}
                </p>
              </div>

              {latestGeneratedContent.sections.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {latestGeneratedContent.sections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-border/60 bg-background/65 p-3"
                    >
                      <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                        {section.timestamp}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {section.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {section.narration || "--"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {copy("Editing notes", "Ghi chú dựng")}:{" "}
                        {section.notes || "--"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No script sections returned in latest generated content.",
                    "Chưa có script sections trong generated content gần nhất.",
                  )}
                />
              )}

              {latestPublishingWindows.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-border/60 bg-background/65 p-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {copy(
                      "Publishing windows detected",
                      "Khung giờ đăng được phát hiện",
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {latestPublishingWindows.map((item, index) => (
                      <Badge
                        key={`${item.platform}-${item.windowLabel}-${index}`}
                        variant="outline"
                        className="rounded-full"
                      >
                        {item.platform}: {item.windowLabel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </PanelCard>
          </div>

          <PanelCard
            title={copy(
              "Storyboard Preview (Mock Images)",
              "Storyboard preview (ảnh mock)",
            )}
            description={copy(
              "Images are mocked while section thumbnail output paths are not public URLs.",
              "Ảnh đang dùng mock trong khi output_path thumbnail chưa phải public URL.",
            )}
          >
            {latestGeneratedContent.sections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {latestGeneratedContent.sections.map((section) => (
                  <article
                    key={`storyboard-${section.id}`}
                    className="overflow-hidden rounded-2xl border border-border/65 bg-background/70"
                  >
                    <img
                      src={section.imageUrl}
                      alt={`${section.label} mock preview`}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                    <div className="space-y-1.5 p-3">
                      <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                        {section.timestamp}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {section.label}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {section.thumbnailPrompt || section.narration || "--"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {copy("Output path", "Output path")}:{" "}
                        {section.thumbnailOutputPath || "(mock-only)"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No storyboard sections available to preview yet.",
                  "Chưa có phân đoạn storyboard để preview.",
                )}
              />
            )}
          </PanelCard>
        </>
      ) : null}

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
