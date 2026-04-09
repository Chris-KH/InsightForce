import { type ReactNode } from "react";
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
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-border/70 bg-card/75 px-5 py-5 shadow-[0_16px_42px_rgba(0,0,0,0.06)] sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-16 size-40 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 size-44 rounded-full bg-chart-2/12 blur-3xl" />
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
    <Card className="relative rounded-3xl border-border/70 bg-card/80 shadow-[0_16px_38px_rgba(0,0,0,0.05)]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl">
        <div className="absolute -top-20 -right-16 size-28 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <CardContent className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
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
  children: ReactNode;
};

export function PanelCard({
  title,
  description,
  action,
  className,
  children,
}: PanelProps) {
  return (
    <Card
      className={cn(
        "relative rounded-3xl border-border/70 bg-card/82 shadow-[0_18px_44px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl">
        <div className="absolute -top-28 -right-24 size-40 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <CardHeader className="border-b border-border/50 pb-5">
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
      <CardContent className="pt-6">{children}</CardContent>
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
