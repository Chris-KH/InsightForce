import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SendHorizontal, Sparkles, Workflow } from "lucide-react";

import {
  useAgentsStatusQuery,
  useHealthQuery,
  useUploadPostPublishJobsQuery,
} from "@/api";
import { BarTrendChart, DoughnutTrendChart } from "@/components/app-data-viz";
import { InlineQueryState, QueryStateCard } from "@/components/app-query-state";
import { PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";
import { AutomationHintTooltip } from "@/pages/automation/components/AutomationHintTooltip";
import { AutomationLatestOrchestrationOutput } from "@/pages/automation/components/AutomationLatestOrchestrationOutput";
import { AutomationOrchestrationControlSection } from "@/pages/automation/components/AutomationOrchestrationControlSection";
import {
  AutomationPriorityGrid,
  AutomationPriorityItem,
} from "@/pages/automation/components/AutomationPriorityGrid";
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

  const sectionTransition = {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.div
      className="grid gap-6"
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

      <motion.section
        className="grid gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.04 }}
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("Workspace mode", "Chế độ làm việc")}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy(
              "Orchestration creates trend/content outputs. Publishing turns those outputs into platform-ready posts.",
              "Orchestration tạo đầu ra xu hướng/nội dung. Publishing chuyển đầu ra đó thành bài đăng sẵn sàng cho từng nền tảng.",
            )}
          </p>
          <AutomationHintTooltip
            label={copy(
              "Layout adapts by priority: High (full row), Medium (half row), Low (one-third row).",
              "Bố cục tự co giãn theo ưu tiên: High (toàn hàng), Medium (nửa hàng), Low (một phần ba hàng).",
            )}
            hint={copy(
              "Keep mission-critical actions in High cards, supporting analytics in Medium cards, and optional context in Low cards for faster scanning.",
              "Đặt tác vụ quan trọng ở thẻ High, analytics hỗ trợ ở thẻ Medium, và thông tin phụ ở thẻ Low để quét thông tin nhanh hơn.",
            )}
          />
        </div>

        <Tabs
          value={workspaceTab}
          onValueChange={handleWorkspaceTabChange}
          className="gap-4"
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
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sectionTransition, delay: 0.04 }}
              className="flex flex-col gap-4"
            >
              <AutomationPriorityGrid>
                <AutomationPriorityItem priority="high">
                  <AutomationOrchestrationControlSection
                    onOpenPublishing={() => setWorkspaceTab("publishing")}
                  />
                </AutomationPriorityItem>

                <AutomationPriorityItem priority="high">
                  <AutomationLatestOrchestrationOutput />
                </AutomationPriorityItem>

                <AutomationPriorityItem priority="medium">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <PanelCard
                      title={copy("Runtime Queue Pulse", "Xung nhịp hàng đợi")}
                      description={copy(
                        "Operational pressure from pending, published, and failed publish jobs.",
                        "Áp lực vận hành từ các publish job đang chờ, đã đăng và thất bại.",
                      )}
                      className="h-full"
                      contentClassName="pb-4"
                      action={
                        <Badge
                          variant="outline"
                          className="rounded-full border-primary/25 bg-background/75 text-primary"
                        >
                          {copy("Ops Monitor", "Giám sát vận hành")}
                        </Badge>
                      }
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

                      <AutomationHintTooltip
                        className="mt-2"
                        label={copy(
                          "Queue pulse helps identify publishing bottlenecks quickly.",
                          "Queue pulse giúp phát hiện nhanh điểm nghẽn xuất bản.",
                        )}
                        hint={copy(
                          "A rising Pending bar with a flat Published bar usually indicates API throughput, platform validation, or scheduling bottlenecks.",
                          "Khi Pending tăng nhưng Published đứng yên, thường là dấu hiệu tắc nghẽn ở thông lượng API, bước kiểm tra nền tảng hoặc lịch đăng.",
                        )}
                      />
                    </PanelCard>
                  </motion.div>
                </AutomationPriorityItem>

                <AutomationPriorityItem priority="medium">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <PanelCard
                      title={copy("Agent Readiness", "Mức sẵn sàng của agent")}
                      description={copy(
                        "Live ratio between online and recovering agent processes.",
                        "Tỷ lệ trực tiếp giữa process agent đang online và đang khôi phục.",
                      )}
                      className="h-full"
                      contentClassName="pb-4"
                      action={
                        <Badge
                          variant="outline"
                          className="rounded-full border-primary/25 bg-background/75 text-primary"
                        >
                          {onlineAgentsCount}/{processes.length}{" "}
                          {copy("online", "online")}
                        </Badge>
                      }
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

                      <AutomationHintTooltip
                        className="mt-2"
                        label={copy(
                          "Readiness ratio tracks service resilience in real time.",
                          "Tỷ lệ sẵn sàng phản ánh độ ổn định dịch vụ theo thời gian thực.",
                        )}
                        hint={copy(
                          "If online ratio drops below 70%, throttle new publish jobs and run health checks before launching another orchestration cycle.",
                          "Nếu tỷ lệ online dưới 70%, nên giảm tốc tạo publish job mới và chạy health check trước khi mở phiên orchestration tiếp theo.",
                        )}
                      />
                    </PanelCard>
                  </motion.div>
                </AutomationPriorityItem>
              </AutomationPriorityGrid>
            </motion.div>
          </TabsContent>

          <TabsContent
            value="publishing"
            forceMount
            className="flex flex-col gap-6"
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
    </motion.div>
  );
}
