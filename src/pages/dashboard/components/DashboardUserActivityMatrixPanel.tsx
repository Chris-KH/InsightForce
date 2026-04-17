import { useMemo } from "react";

import type { UserSummaryResponse } from "@/api";
import { HeatMatrix } from "@/components/app-data-viz";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatCompactNumber } from "@/lib/insight-formatters";

type DashboardUserActivityMatrixPanelProps = {
  users: UserSummaryResponse[];
};

type UserActivityMatrixRow = {
  email: string;
  label: string;
  trendCount: number;
  contentCount: number;
  publishCount: number;
  totalCount: number;
};

function toUserLabel(email: string) {
  const [localPart] = email.split("@");
  const base = (localPart || email).trim();

  if (base.length <= 14) {
    return base;
  }

  return `${base.slice(0, 11)}...`;
}

export function DashboardUserActivityMatrixPanel({
  users,
}: DashboardUserActivityMatrixPanelProps) {
  const copy = useBilingual();

  const userActivityRows = useMemo<UserActivityMatrixRow[]>(() => {
    return users
      .map((user) => {
        const trendCount = user.trend_analysis_count;
        const contentCount = user.generated_content_count;
        const publishCount = user.publish_job_count;

        return {
          email: user.email,
          label: toUserLabel(user.email),
          trendCount,
          contentCount,
          publishCount,
          totalCount: trendCount + contentCount + publishCount,
        };
      })
      .sort(
        (left, right) =>
          right.totalCount - left.totalCount ||
          right.publishCount - left.publishCount,
      )
      .slice(0, 6);
  }, [users]);

  const totalActions = useMemo(
    () => userActivityRows.reduce((sum, user) => sum + user.totalCount, 0),
    [userActivityRows],
  );

  const averageActionsPerUser = useMemo(() => {
    if (userActivityRows.length === 0) {
      return 0;
    }

    return totalActions / userActivityRows.length;
  }, [totalActions, userActivityRows.length]);

  const mostActiveUser = userActivityRows[0];

  const userHeatMatrix = useMemo(() => {
    if (userActivityRows.length === 0) {
      return {
        rows: [copy("No users", "Chưa có người dùng")],
        columns: [
          copy("Trend", "Xu hướng"),
          copy("Content", "Nội dung"),
          copy("Publish", "Đăng bài"),
        ],
        values: [[0, 0, 0]],
      };
    }

    return {
      rows: userActivityRows.map((user) => user.label),
      columns: [
        copy("Trend", "Xu hướng"),
        copy("Content", "Nội dung"),
        copy("Publish", "Đăng bài"),
      ],
      values: userActivityRows.map((user) => [
        user.trendCount,
        user.contentCount,
        user.publishCount,
      ]),
    };
  }, [copy, userActivityRows]);

  return (
    <PanelCard
      title={copy("User Activity Matrix", "Ma trận hoạt động người dùng")}
      description={copy(
        "Track who is driving trend research, content output, and publishing volume at a glance.",
        "Theo dõi nhanh tài khoản nào đang kéo hiệu suất ở các mảng xu hướng, nội dung và xuất bản.",
      )}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Top Operator", "Tài khoản dẫn đầu")}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {mostActiveUser?.email ?? "--"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {copy("Total actions", "Tổng hoạt động")}:{" "}
            {formatCompactNumber(mostActiveUser?.totalCount ?? 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Tracked Accounts", "Số tài khoản theo dõi")}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatCompactNumber(userActivityRows.length)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {copy("Displayed in matrix", "Đang hiển thị trong ma trận")}
          </p>
        </div>

        <div className="rounded-2xl border border-border/65 bg-background/65 p-3">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Average Actions", "Hoạt động trung bình")}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatCompactNumber(averageActionsPerUser)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {copy("Per tracked account", "Trên mỗi tài khoản")}
          </p>
        </div>
      </div>

      <HeatMatrix
        rows={userHeatMatrix.rows}
        columns={userHeatMatrix.columns}
        values={userHeatMatrix.values}
        valueFormatter={(value) => formatCompactNumber(value)}
      />

      {userActivityRows.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {userActivityRows.map((user) => (
            <div
              key={user.email}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/65 bg-background/60 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">
                  {user.email}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {copy("Trend", "Xu hướng")}:{" "}
                  {formatCompactNumber(user.trendCount)}
                  {" • "}
                  {copy("Content", "Nội dung")}:{" "}
                  {formatCompactNumber(user.contentCount)}
                  {" • "}
                  {copy("Publish", "Đăng bài")}:{" "}
                  {formatCompactNumber(user.publishCount)}
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-primary/30"
              >
                {formatCompactNumber(user.totalCount)}
              </Badge>
            </div>
          ))}
        </div>
      ) : null}
    </PanelCard>
  );
}
