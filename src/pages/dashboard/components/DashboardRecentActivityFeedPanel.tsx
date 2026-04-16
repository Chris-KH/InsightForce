import { useMemo, useState } from "react";

import type {
  GeneratedContentResponse,
  PublishJobResponse,
  TrendAnalysisRecordResponse,
} from "@/api";
import {
  InlineQueryState,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

type PipelineEvent = {
  id: string;
  type: "trend" | "content" | "publish";
  title: string;
  createdAt: string;
  status: string;
};

type EventFilter = "all" | PipelineEvent["type"];

type DashboardRecentActivityFeedPanelProps = {
  trendRecords: TrendAnalysisRecordResponse[];
  generatedContents: GeneratedContentResponse[];
  publishJobs: PublishJobResponse[];
  isLoading: boolean;
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function eventTypeClass(type: PipelineEvent["type"]) {
  if (type === "trend") {
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-700";
  }

  if (type === "content") {
    return "border-violet-500/40 bg-violet-500/10 text-violet-700";
  }

  return "border-amber-500/40 bg-amber-500/10 text-amber-700";
}

export function DashboardRecentActivityFeedPanel({
  trendRecords,
  generatedContents,
  publishJobs,
  isLoading,
}: DashboardRecentActivityFeedPanelProps) {
  const copy = useBilingual();
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");

  const pipelineEvents = useMemo(() => {
    const trendEvents: PipelineEvent[] = trendRecords
      .slice(0, 8)
      .map((item) => ({
        id: item.analysis_id ?? `${item.query}-${item.created_at}`,
        type: "trend",
        title: item.query,
        createdAt: item.created_at,
        status: item.status,
      }));

    const contentEvents: PipelineEvent[] = generatedContents
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        type: "content",
        title: item.main_title || item.selected_keyword || item.id,
        createdAt: item.created_at,
        status: item.status,
      }));

    const publishEvents: PipelineEvent[] = publishJobs
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        type: "publish",
        title: item.title,
        createdAt: item.created_at,
        status: item.status,
      }));

    return [...trendEvents, ...contentEvents, ...publishEvents]
      .sort(
        (left, right) =>
          toTimestamp(right.createdAt) - toTimestamp(left.createdAt),
      )
      .slice(0, 14);
  }, [generatedContents, publishJobs, trendRecords]);

  const filteredEvents = useMemo(() => {
    if (eventFilter === "all") {
      return pipelineEvents;
    }

    return pipelineEvents.filter((event) => event.type === eventFilter);
  }, [eventFilter, pipelineEvents]);

  return (
    <PanelCard
      title={copy("Recent Activity Feed", "Bảng hoạt động gần đây")}
      description={copy(
        "Filter activity stream by trend, content, or publishing tasks.",
        "Lọc luồng hoạt động theo xu hướng, nội dung hoặc tác vụ đăng bài.",
      )}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: copy("All", "Tất cả") },
            { key: "trend", label: copy("Trend", "Xu hướng") },
            { key: "content", label: copy("Content", "Nội dung") },
            { key: "publish", label: copy("Publish", "Đăng bài") },
          ] as const
        ).map((filter) => {
          const active = eventFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setEventFilter(filter.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary/45 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/70 text-muted-foreground",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {isLoading && filteredEvents.length === 0 ? (
        <PanelRowsSkeleton rows={6} />
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={`${event.type}-${event.id}`}
              className="rounded-2xl border border-border/65 bg-background/65 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full capitalize",
                    eventTypeClass(event.type),
                  )}
                >
                  {event.type}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(event.createdAt)}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy("Status", "Trạng thái")}: {event.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <InlineQueryState
          state="empty"
          message={copy(
            "No activity for the selected filter.",
            "Không có hoạt động phù hợp bộ lọc đã chọn.",
          )}
        />
      )}
    </PanelCard>
  );
}
