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
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-muted/80 hover:text-foreground",
          mobile && "rounded-lg px-3 py-2.5",
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}
