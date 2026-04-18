import { type ReactNode } from "react";

import { SurfaceGrid } from "@/components/app-futuristic";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-border/75 bg-linear-to-br from-card via-card/95 to-muted/35 px-5 py-5 shadow-[0_20px_45px_rgba(51,65,85,0.08)] backdrop-blur-[2px] sm:px-6 sm:py-6 dark:from-card dark:via-card/92 dark:to-card/82 dark:shadow-[0_22px_50px_rgba(2,6,23,0.34)]">
      <div className="pointer-events-none absolute inset-0">
        <SurfaceGrid className="opacity-24 dark:opacity-15" />
        <div className="absolute inset-x-8 top-4 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute -top-20 -right-16 size-44 rounded-full bg-primary/16 blur-3xl dark:bg-primary/12" />
        <div className="absolute -bottom-24 -left-12 size-48 rounded-full bg-chart-2/14 blur-3xl dark:bg-chart-2/10" />
      </div>

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  detail?: string;
};

export function MetricCard({
  label,
  value,
  delta,
  icon,
  detail,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-border/75 bg-linear-to-br from-card via-card/96 to-muted/30 shadow-[0_18px_40px_rgba(51,65,85,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(51,65,85,0.14)] dark:from-card/95 dark:via-card/90 dark:to-card/80 dark:shadow-[0_18px_42px_rgba(2,6,23,0.34)] dark:hover:shadow-[0_26px_56px_rgba(2,6,23,0.45)]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl">
        <SurfaceGrid className="opacity-18 dark:opacity-12" />
        <div className="absolute inset-x-6 top-3 h-px bg-linear-to-r from-transparent via-primary/65 to-transparent" />
        <div className="absolute -top-20 -right-16 size-32 rounded-full bg-primary/14 blur-3xl dark:bg-primary/10" />
      </div>
      <CardContent className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/22 bg-linear-to-br from-primary/18 via-primary/12 to-chart-2/16 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.12)_inset] dark:from-primary/20 dark:via-primary/12 dark:to-chart-2/14">
            {icon}
          </div>
          {delta ? (
            <Badge
              variant="outline"
              className="rounded-full border-primary/25 bg-background/80 text-primary"
            >
              {delta}
            </Badge>
          ) : null}
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold text-foreground">
            {value}
          </p>
          {detail ? (
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

type PanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function PanelCard({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: PanelProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border-border/75 bg-linear-to-br from-card via-card/96 to-muted/28 shadow-[0_20px_46px_rgba(51,65,85,0.08)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(51,65,85,0.14)] dark:from-card/96 dark:via-card/90 dark:to-card/82 dark:shadow-[0_20px_48px_rgba(2,6,23,0.35)] dark:hover:shadow-[0_26px_56px_rgba(2,6,23,0.45)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl">
        <SurfaceGrid className="opacity-20 dark:opacity-12" />
        <div className="absolute inset-x-8 top-4 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute -top-28 -right-24 size-44 rounded-full bg-primary/13 blur-3xl dark:bg-primary/10" />
      </div>

      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">
              {title}
            </CardTitle>
            {description ? (
              <CardDescription className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn("pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

type ProgressBarProps = {
  value: number;
  tone?: "primary" | "secondary" | "tertiary" | "muted";
  className?: string;
};

export function ProgressBar({
  value,
  tone = "primary",
  className,
}: ProgressBarProps) {
  const toneClassName =
    tone === "primary"
      ? "bg-linear-to-r from-primary to-chart-1"
      : tone === "secondary"
        ? "bg-linear-to-r from-chart-2 to-primary"
        : tone === "tertiary"
          ? "bg-linear-to-r from-chart-3 to-chart-1"
          : "bg-muted-foreground";

  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full border border-border/60 bg-muted",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full", toneClassName)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
