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
  { top: "7%", left: "8%", size: 4, delay: 0, duration: 3.4, tone: "neutral" },
  {
    top: "10%",
    left: "22%",
    size: 3,
    delay: 0.2,
    duration: 2.9,
    tone: "chart",
  },
  {
    top: "13%",
    left: "35%",
    size: 5,
    delay: 0.35,
    duration: 3.6,
    tone: "primary",
  },
  {
    top: "18%",
    left: "66%",
    size: 3,
    delay: 0.6,
    duration: 2.8,
    tone: "neutral",
  },
  {
    top: "15%",
    left: "84%",
    size: 4,
    delay: 1.1,
    duration: 3.2,
    tone: "primary",
  },
  {
    top: "23%",
    left: "51%",
    size: 3,
    delay: 0.45,
    duration: 3.1,
    tone: "chart",
  },
  {
    top: "28%",
    left: "12%",
    size: 3,
    delay: 1.4,
    duration: 2.7,
    tone: "neutral",
  },
  {
    top: "31%",
    left: "28%",
    size: 5,
    delay: 0.15,
    duration: 3.8,
    tone: "primary",
  },
  {
    top: "34%",
    left: "74%",
    size: 4,
    delay: 1.3,
    duration: 3.1,
    tone: "chart",
  },
  {
    top: "40%",
    left: "90%",
    size: 3,
    delay: 0.2,
    duration: 2.9,
    tone: "neutral",
  },
  {
    top: "45%",
    left: "17%",
    size: 4,
    delay: 0.9,
    duration: 3.3,
    tone: "chart",
  },
  {
    top: "49%",
    left: "42%",
    size: 5,
    delay: 1.6,
    duration: 3.7,
    tone: "primary",
  },
  {
    top: "53%",
    left: "61%",
    size: 3,
    delay: 0.3,
    duration: 2.6,
    tone: "neutral",
  },
  {
    top: "57%",
    left: "78%",
    size: 3,
    delay: 1.7,
    duration: 3.2,
    tone: "chart",
  },
  {
    top: "63%",
    left: "8%",
    size: 5,
    delay: 0.55,
    duration: 3.9,
    tone: "primary",
  },
  {
    top: "67%",
    left: "29%",
    size: 3,
    delay: 1.15,
    duration: 3.1,
    tone: "neutral",
  },
  {
    top: "70%",
    left: "49%",
    size: 4,
    delay: 0.35,
    duration: 2.7,
    tone: "chart",
  },
  {
    top: "74%",
    left: "82%",
    size: 5,
    delay: 1.9,
    duration: 3.8,
    tone: "primary",
  },
  {
    top: "79%",
    left: "63%",
    size: 3,
    delay: 0.9,
    duration: 2.9,
    tone: "neutral",
  },
  {
    top: "84%",
    left: "21%",
    size: 4,
    delay: 1.3,
    duration: 3.2,
    tone: "chart",
  },
  {
    top: "87%",
    left: "40%",
    size: 3,
    delay: 1.7,
    duration: 2.7,
    tone: "neutral",
  },
  {
    top: "90%",
    left: "71%",
    size: 4,
    delay: 0.6,
    duration: 3.4,
    tone: "primary",
  },
  {
    top: "93%",
    left: "89%",
    size: 3,
    delay: 1.8,
    duration: 3.1,
    tone: "chart",
  },
  {
    top: "95%",
    left: "55%",
    size: 5,
    delay: 0.45,
    duration: 3.5,
    tone: "primary",
  },
];

const BURST_ONE: BurstParticle[] = [
  { x: 110, y: -70, size: 10, duration: 4.4, delay: 0.1 },
  { x: 145, y: -12, size: 8, duration: 4.7, delay: 0.42 },
  { x: 122, y: 62, size: 7, duration: 4.1, delay: 0.75 },
  { x: 72, y: 108, size: 11, duration: 4.5, delay: 1.1 },
  { x: 8, y: 130, size: 8, duration: 4.2, delay: 0.95 },
  { x: -68, y: 114, size: 9, duration: 4.9, delay: 0.25 },
  { x: -120, y: 70, size: 7, duration: 4.4, delay: 1.35 },
  { x: -144, y: 6, size: 9, duration: 4, delay: 0.6 },
  { x: -116, y: -66, size: 10, duration: 4.3, delay: 1.7 },
  { x: -56, y: -112, size: 8, duration: 4.8, delay: 0.85 },
  { x: 18, y: -132, size: 11, duration: 4.1, delay: 1.25 },
  { x: 82, y: -100, size: 7, duration: 4.6, delay: 0.35 },
];

