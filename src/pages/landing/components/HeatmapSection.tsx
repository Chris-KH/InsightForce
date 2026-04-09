import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HEATMAP_IMAGE, INFRASTRUCTURE_KPIS, NETWORK_LOCATIONS } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { RadarSweep } from "./RadarSweep";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { Globe2, Timer } from "lucide-react";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

export function GuardianWatchSection() {
  const copy = useBilingual();

  const translateKpiLabel = (label: string) => {
    if (label === "Creator data hubs") {
      return copy("Creator data hubs", "Hub dữ liệu creator");
    }

    if (label === "Uptime SLA") {
      return copy("Uptime SLA", "SLA thời gian hoạt động");
    }

    if (label === "Global response") {
      return copy("Global response", "Phản hồi toàn cầu");
    }

    return label;
  };

  const translateRegion = (region: string) => {
    if (region === "US West") {
      return copy("US West", "Bờ Tây Mỹ");
    }

    if (region === "US East") {
      return copy("US East", "Bờ Đông Mỹ");
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
              "Triển khai nhanh và ổn định cho trí tuệ creator ở mọi khu vực",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Route audience signals through distributed hubs with low-latency responses, high availability, and operational visibility for every live campaign.",
              "Định tuyến tín hiệu khách hàng qua các hub phân tán với độ trễ thấp, độ sẵn sàng cao và khả năng quan sát vận hành cho mọi chiến dịch trực tiếp.",
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
                    {copy("Regional Delivery Grid", "Lưới phân phối khu vực")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy("Live network status", "Trạng thái mạng trực tiếp")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NETWORK_LOCATIONS.map((location) => (
                  <div
                    key={location.city}
                    className="flex items-center justify-between rounded-lg border border-border/65 bg-background/70 px-3 py-2.5"
                  >
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
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
