import {
  BellRing,
  Bot,
  Compass,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";

import type {
  ActivityDomain,
  ActivityStatus,
} from "@/app/slices/activity-feed.slice";

export function formatActivityRelativeTime(
  timestamp: number,
  copy: (en: string, vi: string) => string,
) {
  const diffMs = Date.now() - timestamp;
  const diffSeconds = Math.max(1, Math.floor(diffMs / 1000));

  if (diffSeconds < 60) {
    return copy(`${diffSeconds}s ago`, `${diffSeconds} giây trước`);
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return copy(`${diffMinutes}m ago`, `${diffMinutes} phút trước`);
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return copy(`${diffHours}h ago`, `${diffHours} giờ trước`);
  }

  const diffDays = Math.floor(diffHours / 24);
  return copy(`${diffDays}d ago`, `${diffDays} ngày trước`);
}

export function getActivityDomainLabel(
  domain: ActivityDomain,
  copy: (en: string, vi: string) => string,
) {
  if (domain === "automation") {
    return copy("Automation", "Tự động hóa");
  }

  return copy("Strategy", "Chiến lược");
}

export function getActivityDomainIcon(domain: ActivityDomain): LucideIcon {
  if (domain === "automation") {
    return Bot;
  }

  return Compass;
}

export function getActivityStatusIcon(status: ActivityStatus): LucideIcon {
  if (status === "error") {
    return TriangleAlert;
  }

  return BellRing;
}

export function getActivityStatusClass(status: ActivityStatus) {
  if (status === "error") {
    return "border-rose-500/35 bg-rose-500/12 text-rose-700 dark:text-rose-300";
  }

  return "border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
}
