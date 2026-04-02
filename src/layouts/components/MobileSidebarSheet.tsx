import { Link } from "react-router";
import { Menu } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AppNavLink } from "@/layouts/components/AppNavLink";
import {
  APP_AGENT_ITEMS,
  APP_NAV_ITEMS,
} from "@/layouts/components/app-layout-data";

export function MobileSidebarSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden">
          <Menu />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-sm border-border/60 bg-background"
      >
        <SheetHeader className="px-0 pt-2">
          <SheetTitle className="font-heading text-2xl text-primary">
            InsightForge
          </SheetTitle>
          <SheetDescription>
            Navigate your operating dashboard and live agent systems.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2">
          {APP_NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              mobile
            />
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2">
          <p className="px-1 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Core Guards
          </p>
          {APP_AGENT_ITEMS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.label}
                className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  <span>{agent.label}</span>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 text-primary"
                >
                  {agent.status}
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">InsightForge Control</p>
          <p className="mt-1">
            Realtime orchestration across all active agent lanes.
          </p>
          <Link to="/app/finance" className="mt-3 inline-block text-primary">
            Open Finance
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
