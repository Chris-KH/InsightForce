import { motion } from "motion/react";

import { InlineQueryState, QueryStateCard } from "@/components/app-query-state";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";

import { DashboardAgentActivityFeedPanel } from "./components/DashboardAgentActivityFeedPanel";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardHeroMetrics } from "./components/DashboardHeroMetrics";
import { DashboardKeywordPriorityPanel } from "./components/DashboardKeywordPriorityPanel";
import { DashboardStrategicApprovalsPanel } from "./components/DashboardStrategicApprovalsPanel";
import { DashboardTrendMomentumPanel } from "./components/DashboardTrendMomentumPanel";
import { useDashboardWorkspaceData } from "./hooks/useDashboardWorkspaceData";

export function DashboardPage() {
  const copy = useBilingual();
  const {
    isInitialLoading,
    isLoading,
    firstError,
    readyToShootScripts,
    estimatedViews,
    estimatedRevenue,
    publishSuccessRatio,
    publishedJobs,
    pendingJobs,
    strategicProposalText,
    keywordPriority,
    trendMomentumData,
    trendMomentumOptions,
    agentActivityFeed,
    reachableAgents,
    totalAgents,
    refreshAll,
  } = useDashboardWorkspaceData(copy);

  return (
    <motion.div
      className="grid gap-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <DashboardHeader
        copy={copy}
        isLoading={isLoading}
        onRefresh={() => {
          void refreshAll();
        }}
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Unable to load full dashboard", "Không thể tải đầy đủ dashboard")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load dashboard data right now.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <InlineQueryState
          state="loading"
          message={copy(
            "Preparing your command center...",
            "Đang chuẩn bị trung tâm chỉ huy của bạn...",
          )}
          className="rounded-2xl border-slate-200 bg-background shadow-sm"
        />
      ) : null}

      <DashboardHeroMetrics
        copy={copy}
        readyToShootScripts={readyToShootScripts}
        estimatedViews={estimatedViews}
        estimatedRevenue={estimatedRevenue}
        publishSuccessRatio={publishSuccessRatio}
        publishedJobs={publishedJobs}
        pendingJobs={pendingJobs}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <DashboardStrategicApprovalsPanel
          copy={copy}
          strategicProposalText={strategicProposalText}
        />

        <DashboardKeywordPriorityPanel
          copy={copy}
          items={keywordPriority.slice(0, 3)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardTrendMomentumPanel
          copy={copy}
          data={trendMomentumData}
          options={trendMomentumOptions}
        />

        <DashboardAgentActivityFeedPanel
          copy={copy}
          isLoading={isLoading}
          items={agentActivityFeed}
        />
      </section>

      <footer className="flex items-center justify-between rounded-2xl border border-border/65 bg-card/70 px-4 py-3 text-xs text-muted-foreground">
        <p>
          {copy(
            "Guardian, Content, and Scout agents are assisting your daily execution loop.",
            "Guardian, Content và Scout Agent đang hỗ trợ vòng lặp vận hành hằng ngày của bạn.",
          )}
        </p>
        <p>
          {copy(
            `${reachableAgents}/${totalAgents} agents online`,
            `${reachableAgents}/${totalAgents} agent đang trực tuyến`,
          )}
        </p>
      </footer>
    </motion.div>
  );
}
