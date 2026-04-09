import { PulseDot } from "@/components/app-futuristic";
import { SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import { ChannelHealthPanel } from "@/pages/dashboard/components/ChannelHealthPanel";
import { DashboardInsightsColumn } from "@/pages/dashboard/components/DashboardInsightsColumn";
import { DashboardMetrics } from "@/pages/dashboard/components/DashboardMetrics";
import { TopVideosPanel } from "@/pages/dashboard/components/TopVideosPanel";

export function DashboardPage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,0.86fr)]">
      <div className="flex flex-col gap-8">
        <SectionHeader
          eyebrow={copy("Control Center", "Trung tâm điều phối")}
          title={copy("Channel Overview", "Tổng quan kênh")}
          description={copy(
            "Deep insights into your content ecosystem.",
            "Thông tin chuyên sâu về hệ sinh thái nội dung của bạn.",
          )}
          action={
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
            >
              <PulseDot className="mr-2" />
              {copy("Neural Sync Active", "Đồng bộ neural đang chạy")}
            </Badge>
          }
        />
        <DashboardMetrics />
        <ChannelHealthPanel />
        <TopVideosPanel />
      </div>

      <DashboardInsightsColumn />
    </div>
  );
}
