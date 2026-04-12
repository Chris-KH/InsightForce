import { Link } from "react-router";

import { useBilingual } from "@/hooks/use-bilingual";
import { AppNavLink } from "@/layouts/components/AppNavLink";
import {
  APP_FOCUS_NAV_ITEMS,
  APP_NAV_ITEMS,
  APP_SIDEBAR_STATUS,
} from "@/layouts/components/app-layout-data";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const copy = useBilingual();

  const getStatusToneClass = (tone: "primary" | "secondary" | "tertiary") =>
    tone === "primary"
      ? "bg-primary"
      : tone === "secondary"
        ? "bg-chart-2"
        : "bg-chart-3";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-xl md:flex md:flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-32 size-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-24 -bottom-28 size-72 rounded-full bg-chart-2/12 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="border-b border-border/60 px-5 py-5">
          <Link
            to="/app/dashboard"
            className="font-heading text-[1.8rem] leading-none font-bold text-primary"
          >
            Insight<span className="text-chart-1">Forge</span>
          </Link>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {copy(
              "Command center for creator operations, finance, and automation loops.",
              "Trung tâm điều phối cho vận hành creator, tài chính và luồng tự động hóa.",
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <section className="rounded-2xl border border-border/70 bg-background/75 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.06)]">
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
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        getStatusToneClass(status.tone),
                      )}
                      style={{ width: `${status.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <p className="px-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {copy("Navigation", "Điều hướng")}
            </p>
            <nav className="mt-2 flex flex-col gap-1">
              {APP_NAV_ITEMS.map((item) => (
                <AppNavLink
                  key={item.path}
                  to={item.path}
                  label={copy(item.label.en, item.label.vi)}
                  icon={item.icon}
                />
              ))}
            </nav>
          </section>

          <section className="mt-6">
            <p className="px-1 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {copy("Focus Pages", "Trang chuyên sâu")}
            </p>
            <nav className="mt-2 flex flex-col gap-1">
              {APP_FOCUS_NAV_ITEMS.map((item) => (
                <AppNavLink
                  key={item.path}
                  to={item.path}
                  label={copy(item.label.en, item.label.vi)}
                  icon={item.icon}
                />
              ))}
            </nav>
          </section>
        </div>
      </div>
    </aside>
  );
}
