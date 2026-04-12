import { Link, NavLink } from "react-router";
import { Bell, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileSidebarSheet } from "@/layouts/components/MobileSidebarSheet";
import {
  APP_FOCUS_NAV_ITEMS,
  APP_NAV_ITEMS,
} from "@/layouts/components/app-layout-data";
import { useBilingual } from "@/hooks/use-bilingual";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function AppHeader() {
  const copy = useBilingual();
  const headerNavItems = [...APP_NAV_ITEMS, ...APP_FOCUS_NAV_ITEMS];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-10 size-48 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative flex w-full items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <MobileSidebarSheet />
          <Link
            to="/app/dashboard"
            className="font-heading text-xl font-bold text-primary"
          >
            Insight<span className="text-chart-1">Forge</span>
          </Link>
        </div>

        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-muted/35 p-1 md:flex">
          {headerNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-all",
                    isActive
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                    item.group === "focus" &&
                      !isActive &&
                      "text-primary/85 hover:text-primary",
                  )
                }
              >
                <Icon className="size-3.5" />
                {copy(item.label.en, item.label.vi)}
              </NavLink>
            );
          })}
        </nav>

        <Badge
          variant="outline"
          className="hidden rounded-full border-primary/20 text-primary xl:inline-flex"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {copy("3 agents online", "3 bot đang hoạt động")}
        </Badge>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon-sm">
            <Bell />
            <span className="sr-only">
              {copy("Notifications", "Thông báo")}
            </span>
          </Button>
          <Button variant="ghost" size="icon-sm">
            <UserCircle2 />
            <span className="sr-only">{copy("Account", "Tài khoản")}</span>
          </Button>
          <LanguageSwitcher compact triggerVariant="ghost" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
