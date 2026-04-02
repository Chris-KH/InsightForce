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
};

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
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
        <div className="flex shrink-0 items-center gap-3">{action}</div>
      ) : null}
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
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardContent className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          {delta ? (
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
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
    <Card className={cn("rounded-3xl border-border/50 shadow-sm", className)}>
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
      ? "bg-primary"
      : tone === "secondary"
        ? "bg-secondary"
        : tone === "tertiary"
          ? "bg-chart-1"
          : "bg-muted-foreground";

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full", toneClassName)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
