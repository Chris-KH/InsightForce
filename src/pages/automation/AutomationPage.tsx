import { SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { AgentStatusGrid } from "@/pages/automation/components/AgentStatusGrid";
import { ModerationLogPanel } from "@/pages/automation/components/ModerationLogPanel";
import { ReasoningTracePanel } from "@/pages/automation/components/ReasoningTracePanel";

export function AutomationPage() {
  return (
    <div className="grid gap-8">
      <SectionHeader
        title="Agent Orchestration Hub"
        description="War Room: 3 Agents Active • 14 Operations Today"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <SlidersHorizontal data-icon="inline-start" />
              Pause Global Hub
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground">
              <Sparkles data-icon="inline-start" />
              Deploy Agent
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
