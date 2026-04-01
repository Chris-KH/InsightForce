import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HERO_IMAGE, TRUSTED_AVATARS } from "../data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-18 sm:px-6 sm:pt-14 sm:pb-22 lg:px-8 lg:pt-18 lg:pb-28">
      <div className="absolute top-0 right-0 -z-10 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 -z-10 size-96 rounded-full bg-chart-1/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="flex flex-col gap-8">
          <div className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[10px] leading-none font-semibold tracking-[0.15em] text-primary uppercase sm:text-xs">
            Transforming raw data into actionable wisdom
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="font-heading text-[2.5rem] leading-[0.98] font-semibold tracking-tight text-foreground sm:text-[3.35rem] lg:text-[4.8rem]">
              Forge Your Path with{" "}
              <span className="text-primary italic">Organic AI</span>
            </h1>
            <p className="max-w-[60ch] text-[15px] leading-7 text-muted-foreground sm:text-lg">
              Deep analytics, sentiment tracking, and predictive modeling rooted
              in human intelligence. Grow your business on the bedrock of real
              insights.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-[15px] font-semibold">
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-[15px] font-semibold"
            >
              Watch Strategy Demo
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex">
              {TRUSTED_AVATARS.map((avatar, index) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="Team member avatar"
                  className={cn(
                    "size-9 rounded-full border-2 border-background object-cover sm:size-10",
                    index !== 0 && "-ml-2",
                  )}
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Trusted by 2,000+ data-driven companies
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rotate-2 rounded-2xl bg-primary/15" />
          <Card className="relative overflow-hidden rounded-2xl border border-border/70 p-0 shadow-2xl">
            <img
              src={HERO_IMAGE}
              alt="Analytics dashboard overview"
              className="h-85 w-full object-cover sm:h-105"
              loading="lazy"
            />
            <Card className="absolute right-4 bottom-4 left-4 gap-3 rounded-xl border border-border/60 bg-background/80 py-4 backdrop-blur-md sm:right-5 sm:bottom-5 sm:left-5">
              <CardHeader className="px-4 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">
                    Live Growth Index
                  </CardTitle>
                  <p className="text-sm font-semibold text-primary">+12.4%</p>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-0">
                <div className="flex h-12 items-end gap-1.5 sm:h-14">
                  {[30, 45, 40, 65, 88, 78].map((height) => (
                    <div
                      key={height}
                      className="w-full rounded-sm bg-primary/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Card>
        </div>
      </div>
    </section>
  );
}
