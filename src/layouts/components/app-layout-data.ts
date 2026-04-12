import {
  Activity,
  Brain,
  CircleGauge,
  Compass,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  MessageCircle,
  Shield,
  ShieldCheck,
  Send,
  Wallet,
  Bot,
  Users,
} from "lucide-react";

export type LocalizedLabel = {
  en: string;
  vi: string;
};

export type NavItem = {
  key: string;
  label: LocalizedLabel;
  path: string;
  icon: LucideIcon;
  group: "primary" | "focus";
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
    group: "primary",
  },
  {
    key: "audience",
    label: { en: "Audience", vi: "Khách hàng" },
    path: "/app/audience",
    icon: Users,
    group: "primary",
  },
  {
    key: "strategy",
    label: { en: "Strategy", vi: "Chiến lược" },
    path: "/app/strategy",
    icon: Compass,
    group: "primary",
  },
  {
    key: "finance",
    label: { en: "Finance", vi: "Tài chính" },
    path: "/app/finance",
    icon: Wallet,
    group: "primary",
  },
  {
    key: "automation",
    label: { en: "Automation", vi: "Tự động hóa" },
    path: "/app/automation",
    icon: Bot,
    group: "primary",
  },
];

export const APP_FOCUS_NAV_ITEMS: NavItem[] = [
  {
    key: "ops-control",
    label: { en: "Ops Control", vi: "Điều phối vận hành" },
    path: "/app/ops-control",
    icon: Activity,
    group: "focus",
  },
  {
    key: "audience-signals",
    label: { en: "Audience Signals", vi: "Tín hiệu khách hàng" },
    path: "/app/audience-signals",
    icon: MessageCircle,
    group: "focus",
  },
  {
    key: "strategy-lab",
    label: { en: "Strategy Lab", vi: "Phòng lab chiến lược" },
    path: "/app/strategy-lab",
    icon: Brain,
    group: "focus",
  },
  {
    key: "finance-control",
    label: { en: "Finance Control", vi: "Điều phối tài chính" },
    path: "/app/finance-control",
    icon: ShieldCheck,
    group: "focus",
  },
  {
    key: "publish-ops",
    label: { en: "Publish Ops", vi: "Vận hành publish" },
    path: "/app/publish-ops",
    icon: Send,
    group: "focus",
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
