import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type GridFadeDirection = "left-to-right" | "top-to-bottom" | "diagonal";
type GridStrength = "soft" | "medium" | "strong";

type SectionGridOverlayProps = {
  className?: string;
  cellSize?: number;
  strength?: GridStrength;
  fade?: GridFadeDirection;
  drift?: boolean;
};

const STRENGTH_TO_OPACITY: Record<GridStrength, number> = {
  soft: 13,
  medium: 18,
  strong: 24,
};

function maskForDirection(direction: GridFadeDirection) {
  if (direction === "top-to-bottom") {
    return "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.16))";
  }

  if (direction === "diagonal") {
    return "linear-gradient(140deg, rgba(0,0,0,0.96), rgba(0,0,0,0.14))";
  }

  return "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.14))";
}

export function SectionGridOverlay({
  className,
  cellSize = 84,
  strength = "medium",
  fade = "left-to-right",
  drift = true,
}: SectionGridOverlayProps) {
  const opacity = STRENGTH_TO_OPACITY[strength];

  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, color-mix(in oklch, var(--foreground) ${opacity}%, transparent) 0 1px, transparent 1px ${cellSize}px), repeating-linear-gradient(to bottom, color-mix(in oklch, var(--foreground) ${Math.max(opacity - 3, 9)}%, transparent) 0 1px, transparent 1px ${cellSize}px)`,
        maskImage: maskForDirection(fade),
      }}
      animate={
        drift
          ? { backgroundPosition: ["0px 0px", "24px -16px", "0px 0px"] }
          : undefined
      }
      transition={
        drift ? { duration: 16, repeat: Infinity, ease: "linear" } : undefined
      }
    />
  );
}
