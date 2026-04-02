import { Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";

export function ReasoningTracePanel() {
  return (
    <PanelCard
      title="Reasoning Trace Viewer"
      description="Context-aware moderation flow from raw signal to action."
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 text-primary"
        >
          Focused: Guardian Action @14:24:10
        </Badge>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-4">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            <TriangleAlert className="size-3.5" />
            Input Signal Extraction
          </p>
          <p className="mt-3 rounded-2xl bg-background px-4 py-4 text-sm leading-7 text-muted-foreground">
            "The user @user_92 posted: \"This project is absolute trash, you
            should all quit.\" in Thread #81."
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background px-4 py-4">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            Chain of Thought Analysis
          </p>
          <ol className="mt-4 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">1.</strong> Identity Check:
              user_92 is an unverified account created 2 hours ago.
            </li>
            <li>
              <strong className="text-foreground">2.</strong> Semantic Check:
              keywords imply abusive language and a direct threat to community
              morale.
            </li>
            <li>
              <strong className="text-foreground">3.</strong> Context Check:
              thread #81 uses strict moderation settings and has prior reports.
            </li>
            <li>
              <strong className="text-foreground">4.</strong> Synthesis: content
              violates policy and should be removed immediately.
            </li>
          </ol>
        </div>
      </div>
    </PanelCard>
  );
}
