import { useMemo, useState } from "react";

import { type PublishJobResponse, useUploadPostPublishJobQuery } from "@/api";
import {
  InlineQueryState,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { localizeStatus } from "@/lib/localized-status";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

type PublishStatusFilter = "all" | "pending" | "published" | "failed";

type PublishWorkspaceTimelineProps = {
  jobs: PublishJobResponse[];
  isLoading: boolean;
  selectedJobId?: string;
  onSelectJob: (jobId: string) => void;
};

function statusBadgeClass(status: string) {
  const lowered = status.toLowerCase();

  if (lowered === "published") {
    return "border-emerald-500/45 bg-emerald-500/10 text-emerald-700";
  }

  if (lowered === "failed") {
    return "border-rose-500/45 bg-rose-500/10 text-rose-700";
  }

  if (lowered === "pending") {
    return "border-amber-500/45 bg-amber-500/10 text-amber-700";
  }

  return "border-border/70 text-muted-foreground";
}

function sortJobsByCreatedAt(items: PublishJobResponse[]) {
  return [...items].sort((left, right) => {
    const leftTime = Date.parse(left.created_at);
    const rightTime = Date.parse(right.created_at);

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return 0;
    }

    return rightTime - leftTime;
  });
}

function getFilterLabel(
  filter: PublishStatusFilter,
  copy: (en: string, vi: string) => string,
) {
  if (filter === "all") {
    return copy("All", "Tất cả");
  }

  if (filter === "pending") {
    return copy("Pending", "Đang chờ");
  }

  if (filter === "published") {
    return copy("Published", "Đã đăng");
  }

  return copy("Failed", "Lỗi");
}

function isPublishStatusFilter(value: string): value is PublishStatusFilter {
  return (
    value === "all" ||
    value === "pending" ||
    value === "published" ||
    value === "failed"
  );
}

export function PublishWorkspaceTimeline({
  jobs,
  isLoading,
  selectedJobId,
  onSelectJob,
}: PublishWorkspaceTimelineProps) {
  const copy = useBilingual();
  const [statusFilter, setStatusFilter] = useState<PublishStatusFilter>("all");

  const selectedJobQuery = useUploadPostPublishJobQuery({
    publishJobId: selectedJobId,
    enabled: Boolean(selectedJobId),
  });

  const sortedJobs = useMemo(() => sortJobsByCreatedAt(jobs), [jobs]);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") {
      return sortedJobs;
    }

    return sortedJobs.filter(
      (job) => job.status.toLowerCase() === statusFilter,
    );
  }, [sortedJobs, statusFilter]);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {copy("Publishing Timeline", "Dòng thời gian xuất bản")}
        </p>
        <p className="mb-2 text-xs text-muted-foreground">
          {copy(
            "Filter by status to isolate queue bottlenecks and failed retries quickly.",
            "Lọc theo trạng thái để tách nhanh các điểm nghẽn hàng đợi và lần thử lại bị lỗi.",
          )}
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={statusFilter}
          className="mb-3 flex-wrap"
          onValueChange={(value) => {
            if (isPublishStatusFilter(value)) {
              setStatusFilter(value);
            }
          }}
        >
          {(["all", "pending", "published", "failed"] as const).map(
            (status) => (
              <ToggleGroupItem
                key={status}
                value={status}
                aria-label={getFilterLabel(status, copy)}
                className="rounded-full"
              >
                {getFilterLabel(status, copy)}
              </ToggleGroupItem>
            ),
          )}
        </ToggleGroup>

        {isLoading ? (
          <PanelRowsSkeleton rows={7} />
        ) : filteredJobs.length > 0 ? (
          <ScrollArea className="h-96 pr-3">
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => onSelectJob(job.id)}
                  className={cn(
                    "w-full rounded-2xl border border-border/65 bg-background/65 p-3 text-left transition-colors hover:border-primary/35",
                    selectedJobId === job.id ? "border-primary/45" : undefined,
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full capitalize",
                        statusBadgeClass(job.status),
                      )}
                    >
                      {localizeStatus(job.status, copy)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Platforms", "Nền tảng")}: {job.platforms.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Tạo lúc")}:{" "}
                    {formatDateTime(job.created_at)}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No jobs for this filter.",
              "Không có job nào cho bộ lọc này.",
            )}
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {copy("Selected Job Detail", "Chi tiết job đã chọn")}
        </p>
        {!selectedJobId ? (
          <InlineQueryState
            state="empty"
            message={copy(
              "Select one publish job from the timeline.",
              "Hãy chọn một job đăng bài từ dòng thời gian.",
            )}
          />
        ) : selectedJobQuery.isLoading ? (
          <PanelRowsSkeleton rows={4} />
        ) : selectedJobQuery.error ? (
          <InlineQueryState
            state="error"
            message={getQueryErrorMessage(
              selectedJobQuery.error,
              "Unable to load selected publish job.",
            )}
          />
        ) : selectedJobQuery.data ? (
          <div className="grid gap-3">
            <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
              <p className="text-xs text-muted-foreground">
                {copy("Title", "Tiêu đề")}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {selectedJobQuery.data.title}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
                <p className="text-xs text-muted-foreground">
                  {copy("Status", "Trạng thái")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {localizeStatus(selectedJobQuery.data.status, copy)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
                <p className="text-xs text-muted-foreground">
                  {copy("Created", "Tạo lúc")}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {formatDateTime(selectedJobQuery.data.created_at)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
              <p className="text-xs text-muted-foreground">
                {copy("Platforms", "Nền tảng")}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {selectedJobQuery.data.platforms.join(", ")}
              </p>
            </div>
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No detail data found for selected job.",
              "Không tìm thấy dữ liệu chi tiết cho job đã chọn.",
            )}
          />
        )}
      </div>
    </div>
  );
}
