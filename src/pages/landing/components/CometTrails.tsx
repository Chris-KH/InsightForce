import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type TrailDensity = "low" | "medium" | "high";
type TrailDirection = "left-to-right" | "right-to-left" | "diagonal";
type TrailTone = "primary" | "chart" | "mixed";

type CometTrailsProps = {
  className?: string;
  density?: TrailDensity;
  direction?: TrailDirection;
  tone?: TrailTone;
};

type CometSeed = {
  top: string;
  left: string;
  width: number;
  delay: number;
  duration: number;
  tilt: number;
  drift: number;
};

const COMET_SEEDS: CometSeed[] = [
  {
    top: "8%",
    left: "6%",
    width: 138,
    delay: 0.2,
    duration: 6.8,
    tilt: 9,
    drift: 180,
  },
  {
    top: "17%",
    left: "28%",
    width: 112,
    delay: 1.15,
    duration: 7.2,
    tilt: 12,
    drift: 172,
  },
  {
    top: "29%",
    left: "11%",
    width: 122,
    delay: 0.65,
    duration: 6.9,
    tilt: -7,
    drift: 194,
  },
  {
    top: "37%",
    left: "48%",
    width: 140,
    delay: 1.75,
    duration: 7.6,
    tilt: 10,
    drift: 186,
  },
  {
    top: "52%",
    left: "18%",
    width: 124,
    delay: 0.45,
    duration: 6.6,
    tilt: -5,
    drift: 170,
  },
  {
    top: "61%",
    left: "44%",
    width: 146,
    delay: 2.1,
    duration: 7.8,
    tilt: 8,
    drift: 198,
  },
  {
    top: "73%",
    left: "8%",
    width: 116,
    delay: 1.32,
    duration: 6.9,
    tilt: -8,
    drift: 165,
  },
  {
    top: "78%",
    left: "35%",
    width: 132,
    delay: 2.45,
    duration: 7.1,
    tilt: 6,
    drift: 176,
  },
  {
    top: "86%",
    left: "64%",
    width: 124,
    delay: 1.58,
    duration: 6.8,
    tilt: -7,
    drift: 160,
  },
  {
    top: "92%",
    left: "24%",
    width: 108,
    delay: 2.7,
    duration: 7.5,
    tilt: 10,
    drift: 182,
  },
];

const DENSITY_COUNT: Record<TrailDensity, number> = {
  low: 4,
  medium: 7,
  high: 10,
};

function trailClass(index: number, tone: TrailTone) {
  if (tone === "primary") {
    return "bg-linear-to-r from-transparent via-primary/72 to-transparent";
  }

  if (tone === "chart") {
    return "bg-linear-to-r from-transparent via-chart-1/72 to-transparent";
  }

  return index % 2 === 0
    ? "bg-linear-to-r from-transparent via-primary/72 to-transparent"
    : "bg-linear-to-r from-transparent via-chart-1/72 to-transparent";
}

function headClass(index: number, tone: TrailTone) {
  if (tone === "primary") {
    return "bg-primary/86";
  }

  if (tone === "chart") {
    return "bg-chart-1/86";
  }

  return index % 2 === 0 ? "bg-primary/84" : "bg-chart-1/84";
}

function movement(seed: CometSeed, direction: TrailDirection) {
  if (direction === "right-to-left") {
    return {
      x: [seed.drift, -seed.drift],
      y: [0, -8, 0],
      rotate: [seed.tilt + 180, seed.tilt + 180, seed.tilt + 180],
    };
  }

  if (direction === "diagonal") {
    return {
      x: [-seed.drift, seed.drift],
      y: [seed.drift * 0.22, -seed.drift * 0.22, seed.drift * 0.22],
      rotate: [seed.tilt + 25, seed.tilt + 25, seed.tilt + 25],
    };
  }

  return {
    x: [-seed.drift, seed.drift],
    y: [0, -10, 0],
    rotate: [seed.tilt, seed.tilt, seed.tilt],
  };
}

export function CometTrails({
  className,
  density = "medium",
  direction = "left-to-right",
  tone = "mixed",
}: CometTrailsProps) {
  const visible = COMET_SEEDS.slice(0, DENSITY_COUNT[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((seed, index) => {
        const travel = movement(seed, direction);

        return (
          <motion.div
            key={`${seed.left}-${seed.top}-${seed.delay}`}
            className="absolute"
            style={{ top: seed.top, left: seed.left }}
            animate={{
              opacity: [0, 0.95, 0],
              x: travel.x,
              y: travel.y,
              rotate: travel.rotate,
            }}
            transition={{
              duration: seed.duration,
              delay: seed.delay,
              repeat: Infinity,
              repeatDelay: 0.9 + index * 0.08,
              ease: "easeInOut",
            }}
          >
            <span
              className={cn(
                "block h-0.5 rounded-full",
                trailClass(index, tone),
              )}
              style={{ width: `${seed.width}px` }}
            />
            <span
              className={cn(
                "absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full blur-[2px]",
                headClass(index, tone),
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
