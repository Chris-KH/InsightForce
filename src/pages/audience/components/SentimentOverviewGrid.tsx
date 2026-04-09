import { motion } from "motion/react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBilingual } from "@/hooks/use-bilingual";
import { SentimentDonut } from "@/pages/audience/components/SentimentDonut";

const SENTIMENT_BARS = [24, 32, 26, 44, 58, 42, 66];

export function SentimentOverviewGrid() {
  const copy = useBilingual();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <RevealBlock>
        <Card className="relative rounded-3xl border-border/70 bg-card/85 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <SurfaceGrid className="opacity-25" />
          </div>

          <CardHeader className="relative pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                  {copy("Overall Sentiment Share", "Tỷ lệ cảm xúc tổng thể")}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {copy(
                    "Audience mood across the last 30 days.",
                    "Xu hướng cảm xúc của khách hàng trong 30 ngày gần nhất.",
                  )}
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/20 bg-background/80 text-primary"
              >
                {copy("65% Positive", "65% Tích cực")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="rounded-2xl border border-border/65 bg-background/75 p-4">
              <SentimentDonut />
            </div>
          </CardContent>
        </Card>
      </RevealBlock>

      <RevealBlock delay={0.06}>
        <Card className="relative rounded-3xl border-border/70 bg-card/85 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <SurfaceGrid className="opacity-25" />
          </div>

          <CardHeader className="relative pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                  {copy(
                    "Sentiment Over Time",
                    "Biến động cảm xúc theo thời gian",
                  )}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {copy("Last 7 days", "7 ngày gần nhất")}
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/20 bg-background/80 text-primary"
              >
                {copy("Trending Up", "Đang tăng")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="relative rounded-2xl border border-border/65 bg-background/75 p-4">
              <SurfaceGrid className="opacity-25" />
              <div className="relative flex h-56 items-end gap-2">
                {SENTIMENT_BARS.map((bar, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ height: 0, opacity: 0.35 }}
                      whileInView={{ height: `${bar}%`, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className={
                        index === 6
                          ? "w-full rounded-t-2xl bg-linear-to-t from-primary/70 to-primary"
                          : "w-full rounded-t-2xl bg-linear-to-t from-primary/40 to-primary/75"
                      }
                    />
                    <span className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      {
                        [
                          copy("Mon", "T2"),
                          copy("Tue", "T3"),
                          copy("Wed", "T4"),
                          copy("Thu", "T5"),
                          copy("Fri", "T6"),
                          copy("Sat", "T7"),
                          copy("Sun", "CN"),
                        ][index]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </RevealBlock>
    </div>
  );
}
