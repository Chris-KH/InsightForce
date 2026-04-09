import { motion } from "motion/react";

import HERO_IMAGE from "@/assets/hero-section.png";
import {
  CometRailOverlay,
  FloatingShardField,
  OrbitHalo,
  PanelOrbital3D,
  SignalWaveCanvas,
  SketchFlowLines,
} from "@/components/app-futuristic";

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

      <SignalWaveCanvas
        className="opacity-40 dark:opacity-18"
        cell={30}
        speed={0.018}
      />
      <SketchFlowLines className="opacity-40 dark:opacity-22" tone="mixed" />
      <SketchFlowLines className="opacity-24 dark:opacity-14" tone="primary" />
      <CometRailOverlay className="opacity-64 dark:opacity-34" density="high" />
      <FloatingShardField
        className="opacity-58 dark:opacity-26"
        density="high"
      />

      <OrbitHalo
        className="top-14 right-8 hidden h-96 w-96 opacity-42 lg:block dark:opacity-28"
        tone="mixed"
        spin="slow"
      />
      <OrbitHalo
        className="-bottom-10 -left-8 hidden h-84 w-84 opacity-34 xl:block dark:opacity-22"
        tone="primary"
        spin="medium"
      />

      <PanelOrbital3D
        variant="satellite"
        className="top-auto -right-28 -bottom-24 left-auto hidden size-160 opacity-50 xl:block"
      />
      <PanelOrbital3D
        variant="tetra"
        className="-top-22 right-auto bottom-auto -left-26 hidden size-132 opacity-42 xl:block"
      />
      <PanelOrbital3D
        variant="crystal"
        className="top-[34%] -right-16 bottom-auto left-auto hidden size-116 opacity-34 2xl:block"
      />

      <div
        className="absolute h-[64vh] w-[56vw] max-w-245 rounded-full opacity-36 blur-[1px] dark:opacity-14"
        style={{
          right: "-16%",
          bottom: "-20%",
          backgroundImage: `linear-gradient(132deg, rgba(30,41,59,0.12) 0%, rgba(15,23,42,0.62) 64%, rgba(2,6,23,0.72) 100%), url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(circle at 32% 36%, rgba(0,0,0,0.98), rgba(0,0,0,0.84) 32%, rgba(0,0,0,0.2) 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 32% 36%, rgba(0,0,0,0.98), rgba(0,0,0,0.84) 32%, rgba(0,0,0,0.2) 70%, transparent 100%)",
        }}
      />

      <div
        className="absolute -top-36 left-[44%] hidden size-120 rounded-full opacity-24 blur-[0.5px] xl:block dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(142deg, rgba(59,130,246,0.22) 0%, rgba(2,6,23,0.62) 72%), url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(circle at 56% 44%, rgba(0,0,0,0.96), rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.14) 74%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 56% 44%, rgba(0,0,0,0.96), rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.14) 74%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_36%),radial-gradient(circle_at_84%_18%,rgba(125,211,252,0.24),transparent_30%),radial-gradient(circle_at_52%_84%,rgba(251,191,36,0.16),transparent_34%)] opacity-80 dark:opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_17px,rgba(15,23,42,0.06)_17px)] bg-size-[30px_30px] opacity-24 dark:opacity-12" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/70" />
    </div>
  );
}
