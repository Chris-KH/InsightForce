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

export type LocalizedLabel = {
  en: string;
  vi: string;
};

export type NavItem = {
  key: "dashboard" | "audience" | "strategy" | "finance" | "automation";
  label: LocalizedLabel;
  path: string;
  icon: LucideIcon;
};

export type AgentItem = {
  label: LocalizedLabel;
  status: "Active" | "Idle";
  detail: LocalizedLabel;
  icon: LucideIcon;
};

export type SidebarStatusItem = {
  label: LocalizedLabel;
  value: number;
  tone: "primary" | "secondary" | "tertiary";
};

export const APP_NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: { en: "Dashboard", vi: "Tổng quan" },
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "audience",
    label: { en: "Audience", vi: "Khách hàng" },
    path: "/app/audience",
    icon: Users,
  },
  {
    key: "strategy",
    label: { en: "Strategy", vi: "Chiến lược" },
    path: "/app/strategy",
    icon: Compass,
  },
  {
    key: "finance",
    label: { en: "Finance", vi: "Tài chính" },
    path: "/app/finance",
    icon: Wallet,
  },
  {
    key: "automation",
    label: { en: "Automation", vi: "Tự động hóa" },
    path: "/app/automation",
    icon: Bot,
  },
];

export const APP_AGENT_ITEMS: AgentItem[] = [
  {
    label: { en: "Guardian", vi: "Vệ binh" },
    status: "Active",
    detail: { en: "Community safety", vi: "An toàn cộng đồng" },
    icon: Shield,
  },
  {
    label: { en: "Architect", vi: "Thiết kế phân luồng" },
    status: "Active",
    detail: { en: "Content systems", vi: "Hệ thống nội dung" },
    icon: FolderKanban,
  },
  {
    label: { en: "Scout", vi: "Phân tích" },
    status: "Idle",
    detail: { en: "Trend scouting", vi: "Trinh sát xu hướng" },
    icon: CircleGauge,
  },
];

export const APP_SIDEBAR_STATUS: SidebarStatusItem[] = [
  {
    label: { en: "System Health", vi: "Sức khỏe hệ thống" },
    value: 91,
    tone: "primary",
  },
  {
    label: { en: "Security Shield", vi: "Lá chắn bảo mật" },
    value: 84,
    tone: "secondary",
  },
  {
    label: { en: "Automation Uptime", vi: "Độ ổn định tự động" },
    value: 96,
    tone: "tertiary",
  },
];

export const APP_HEADER_TABS = [
  {
    key: "reports",
    label: { en: "Reports", vi: "Báo cáo" },
    to: "/app/dashboard",
    match: ["/app/dashboard", "/app/automation", "/app/audience"],
  },
  {
    key: "finance",
    label: { en: "Finance", vi: "Tài chính" },
    to: "/app/finance",
    match: ["/app/finance"],
  },
  {
    key: "settings",
    label: { en: "Settings", vi: "Cài đặt" },
    to: "/app/strategy",
    match: ["/app/strategy"],
  },
] as const;
