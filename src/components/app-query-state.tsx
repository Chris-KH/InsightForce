import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

import { PanelCard } from "@/components/app-section";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type QueryStateType = "loading" | "empty" | "error";

type QueryStateCardProps = {
  state: QueryStateType;
  title: string;
  description: string;
  hint?: string;
  className?: string;
};

type InlineQueryStateProps = {
  state: Exclude<QueryStateType, "error"> | "error";
  message: string;
  className?: string;
};

const stateStyles: Record<
  QueryStateType,
  { icon: typeof LoaderCircle; className: string }
> = {
  loading: {
    icon: LoaderCircle,
    className: "text-primary",
  },
  empty: {
    icon: Inbox,
    className: "text-muted-foreground",
  },
  error: {
    icon: AlertTriangle,
    className: "text-rose-600",
  },
};

export function QueryStateCard({
  state,
  title,
  description,
  hint,
  className,
}: QueryStateCardProps) {
  const config = stateStyles[state];
  const Icon = config.icon;

  return (
    <PanelCard title={title} description={description} className={className}>
      <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
        <div className={cn("mb-2 flex items-center gap-2", config.className)}>
          <Icon
            className={cn("size-4", state === "loading" && "animate-spin")}
          />
          <span className="text-xs font-medium tracking-[0.14em] uppercase">
            {state}
          </span>
        </div>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
    </PanelCard>
  );
}

export function InlineQueryState({
  state,
  message,
  className,
}: InlineQueryStateProps) {
  const config = stateStyles[state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/65 bg-background/50 px-4 py-5 text-sm",
        className,
      )}
    >
      <div className={cn("mb-2 flex items-center gap-2", config.className)}>
        <Icon className={cn("size-4", state === "loading" && "animate-spin")} />
        <span className="text-xs font-medium tracking-[0.14em] uppercase">
          {state}
        </span>
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

type MetricCardsSkeletonProps = {
  count?: number;
  className?: string;
};

export function MetricCardsSkeleton({
  count = 4,
  className,
}: MetricCardsSkeletonProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-border/75 bg-card/80 p-5 shadow-[0_12px_28px_rgba(51,65,85,0.08)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-2/3 rounded-full" />
          <Skeleton className="mt-2 h-8 w-1/2 rounded-full" />
          <Skeleton className="mt-3 h-3 w-3/4 rounded-full" />
        </div>
      ))}
    </div>
  );
}

type PanelRowsSkeletonProps = {
  rows?: number;
  className?: string;
};

export function PanelRowsSkeleton({
  rows = 4,
  className,
}: PanelRowsSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border/55 bg-background/55 p-4"
        >
          <Skeleton className="h-4 w-1/3 rounded-full" />
          <Skeleton className="mt-3 h-3 w-11/12 rounded-full" />
          <Skeleton className="mt-2 h-3 w-2/3 rounded-full" />
        </div>
      ))}
    </div>
  );
}
