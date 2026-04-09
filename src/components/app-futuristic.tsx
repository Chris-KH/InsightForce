import type { ReactNode } from "react";
import { motion } from "motion/react";

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
