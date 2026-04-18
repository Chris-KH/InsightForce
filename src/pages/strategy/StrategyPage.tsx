import { motion } from "motion/react";
import { RefreshCw, Sparkles } from "lucide-react";

import { QueryStateCard } from "@/components/app-query-state";
import { SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/hooks/use-bilingual";
import { useLocale } from "@/hooks/use-locale";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

import { ActionHub } from "./components/ActionHub";
import { StrategyScoutComposerPanel } from "./components/StrategyScoutComposerPanel";
import { StrategyTrendDiscoveryPanel } from "./components/StrategyTrendDiscoveryPanel";
import { useStrategyWorkspaceState } from "./hooks/useStrategyWorkspaceState";

export function StrategyPage() {
  const { locale } = useLocale();

  return <StrategyPageContent key={locale} locale={locale} />;
}

type StrategyPageContentProps = {
  locale: string;
};

function StrategyPageContent({ locale }: StrategyPageContentProps) {
  const copy = useBilingual();
  const {
    promptInput,
    isTrendAnalyzePending,
    aiStatus,
    sessionSuggestions,
    trendTopics,
    selectedTopic,
    firstError,
    isGeneralRefreshFetching,
    setPromptInput,
    submitPrompt,
    runSuggestion,
    selectKeyword,
    refreshGeneralTrends,
  } = useStrategyWorkspaceState(copy, locale);

  return (
    <motion.div
      className="grid gap-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionHeader
        eyebrow={copy(
          "Trend Intelligence Workspace",
          "Không gian trí tuệ xu hướng",
        )}
        title={copy(
          "Creator Trend Intelligence Hub",
          "Hub xu hướng cho creator",
        )}
        description={copy(
          "Discover what topics are heating up and turn them into content actions in minutes.",
          "Khám phá chủ đề đang nóng và chuyển thành hành động nội dung chỉ trong vài phút.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
            >
              <Sparkles className="mr-2 size-3.5" />
              {copy("Creator Mode", "Chế độ creator")}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void refreshGeneralTrends();
              }}
              disabled={isGeneralRefreshFetching}
            >
              <RefreshCw
                data-icon="inline-start"
                className={cn(isGeneralRefreshFetching && "animate-spin")}
              />
              {isGeneralRefreshFetching
                ? copy("Refreshing", "Đang làm mới")
                : copy("Refresh", "Làm mới")}
            </Button>
          </div>
        }
      />

      {firstError && trendTopics.length === 0 ? (
        <QueryStateCard
          state="error"
          title={copy(
            "Unable to load trend workspace",
            "Không thể tải không gian xu hướng",
          )}
          description={getQueryErrorMessage(
            firstError,
            "Unable to fetch trend data right now.",
          )}
        />
      ) : null}

      <StrategyScoutComposerPanel
        copy={copy}
        promptInput={promptInput}
        isPending={isTrendAnalyzePending}
        aiStatus={aiStatus}
        suggestions={sessionSuggestions}
        onPromptInputChange={setPromptInput}
        onPromptSubmit={() => {
          void submitPrompt();
        }}
        onSuggestionSelect={(suggestion) => {
          void runSuggestion(suggestion);
        }}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <StrategyTrendDiscoveryPanel
          copy={copy}
          topics={trendTopics}
          selectedKeyword={selectedTopic?.keyword}
          isPending={isTrendAnalyzePending}
          onSelectKeyword={selectKeyword}
        />

        <div className="xl:sticky xl:top-24 xl:h-fit">
          <ActionHub copy={copy} selectedTopic={selectedTopic} />
        </div>
      </section>
    </motion.div>
  );
}
