import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  CheckCircle2,
  Clock3,
  SendHorizontal,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  useAgentsStatusQuery,
  useHealthQuery,
  useUploadPostPublishJobsQuery,
} from "@/api";
import { BarTrendChart, DoughnutTrendChart } from "@/components/app-data-viz";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { localizeHealthStatus } from "@/lib/localized-status";
import { getQueryErrorMessage } from "@/lib/query-error";
import { AutomationLatestOrchestrationOutput } from "@/pages/automation/components/AutomationLatestOrchestrationOutput";
import { AutomationOrchestrationControlSection } from "@/pages/automation/components/AutomationOrchestrationControlSection";
import { PublishWorkspaceSection } from "@/pages/automation/components/PublishWorkspaceSection";

type AutomationWorkspaceTab = "orchestration" | "publishing";

const AUTOMATION_WORKSPACE_TAB_STORAGE_KEY =
  "insightforce.automation.workspace-tab";

function isAutomationWorkspaceTab(
  value: string,
): value is AutomationWorkspaceTab {
  return value === "orchestration" || value === "publishing";
}

function readPersistedWorkspaceTab(): AutomationWorkspaceTab {
  if (typeof window === "undefined") {
    return "orchestration";
  }

  const stored = window.localStorage.getItem(
    AUTOMATION_WORKSPACE_TAB_STORAGE_KEY,
  );

  return stored && isAutomationWorkspaceTab(stored) ? stored : "orchestration";
}

export function AutomationPage() {
  const copy = useBilingual();
  const publishJobsParams = useMemo(() => ({ limit: 30 }), []);
  const [workspaceTab, setWorkspaceTab] = useState<AutomationWorkspaceTab>(() =>
    readPersistedWorkspaceTab(),
  );
  const [hasLoadedMetricsOnce, setHasLoadedMetricsOnce] = useState(false);

  const healthQuery = useHealthQuery();
  const agentsStatusQuery = useAgentsStatusQuery();
  const publishJobsQuery = useUploadPostPublishJobsQuery(publishJobsParams);

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

  const allQueries = [healthQuery, agentsStatusQuery, publishJobsQuery];

  const hasResolvedMetrics = allQueries.every(
    (query) => query.data !== undefined || query.error != null,
  );

  const isInitialLoading =
    !hasLoadedMetricsOnce && allQueries.some((query) => query.isLoading);

  const firstError = allQueries.find((query) => query.error)?.error;

  const handleWorkspaceTabChange = (value: string) => {
    if (isAutomationWorkspaceTab(value)) {
      setWorkspaceTab(value);
    }
  };

  useEffect(() => {
    window.localStorage.setItem(
      AUTOMATION_WORKSPACE_TAB_STORAGE_KEY,
      workspaceTab,
    );
  }, [workspaceTab]);

  useEffect(() => {
    if (hasResolvedMetrics || firstError) {
      setHasLoadedMetricsOnce(true);
    }
  }, [firstError, hasResolvedMetrics]);

  const sectionTransition = {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.div
      className="grid gap-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
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

      <AnimatePresence initial={false} mode="wait">
        {firstError ? (
          <motion.div
            key="automation-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <QueryStateCard
              state="error"
              title={copy("Automation Data Error", "Lỗi dữ liệu tự động hóa")}
              description={getQueryErrorMessage(
                firstError,
                "Unable to load automation metrics.",
              )}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...sectionTransition, delay: 0.02 }}
            whileHover={{ y: -3 }}
          >
            <MetricCard
              label={copy("System Health", "Sức khỏe hệ thống")}
              value={localizeHealthStatus(healthQuery.data?.status, copy)}
              detail={copy(
                "Backend service heartbeat",
                "Nhịp trạng thái dịch vụ backend",
              )}
              icon={<Server className="size-5" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...sectionTransition, delay: 0.06 }}
            whileHover={{ y: -3 }}
          >
            <MetricCard
              label={copy("Ready Agents", "Agent sẵn sàng")}
              value={`${onlineAgentsCount}/${processes.length}`}
              detail={copy(
                "Agent processes responding",
                "Số process agent phản hồi",
              )}
              icon={<Bot className="size-5" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...sectionTransition, delay: 0.1 }}
            whileHover={{ y: -3 }}
          >
            <MetricCard
              label={copy("Publish Success", "Tỷ lệ xuất bản thành công")}
              value={formatPercentFromRatio(successRatio)}
              detail={copy(
                "From finished publish jobs",
                "Tính trên các publish job đã hoàn tất",
              )}
              icon={<CheckCircle2 className="size-5" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...sectionTransition, delay: 0.14 }}
            whileHover={{ y: -3 }}
          >
            <MetricCard
              label={copy("Pending Queue", "Hàng đợi chờ xử lý")}
              value={formatCompactNumber(pendingCount)}
              detail={copy(
                "Jobs waiting for completion",
                "Số công việc đang chờ hoàn tất",
              )}
              icon={<Clock3 className="size-5" />}
            />
          </motion.div>
        </motion.div>
      )}

      <motion.section
        className="grid gap-3"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.04 }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("Workspace mode", "Chế độ làm việc")}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy(
              "Orchestration creates trend/content outputs. Publishing turns those outputs into platform-ready posts.",
              "Orchestration tạo đầu ra xu hướng/nội dung. Publishing chuyển đầu ra đó thành bài đăng sẵn sàng cho từng nền tảng.",
            )}
          </p>
        </div>

        <Tabs
          value={workspaceTab}
          onValueChange={handleWorkspaceTabChange}
          className="gap-6"
        >
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="orchestration">
              <Workflow data-icon="inline-start" />
              {copy("Orchestration", "Điều phối")}
            </TabsTrigger>
            <TabsTrigger value="publishing">
              <SendHorizontal data-icon="inline-start" />
              {copy("Publishing", "Xuất bản")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="orchestration"
            forceMount
            className="flex flex-col gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sectionTransition, delay: 0.04 }}
              className="flex flex-col gap-8"
            >
              <AutomationOrchestrationControlSection
                onOpenPublishing={() => setWorkspaceTab("publishing")}
              />
              <AutomationLatestOrchestrationOutput />
            </motion.div>
          </TabsContent>

          <TabsContent
            value="publishing"
            forceMount
            className="flex flex-col gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sectionTransition, delay: 0.04 }}
            >
              <PublishWorkspaceSection />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>

      <motion.div
        className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.08 }}
      >
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <PanelCard
            title={copy("Queue Health", "Sức khỏe hàng đợi")}
            description={copy(
              "Track queue pressure across pending, published, and failed jobs.",
              "Theo dõi áp lực hàng đợi giữa các trạng thái đang chờ, đã đăng và thất bại.",
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
                  "Chưa có job đăng bài nào.",
                )}
              />
            )}
          </PanelCard>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
