import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type SparkleDot = {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  tone: "primary" | "chart" | "neutral";
};

type BurstParticle = {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

const SPARKLE_DOTS: SparkleDot[] = [
  {
    top: "6%",
    left: "10%",
    size: 4,
    delay: 0.1,
    duration: 3.2,
    tone: "neutral",
  },
  {
    top: "8%",
    left: "34%",
    size: 5,
    delay: 0.4,
    duration: 3.8,
    tone: "primary",
  },
  {
    top: "12%",
    left: "67%",
    size: 3,
    delay: 0.9,
    duration: 3.1,
    tone: "chart",
  },
  {
    top: "16%",
    left: "84%",
    size: 4,
    delay: 1.2,
    duration: 3.5,
    tone: "primary",
  },
  {
    top: "26%",
    left: "21%",
    size: 3,
    delay: 1.5,
    duration: 2.9,
    tone: "neutral",
  },
  {
    top: "31%",
    left: "48%",
    size: 5,
    delay: 0.2,
    duration: 3.7,
    tone: "chart",
  },
  {
    top: "39%",
    left: "78%",
    size: 4,
    delay: 0.7,
    duration: 3.3,
    tone: "primary",
  },
  {
    top: "46%",
    left: "12%",
    size: 4,
    delay: 1.1,
    duration: 3.4,
    tone: "chart",
  },
  {
    top: "54%",
    left: "59%",
    size: 3,
    delay: 0.5,
    duration: 2.8,
    tone: "neutral",
  },
  {
    top: "63%",
    left: "83%",
    size: 5,
    delay: 1.3,
    duration: 3.6,
    tone: "primary",
  },
  {
    top: "72%",
    left: "18%",
    size: 4,
    delay: 0.35,
    duration: 3.1,
    tone: "chart",
  },
  {
    top: "79%",
    left: "42%",
    size: 3,
    delay: 1.55,
    duration: 3,
    tone: "neutral",
  },
  {
    top: "86%",
    left: "67%",
    size: 4,
    delay: 0.8,
    duration: 3.2,
    tone: "primary",
  },
  {
    top: "92%",
    left: "88%",
    size: 3,
    delay: 1.8,
    duration: 2.9,
    tone: "chart",
  },
];

const BURST_ONE: BurstParticle[] = [
  { x: 124, y: -78, size: 10, duration: 4.4, delay: 0.2 },
  { x: 150, y: -10, size: 8, duration: 4.8, delay: 0.55 },
  { x: 118, y: 66, size: 7, duration: 4.1, delay: 0.9 },
  { x: 70, y: 112, size: 11, duration: 4.6, delay: 1.2 },
  { x: 0, y: 132, size: 8, duration: 4.2, delay: 1.45 },
  { x: -72, y: 114, size: 9, duration: 4.9, delay: 0.36 },
  { x: -128, y: 58, size: 7, duration: 4.4, delay: 1.7 },
  { x: -148, y: -4, size: 9, duration: 4.1, delay: 0.72 },
  { x: -114, y: -76, size: 10, duration: 4.5, delay: 1.96 },
  { x: -50, y: -118, size: 8, duration: 4.8, delay: 1.08 },
  { x: 22, y: -136, size: 10, duration: 4.2, delay: 1.36 },
  { x: 84, y: -102, size: 7, duration: 4.6, delay: 0.44 },
];

const BURST_TWO: BurstParticle[] = [
  { x: 98, y: -56, size: 8, duration: 5, delay: 0.35 },
  { x: 132, y: -8, size: 10, duration: 4.8, delay: 0.85 },
  { x: 106, y: 54, size: 7, duration: 4.6, delay: 1.42 },
  { x: 58, y: 96, size: 8, duration: 5.1, delay: 1.02 },
  { x: -6, y: 110, size: 10, duration: 4.7, delay: 0.26 },
  { x: -68, y: 88, size: 7, duration: 5.15, delay: 1.7 },
  { x: -108, y: 44, size: 9, duration: 4.85, delay: 0.58 },
  { x: -118, y: -4, size: 8, duration: 5.3, delay: 1.22 },
  { x: -94, y: -58, size: 7, duration: 4.9, delay: 0.92 },
  { x: -42, y: -90, size: 10, duration: 4.55, delay: 1.76 },
  { x: 24, y: -104, size: 8, duration: 5.05, delay: 0.52 },
  { x: 74, y: -74, size: 9, duration: 4.85, delay: 1.46 },
];

function sparkleTone(tone: SparkleDot["tone"]) {
  if (tone === "primary") {
    return "bg-primary/60";
  }

  if (tone === "chart") {
    return "bg-chart-1/55";
  }

  return "bg-foreground/30";
}

function burstTone(index: number) {
  if (index % 3 === 0) {
    return "border-primary/50 bg-primary/20";
  }

  if (index % 3 === 1) {
    return "border-chart-1/48 bg-chart-1/18";
  }

  return "border-foreground/34 bg-background/74";
}

export function LandingAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 10%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 34%), radial-gradient(circle at 84% 16%, color-mix(in oklch, var(--chart-1) 22%, transparent), transparent 35%), radial-gradient(circle at 74% 72%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 32%)",
        }}
        animate={{ opacity: [0.4, 0.68, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-x-0 top-20 h-24 text-foreground/20"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
        animate={{
          opacity: [0.2, 0.52, 0.2],
          backgroundPositionX: ["0px", "24px", "0px"],
        }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "linear" }}
      />

      <motion.svg
        viewBox="0 0 1600 1200"
        className="absolute inset-0 h-full w-full text-foreground/24"
      >
        <motion.path
          d="M-30 186 C 224 38 520 278 826 146 C 1088 40 1342 228 1650 132"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="8 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.56, 0] }}
          transition={{
            duration: 10.2,
            delay: 0.22,
            repeat: Infinity,
            repeatDelay: 0.88,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M100 852 C 318 692 522 934 762 840 C 982 756 1178 940 1458 818"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="6 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.4, 0] }}
          transition={{
            duration: 9.3,
            delay: 1.1,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      </motion.svg>

      {SPARKLE_DOTS.map((dot) => (
        <motion.span
          key={`${dot.left}-${dot.top}-${dot.delay}`}
          className={cn("absolute rounded-full", sparkleTone(dot.tone))}
          style={{
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
          }}
          animate={{ opacity: [0.14, 0.94, 0.2], scale: [0.6, 1.32, 0.72] }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute" style={{ right: "12%", top: "20%" }}>
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/26 blur-xl"
          style={{ width: "80px", height: "80px" }}
          animate={{ opacity: [0.24, 0.62, 0.24], scale: [0.92, 1.26, 0.92] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/38"
          style={{ width: "14px", height: "14px" }}
          animate={{ width: [14, 178], height: [14, 178], opacity: [0.56, 0] }}
          transition={{ duration: 3.75, repeat: Infinity, ease: "easeOut" }}
        />
        {BURST_ONE.map((particle, index) => (
          <motion.span
            key={`burst-one-${particle.x}-${particle.y}`}
            className={cn(
              "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border",
              burstTone(index),
            )}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.25 }}
            animate={{
              x: [0, particle.x],
              y: [0, particle.y],
              opacity: [0, 0.84, 0],
              scale: [0.2, 1.05, 0.54],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.92,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="absolute" style={{ left: "13%", top: "64%" }}>
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-1/24 blur-xl"
          style={{ width: "72px", height: "72px" }}
          animate={{ opacity: [0.2, 0.56, 0.2], scale: [0.9, 1.22, 0.9] }}
          transition={{
            duration: 4.5,
            delay: 0.82,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-chart-1/35"
          style={{ width: "12px", height: "12px" }}
          animate={{ width: [12, 162], height: [12, 162], opacity: [0.45, 0] }}
          transition={{
            duration: 4.2,
            delay: 0.62,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {BURST_TWO.map((particle, index) => (
          <motion.span
            key={`burst-two-${particle.x}-${particle.y}`}
            className={cn(
              "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border",
              burstTone(index + 1),
            )}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.24 }}
            animate={{
              x: [0, particle.x],
              y: [0, particle.y],
              opacity: [0, 0.8, 0],
              scale: [0.2, 1.05, 0.5],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1.18,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
