import { motion } from "motion/react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function RoiPredictorPanel() {
  const copy = useBilingual();

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];
  const xPoints = [30, 110, 190, 270, 350, 430, 490] as const;
  const suggestedY = [190, 168, 140, 124, 92, 80, 58] as const;
  const baselineY = [205, 180, 150, 140, 110, 92, 70] as const;

  const buildLinePath = (values: readonly number[]) =>
    values
      .map((y, index) => `${index === 0 ? "M" : "L"}${xPoints[index]} ${y}`)
      .join(" ");

  const suggestedPath = buildLinePath(suggestedY);
  const baselinePath = buildLinePath(baselineY);
  const areaPath = `${suggestedPath} L490 220 L30 220 Z`;

  return (
    <PanelCard
      title={copy("ROI Predictor", "Dự báo ROI")}
      description={copy(
        "6-Month Strategic Projection",
        "Dự phóng chiến lược 6 tháng",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-background/70 p-4">
        <SurfaceGrid className="opacity-26" />

        <div className="relative flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            {copy("Suggested", "Đề xuất")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-muted-foreground" />
            {copy("Baseline", "Cơ sở")}
          </span>
        </div>

        <RevealBlock delay={0.05}>
          <div className="relative mt-3 overflow-hidden rounded-2xl border border-border/65 bg-card/80 p-3">
            <svg viewBox="0 0 520 220" className="h-60 w-full">
              <g
                className="text-border/80"
                stroke="currentColor"
                strokeDasharray="4 6"
              >
                <path d="M30 24 L490 24" />
                <path d="M30 72 L490 72" />
                <path d="M30 120 L490 120" />
                <path d="M30 168 L490 168" />
              </g>

              <motion.path
                d={baselinePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeDasharray="6 6"
                className="text-muted-foreground/55"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />

              <motion.path
                d={areaPath}
                className="text-primary/16"
                fill="currentColor"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              />

              <motion.path
                d={suggestedPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-primary"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.12 }}
              />

              {xPoints.map((x, index) => (
                <motion.circle
                  key={x}
                  cx={x}
                  cy={suggestedY[index]}
                  r="4"
                  className="fill-primary"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.08 }}
                />
              ))}
            </svg>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>

            <div className="absolute top-5 right-5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              {copy("+42% Peak Alpha", "+42% đỉnh tăng trưởng")}
            </div>
          </div>
        </RevealBlock>
      </div>
    </PanelCard>
  );
}
