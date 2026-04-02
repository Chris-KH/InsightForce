import { Clock3, MoreVertical, PlayCircle, Shield, Wand2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/app-section";

const AGENTS = [
  {
    name: "Guardian Agent",
    status: "Active",
    icon: Shield,
    reason: "Content Integrity",
    progress: 84,
    detail:
      "Analyzing semantic drift in community thread #429 for potential toxic pivot.",
    impact: "122 actions prevented spam today.",
  },
  {
    name: "Content Architect",
    status: "Active",
    icon: Wand2,
    reason: "Campaign Structuring",
    progress: 32,
    detail:
      "Drafting modular response templates for the next launch based on 2023 engagement data.",
    impact: "Generated 4 high-quality campaign drafts.",
  },
  {
    name: "Scout Executor",
    status: "Idle",
    icon: PlayCircle,
    reason: "Waiting for trigger",
    progress: 0,
    detail: "Ready to deploy data extraction tasks on the next signal.",
    impact: "Last active: 22 minutes ago.",
  },
] as const;

export function AgentStatusGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {AGENTS.map((agent) => {
        const Icon = agent.icon;
        const isIdle = agent.status === "Idle";

        return (
          <Card
            key={agent.name}
            className={
              isIdle
                ? "rounded-3xl border-border/60 bg-muted/20 opacity-80 shadow-sm"
                : "rounded-3xl border-border/60 shadow-sm"
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-[1.6rem] leading-tight font-semibold text-foreground">
                      {agent.name}
                    </CardTitle>
                    <div className="mt-1 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                      <span
                        className={
                          isIdle
                            ? "size-2 rounded-full bg-muted-foreground"
                            : "size-2 rounded-full bg-primary"
                        }
                      />
                      {agent.status}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                >
                  <MoreVertical />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reasoning: {agent.reason}</span>
                  <span>{agent.progress}%</span>
                </div>
                <ProgressBar value={agent.progress} />
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-4 text-sm leading-7 text-muted-foreground">
                <strong className="text-foreground">Live Logic:</strong>{" "}
                {agent.detail}
              </div>
              <div className="flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <Clock3 className="size-4" />
                <span>{agent.impact}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
