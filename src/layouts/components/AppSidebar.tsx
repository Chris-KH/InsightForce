import { Link } from "react-router";

import { useBilingual } from "@/hooks/use-bilingual";
import { AppNavLink } from "@/layouts/components/AppNavLink";
import {
  APP_AGENT_ITEMS,
  APP_NAV_ITEMS,
} from "@/layouts/components/app-layout-data";

export function AppSidebar() {
  const copy = useBilingual();

  const getNavLabel = (path: string, fallbackLabel: string) => {
    if (path === "/app/dashboard") {
      return copy("Dashboard", "Tổng quan");
    }

    if (path === "/app/audience") {
      return copy("Audience", "Khán giả");
    }

    if (path === "/app/strategy") {
      return copy("Strategy", "Chiến lược");
    }

    if (path === "/app/finance") {
      return copy("Finance", "Tài chính");
    }

    if (path === "/app/automation") {
      return copy("Automation", "Tự động hóa");
    }

    return fallbackLabel;
  };

  const getAgentLabel = (label: string) => {
    if (label === "Guardian") {
      return copy("Guardian", "Vệ binh");
    }

    if (label === "Architect") {
      return copy("Architect", "Kiến trúc sư");
    }

    if (label === "Scout") {
      return copy("Scout", "Trinh sát");
    }

    return label;
  };

  return (
    <aside className="fixed top-0 left-0 hidden h-screen w-60 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="border-b border-border/60 px-5 py-5">
        <Link
          to="/app/dashboard"
          className="font-heading text-[1.75rem] leading-none font-bold text-primary"
        >
          Insight<span className="text-chart-1">Forge</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {copy("Agents", "Tác vụ viên")}
        </p>
        <p className="px-2 pt-1 text-[11px] text-primary">
          {copy("Live Status", "Trạng thái trực tuyến")}
        </p>

        <nav className="mt-6 flex flex-col gap-1">
          {APP_NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.path}
              to={item.path}
              label={getNavLabel(item.path, item.label)}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {copy("Core Guards", "Bảo vệ cốt lõi")}
        </p>
        <div className="mt-3 space-y-2">
          {APP_AGENT_ITEMS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.label}
                className="flex items-center gap-3 text-xs text-muted-foreground"
              >
                <Icon className="size-3.5" />
                <span>{getAgentLabel(agent.label)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
