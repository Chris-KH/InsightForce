import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PanelCard } from "@/components/app-section";

export function DashboardInsightsColumn() {
  return (
    <aside className="flex flex-col gap-6">
      <Card className="rounded-3xl border border-amber-200/70 bg-amber-100/70 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">
              AI Strategy
            </CardTitle>
            <Sparkles className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-amber-500/30 text-amber-700"
          >
            Action Required
          </Badge>
          <p className="text-sm leading-7 text-foreground/80">
            Scout Agent wants to launch a $50 ad campaign for{" "}
            <strong>Spring Gear Review</strong>.
          </p>
          <div className="flex gap-3">
            <Button className="flex-1 rounded-full bg-primary text-primary-foreground">
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-border/70"
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      <PanelCard
        title="Optimization Tip"
        description="AI suggestions to improve retention and watch depth."
      >
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-muted/40 px-4 py-4 text-sm leading-7 text-muted-foreground">
            Your audience loves the{" "}
            <span className="font-medium text-primary">
              "behind-the-scenes"
            </span>{" "}
            segments. Consider adding one more in your next video to increase
            retention.
          </div>
          <Button variant="outline" className="rounded-full">
            View Full Report
          </Button>
        </div>
      </PanelCard>

      <PanelCard
        title="Guardian Status"
        description="Spam and sentiment protection across the channel."
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spam hidden</span>
            <span className="font-semibold text-foreground">124</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[76%] rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            Active protection over comments and mentions.
          </p>
        </div>
      </PanelCard>

      <Card className="overflow-hidden rounded-3xl border border-border/60 shadow-sm">
        <div
          className="relative min-h-56 overflow-hidden p-6 text-background"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(51,65,85,0.4) 45%, rgba(74,124,89,0.6) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-background/70 uppercase">
                Next Milestone
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold">
                Reach 10k Subs
              </h3>
            </div>
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-background/20">
                <div className="h-full w-[72%] rounded-full bg-background" />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-background/80">
                <span>72%</span>
                <span>Projected this month</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
