import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ExecutiveProjectionsSection() {
  return (
    <section className="bg-linear-to-b from-foreground to-foreground/95 px-4 py-16 text-background sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
              Executive Intelligence Projections
            </h2>
            <p className="text-[15px] leading-7 text-background/75 sm:text-base">
              The Scout & Executor agent doesn&apos;t just run campaigns; it
              calculates future outcomes. See your revenue trajectory before you
              spend a single dollar on production.
            </p>
          </div>
          <Button className="h-12 w-fit bg-primary px-7 text-primary-foreground hover:bg-primary/80">
            Unlock Premium Projections
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.9fr_2.1fr]">
          <Card className="border border-white/10 bg-white/5 text-background backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-[2.4rem] leading-none text-chart-1">
                $4.2M
              </CardTitle>
              <CardDescription className="tracking-[0.12em] text-background/70 uppercase">
                Projected Creator ARR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-end gap-1.5">
                {[40, 62, 48, 90, 76, 96].map((height) => (
                  <div
                    key={height}
                    className="w-2 rounded-full bg-chart-1/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-chart-1/90">Scout Confidence: 94.2%</p>
            </CardFooter>
          </Card>

          <Card className="border border-white/10 bg-white/5 text-background backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Audience Retention Forecast</CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-primary" />
                    Retention
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-destructive" />
                    Risk
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-56 border-b border-white/10 pb-3">
                <svg viewBox="0 0 420 120" className="size-full">
                  <path
                    d="M0 95 Q52 12 104 86 T210 62 T318 35 T420 70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-primary"
                  />
                  <circle
                    cx="104"
                    cy="86"
                    r="5"
                    className="fill-background stroke-primary"
                    strokeWidth="2"
                  />
                  <circle
                    cx="318"
                    cy="35"
                    r="5"
                    className="fill-background stroke-primary"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-4 text-center text-[11px] tracking-[0.12em] text-background/70 uppercase">
                <span>Phase 1: Deployment</span>
                <span>Phase 2: Scaling</span>
                <span>Phase 3: Optimization</span>
                <span>Phase 4: Domination</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
