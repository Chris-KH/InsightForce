import {
  Compass,
  LayoutDashboard,
  type LucideIcon,
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
  group: "primary";
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
    label: { en: "Audience", vi: "Khán giả" },
    path: "/app/audience",
    icon: Users,
    group: "primary",
  },
  {
    key: "strategy",
    label: { en: "Trends", vi: "Xu hướng" },
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
