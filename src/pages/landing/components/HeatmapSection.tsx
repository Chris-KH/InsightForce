import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HEATMAP_IMAGE, INFRASTRUCTURE_KPIS, NETWORK_LOCATIONS } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { RadarSweep } from "./RadarSweep";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { Activity, Globe2, Timer } from "lucide-react";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

const REGION_TRAFFIC = [
  { label: "North America", value: 37, color: "hsl(var(--chart-1))" },
  { label: "Asia Pacific", value: 29, color: "hsl(var(--chart-2))" },
  { label: "Europe", value: 21, color: "hsl(var(--primary))" },
  { label: "Other", value: 13, color: "hsl(var(--muted-foreground))" },
];

export function GuardianWatchSection() {
  const copy = useBilingual();

  const translateKpiLabel = (label: string) => {
    if (label === "Creator data hubs") {
      return copy("Creator data hubs", "Trung tâm dữ liệu creator");
    }

    if (label === "Uptime SLA") {
      return copy("Uptime SLA", "Cam kết thời gian hoạt động");
    }

    if (label === "Global response") {
      return copy("Global response", "Phản hồi toàn cầu");
    }

    return label;
  };

  const translateRegion = (region: string) => {
    if (region === "US West") {
      return copy("US West", "Miền Tây Hoa Kỳ");
    }

    if (region === "US East") {
      return copy("US East", "Miền Đông Hoa Kỳ");
    }

    if (region === "Europe") {
      return copy("Europe", "Châu Âu");
    }

    if (region === "Asia") {
      return copy("Asia", "Châu Á");
    }

    if (region === "Oceania") {
      return copy("Oceania", "Châu Đại Dương");
    }

    if (region === "South America") {
      return copy("South America", "Nam Mỹ");
    }

    return region;
  };

  const translateTrafficLabel = (label: string) => {
    if (label === "North America") {
      return copy("North America", "Bắc Mỹ");
    }

    if (label === "Asia Pacific") {
      return copy("Asia Pacific", "Châu Á - Thái Bình Dương");
    }

    if (label === "Europe") {
      return copy("Europe", "Châu Âu");
    }

    if (label === "Other") {
      return copy("Other", "Khu vực khác");
    }

    return label;
  };

  return (
    <section
      id="infrastructure"
      className="relative isolate overflow-hidden bg-background/72 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-72"
          cellSize={116}
          strength="soft"
          fade="left-to-right"
        />

        <CometTrails
          className="absolute inset-0 opacity-80"
          density="low"
          direction="right-to-left"
          tone="chart"
        />

        <FloatingShards
          className="absolute inset-0"
          density="low"
          tone="chart"
        />

        <RadarSweep
          className="absolute top-10 right-[6%] hidden h-64 w-64 opacity-80 lg:block"
          intensity="strong"
        />

        <motion.div
          className="absolute -bottom-12 left-[10%] h-56 w-56 rounded-full bg-primary/10 blur-[110px]"
          animate={{ opacity: [0.16, 0.3, 0.16], scale: [1, 1.07, 1] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
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
            {copy("Global Infrastructure", "Hạ tầng toàn cầu")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            {copy(
              "Fast, reliable delivery for creator intelligence in every region",
              "Triển khai nhanh, ổn định cho hệ trí tuệ dành cho creator ở mọi khu vực",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Route audience signals through distributed hubs with low-latency responses, high availability, and operational visibility for every live campaign.",
              "Định tuyến tín hiệu từ khách hàng mục tiêu qua các trung tâm phân tán với độ trễ thấp, độ sẵn sàng cao và khả năng quan sát vận hành cho mọi chiến dịch trực tiếp.",
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden border-border/65 p-0 shadow-xl">
              <img
                src={HEATMAP_IMAGE}
                alt={copy(
                  "Global infrastructure map",
                  "Bản đồ hạ tầng toàn cầu",
                )}
                className="h-120 w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/75 via-background/10 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 grid gap-3 sm:grid-cols-3">
                {INFRASTRUCTURE_KPIS.map((kpi, index) => (
                  <motion.div
                    key={kpi.label}
                    className="rounded-xl border border-border/70 bg-background/78 px-3 py-3 backdrop-blur-md"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
                  >
                    <p className="font-heading text-[1.45rem] leading-none font-semibold">
                      {kpi.value}
                    </p>
                    <p className="mt-1 text-[11px] tracking-widest text-muted-foreground uppercase">
                      {translateKpiLabel(kpi.label)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Card className="h-full border-border/65 bg-card/70 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Globe2 className="size-4" />
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                    {copy(
                      "Regional Delivery Grid",
                      "Lưới phân phối theo khu vực",
                    )}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Live network status",
                    "Trạng thái mạng theo thời gian thực",
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 rounded-xl border border-border/65 bg-background/70 p-3 sm:grid-cols-[auto_1fr]">
                  <div className="relative grid size-24 place-items-center rounded-full bg-muted/60">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(hsl(var(--chart-1)) 0deg 133deg, hsl(var(--chart-2)) 133deg 238deg, hsl(var(--primary)) 238deg 313deg, hsl(var(--muted-foreground)) 313deg 360deg)",
                      }}
                    />
                    <div className="absolute inset-2 rounded-full bg-card/95" />
                    <div className="relative text-center">
                      <p className="font-heading text-lg leading-none font-semibold">
                        99.99%
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">
                        SLA
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {REGION_TRAFFIC.map((region) => (
                      <div key={region.label}>
                        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                          <span>{translateTrafficLabel(region.label)}</span>
                          <span className="text-foreground">
                            {region.value}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-muted/60">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: region.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${region.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {NETWORK_LOCATIONS.map((location) => (
                  <div
                    key={location.city}
                    className="rounded-lg border border-border/65 bg-background/70 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{location.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {translateRegion(location.region)}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <Timer className="size-3.5" />
                        {location.latency}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-chart-1 via-chart-2 to-primary"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.max(
                              30,
                              100 - Number.parseInt(location.latency, 10),
                            )}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45 }}
                        />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/75 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                        <Activity className="size-3 text-primary" />
                        {copy("Healthy", "Ổn định")}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
