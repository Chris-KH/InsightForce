import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useBilingual } from "@/hooks/use-bilingual";
import { AssistantSidebarStatus } from "@/layouts/components/AssistantSidebarStatus";
import { AppNavLink } from "@/layouts/components/AppNavLink";
import { APP_NAV_ITEMS } from "@/layouts/components/app-layout-data";

export function AppSidebar() {
  const copy = useBilingual();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-xl md:flex md:flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-32 size-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-24 -bottom-28 size-72 rounded-full bg-chart-2/12 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="border-b border-border/60 px-5 py-5">
          <Link
            to="/"
            className="font-heading text-[1.8rem] leading-none font-bold text-primary"
          >
            Insight<span className="text-chart-1">Forge</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AssistantSidebarStatus />

          <Collapsible
            defaultOpen
            className="mt-6 rounded-xl border border-border/55 bg-background/45 p-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group h-8 w-full justify-between px-2 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase data-[state=open]:text-foreground"
              >
                {copy("Navigation", "Điều hướng")}
                <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 flex flex-col gap-1">
              {APP_NAV_ITEMS.map((item) => (
                <AppNavLink
                  key={item.path}
                  to={item.path}
                  label={copy(item.label.en, item.label.vi)}
                  icon={item.icon}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  );
}
