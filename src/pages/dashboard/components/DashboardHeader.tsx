import { Activity, RefreshCcw } from "lucide-react";

import { SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { BilingualCopy } from "./dashboard-workspace.types";

type DashboardHeaderProps = {
  copy: BilingualCopy;
  isLoading: boolean;
  onRefresh: () => void;
};

export function DashboardHeader({
  copy,
  isLoading,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <SectionHeader
      eyebrow={copy("Human-in-the-loop Workspace", "Không gian Human-in-the-loop")}
      title={copy("Campaign Command Center", "Trung tâm chỉ huy chiến dịch")}
      description={copy(
        "Your executive dashboard to cut through noise, approve strategic moves, and protect creator energy.",
        "Dashboard điều hành giúp bạn lọc nhiễu dữ liệu, duyệt chiến lược quan trọng và bảo vệ năng lượng sáng tạo.",
      )}
      action={
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Activity className="mr-2 size-3.5" />
            {isLoading
              ? copy("Syncing Live Data", "Đang đồng bộ dữ liệu")
              : copy("Live Data Synced", "Dữ liệu đã đồng bộ")}
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onRefresh}
          >
            <RefreshCcw data-icon="inline-start" />
            {copy("Refresh", "Làm mới")}
          </Button>
        </div>
      }
    />
  );
}
