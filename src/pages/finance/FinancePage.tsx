import type { ChartData, ChartOptions } from "chart.js";
import { Coins, ReceiptText, TrendingUp } from "lucide-react";

import { BarTrendChart } from "@/components/app-data-viz";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";

const platformRevenue = [
  { platform: "Instagram", amount: 62_000, color: "rgba(236, 72, 153, 0.82)" },
  { platform: "TikTok", amount: 48_000, color: "rgba(20, 184, 166, 0.82)" },
  { platform: "Facebook", amount: 21_000, color: "rgba(59, 130, 246, 0.78)" },
];

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const totalRevenue = platformRevenue.reduce(
  (sum, item) => sum + item.amount,
  0,
);

const topPlatform = platformRevenue.reduce((top, item) =>
  item.amount > top.amount ? item : top,
);

const revenueChartData: ChartData<"bar"> = {
  labels: platformRevenue.map((item) => item.platform),
  datasets: [
    {
      label: "VND",
      data: platformRevenue.map((item) => item.amount),
      backgroundColor: platformRevenue.map((item) => item.color),
      borderRadius: 10,
    },
  ],
};

const revenueChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => vndFormatter.format(Number(context.parsed.y ?? 0)),
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "rgba(148, 163, 184, 0.92)",
        font: { size: 10 },
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(148, 163, 184, 0.16)" },
      ticks: {
        color: "rgba(148, 163, 184, 0.92)",
        font: { size: 10 },
        callback: (value) => `${Number(value) / 1000}k`,
      },
    },
  },
};

export function FinancePage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Finance", "Tài chính")}
        title={copy("Revenue Snapshot", "Tổng quan doanh thu")}
        description={copy(
          "A compact view of creator revenue across the main platforms.",
          "Góc nhìn gọn về doanh thu creator trên các nền tảng chính.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300"
          >
            {copy("Demo snapshot", "Bản demo")}
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label={copy("Total Revenue", "Tổng tiền kiếm được")}
          value={vndFormatter.format(totalRevenue)}
          detail={copy(
            "Across tracked platforms",
            "Từ các nền tảng đang theo dõi",
          )}
          icon={<Coins className="size-5" />}
        />
        <MetricCard
          label={copy("Top Platform", "Nền tảng cao nhất")}
          value={topPlatform.platform}
          detail={vndFormatter.format(topPlatform.amount)}
          icon={<TrendingUp className="size-5" />}
        />
        <MetricCard
          label={copy("Tracked Platforms", "Nền tảng theo dõi")}
          value={String(platformRevenue.length)}
          detail={copy(
            "Instagram, TikTok, Facebook",
            "Instagram, TikTok, Facebook",
          )}
          icon={<ReceiptText className="size-5" />}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PanelCard
          title={copy("Revenue By Platform", "Doanh thu theo nền tảng")}
          description={copy(
            "VND amount grouped by social channel.",
            "Số tiền VND được nhóm theo từng kênh mạng xã hội.",
          )}
        >
          <BarTrendChart
            data={revenueChartData}
            options={revenueChartOptions}
            className="bg-linear-to-br from-emerald-100/55 via-card to-sky-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-sky-500/10"
          />
        </PanelCard>

        <PanelCard
          title={copy("Platform Payouts", "Số tiền từng nền tảng")}
          description={copy(
            "A short breakdown for quick review.",
            "Bảng chia nhỏ để kiểm tra nhanh.",
          )}
        >
          <div className="space-y-3">
            {platformRevenue.map((item) => (
              <div
                key={item.platform}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/65 bg-background/65 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.platform}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {copy("Recorded amount", "Tiền ghi nhận")}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {vndFormatter.format(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
