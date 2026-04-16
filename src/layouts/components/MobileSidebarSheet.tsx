import { Link } from "react-router";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useBilingual } from "@/hooks/use-bilingual";
import { AssistantSidebarStatus } from "@/layouts/components/AssistantSidebarStatus";
import { AppNavLink } from "@/layouts/components/AppNavLink";
import { APP_NAV_ITEMS } from "@/layouts/components/app-layout-data";

export function MobileSidebarSheet() {
  const copy = useBilingual();

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

        <AssistantSidebarStatus className="mt-6 border-border/70 bg-muted/35" />

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
