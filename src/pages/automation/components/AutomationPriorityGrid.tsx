import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AutomationCardPriority = "high" | "medium" | "low";

type AutomationPriorityGridProps = {
  children: ReactNode;
  className?: string;
};

type AutomationPriorityItemProps = {
  priority: AutomationCardPriority;
  children: ReactNode;
  className?: string;
};

function getPriorityClassName(priority: AutomationCardPriority) {
  if (priority === "high") {
    return "md:col-span-6 xl:col-span-12";
  }

  if (priority === "medium") {
    return "md:col-span-3 xl:col-span-6";
  }

  return "md:col-span-2 xl:col-span-4";
}

export function AutomationPriorityGrid({
  children,
  className,
}: AutomationPriorityGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AutomationPriorityItem({
  priority,
  children,
  className,
}: AutomationPriorityItemProps) {
  return (
    <div className={cn(getPriorityClassName(priority), className)}>
      {children}
    </div>
  );
}
