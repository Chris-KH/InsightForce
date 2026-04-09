import {
  AgentSquadSection,
  CreatorMomentumSection,
  GuardianWatchSection,
  HeroSection,
  PricingSection,
  ExecutiveProjectionsSection,
  SiteFooter,
  SiteHeader,
} from "./components";
import { motion } from "motion/react";

export function LandingPage() {
  return (
    <motion.div
      className="relative min-h-screen overflow-x-clip bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <SiteHeader />
      <main className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.08, ease: "easeOut" }}
        >
          <CreatorMomentumSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
        >
          <AgentSquadSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.24, ease: "easeOut" }}
        >
          <GuardianWatchSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.32, ease: "easeOut" }}
        >
          <ExecutiveProjectionsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <PricingSection />
        </motion.div>
      </main>
      <SiteFooter />
    </motion.div>
  );
}
