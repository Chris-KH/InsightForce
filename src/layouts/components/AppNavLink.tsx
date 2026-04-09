import { NavLink } from "react-router";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type AppNavLinkProps = {
  to: string;
  label: string;
  icon: LucideIcon;
  mobile?: boolean;
};

export function AppNavLink({
  to,
  label,
  icon: Icon,
  mobile = false,
}: AppNavLinkProps) {
  return (
    <NavLink to={to} className="block">
      {({ isActive }) => (
        <span
          className={cn(
            "group/nav relative flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all",
            isActive
              ? "border-primary/30 bg-primary/12 text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
              : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-muted/55 hover:text-foreground",
            mobile && "rounded-lg px-3 py-2.5",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              isActive
                ? "bg-primary"
                : "bg-transparent group-hover/nav:bg-muted-foreground/60",
            )}
          />
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </span>
      )}
    </NavLink>
  );
}
