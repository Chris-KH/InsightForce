import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FORGE_FEATURES } from "../data";

export function ContentForgeSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-7">
          <h2 className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            Content Forge
          </h2>
          <p className="text-[15px] leading-7 text-muted-foreground sm:text-base">
            Our transformation engine distills raw customer feedback and social
            noise into high-impact content strategy.
          </p>

          <ul className="flex flex-col gap-5">
            {FORGE_FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <div
                  className={cn(
                    "mt-1 inline-flex size-11 items-center justify-center rounded-lg",
                    feature.iconClass,
                  )}
                >
                  <feature.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-[1.35rem] leading-7 font-medium sm:text-[1.55rem]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="min-h-44 border border-border/70 bg-muted/40">
            <CardContent className="flex h-full flex-col justify-center gap-3">
              <div className="h-2 w-3/4 rounded-full bg-muted-foreground/25" />
              <div className="h-2 w-1/2 rounded-full bg-muted-foreground/15" />
              <div className="h-2 w-full rounded-full bg-muted-foreground/25" />
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Raw Comment Data
              </p>
            </CardContent>
          </Card>

          <Card className="min-h-44 border border-primary/30 bg-primary/10">
            <CardContent className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Sparkles className="size-8 text-primary" />
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Processing...
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2 border border-border/70 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-[1.45rem] leading-8 text-primary sm:text-[1.6rem]">
                Marketing Strategy Alpha
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Primary Theme</span>
                <span className="font-semibold">
                  Sustainability &amp; Trust
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Key Channel</span>
                <span className="font-semibold">Organic Search</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Expected Conversion
                </span>
                <span className="font-semibold text-primary">+28%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
