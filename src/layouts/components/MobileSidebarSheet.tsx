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
import { useBilingual } from "@/hooks/use-bilingual";

export function MobileSidebarSheet() {
  const copy = useBilingual();

  const getNavLabel = (path: string, fallbackLabel: string) => {
    if (path === "/app/dashboard") {
      return copy("Dashboard", "Tổng quan");
    }

    if (path === "/app/audience") {
      return copy("Audience", "Khách hàng");
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
      return copy("Architect", "Thiết kế phân luồng");
    }

    if (label === "Scout") {
      return copy("Scout", "Phân tích");
    }

    return label;
  };

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
        className="w-[88vw] max-w-sm border-border/60 bg-background"
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

        <div className="mt-6 flex flex-col gap-2">
          {APP_NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.path}
              to={item.path}
              label={getNavLabel(item.path, item.label)}
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
                key={agent.label}
                className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  <span>{getAgentLabel(agent.label)}</span>
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
