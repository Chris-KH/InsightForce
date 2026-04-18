import { useState } from "react";
import { CheckCircle2, Clock3, TrendingUp, XCircle } from "lucide-react";

import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

import type { BilingualCopy } from "./dashboard-workspace.types";

type ApprovalStatus = "pending" | "approved" | "rejected";

type DashboardStrategicApprovalsPanelProps = {
  copy: BilingualCopy;
  strategicProposalText: string;
};

function getApprovalLabel(status: ApprovalStatus, copy: BilingualCopy) {
  if (status === "approved") {
    return copy("Approved", "Đã duyệt");
  }

  if (status === "rejected") {
    return copy("Rejected", "Đã từ chối");
  }

  return copy("Pending Review", "Đang chờ duyệt");
}

function getApprovalBadgeClass(status: ApprovalStatus) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (status === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300";
}

export function DashboardStrategicApprovalsPanel({
  copy,
  strategicProposalText,
}: DashboardStrategicApprovalsPanelProps) {
  const [approvalStatus, setApprovalStatus] =
    useState<ApprovalStatus>("pending");
  const [approvalUpdatedAt, setApprovalUpdatedAt] = useState<string | null>(
    null,
  );

  const handleApprovalDecision = (nextStatus: ApprovalStatus) => {
    setApprovalStatus(nextStatus);
    setApprovalUpdatedAt(new Date().toISOString());
  };

  return (
    <PanelCard
      title={copy("Strategic Approvals", "Phê duyệt chiến lược")}
      description={copy(
        "Human-in-the-loop actions requiring your decision before launch.",
        "Các hành động Human-in-the-loop cần bạn quyết định trước khi triển khai.",
      )}
      className="border-amber-200/80 bg-linear-to-br from-amber-100/45 via-card/96 to-card/96 dark:border-amber-500/30 dark:from-amber-500/12"
      action={
        <Badge
          variant="outline"
          className={cn("rounded-full", getApprovalBadgeClass(approvalStatus))}
        >
          {getApprovalLabel(approvalStatus, copy)}
        </Badge>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-amber-300/65 bg-background/72 p-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {copy("Scout Agent Proposal", "Đề xuất từ Scout Agent")}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {strategicProposalText}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy(
              "Scout Agent detected a rising trend with strong conversion intent. A lightweight ad test can validate demand quickly before scaling.",
              "Scout Agent phát hiện xu hướng tăng với ý định chuyển đổi cao. Một chiến dịch quảng cáo nhỏ giúp xác thực nhu cầu nhanh trước khi mở rộng.",
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/65 bg-background px-2.5 py-1">
              <Clock3 className="size-3.5" />
              {copy("Review window: 2h", "Khung duyệt: 2 giờ")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/65 bg-background px-2.5 py-1">
              <TrendingUp className="size-3.5" />
              {copy("Expected CTR uplift: +14%", "CTR kỳ vọng: +14%")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => {
              handleApprovalDecision("approved");
            }}
          >
            <CheckCircle2 data-icon="inline-start" />
            {copy("Approve", "Duyệt")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              handleApprovalDecision("rejected");
            }}
          >
            <XCircle data-icon="inline-start" />
            {copy("Reject", "Từ chối")}
          </Button>

          <p className="text-xs text-muted-foreground">
            {approvalUpdatedAt
              ? copy(
                  `Last decision at ${formatDateTime(approvalUpdatedAt)}`,
                  `Lần quyết định gần nhất lúc ${formatDateTime(approvalUpdatedAt)}`,
                )
              : copy(
                  "No decision yet. Action remains pending.",
                  "Chưa có quyết định. Hành động vẫn đang chờ duyệt.",
                )}
          </p>
        </div>
      </div>
    </PanelCard>
  );
}
