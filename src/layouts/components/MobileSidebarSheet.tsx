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
  APP_SIDEBAR_STATUS,
} from "@/layouts/components/app-layout-data";
import { useBilingual } from "@/hooks/use-bilingual";

export function MobileSidebarSheet() {
  const copy = useBilingual();

  const getAgentStatus = (status: "Active" | "Idle") => {
    return status === "Active"
      ? copy("Active", "Đang hoạt động")
      : copy("Idle", "Tạm nghỉ");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden">
          <Menu />
          <span className="sr-only">
            {copy("Open navigation", "Mở điều hướng")}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[90vw] max-w-sm border-border/60 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader className="px-0 pt-2">
          <SheetTitle className="font-heading text-2xl text-primary">
            Insight<span className="text-chart-1">Forge</span>
          </SheetTitle>
          <SheetDescription>
            {copy(
              "Navigate your operating dashboard and live agent systems.",
              "Di chuyển giữa bảng điều khiển vận hành và hệ thống bot trực tuyến.",
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 rounded-2xl border border-border/70 bg-muted/35 p-4">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {copy("Live Core Status", "Trạng thái lõi trực tiếp")}
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {APP_SIDEBAR_STATUS.map((status) => (
              <div key={status.label.en}>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{copy(status.label.en, status.label.vi)}</span>
                  <span>{status.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-background/90">
                  <div
                    className={
                      status.tone === "primary"
                        ? "h-full rounded-full bg-primary"
                        : status.tone === "secondary"
                          ? "h-full rounded-full bg-chart-2"
                          : "h-full rounded-full bg-chart-3"
                    }
                    style={{ width: `${status.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {APP_NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.path}
              to={item.path}
              label={copy(item.label.en, item.label.vi)}
              icon={item.icon}
              mobile
            />
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2">
          <p className="px-1 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {copy("Core Guards", "Hệ thống phòng vệ cốt lõi")}
          </p>
          {APP_AGENT_ITEMS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.label.en}
                className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  <span>{copy(agent.label.en, agent.label.vi)}</span>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 text-primary"
                >
                  {getAgentStatus(agent.status)}
                </Badge>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            InsightForge <span className="text-chart-1">Control</span>
          </p>
          <p className="mt-1">
            {copy(
              "Realtime orchestration across all active agent lanes.",
              "Điều phối thời gian thực trên tất cả luồng bot đang hoạt động.",
            )}
          </p>
          <Link to="/app/finance" className="mt-3 inline-block text-primary">
            {copy("Open Finance", "Mở tài chính")}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
