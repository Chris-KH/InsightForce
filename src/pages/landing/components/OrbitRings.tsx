import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type OrbitTone = "primary" | "chart" | "mixed";

type OrbitRingsProps = {
  className?: string;
  tone?: OrbitTone;
  spin?: "slow" | "medium" | "fast";
};

const SPEED_SECONDS: Record<NonNullable<OrbitRingsProps["spin"]>, number> = {
  slow: 22,
  medium: 16,
  fast: 11,
};

function ringClass(index: number, tone: OrbitTone) {
  if (tone === "primary") {
    return "border-primary/45";
  }

  if (tone === "chart") {
    return "border-chart-1/42";
  }

  return index % 2 === 0 ? "border-primary/44" : "border-chart-1/42";
}

function orbClass(index: number, tone: OrbitTone) {
  if (tone === "primary") {
    return "bg-primary/82";
  }

  if (tone === "chart") {
    return "bg-chart-1/82";
  }

  return index % 2 === 0 ? "bg-primary/80" : "bg-chart-1/80";
}

export function OrbitRings({
  className,
  tone = "mixed",
  spin = "medium",
}: OrbitRingsProps) {
  const base = SPEED_SECONDS[spin];

  return (
    <div
      className={cn("pointer-events-none absolute isolate", className)}
      aria-hidden
    >
      <motion.div
        className="absolute inset-1/2 h-18 w-18 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/14 blur-2xl"
        animate={{ opacity: [0.2, 0.52, 0.2], scale: [0.92, 1.14, 0.92] }}
        transition={{
          duration: base * 0.62,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {[0, 1, 2].map((index) => {
        const size = 100 + index * 44;

        return (
          <motion.div
            key={`orbit-${index}`}
            className={cn(
              "absolute inset-1/2 rounded-full border border-dashed",
              ringClass(index, tone),
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${size * -0.5}px`,
              marginTop: `${size * -0.5}px`,
            }}
            animate={{ rotate: index % 2 === 0 ? [0, 360] : [360, 0] }}
            transition={{
              duration: base + index * 4.2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              className={cn(
                "absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]",
                orbClass(index, tone),
              )}
            />
          </motion.div>
        );
      })}

      <motion.div
        className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70"
        animate={{ opacity: [0.36, 1, 0.36], scale: [0.84, 1.22, 0.84] }}
        transition={{
          duration: base * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
