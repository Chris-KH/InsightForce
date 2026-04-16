import { useMemo } from "react";

import type { UserSummaryResponse } from "@/api";
import { HeatMatrix } from "@/components/app-data-viz";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatCompactNumber } from "@/lib/insight-formatters";

type DashboardUserActivityMatrixPanelProps = {
  users: UserSummaryResponse[];
};

export function DashboardUserActivityMatrixPanel({
  users,
}: DashboardUserActivityMatrixPanelProps) {
  const copy = useBilingual();

  const userHeatMatrix = useMemo(() => {
    const limitedUsers = users.slice(0, 6);

    if (limitedUsers.length === 0) {
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
      rows: limitedUsers.map((user) => user.email),
      columns: [
        copy("Trend", "Xu hướng"),
        copy("Content", "Nội dung"),
        copy("Publish", "Đăng bài"),
      ],
      values: limitedUsers.map((user) => [
        user.trend_analysis_count,
        user.generated_content_count,
        user.publish_job_count,
      ]),
    };
  }, [copy, users]);

  return (
    <PanelCard
      title={copy("User Activity Matrix", "Ma trận hoạt động người dùng")}
      description={copy(
        "Understand which account is producing trends, content, and publishing output.",
        "Xem tài khoản nào đang đóng góp nhiều nhất cho xu hướng, nội dung và đăng bài.",
      )}
    >
      <HeatMatrix
        rows={userHeatMatrix.rows}
        columns={userHeatMatrix.columns}
        values={userHeatMatrix.values}
        valueFormatter={(value) => formatCompactNumber(value)}
      />
    </PanelCard>
  );
}
