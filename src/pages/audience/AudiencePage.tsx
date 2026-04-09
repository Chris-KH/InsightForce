import { Download, SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { ContextPanel } from "@/pages/audience/components/ContextPanel";
import { SemanticClusterPanel } from "@/pages/audience/components/SemanticClusterPanel";
import { SentimentOverviewGrid } from "@/pages/audience/components/SentimentOverviewGrid";
import { VideoLabPanel } from "@/pages/audience/components/VideoLabPanel";

export function AudiencePage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Audience Intelligence", "Trí tuệ khách hàng")}
        title={copy("Content Architect", "Thiết kế phân luồng nội dung")}
        description={copy(
          "Decoding audience psychology through unstructured data.",
          "Giải mã tâm lý khách hàng qua dữ liệu phi cấu trúc.",
        )}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <SlidersHorizontal data-icon="inline-start" />
              {copy("Filters", "Bộ lọc")}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <Download data-icon="inline-start" />
              {copy("Export", "Xuất")}
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground">
              <Sparkles data-icon="inline-start" />
              {copy("Sync Data", "Đồng bộ dữ liệu")}
            </Button>
          </div>
        }
      />

      <SemanticClusterPanel />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <VideoLabPanel />
        <ContextPanel />
      </div>

      <SentimentOverviewGrid />
    </div>
  );
}
