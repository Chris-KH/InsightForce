import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SendHorizontal, Sparkles, Workflow } from "lucide-react";

import { useHealthQuery } from "@/api";
import { QueryStateCard } from "@/components/app-query-state";
import { SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";
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
  const [workspaceTab, setWorkspaceTab] = useState<AutomationWorkspaceTab>(() =>
    readPersistedWorkspaceTab(),
  );

  const healthQuery = useHealthQuery();
  const firstError = healthQuery.error;

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
                  <AutomationOrchestrationControlSection />
                </AutomationPriorityItem>

                <AutomationPriorityItem priority="high">
                  <AutomationLatestOrchestrationOutput
                    onOpenPublishing={() => setWorkspaceTab("publishing")}
                  />
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
