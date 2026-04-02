import {
  AgentSquadSection,
  GuardianWatchSection,
  HeroSection,
  PricingSection,
  ExecutiveProjectionsSection,
  SiteFooter,
  SiteHeader,
} from "./components";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <AgentSquadSection />
        <GuardianWatchSection />
        <ExecutiveProjectionsSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
