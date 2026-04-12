import { Suspense, lazy } from "react";

import { Badge } from "@/components/ui/badge";
import {
  getPlatformBadgeClassName,
  getPlatformIcon,
  getPlatformLabel,
} from "@/lib/platform-theme";
import { cn } from "@/lib/utils";

type PlatformBadgeProps = {
  platform: string;
  className?: string;
  withIcon?: boolean;
};

const Icon = lazy(() =>
  import("@iconify-icon/react").then((module) => ({ default: module.Icon })),
);

export function PlatformBadge({
  platform,
  className,
  withIcon = true,
}: PlatformBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase",
        getPlatformBadgeClassName(platform),
        className,
      )}
    >
      {withIcon ? (
        <Suspense
          fallback={
            <span className="size-3.5 shrink-0 rounded-full bg-current/20" />
          }
        >
          <Icon
            icon={getPlatformIcon(platform)}
            className="size-3.5 shrink-0"
          />
        </Suspense>
      ) : null}
      {getPlatformLabel(platform)}
    </Badge>
  );
}
