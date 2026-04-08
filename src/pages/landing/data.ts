import { BrainCircuit, Filter, PenSquare } from "lucide-react";

export const NAV_ITEMS: { label: string; s: string }[] = [
  { label: "Agents", s: "#" },
  { label: "Solutions", s: "#solutions" },
  { label: "Academy", s: "#academy" },
  { label: "Pricing", s: "#pricing" },
];

export const TRUSTED_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80";

export const HEATMAP_IMAGE =
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80";

export const FORGE_FEATURES: {
  icon: React.ComponentType;
  title: string;
  description: string;
  iconClass: string;
}[] = [
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
    iconClass: "bg-secondary/70 text-secondary-foreground",
  },
  {
    icon: PenSquare,
    title: "Creative Briefing",
    description:
      "Generate strategy-ready briefs for content and product teams.",
    iconClass: "bg-accent/70 text-accent-foreground",
  },
];

export const PRICING_PLANS: {
  name: string;
  price: string;
  subtitle: string;
  cta: string;
  highlighted: boolean;
  features: string[];
}[] = [
  {
    name: "Solo Creator",
    price: "$99",
    subtitle:
      "Deploy the Guardian & Scout to protect your brand and find your first 1,000 true fans.",
    cta: "Start Sprouting",
    highlighted: false,
    features: [
      "1 Specialized AI Agent",
      "Guardian Sentiment Watch",
      "Daily Intelligence Briefing",
    ],
  },
  {
    name: "Agency Elite",
    price: "$299",
    subtitle:
      "The full autonomous triad. Guardian, Architect, and Scout working in perfect harmony.",
    cta: "Go Agentic",
    highlighted: true,
    features: [
      "Full Agent Triad Deployment",
      "Architect Strategy Engine",
      "Executive Global Heatmap",
      "Priority GPU Allocation",
    ],
  },
  {
    name: "Empire",
    price: "$999",
    subtitle:
      "Unlimited autonomous swarms for media empires and large-scale brands.",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      "Custom Agent Training",
      "Private Cloud Deployment",
      "24/7 Agent Ops Support",
      "Full White-label Suite",
    ],
  },
];
