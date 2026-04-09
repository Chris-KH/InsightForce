import { motion } from "motion/react";

import { RevealBlock } from "@/components/app-futuristic";
import { useBilingual } from "@/hooks/use-bilingual";

export function SentimentDonut() {
  const copy = useBilingual();

  const legendRows = [
    {
      key: "positive",
      label: copy("Positive", "Tích cực"),
      value: "4,120",
      dot: "bg-primary",
    },
    {
      key: "neutral",
      label: copy("Neutral", "Trung tính"),
      value: "1,204",
      dot: "bg-chart-3",
    },
    {
      key: "negative",
      label: copy("Negative", "Tiêu cực"),
      value: "943",
      dot: "bg-destructive",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-9">
      <RevealBlock className="flex justify-center lg:justify-start">
        <div className="relative grid size-48 place-items-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,var(--primary)_0_65%,var(--chart-3)_65_85%,var(--destructive)_85_100%)] shadow-[0_20px_38px_rgba(15,23,42,0.2)]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />

          <div className="absolute inset-3 rounded-full border border-border/70 bg-background/92 shadow-inner" />

          <div className="relative z-10 text-center">
            <p className="font-heading text-4xl font-semibold text-foreground">
              65%
            </p>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {copy("Positive", "Tích cực")}
            </p>
          </div>

          <motion.span
            className="absolute top-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary"
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
            style={{ transformOrigin: "50% 5.5rem" }}
          />
        </div>
      </RevealBlock>

      <div className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
        {legendRows.map((row, index) => (
          <RevealBlock key={row.key} delay={0.04 * index}>
            <div className="flex items-center gap-3 rounded-xl border border-border/65 bg-background/75 px-3 py-2.5">
              <span className={"size-2 rounded-full " + row.dot} />
              <span>{row.label}</span>
              <span className="ml-auto font-medium text-foreground">
                {row.value}
              </span>
            </div>
          </RevealBlock>
        ))}
      </div>
    </div>
  );
}
