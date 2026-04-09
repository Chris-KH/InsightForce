import {
  BrainCircuit,
  Filter,
  Globe2,
  PenSquare,
  Radar,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Workflow", href: "#workflow" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Pricing", href: "#pricing" },
];

export const HERO_ROTATING_WORDS = [
  "launch",
  "orchestrate",
  "scale",
  "monetize",
];

export const HERO_IMPACT_STATS: {
  value: string;
  label: string;
  brand: string;
}[] = [
  { value: "31 hrs", label: "saved weekly", brand: "CREATOR LABS" },
  { value: "+286%", label: "qualified leads", brand: "PULSE AGENCY" },
  { value: "8.4x", label: "campaign ROAS", brand: "KOL STUDIO" },
  { value: "42%", label: "retention growth", brand: "SPARK COMMERCE" },
];

export const TRUSTED_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80",
];

export const HERO_IMAGE = "v.jpg";

export const HEATMAP_IMAGE =
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1800&q=80";

export const CAPABILITY_ITEMS: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    number: "01",
    title: "Audience Signal Graph",
    description:
      "Cluster creator comments, search intent, and purchase language into clear opportunity maps before you publish.",
    icon: Filter,
  },
  {
    number: "02",
    title: "Narrative Blueprinting",
    description:
      "Generate platform-specific content arcs with hook variants, emotional cues, and CTA sequencing tuned for each audience segment.",
    icon: PenSquare,
  },
  {
    number: "03",
    title: "KOL Match Intelligence",
    description:
      "Prioritize partner creators using trust overlap, category authority, and conversion-fit scoring across regions.",
    icon: Radar,
  },
  {
    number: "04",
    title: "Brand Safety Guardian",
    description:
      "Detect tonal drift and cultural risk in real time, with guardrails that keep every campaign aligned with brand values.",
    icon: ShieldCheck,
  },
];

export const AGENT_MODULES: {
  title: string;
  detail: string;
  metric: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Psychological Guardian",
    detail:
      "Monitors audience sentiment shifts and flags messages that may weaken trust.",
    metric: "92% alignment confidence",
    icon: ShieldCheck,
  },
  {
    title: "Content Architect",
    detail:
      "Builds narrative systems that convert short-form attention into long-term community.",
    metric: "88% viral pattern match",
    icon: BrainCircuit,
  },
  {
    title: "Scout & Executor",
    detail:
      "Scans market momentum and deploys campaign actions at optimal launch windows.",
    metric: "95% timing precision",
    icon: Sparkles,
  },
];

export const WORKFLOW_STEPS: {
  number: string;
  title: string;
  description: string;
  code: string;
}[] = [
  {
    number: "I",
    title: "Connect creator data",
    description:
      "Sync channels, CRM, ad platforms, and creator analytics in minutes with no custom pipeline setup.",
    code: `import { insightforge } from "@insightforge/core"

insightforge.connect({
  sources: ["youtube", "tiktok", "shopify"],
  sync: true
})`,
  },
  {
    number: "II",
    title: "Design agent workflow",
    description:
      "Compose Guardian, Architect, and Scout playbooks with measurable checkpoints and approvals.",
    code: `insightforge.workflow("spring-drop", {
  trigger: "trend-spike",
  actions: [
    "guardian.validateTone",
    "architect.generateBrief",
    "scout.deployVariants"
  ]
})`,
  },
  {
    number: "III",
    title: "Ship globally",
    description:
      "Launch campaign assets, creator outreach, and reporting dashboards across markets with one command.",
    code: `await insightforge.launch({
  campaign: "spring-drop",
  regions: "auto",
  reporting: "live"
})

// Campaign live across 12 regions`,
  },
];

export const NETWORK_LOCATIONS: {
  city: string;
  region: string;
  latency: string;
}[] = [
  { city: "Los Angeles", region: "US West", latency: "14ms" },
  { city: "New York", region: "US East", latency: "19ms" },
  { city: "London", region: "Europe", latency: "23ms" },
  { city: "Singapore", region: "Asia", latency: "29ms" },
  { city: "Sydney", region: "Oceania", latency: "37ms" },
  { city: "Sao Paulo", region: "South America", latency: "41ms" },
];

