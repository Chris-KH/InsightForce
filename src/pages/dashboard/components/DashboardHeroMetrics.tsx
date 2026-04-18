import { Shield, Sparkles, TrendingUp } from "lucide-react";

import { MetricCard } from "@/components/app-section";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";

import type { BilingualCopy } from "./dashboard-workspace.types";

type DashboardHeroMetricsProps = {
  copy: BilingualCopy;
  readyToShootScripts: number;
  estimatedViews: number;
  estimatedRevenue: number;
  publishSuccessRatio: number;
  publishedJobs: number;
  pendingJobs: number;
};

function formatCurrencyUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardHeroMetrics({
  copy,
  readyToShootScripts,
  estimatedViews,
  estimatedRevenue,
  publishSuccessRatio,
  publishedJobs,
  pendingJobs,
}: DashboardHeroMetricsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        label={copy("Psychological Guardian", "Lá chắn tâm lý")}
        value={copy("Guardian Shield Active", "Lá chắn bảo vệ đang hoạt động")}
        detail={copy(
          "124 Toxic/Spam comments auto-filtered today",
          "124 bình luận độc hại/spam đã được tự động lọc hôm nay",
        )}
        icon={<Shield className="size-5" />}
      />

      <MetricCard
        label={copy("Content Architect", "Kiến trúc sư nội dung")}
        value={copy(
          `${readyToShootScripts} Ready-to-shoot Scripts`,
          `${readyToShootScripts} kịch bản sẵn sàng quay`,
        )}
        detail={copy(
          "Generated from audience insights",
          "Được tạo từ insight của khán giả",
        )}
        icon={<Sparkles className="size-5" />}
      />

      <MetricCard
        label={copy("Channel Pulse", "Nhịp kênh")}
        value={`${formatCompactNumber(estimatedViews)} • ${formatCurrencyUSD(estimatedRevenue)}`}
        detail={copy(
          `Publish quality ${formatPercentFromRatio(publishSuccessRatio)} · ${publishedJobs} published · ${pendingJobs} pending`,
          `Chất lượng đăng ${formatPercentFromRatio(publishSuccessRatio)} · ${publishedJobs} đã đăng · ${pendingJobs} đang chờ`,
        )}
        icon={<TrendingUp className="size-5" />}
      />
    </section>
  );
}
