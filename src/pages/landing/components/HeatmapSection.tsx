import { Card } from "@/components/ui/card";
import { HEATMAP_IMAGE } from "../data";

export function HeatmapSection() {
  return (
    <section className="bg-card px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
          <h2 className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            Global Sentiment Heatmap
          </h2>
          <p className="text-[15px] leading-7 text-muted-foreground sm:text-base">
            Visualize how the world feels about your brand in real-time. Our
            organic mapping layers cultural nuance over raw frequency data.
          </p>
        </div>

        <Card className="relative overflow-hidden rounded-2xl border border-border/50 p-0">
          <img
            src={HEATMAP_IMAGE}
            alt="World heatmap visualization"
            className="h-95 w-full object-cover grayscale sm:h-125"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-br from-background/20 via-transparent to-background/35" />
          <div className="absolute top-[30%] left-8 size-24 rounded-full bg-primary/35 blur-3xl" />
          <div className="absolute top-[22%] right-[18%] size-32 rounded-full bg-chart-1/45 blur-3xl" />
          <div className="absolute bottom-4 left-4 flex flex-col gap-2.5 sm:bottom-6 sm:left-6 sm:gap-3">
            <div className="rounded-xl border border-border/40 bg-background/75 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-xs font-medium sm:text-sm">
                Positive Growth: +4.2k mentions
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/75 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-xs font-medium sm:text-sm">
                Critical Interest: +1.8k mentions
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
