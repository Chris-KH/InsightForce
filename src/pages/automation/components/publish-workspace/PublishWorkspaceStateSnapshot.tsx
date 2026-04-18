import { CheckCircle2, Clock3 } from "lucide-react";

import type { PublishJobResponse } from "@/api";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

type PublishWorkspaceStateSnapshotProps = {
  jobs: PublishJobResponse[];
};

export function PublishWorkspaceStateSnapshot({
  jobs,
}: PublishWorkspaceStateSnapshotProps) {
  const copy = useBilingual();

  const pendingCount = jobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;
  const publishedCount = jobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;

  return (
    <PanelCard
      title={copy("Publish State Snapshot", "Ảnh chụp trạng thái xuất bản")}
      description={copy(
        "Quick summary to inspect queue state at a glance.",
        "Tóm tắt nhanh để kiểm tra trạng thái hàng đợi.",
      )}
      contentClassName="pb-4"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-xs text-muted-foreground">
            {copy("Pending", "Đang chờ")}
          </p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-foreground">
            <Clock3 className="size-4 text-amber-600" />
            {pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-xs text-muted-foreground">
            {copy("Published", "Đã đăng")}
          </p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-600" />
            {publishedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-xs text-muted-foreground">
            {copy("Total", "Tổng")}
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {jobs.length}
          </p>
        </div>
      </div>
    </PanelCard>
  );
}
