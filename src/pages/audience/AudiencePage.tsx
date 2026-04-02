import { Download, SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { ContextPanel } from "@/pages/audience/components/ContextPanel";
import { SemanticClusterPanel } from "@/pages/audience/components/SemanticClusterPanel";
import { SentimentOverviewGrid } from "@/pages/audience/components/SentimentOverviewGrid";
import { VideoLabPanel } from "@/pages/audience/components/VideoLabPanel";

export function AudiencePage() {
  return (
    <div className="grid gap-8">
      <SectionHeader
        title="Content Architect"
        description="Decoding audience psychology through unstructured data."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filters
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <Download data-icon="inline-start" />
              Export
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground">
              <Sparkles data-icon="inline-start" />
              Sync Data
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
