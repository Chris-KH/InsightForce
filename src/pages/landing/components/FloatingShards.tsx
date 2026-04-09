import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type ShardDensity = "low" | "medium" | "high";
type ShardTone = "primary" | "chart" | "mixed";

type FloatingShardsProps = {
  className?: string;
  density?: ShardDensity;
  tone?: ShardTone;
};

type ShardSeed = {
  top: string;
  left: string;
  width: number;
  height: number;
  tilt: number;
  delay: number;
  duration: number;
};

const SHARDS: ShardSeed[] = [
  {
    top: "8%",
    left: "14%",
    width: 16,
    height: 30,
    tilt: -24,
    delay: 0.1,
    duration: 8.6,
  },
  {
    top: "18%",
    left: "37%",
    width: 12,
    height: 26,
    tilt: 31,
    delay: 1.25,
    duration: 9.1,
  },
  {
    top: "29%",
    left: "72%",
    width: 14,
    height: 24,
    tilt: -16,
    delay: 0.6,
    duration: 8.8,
  },
  {
    top: "38%",
    left: "55%",
    width: 18,
    height: 34,
    tilt: 20,
    delay: 2.05,
    duration: 9.4,
  },
  {
    top: "51%",
    left: "24%",
    width: 13,
    height: 26,
    tilt: -33,
    delay: 1.4,
    duration: 8.9,
  },
  {
    top: "64%",
    left: "78%",
    width: 12,
    height: 28,
    tilt: 24,
    delay: 0.42,
    duration: 8.4,
  },
  {
    top: "72%",
    left: "46%",
    width: 15,
    height: 32,
    tilt: -27,
    delay: 2.2,
    duration: 9.6,
  },
  {
    top: "84%",
    left: "18%",
    width: 11,
    height: 22,
    tilt: 18,
    delay: 1.85,
    duration: 8.2,
  },
  {
    top: "89%",
    left: "62%",
    width: 13,
    height: 24,
    tilt: -14,
    delay: 2.45,
    duration: 8.8,
  },
];

const DENSITY_TOTAL: Record<ShardDensity, number> = {
  low: 4,
  medium: 6,
  high: 9,
};

function shardClass(index: number, tone: ShardTone) {
  if (tone === "primary") {
    return "bg-primary/34 border-primary/45";
  }

  if (tone === "chart") {
    return "bg-chart-1/34 border-chart-1/45";
  }

  return index % 2 === 0
    ? "bg-primary/33 border-primary/42"
    : "bg-chart-1/33 border-chart-1/42";
}

export function FloatingShards({
  className,
  density = "medium",
  tone = "mixed",
}: FloatingShardsProps) {
  const visible = SHARDS.slice(0, DENSITY_TOTAL[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((shard, index) => (
        <motion.span
          key={`${shard.left}-${shard.top}-${shard.delay}`}
          className={cn(
            "absolute block rounded-[3px] border backdrop-blur-[1px]",
            shardClass(index, tone),
          )}
          style={{
            top: shard.top,
            left: shard.left,
            width: `${shard.width}px`,
            height: `${shard.height}px`,
            transform: `rotate(${shard.tilt}deg)`,
          }}
          animate={{
            opacity: [0.16, 0.58, 0.16],
            y: [0, -16, 0],
            rotate: [shard.tilt, shard.tilt + 14, shard.tilt],
          }}
          transition={{
            duration: shard.duration,
            delay: shard.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
