import { SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { AgentStatusGrid } from "@/pages/automation/components/AgentStatusGrid";
import { ModerationLogPanel } from "@/pages/automation/components/ModerationLogPanel";
import { ReasoningTracePanel } from "@/pages/automation/components/ReasoningTracePanel";

export function AutomationPage() {
  const copy = useBilingual();

  return (
    <div className="grid gap-8">
      <SectionHeader
        title={copy(
          "Agent Orchestration Hub",
          "Trung tâm điều phối tác vụ viên",
        )}
        description={copy(
          "War Room: 3 Agents Active • 14 Operations Today",
          "Phòng điều hành: 3 tác vụ viên đang hoạt động • 14 tác vụ hôm nay",
        )}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <SlidersHorizontal data-icon="inline-start" />
              {copy("Pause Global Hub", "Tạm dừng trung tâm toàn cục")}
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground">
              <Sparkles data-icon="inline-start" />
              {copy("Deploy Agent", "Triển khai tác vụ viên")}
            </Button>
          </div>
        }
      />

      <AgentStatusGrid />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ModerationLogPanel />
        <ReasoningTracePanel />
      </div>
    </div>
  );
}
