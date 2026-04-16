import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Radar,
  SendHorizontal,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { useAgentsStatusQuery } from "@/api";
import type { AgentProcessStatus } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBilingual } from "@/hooks/use-bilingual";
import { cn } from "@/lib/utils";

type LocalizedLabel = {
  en: string;
  vi: string;
};

type AssistantMeta = {
  label: LocalizedLabel;
  icon: LucideIcon;
  chipClass: string;
};

const DEFAULT_ASSISTANT_META: AssistantMeta = {
  label: { en: "Bot Assistant", vi: "Trợ lý bot" },
  icon: Bot,
  chipClass: "border-primary/30 bg-primary/10 text-primary",
};

const ASSISTANT_META_BY_NAME: Record<string, AssistantMeta> = {
  routing_orchestrator: {
    label: { en: "Campaign Orchestrator", vi: "Điều phối chiến dịch" },
    icon: Workflow,
    chipClass: "border-primary/35 bg-primary/10 text-primary",
  },
  trend_agent: {
    label: { en: "Trend Assistant", vi: "Trợ lý xu hướng" },
    icon: Radar,
    chipClass: "border-cyan-500/35 bg-cyan-500/10 text-cyan-600",
  },
  content_agent: {
    label: { en: "Content Assistant", vi: "Trợ lý nội dung" },
    icon: Sparkles,
    chipClass: "border-violet-500/35 bg-violet-500/10 text-violet-600",
  },
  posting_agent: {
    label: { en: "Publishing Assistant", vi: "Trợ lý đăng bài" },
    icon: SendHorizontal,
    chipClass: "border-amber-500/35 bg-amber-500/10 text-amber-600",
  },
};

function formatFallbackLabel(name: string) {
  return name.replaceAll("_", " ");
}

function getAssistantMeta(name: string): AssistantMeta {
  const mapped = ASSISTANT_META_BY_NAME[name];

  if (mapped) {
    return mapped;
  }

  return {
    ...DEFAULT_ASSISTANT_META,
    label: {
      en: formatFallbackLabel(name),
      vi: formatFallbackLabel(name),
    },
  };
}

type AssistantSidebarStatusProps = {
  className?: string;
};

export function AssistantSidebarStatus({
  className,
}: AssistantSidebarStatusProps) {
  const copy = useBilingual();
  const agentsQuery = useAgentsStatusQuery();

  const processes: AgentProcessStatus[] = agentsQuery.data?.processes ?? [];
  const totalCount = processes.length;
  const reachableCount = processes.filter(
    (process: AgentProcessStatus) => process.reachable,
  ).length;
  const coveragePercent =
    totalCount > 0 ? Math.round((reachableCount / totalCount) * 100) : 0;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-linear-to-br from-background/95 via-background/80 to-primary/10 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {copy("Assistant Status", "Trạng thái trợ lý")}
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/10 px-2.5 text-primary"
        >
          <Sparkles className="size-3" />
          {copy("Live", "Live")}
        </Badge>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted/80">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary via-chart-2 to-chart-3 transition-[width] duration-500"
          style={{ width: `${coveragePercent}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {copy(
          `${reachableCount}/${totalCount} assistants online`,
          `${reachableCount}/${totalCount} trợ lý sẵn sàng`,
        )}
      </p>

      {agentsQuery.isLoading ? (
        <div className="mt-3 space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-2.5 py-2"
            >
              <Skeleton className="size-7 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
              <Skeleton className="size-3 rounded-full" />
            </div>
          ))}
        </div>
      ) : processes.length > 0 ? (
        <div className="mt-3 space-y-2.5">
          {processes.slice(0, 4).map((process: AgentProcessStatus) => {
            const meta = getAssistantMeta(process.name);
            const Icon = meta.icon;
            const online = process.reachable;

            return (
              <div
                key={process.name}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-2.5 py-2",
                  online
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-amber-500/35 bg-amber-500/12",
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border",
                      meta.chipClass,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {copy(meta.label.en, meta.label.vi)}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {online
                        ? copy("Ready now", "Sẵn sàng ngay")
                        : copy("Recovering", "Đang phục hồi")}
                    </p>
                  </div>
                </div>
                {online ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-border/70 bg-background/60 px-3 py-2 text-[11px] text-muted-foreground">
          {agentsQuery.error
            ? copy(
                "Unable to load assistant status right now.",
                "Không thể tải trạng thái trợ lý vào lúc này.",
              )
            : copy(
                "No assistant status available.",
                "Chưa có trạng thái trợ lý.",
              )}
        </div>
      )}
    </section>
  );
}
