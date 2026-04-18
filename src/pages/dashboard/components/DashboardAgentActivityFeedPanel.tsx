import { Compass, Shield, Sparkles } from "lucide-react";

import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

import type {
  AgentActivityItem,
  AgentKind,
  BilingualCopy,
} from "./dashboard-workspace.types";

type DashboardAgentActivityFeedPanelProps = {
  copy: BilingualCopy;
  isLoading: boolean;
  items: AgentActivityItem[];
};

function getAgentStyle(kind: AgentKind) {
  if (kind === "guardian") {
    return {
      icon: Shield,
      iconClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
      cardClass:
        "border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5",
    };
  }

  if (kind === "content") {
    return {
      icon: Sparkles,
      iconClass:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
      cardClass:
        "border-sky-200/70 bg-sky-50/40 dark:border-sky-500/20 dark:bg-sky-500/5",
    };
  }

  return {
    icon: Compass,
    iconClass:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300",
    cardClass:
      "border-violet-200/70 bg-violet-50/40 dark:border-violet-500/20 dark:bg-violet-500/5",
  };
}

export function DashboardAgentActivityFeedPanel({
  copy,
  isLoading,
  items,
}: DashboardAgentActivityFeedPanelProps) {
  return (
    <PanelCard
      title={copy("Agent Activity Feed", "Luồng hoạt động của Agent")}
      description={copy(
        "Compact real-time timeline across Guardian, Content, and Scout agents.",
        "Timeline thời gian thực gọn nhẹ của Guardian, Content và Scout Agent.",
      )}
    >
      <div>
        {isLoading && items.length === 0 ? (
          <InlineQueryState
            state="loading"
            message={copy(
              "Building activity timeline...",
              "Đang dựng timeline hoạt động...",
            )}
          />
        ) : items.length > 0 ? (
          <ScrollArea className="h-80 pr-3">
            <ol className="flex flex-col gap-3">
              {items.map((item, index) => {
                const style = getAgentStyle(item.kind);
                const Icon = style.icon;
                const showLine = index < items.length - 1;

                return (
                  <li key={item.id} className="relative pl-10">
                    {showLine ? (
                      <span className="absolute top-8 bottom-0 left-3.5 w-px bg-border/70" />
                    ) : null}

                    <span
                      className={cn(
                        "absolute top-0 left-0 flex size-7 items-center justify-center rounded-full border",
                        style.iconClass,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>

                    <div
                      className={cn(
                        "rounded-xl border p-3",
                        "transition-colors",
                        style.cardClass,
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-foreground/90">
                        {item.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </ScrollArea>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No live activity yet.",
              "Chưa có hoạt động thời gian thực.",
            )}
          />
        )}
      </div>
    </PanelCard>
  );
}
