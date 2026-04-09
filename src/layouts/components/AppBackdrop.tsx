import { motion } from "motion/react";

export function AppBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="absolute -top-56 -left-52 size-152 rounded-full bg-primary/20 blur-[138px] dark:bg-primary/16"
        animate={{ x: [0, 28, 0], y: [0, 16, 0], opacity: [0.48, 0.65, 0.48] }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -top-32 -right-64 size-144 rounded-full bg-chart-2/16 blur-[138px] dark:bg-chart-2/12"
        animate={{ x: [0, -22, 0], y: [0, 20, 0], opacity: [0.42, 0.58, 0.42] }}
        transition={{
          duration: 16,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <motion.div
        className="absolute -bottom-64 left-1/2 size-160 -translate-x-1/2 rounded-full bg-chart-3/18 blur-[140px] dark:bg-chart-3/12"
        animate={{ y: [0, -24, 0], opacity: [0.4, 0.55, 0.4] }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.8,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_36%),radial-gradient(circle_at_84%_18%,rgba(125,211,252,0.24),transparent_30%),radial-gradient(circle_at_52%_84%,rgba(251,191,36,0.16),transparent_34%)] opacity-80 dark:opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_17px,rgba(15,23,42,0.06)_17px)] bg-size-[30px_30px] opacity-24 dark:opacity-12" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/70" />
    </div>
  );
}
