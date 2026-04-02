import { Link } from "react-router";

import { AppNavLink } from "@/layouts/components/AppNavLink";
import {
  APP_AGENT_ITEMS,
  APP_NAV_ITEMS,
} from "@/layouts/components/app-layout-data";

export function AppSidebar() {
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
          Agents
        </p>
        <p className="px-2 pt-1 text-[11px] text-primary">Live Status</p>

        <nav className="mt-6 flex flex-col gap-1">
          {APP_NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Core Guards
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
                <span>{agent.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
