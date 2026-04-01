import { BrainCircuit, Filter, PenSquare } from "lucide-react";

export const NAV_ITEMS = ["Platform", "Solutions", "Resources", "Pricing"];

export const TRUSTED_AVATARS = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80";

export const HEATMAP_IMAGE =
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80";

export const FORGE_FEATURES = [
  {
    icon: Filter,
    title: "Noise Reduction",
    description: "Identify and filter out 98% of irrelevant bot activity.",
    iconClass: "bg-primary/15 text-primary",
  },
  {
    icon: BrainCircuit,
    title: "Intent Mapping",
    description: "Cluster audience language into clear buying-intent profiles.",
    iconClass: "bg-secondary text-secondary-foreground",
  },
  {
    icon: PenSquare,
    title: "Creative Briefing",
    description:
      "Generate strategy-ready briefs for content and product teams.",
    iconClass: "bg-chart-1/30 text-foreground",
  },
];

export const PRICING_PLANS = [
  {
    name: "Seed",
    price: "$49",
    subtitle: "Ideal for solo founders and early-stage projects.",
    cta: "Start Sprouting",
    highlighted: false,
    features: [
      "5 Active Sentiment Streams",
      "Weekly Email Reports",
      "Basic Revenue Modeling",
    ],
  },
  {
    name: "Sapling",
    price: "$149",
    subtitle: "For growing teams that need deeper predictive insight.",
    cta: "Go Pro",
    highlighted: true,
    features: [
      "Everything in Seed",
      "Unlimited Forge Strategy",
      "Advanced Global Heatmap",
      "Team Collaboration Tools",
    ],
  },
  {
    name: "Forest",
    price: "$499",
    subtitle: "Enterprise-grade access for high-volume organizations.",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      "Custom ML Model Training",
      "24/7 Dedicated Support",
      "API Access & Integrations",
      "White-label Dashboards",
    ],
  },
];
