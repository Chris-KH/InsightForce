import { SectionHeader } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { ChannelHealthPanel } from "@/pages/dashboard/components/ChannelHealthPanel";
import { DashboardInsightsColumn } from "@/pages/dashboard/components/DashboardInsightsColumn";
import { DashboardMetrics } from "@/pages/dashboard/components/DashboardMetrics";
import { TopVideosPanel } from "@/pages/dashboard/components/TopVideosPanel";

export function DashboardPage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.9fr)_minmax(340px,0.86fr)]">
      <div className="flex flex-col gap-8">
        <SectionHeader
          title={copy("Channel Overview", "Tổng quan kênh")}
          description={copy(
            "Deep insights into your content ecosystem.",
            "Thông tin chuyên sâu về hệ sinh thái nội dung của bạn.",
          )}
        />
        <DashboardMetrics />
        <ChannelHealthPanel />
        <TopVideosPanel />
      </div>

      <DashboardInsightsColumn />
    </div>
  );
}
