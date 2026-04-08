import { Link, NavLink, useLocation } from "react-router";
import { Bell, Search, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileSidebarSheet } from "@/layouts/components/MobileSidebarSheet";
import { APP_HEADER_TABS } from "@/layouts/components/app-layout-data";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function AppHeader() {
  const location = useLocation();

  const activeTopTab = location.pathname.includes("/finance")
    ? "Finance"
    : location.pathname.includes("/dashboard") ||
        location.pathname.includes("/automation")
      ? "Reports"
      : "Settings";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="flex w-full items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <MobileSidebarSheet />
          <Link
            to="/app/dashboard"
            className="font-heading text-xl font-bold text-primary"
          >
            InsightForge
          </Link>
        </div>

        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search workspace"
            placeholder="Search financials..."
            className="h-10 rounded-full border-border/60 bg-muted/30 pl-10 shadow-none"
          />
        </div>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {APP_HEADER_TABS.map((tab) => {
            const to =
              tab === "Finance"
                ? "/app/finance"
                : tab === "Reports"
                  ? "/app/dashboard"
                  : "/app/strategy";

            return (
              <NavLink
                key={tab}
                to={to}
                className={cn(
                  "border-b-2 pb-1 text-sm transition-colors",
                  activeTopTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground",
                )}
              >
                {tab}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
          <Button variant="ghost" size="icon-sm">
            <Bell />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon-sm">
            <UserCircle2 />
            <span className="sr-only">Account</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
