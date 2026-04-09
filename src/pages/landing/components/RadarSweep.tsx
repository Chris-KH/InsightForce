import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type RadarSweepProps = {
  className?: string;
  intensity?: "soft" | "medium" | "strong";
};

const INTENSITY: Record<
  NonNullable<RadarSweepProps["intensity"]>,
  { ring: string; pulse: string }
> = {
  soft: { ring: "border-foreground/20", pulse: "bg-primary/34" },
  medium: { ring: "border-foreground/28", pulse: "bg-primary/42" },
  strong: { ring: "border-foreground/36", pulse: "bg-primary/52" },
};

const BLIPS = [
  { top: "26%", left: "62%", delay: 0.2 },
  { top: "39%", left: "41%", delay: 1.1 },
  { top: "58%", left: "68%", delay: 1.9 },
  { top: "70%", left: "33%", delay: 0.75 },
  { top: "79%", left: "57%", delay: 2.2 },
];

export function RadarSweep({
  className,
  intensity = "medium",
}: RadarSweepProps) {
  const tone = INTENSITY[intensity];

  return (
    <div className={cn("pointer-events-none absolute", className)} aria-hidden>
      <div className="relative h-full w-full">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 58%), repeating-radial-gradient(circle, color-mix(in oklch, var(--foreground) 16%, transparent) 0 1px, transparent 1px 22px)",
          }}
        />

        {[0, 1, 2].map((idx) => (
          <div
            key={`radar-ring-${idx}`}
            className={cn("absolute inset-1/2 rounded-full border", tone.ring)}
            style={{
              width: `${34 + idx * 28}%`,
              height: `${34 + idx * 28}%`,
              marginLeft: `${-(34 + idx * 28) * 0.5}%`,
              marginTop: `${-(34 + idx * 28) * 0.5}%`,
            }}
          />
        ))}

        <motion.div
          className="absolute inset-[3%] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, color-mix(in oklch, var(--primary) 0%, transparent), color-mix(in oklch, var(--primary) 64%, transparent), color-mix(in oklch, var(--primary) 0%, transparent))",
            maskImage:
              "radial-gradient(circle, transparent 16%, black 48%, black 100%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "linear" }}
        />

        {BLIPS.map((blip) => (
          <motion.span
            key={`${blip.top}-${blip.left}`}
            className={cn("absolute size-2 rounded-full", tone.pulse)}
            style={{ top: blip.top, left: blip.left }}
            animate={{ opacity: [0.15, 1, 0.2], scale: [0.7, 1.35, 0.84] }}
            transition={{
              duration: 2.5,
              delay: blip.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
