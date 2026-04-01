import {
  ContentForgeSection,
  HeatmapSection,
  HeroSection,
  PricingSection,
  RevenueSection,
  SiteFooter,
  SiteHeader,
} from "./components";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <HeatmapSection />
        <ContentForgeSection />
        <RevenueSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