const BURST_TWO: BurstParticle[] = [
  { x: 98, y: -54, size: 8, duration: 5.2, delay: 0.35 },
  { x: 128, y: -6, size: 10, duration: 4.9, delay: 0.85 },
  { x: 104, y: 56, size: 7, duration: 4.6, delay: 1.4 },
  { x: 54, y: 94, size: 8, duration: 5, delay: 1.05 },
  { x: -8, y: 108, size: 10, duration: 4.7, delay: 0.2 },
  { x: -66, y: 86, size: 7, duration: 5.1, delay: 1.65 },
  { x: -102, y: 46, size: 9, duration: 4.8, delay: 0.55 },
  { x: -118, y: -2, size: 8, duration: 5.3, delay: 1.2 },
  { x: -96, y: -54, size: 7, duration: 4.9, delay: 0.9 },
  { x: -44, y: -92, size: 10, duration: 4.5, delay: 1.75 },
  { x: 18, y: -104, size: 8, duration: 5, delay: 0.5 },
  { x: 74, y: -78, size: 9, duration: 4.8, delay: 1.45 },
];

function sparkleTone(tone: SparkleDot["tone"]) {
  if (tone === "primary") {
    return "bg-primary/50";
  }

  if (tone === "chart") {
    return "bg-chart-1/45";
  }

  return "bg-foreground/28";
}

function burstTone(index: number) {
  if (index % 3 === 0) {
    return "border-primary/45 bg-primary/18";
  }

  if (index % 3 === 1) {
    return "border-chart-1/45 bg-chart-1/15";
  }

  return "border-foreground/30 bg-background/72";
}

export function LandingAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 text-foreground/10"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 36%), radial-gradient(circle at 87% 16%, color-mix(in oklch, var(--chart-1) 18%, transparent), transparent 34%), radial-gradient(circle at 72% 72%, color-mix(in oklch, var(--primary) 13%, transparent), transparent 32%)",
        }}
        animate={{ opacity: [0.44, 0.72, 0.44] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-x-0 top-14 h-20 text-foreground/18"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px",
          maskImage:
            "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
        }}
        animate={{
          opacity: [0.2, 0.46, 0.2],
          backgroundPositionX: ["0px", "20px", "0px"],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
      />

      <motion.svg
        viewBox="0 0 1600 1200"
        className="absolute inset-0 h-full w-full text-foreground/22"
      >
        <motion.path
          d="M-20 175 C 240 20 520 266 820 140 C 1080 32 1330 220 1650 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="8 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 10,
            delay: 0.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M100 850 C 320 690 520 930 760 840 C 980 760 1180 940 1450 820"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="6 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.38, 0] }}
          transition={{
            duration: 9.5,
            delay: 1.2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="1220"
          cy="520"
          r="0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          animate={{ r: [0, 68, 92], opacity: [0, 0.36, 0] }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            repeatDelay: 0.9,
            ease: "easeOut",
          }}
        />
        <motion.circle
          cx="360"
          cy="760"
          r="0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 7"
          animate={{ r: [0, 56, 78], opacity: [0, 0.28, 0] }}
          transition={{
            duration: 5.2,
            delay: 1.1,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeOut",
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
          animate={{ opacity: [0.15, 0.92, 0.2], scale: [0.6, 1.35, 0.75] }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute" style={{ right: "14%", top: "18%" }}>
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-xl"
          style={{ width: "78px", height: "78px" }}
          animate={{ opacity: [0.28, 0.66, 0.28], scale: [0.92, 1.24, 0.92] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35"
          style={{ width: "14px", height: "14px" }}
          animate={{ width: [14, 176], height: [14, 176], opacity: [0.52, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut" }}
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
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.26 }}
            animate={{
              x: [0, particle.x],
              y: [0, particle.y],
              opacity: [0, 0.85, 0],
              scale: [0.2, 1.04, 0.54],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.95,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="absolute" style={{ left: "12%", top: "62%" }}>
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-1/22 blur-xl"
          style={{ width: "72px", height: "72px" }}
          animate={{ opacity: [0.2, 0.56, 0.2], scale: [0.9, 1.22, 0.9] }}
          transition={{
            duration: 4.5,
            delay: 0.8,
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
            delay: 0.6,
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
              repeatDelay: 1.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
