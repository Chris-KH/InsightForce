import {
  AgentSquadSection,
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
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SiteHeader />
      <main>
        <HeroSection />
        <AgentSquadSection />
        <GuardianWatchSection />
        <ExecutiveProjectionsSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </motion.div>
  );
}
