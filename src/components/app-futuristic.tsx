import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function RevealBlock({
  children,
  className,
  delay = 0,
  y = 12,
}: RevealBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type FloatingOrbProps = {
  className?: string;
  duration?: number;
  delay?: number;
  drift?: number;
};

export function FloatingOrb({
  className,
  duration = 8,
  delay = 0,
  drift = 12,
}: FloatingOrbProps) {
  return (
    <motion.div
      aria-hidden
      className={cn("absolute rounded-full blur-3xl", className)}
      animate={{
        y: [0, -drift, 0],
        x: [0, drift * 0.5, 0],
        opacity: [0.25, 0.45, 0.25],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
}

type SurfaceGridProps = {
  className?: string;
};

export function SurfaceGrid({ className }: SurfaceGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-[radial-gradient(circle,rgba(15,23,42,0.12)_1px,transparent_1px)] bg-size-[22px_22px] opacity-35 dark:opacity-20",
        className,
      )}
    />
  );
}

type PulseDotProps = {
  className?: string;
};

export function PulseDot({ className }: PulseDotProps) {
  return (
    <span className={cn("relative inline-flex size-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  );
}

type SketchFlowLinesProps = {
  className?: string;
  tone?: "primary" | "mixed";
};

export function SketchFlowLines({
  className,
  tone = "mixed",
}: SketchFlowLinesProps) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1600 1000"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        tone === "primary" ? "text-primary/36" : "text-foreground/26",
        className,
      )}
    >
      <motion.path
        d="M-30 182 C 250 40 520 272 812 154 C 1124 36 1326 246 1648 126"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeDasharray="9 11"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.56, 0] }}
        transition={{
          duration: 9.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      />
      <motion.path
        d="M84 834 C 268 700 510 930 752 842 C 1014 746 1210 932 1500 818"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="6 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.42, 0] }}
        transition={{
          duration: 9.2,
          delay: 0.7,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.1,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}

type SignalWaveCanvasProps = {
  className?: string;
  cell?: number;
  speed?: number;
};

export function SignalWaveCanvas({
  className,
  cell = 26,
  speed = 0.022,
}: SignalWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const activeRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let time = 0;
    let lastFrameTime = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (timestamp = 0) => {
      if (!activeRef.current) {
        frameRef.current = 0;
        return;
      }

      if (timestamp - lastFrameTime < 33) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = timestamp;

      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);

      const dark = document.documentElement.classList.contains("dark");
      const rgb = dark ? "147, 197, 253" : "37, 99, 235";

      const cols = Math.max(1, Math.floor(rect.width / cell));
      const rows = Math.max(1, Math.floor(rect.height / cell));

      for (let row = 0; row <= rows; row += 1) {
        for (let col = 0; col <= cols; col += 1) {
          const x = (col + 0.5) * (rect.width / cols);
          const y = (row + 0.5) * (rect.height / rows);

          const waveA = Math.sin(col * 0.34 + time * 2.1);
          const waveB = Math.cos(row * 0.28 + time * 1.7);
          const waveC = Math.sin((col + row) * 0.16 + time * 1.3);
          const normalized = (waveA + waveB + waveC + 3) / 6;

          const radius = 0.6 + normalized * 1.65;
          const alpha = (dark ? 0.09 : 0.12) + normalized * 0.32;

          context.beginPath();
          context.fillStyle = `rgba(${rgb}, ${Math.min(alpha, 0.5)})`;
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      time += speed;
      frameRef.current = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      activeRef.current = !document.hidden;

      if (activeRef.current && frameRef.current === 0) {
        frameRef.current = requestAnimationFrame(render);
      }

      if (!activeRef.current && frameRef.current !== 0) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };

    activeRef.current = !document.hidden;
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (activeRef.current) {
      frameRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (frameRef.current !== 0) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = 0;
    };
  }, [cell, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      style={{ display: "block" }}
    />
  );
}

type CometRailOverlayProps = {
  className?: string;
  density?: "low" | "medium" | "high";
  tone?: "primary" | "mixed";
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
    top: "10%",
    left: "8%",
    width: 124,
    delay: 0.15,
    duration: 6.7,
    tilt: 8,
    drift: 170,
  },
  {
    top: "22%",
    left: "28%",
    width: 112,
    delay: 1.1,
    duration: 7.2,
    tilt: 12,
    drift: 162,
  },
  {
    top: "36%",
    left: "14%",
    width: 134,
    delay: 0.65,
    duration: 7,
    tilt: -5,
    drift: 182,
  },
  {
    top: "48%",
    left: "46%",
    width: 128,
    delay: 1.7,
    duration: 7.5,
    tilt: 10,
    drift: 176,
  },
  {
    top: "62%",
    left: "20%",
    width: 118,
    delay: 0.35,
    duration: 6.8,
    tilt: -8,
    drift: 168,
  },
  {
    top: "72%",
    left: "54%",
    width: 142,
    delay: 2.1,
    duration: 7.6,
    tilt: 9,
    drift: 188,
  },
  {
    top: "84%",
    left: "11%",
    width: 106,
    delay: 1.4,
    duration: 6.9,
    tilt: -6,
    drift: 158,
  },
  {
    top: "90%",
    left: "36%",
    width: 122,
    delay: 2.45,
    duration: 7.3,
    tilt: 7,
    drift: 172,
  },
];

const COMET_COUNT: Record<
  NonNullable<CometRailOverlayProps["density"]>,
  number
> = {
  low: 3,
  medium: 5,
  high: 8,
};

function cometTone(
  index: number,
  tone: NonNullable<CometRailOverlayProps["tone"]>,
) {
  if (tone === "primary") {
    return "via-primary/72 bg-linear-to-r from-transparent";
  }

  return index % 2 === 0
    ? "via-primary/70 bg-linear-to-r from-transparent"
    : "via-chart-2/70 bg-linear-to-r from-transparent";
}

function cometHead(
  index: number,
  tone: NonNullable<CometRailOverlayProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/86";
  }

  return index % 2 === 0 ? "bg-primary/84" : "bg-chart-2/84";
}

export function CometRailOverlay({
  className,
  density = "medium",
  tone = "mixed",
}: CometRailOverlayProps) {
  const visible = COMET_SEEDS.slice(0, COMET_COUNT[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((seed, index) => (
        <motion.div
          key={`${seed.left}-${seed.top}`}
          className="absolute"
          style={{ top: seed.top, left: seed.left }}
          animate={{
            opacity: [0, 0.95, 0],
            x: [-seed.drift, seed.drift],
            y: [0, -10, 0],
            rotate: [seed.tilt, seed.tilt, seed.tilt],
          }}
          transition={{
            duration: seed.duration,
            delay: seed.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.95 + index * 0.09,
            ease: "easeInOut",
          }}
        >
          <span
            className={cn(
              "block h-0.5 rounded-full to-transparent",
              cometTone(index, tone),
            )}
            style={{ width: `${seed.width}px` }}
          />
          <span
            className={cn(
              "absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full blur-[2px]",
              cometHead(index, tone),
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

type OrbitHaloProps = {
  className?: string;
  tone?: "primary" | "mixed";
  spin?: "slow" | "medium" | "fast";
};

const ORBIT_SPEED: Record<NonNullable<OrbitHaloProps["spin"]>, number> = {
  slow: 22,
  medium: 16,
  fast: 11,
};

function orbitRingClass(
  index: number,
  tone: NonNullable<OrbitHaloProps["tone"]>,
) {
  if (tone === "primary") {
    return "border-primary/42";
  }

  return index % 2 === 0 ? "border-primary/40" : "border-chart-2/40";
}

function orbitDotClass(
  index: number,
  tone: NonNullable<OrbitHaloProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/82";
  }

  return index % 2 === 0 ? "bg-primary/80" : "bg-chart-2/80";
}

export function OrbitHalo({
  className,
  tone = "mixed",
  spin = "medium",
}: OrbitHaloProps) {
  const base = ORBIT_SPEED[spin];

  return (
    <div
      className={cn("pointer-events-none absolute isolate", className)}
      aria-hidden
    >
      <motion.div
        className="absolute inset-1/2 h-18 w-18 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/16 blur-2xl"
        animate={{ opacity: [0.2, 0.52, 0.2], scale: [0.92, 1.12, 0.92] }}
        transition={{
          duration: base * 0.62,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {[0, 1, 2].map((index) => {
        const size = 110 + index * 46;

        return (
          <motion.div
            key={`orbit-ring-${index}`}
            className={cn(
              "absolute inset-1/2 rounded-full border border-dashed",
              orbitRingClass(index, tone),
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${size * -0.5}px`,
              marginTop: `${size * -0.5}px`,
            }}
            animate={{ rotate: index % 2 === 0 ? [0, 360] : [360, 0] }}
            transition={{
              duration: base + index * 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <span
              className={cn(
                "absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]",
                orbitDotClass(index, tone),
              )}
            />
          </motion.div>
        );
      })}

      <motion.div
        className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/68"
        animate={{ opacity: [0.36, 1, 0.36], scale: [0.82, 1.2, 0.82] }}
        transition={{
          duration: base * 0.42,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

type FloatingShardFieldProps = {
  className?: string;
  density?: "low" | "medium" | "high";
  tone?: "primary" | "mixed";
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

const SHARD_SEEDS: ShardSeed[] = [
  {
    top: "10%",
    left: "14%",
    width: 14,
    height: 28,
    tilt: -22,
    delay: 0.14,
    duration: 8.8,
  },
  {
    top: "18%",
    left: "38%",
    width: 12,
    height: 24,
    tilt: 28,
    delay: 1.2,
    duration: 9.1,
  },
  {
    top: "32%",
    left: "68%",
    width: 15,
    height: 30,
    tilt: -14,
    delay: 0.65,
    duration: 8.9,
  },
  {
    top: "46%",
    left: "52%",
    width: 16,
    height: 32,
    tilt: 20,
    delay: 1.85,
    duration: 9.4,
  },
  {
    top: "60%",
    left: "21%",
    width: 12,
    height: 24,
    tilt: -30,
    delay: 1.35,
    duration: 8.7,
  },
  {
    top: "72%",
    left: "77%",
    width: 11,
    height: 26,
    tilt: 21,
    delay: 0.42,
    duration: 8.3,
  },
  {
    top: "82%",
    left: "45%",
    width: 14,
    height: 30,
    tilt: -24,
    delay: 2.08,
    duration: 9.2,
  },
  {
    top: "90%",
    left: "62%",
    width: 12,
    height: 22,
    tilt: -12,
    delay: 2.32,
    duration: 8.8,
  },
];

const SHARD_COUNT: Record<
  NonNullable<FloatingShardFieldProps["density"]>,
  number
> = {
  low: 3,
  medium: 5,
  high: 8,
};

function shardClass(
  index: number,
  tone: NonNullable<FloatingShardFieldProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/30 border-primary/42";
  }

  return index % 2 === 0
    ? "bg-primary/28 border-primary/40"
    : "bg-chart-2/28 border-chart-2/40";
}

export function FloatingShardField({
  className,
  density = "medium",
  tone = "mixed",
}: FloatingShardFieldProps) {
  const visible = SHARD_SEEDS.slice(0, SHARD_COUNT[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((seed, index) => (
        <motion.span
          key={`${seed.left}-${seed.top}-${seed.delay}`}
          className={cn(
            "absolute block rounded-[3px] border backdrop-blur-[1px]",
            shardClass(index, tone),
          )}
          style={{
            top: seed.top,
            left: seed.left,
            width: `${seed.width}px`,
            height: `${seed.height}px`,
            transform: `rotate(${seed.tilt}deg)`,
          }}
          animate={{
            opacity: [0.14, 0.56, 0.14],
            y: [0, -14, 0],
            rotate: [seed.tilt, seed.tilt + 12, seed.tilt],
          }}
          transition={{
            duration: seed.duration,
            delay: seed.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
