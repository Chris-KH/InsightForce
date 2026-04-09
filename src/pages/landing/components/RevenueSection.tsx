import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  INTEGRATIONS,
  PERFORMANCE_METRICS,
  SECURITY_BADGES,
  SECURITY_FEATURES,
} from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { PlugZap, Shield } from "lucide-react";
import { motion } from "motion/react";

function formatMetric(value: number, prefix?: string, suffix?: string) {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

export function ExecutiveProjectionsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-muted/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-[72%]"
          cellSize={106}
          strength="medium"
          fade="diagonal"
        />

        <CometTrails
          className="absolute inset-0 opacity-85"
          density="medium"
          direction="left-to-right"
          tone="primary"
        />

        <FloatingShards
          className="absolute inset-0"
          density="medium"
          tone="mixed"
        />

        <OrbitRings
          className="absolute top-6 -left-8 hidden h-72 w-72 opacity-70 lg:block"
          tone="mixed"
          spin="slow"
        />

        <motion.div
          className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/10 blur-[120px]"
          animate={{ opacity: [0.18, 0.34, 0.18], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute right-[18%] bottom-2 h-48 w-48 rounded-full bg-chart-1/10 blur-[90px]"
          animate={{ opacity: [0.14, 0.26, 0.14], scale: [1, 1.14, 1] }}
          transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            Scale Visibility
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            Performance, integrations, and compliance from one control plane
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Track real-time throughput, activate your existing toolchain, and
            protect every workflow with enterprise security defaults.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PERFORMANCE_METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="h-full border-border/65 bg-card/72">
                <CardContent className="px-4 py-5">
                  <p className="font-heading text-[1.8rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.1rem]">
                    {formatMetric(metric.value, metric.prefix, metric.suffix)}
                  </p>
                  <p className="mt-2 text-[11px] tracking-widest text-muted-foreground uppercase">
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <Card className="h-full border-border/65 bg-card/72">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <PlugZap className="size-4" />
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                    Integrations
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  Connect your stack in minutes
                </CardTitle>
                <CardDescription>
                  Activate cross-platform workflows with prebuilt connectors for
                  channels, CRM, payments, and collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {INTEGRATIONS.map((integration) => (
                    <span
                      key={integration.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs"
                    >
                      <span className="font-medium text-foreground">
                        {integration.name}
                      </span>
                      <span className="text-muted-foreground">
                        {integration.category}
                      </span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <Card className="h-full border-border/65 bg-card/72">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="size-4" />
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                    Security
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  Enterprise-ready by default
                </CardTitle>
                <CardDescription>
                  Built-in governance controls for creator, partner, and
                  campaign data across global teams.
                </CardDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SECURITY_BADGES.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="border-border/70 bg-background/75 text-xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {SECURITY_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-lg border border-border/65 bg-background/72 px-3 py-3"
                    >
                      <div className="flex items-center gap-2 text-foreground">
                        <Icon className="size-4 text-primary" />
                        <p className="text-sm font-semibold">{feature.title}</p>
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