export const INFRASTRUCTURE_KPIS: { value: string; label: string }[] = [
  { value: "17", label: "Creator data hubs" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<50ms", label: "Global response" },
];

export const PERFORMANCE_METRICS: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}[] = [
  { value: 1240, suffix: "K", label: "Audience events processed today" },
  { value: 99, suffix: ".96%", label: "Campaign uptime this quarter" },
  { value: 18, suffix: "ms", label: "Average agent response" },
  { value: 132, label: "Countries activated" },
];

export const INTEGRATIONS: {
  name: string;
  category: string;
}[] = [
  { name: "YouTube", category: "Creator Channel" },
  { name: "TikTok", category: "Creator Channel" },
  { name: "Instagram", category: "Creator Channel" },
  { name: "Shopify", category: "Commerce" },
  { name: "Stripe", category: "Payments" },
  { name: "HubSpot", category: "CRM" },
  { name: "Notion", category: "Workspace" },
  { name: "Figma", category: "Design" },
  { name: "Slack", category: "Communication" },
  { name: "OpenAI", category: "AI/ML" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Vercel", category: "Hosting" },
];

export const SECURITY_BADGES = [
  "SOC 2",
  "ISO 27001",
  "GDPR",
  "CCPA",
  "AES-256",
];

export const SECURITY_FEATURES: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "SOC 2 Type II controls",
    description:
      "Security controls audited continuously to meet enterprise governance requirements.",
    icon: ShieldCheck,
  },
  {
    title: "End-to-end encryption",
    description:
      "TLS 1.3 in transit and AES-256 at rest for creator, partner, and campaign data.",
    icon: Filter,
  },
  {
    title: "Zero-trust permissions",
    description:
      "Fine-grained access controls by campaign, team, and external collaborator.",
    icon: Globe2,
  },
];

export const PRICING_TIERS: {
  name: string;
  description: string;
  monthly: number | null;
  annual: number | null;
  cta: string;
  highlighted: boolean;
  features: string[];
}[] = [
  {
    name: "Creator",
    description: "For solo creators and small studios validating audience fit.",
    monthly: 99,
    annual: 82,
    cta: "Start free trial",
    highlighted: false,
    features: [
      "1 agent workflow",
      "Daily signal digest",
      "Core channel integrations",
      "Baseline safety checks",
    ],
  },
  {
    name: "Agency",
    description: "For growing teams scaling multi-channel creator campaigns.",
    monthly: 299,
    annual: 249,
    cta: "Go agency mode",
    highlighted: true,
    features: [
      "Full agent triad",
      "Live campaign intelligence",
      "Advanced KOL match scoring",
      "Priority execution queue",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For global brands and media groups with custom deployment needs.",
    monthly: null,
    annual: null,
    cta: "Talk to sales",
    highlighted: false,
    features: [
      "Everything in Agency",
      "Private infrastructure",
      "Custom compliance controls",
      "24/7 strategic support",
      "SLA-backed deployment",
    ],
  },
];

export const TESTIMONIALS: {
  quote: string;
  author: string;
  role: string;
  company: string;
  keyResult: string;
}[] = [
  {
    quote:
      "InsightForce changed our launch process from guesswork to an operating system. Every creator drop now starts with clear confidence.",
    author: "Nadia Tran",
    role: "CMO",
    company: "Pulse Commerce",
    keyResult: "8.4x campaign ROAS",
  },
  {
    quote:
      "The Guardian alerts and Architect briefs helped us scale creator output without losing brand coherence.",
    author: "Marco Vela",
    role: "Head of Growth",
    company: "North Studio",
    keyResult: "41% retention lift",
  },
  {
    quote:
      "Our team ships faster because we can evaluate forecasted impact before spending media budget.",
    author: "Shin Park",
    role: "Creative Director",
    company: "Beacon Agency",
    keyResult: "3.2x faster campaign launch",
  },
  {
    quote:
      "From market signal to activation, everything is now one connected workflow. That has changed our decision speed dramatically.",
    author: "Elena Duarte",
    role: "VP Marketing",
    company: "Nova Labs",
    keyResult: "27 hours saved weekly",
  },
];

export const TRUSTED_COMPANIES = [
  "Pulse Commerce",
  "North Studio",
  "Beacon Agency",
  "Nova Labs",
  "Atlas Media",
  "CreatorOps",
  "Signal House",
  "Orbit Creative",
];

export const FOOTER_LINK_GROUPS: Record<
  string,
  { label: string; href: string }[]
> = {
  Product: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Workflow", href: "#workflow" },
    { label: "Infrastructure", href: "#infrastructure" },
    { label: "Pricing", href: "#pricing" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Twitter", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];
