import { SectionHeader } from "@/components/app-section";
import { ChannelHealthPanel } from "@/pages/dashboard/components/ChannelHealthPanel";
import { DashboardInsightsColumn } from "@/pages/dashboard/components/DashboardInsightsColumn";
import { DashboardMetrics } from "@/pages/dashboard/components/DashboardMetrics";
import { TopVideosPanel } from "@/pages/dashboard/components/TopVideosPanel";

export function DashboardPage() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.9fr)_minmax(340px,0.86fr)]">
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Channel Overview"
          description="Deep insights into your content ecosystem."
        />
        <DashboardMetrics />
        <ChannelHealthPanel />
        <TopVideosPanel />
      </div>

      <DashboardInsightsColumn />
    </div>
  );
}
