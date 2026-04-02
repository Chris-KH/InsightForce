import {
  CircleGauge,
  Compass,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  Shield,
  Wallet,
  Bot,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type AgentItem = {
  label: string;
  status: "Active" | "Idle";
  icon: LucideIcon;
};

export const APP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { label: "Audience", path: "/app/audience", icon: Users },
  { label: "Strategy", path: "/app/strategy", icon: Compass },
  { label: "Finance", path: "/app/finance", icon: Wallet },
  { label: "Automation", path: "/app/automation", icon: Bot },
];

export const APP_AGENT_ITEMS: AgentItem[] = [
  { label: "Guardian", status: "Active", icon: Shield },
  { label: "Architect", status: "Active", icon: FolderKanban },
  { label: "Scout", status: "Idle", icon: CircleGauge },
];

export const APP_HEADER_TABS = ["Reports", "Finance", "Settings"] as const;
