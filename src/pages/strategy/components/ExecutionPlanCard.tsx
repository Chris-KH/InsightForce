import {
  CheckCircle2,
  Edit3,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExecutionPlanCard() {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-3xl leading-tight font-semibold text-foreground">
              Draft Execution Plan
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Focus: Eco-friendly AI Hardware (v1.2)
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="icon-sm">
              <RefreshCw />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Share2 />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-190 flex-col gap-6 px-6 pt-6 pb-7 sm:px-8">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            Content Topic
          </p>
          <h3 className="mt-3 font-heading text-4xl leading-tight font-semibold text-foreground">
            The Secret Carbon Cost of Your AI: How to Build Greener Workflows
          </h3>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/25 px-5 py-5">
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            The Hook
          </div>
          <p className="text-sm leading-7 text-muted-foreground italic">
            "Every prompt you send to a cloud-based LLM has a water and carbon
            footprint equivalent to a bottle of water. But what if you could run
            a 70B parameter model locally on 100% solar power?"
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            Body Outline
          </p>
          <ol className="mt-4 flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                1
              </span>
              <span>
                <strong className="text-foreground">
                  The Invisible Impact:
                </strong>{" "}
                Break down the current energy metrics of major data centers
                versus consumer hardware.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                2
              </span>
              <span>
                <strong className="text-foreground">
                  The Local Revolution:
                </strong>{" "}
                Showcase the new NPUs from Apple, Intel, and AMD that prioritize
                efficiency.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                3
              </span>
              <span>
                <strong className="text-foreground">Step-by-Step Guide:</strong>{" "}
                How to set up LM Studio or Ollama with a focus on undervolting
                for max efficiency.
              </span>
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/25 px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            CTA (Call to Action)
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            "Download my Green AI hardware checklist and see which 2024 laptop
            is best for local inference. Link in bio."
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Resource Allocation
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Edit3 className="size-4" />
                Editor @Elena_VFX
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Thumbnails @Arto_Design
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Estimated Budget
            </p>
            <p className="mt-2 font-heading text-4xl font-semibold text-primary">
              $450.00
            </p>
            <p className="text-xs text-muted-foreground">
              Includes pre-production and ad spend
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-center pt-2">
          <Button className="h-12 rounded-full bg-primary px-8 text-primary-foreground">
            Finalize &amp; Execute Plan
            <Rocket data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
