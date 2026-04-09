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
import {
  BarChart3,
  CircleCheckBig,
  Link2,
  PlugZap,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";
import { SocialIcon } from "react-social-icons";

function formatMetric(value: number, prefix?: string, suffix?: string) {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

const METRIC_TRENDS = [
  [48, 56, 64, 71, 79, 88],
  [72, 79, 83, 88, 92, 96],
  [34, 42, 51, 64, 77, 89],
  [52, 59, 66, 72, 81, 90],
];

const METRIC_DELTA = [18, 6, 23, 14];

const INTEGRATION_NETWORKS: Record<string, string> = {
  YouTube: "youtube",
  TikTok: "tiktok",
  Instagram: "instagram",
  Slack: "slack",
};

const INTEGRATION_COLORS: Record<string, string> = {
  YouTube: "#ff0033",
  TikTok: "#111111",
  Instagram: "#e1306c",
  Slack: "#4a154b",
};

export function ExecutiveProjectionsSection() {
  const copy = useBilingual();

  const translatePerformanceLabel = (label: string) => {
    if (label === "Audience events processed today") {
      return copy(
        "Audience events processed today",
        "Số sự kiện khách hàng đã xử lý hôm nay",
      );
    }

    if (label === "Campaign uptime this quarter") {
      return copy(
        "Campaign uptime this quarter",
        "Thời gian hoạt động của chiến dịch trong quý này",
      );
    }

    if (label === "Average agent response") {
      return copy(
        "Average agent response",
        "Thời gian phản hồi trung bình của agent",
      );
    }

    if (label === "Countries activated") {
      return copy("Countries activated", "Số quốc gia được triển khai");
    }

    return label;
  };

  const translateIntegrationCategory = (category: string) => {
    if (category === "Creator Channel") {
      return copy("Creator Channel", "Kênh creator");
    }

    if (category === "CRM") {
      return copy("CRM", "Quản lý khách hàng");
    }

    if (category === "AI/ML") {
      return copy("AI/ML", "AI/ML");
    }

    if (category === "Commerce") {
      return copy("Commerce", "Thương mại");
    }

    if (category === "Payments") {
      return copy("Payments", "Thanh toán");
    }

    if (category === "Workspace") {
      return copy("Workspace", "Không gian làm việc");
    }

    if (category === "Design") {
      return copy("Design", "Thiết kế");
    }

    if (category === "Communication") {
      return copy("Communication", "Giao tiếp");
    }

    if (category === "Database") {
      return copy("Database", "Cơ sở dữ liệu");
    }

    if (category === "Hosting") {
      return copy("Hosting", "Lưu trữ");
    }

    return category;
  };

  const translateMixLabel = (label: string) => {
    if (label === "Creator channels") {
      return copy("Creator channels", "Kênh creator");
    }

    if (label === "Commerce + payments") {
      return copy("Commerce + payments", "Thương mại + thanh toán");
    }

    if (label === "Operations + AI") {
      return copy("Operations + AI", "Vận hành + AI");
    }

    return label;
  };

  const translateSecurityFeature = (title: string, description: string) => {
    if (title === "SOC 2 Type II controls") {
      return {
        title: copy("SOC 2 Type II controls", "Kiểm soát SOC 2 Type II"),
        description: copy(
          "Security controls audited continuously to meet enterprise governance requirements.",
          "Các kiểm soát bảo mật được kiểm toán liên tục để đáp ứng yêu cầu quản trị doanh nghiệp.",
        ),
      };
    }

    if (title === "End-to-end encryption") {
      return {
        title: copy("End-to-end encryption", "Mã hóa đầu cuối"),
        description: copy(
          "TLS 1.3 in transit and AES-256 at rest for creator, partner, and campaign data.",
          "TLS 1.3 khi truyền và AES-256 khi lưu trữ cho dữ liệu creator, đối tác và chiến dịch.",
        ),
      };
    }

    if (title === "Zero-trust permissions") {
      return {
        title: copy("Zero-trust permissions", "Phân quyền zero-trust"),
        description: copy(
          "Fine-grained access controls by campaign, team, and external collaborator.",
          "Kiểm soát truy cập chi tiết theo chiến dịch, nhóm và cộng tác viên bên ngoài.",
        ),
      };
    }

    return {
      title,
      description,
    };
  };

  const integrationMix = [
    { label: "Creator channels", value: 46, colorClass: "bg-chart-1" },
    { label: "Commerce + payments", value: 32, colorClass: "bg-chart-2" },
    { label: "Operations + AI", value: 22, colorClass: "bg-primary" },
  ];

  const securityPulse = [
    {
      label: copy("Threats blocked", "Mối đe dọa đã chặn"),
      value: "2.8M",
      score: 94,
    },
    {
      label: copy("Safe workflow runs", "Workflow an toàn"),
      value: "99.7%",
      score: 97,
    },
    {
      label: copy("Audit trace coverage", "Độ phủ log kiểm toán"),
      value: "100%",
      score: 100,
    },
  ];

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
            {copy("Scale Visibility", "Khả năng quan sát khi mở rộng")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            {copy(
              "Performance, integrations, and compliance from one control plane",
              "Hiệu năng, tích hợp và tuân thủ trên cùng một mặt phẳng điều khiển",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Track real-time throughput, activate your existing toolchain, and protect every workflow with enterprise security defaults.",
              "Theo dõi thông lượng theo thời gian thực, kích hoạt toolchain hiện có và bảo vệ mọi quy trình bằng các cấu hình bảo mật mặc định cho doanh nghiệp.",
            )}
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
                  <div className="flex items-end justify-between gap-3">
                    <p className="font-heading text-[1.8rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.1rem]">
                      {formatMetric(metric.value, metric.prefix, metric.suffix)}
                    </p>
                    <span className="inline-flex rounded-full border border-border/70 bg-background/75 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      +{METRIC_DELTA[index] ?? 8}%
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] tracking-widest text-muted-foreground uppercase">
                    {translatePerformanceLabel(metric.label)}
                  </p>

                  <div className="mt-3 flex h-9 items-end gap-1.5">
                    {(METRIC_TRENDS[index] ?? [52, 61, 68, 74, 81, 86]).map(
                      (value, trendIndex) => (
                        <span
                          key={`${metric.label}-${value}-${trendIndex}`}
                          className="w-full rounded-sm"
                          style={{
                            height: `${Math.max(24, value * 0.35)}px`,
                            backgroundColor:
                              trendIndex % 2 === 0
                                ? "hsl(var(--chart-1) / 0.75)"
                                : "hsl(var(--chart-2) / 0.75)",
                          }}
                        />
                      ),
                    )}
                  </div>
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
                    {copy("Integrations", "Tích hợp")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Connect your stack with visual channel blocks",
                    "Kết nối stack với các khối kênh trực quan",
                  )}
                </CardTitle>
                <CardDescription>
                  {copy(
                    "Use ready-made connectors and monitor your channel mix at a glance.",
                    "Dùng connector dựng sẵn và theo dõi tỷ trọng kênh chỉ trong một lần nhìn.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {integrationMix.map((mix) => (
                    <div
                      key={mix.label}
                      className="rounded-lg border border-border/70 bg-background/75 px-3 py-2"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase">
                        <span className="text-muted-foreground">
                          {translateMixLabel(mix.label)}
                        </span>
                        <span className="text-foreground">{mix.value}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-muted/60">
                        <motion.div
                          className={`h-full rounded-full ${mix.colorClass}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${mix.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {INTEGRATIONS.map((integration, index) => {
                    const network = INTEGRATION_NETWORKS[integration.name];
                    const bgColor =
                      INTEGRATION_COLORS[integration.name] ?? "#334155";

                    return (
                      <motion.div
                        key={integration.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.03 }}
                        className="rounded-xl border border-border/70 bg-background/75 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          {network ? (
                            <SocialIcon
                              as="div"
                              network={network}
                              style={{ height: 30, width: 30 }}
                              bgColor={bgColor}
                              fgColor="#ffffff"
                            />
                          ) : (
                            <span className="inline-grid size-7 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
                              {integration.name[0]}
                            </span>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {integration.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground uppercase">
                              {translateIntegrationCategory(
                                integration.category,
                              )}
                            </p>
                          </div>

                          <Link2 className="ml-auto size-3.5 text-muted-foreground" />
                        </div>

                        <div className="mt-2 h-1.5 rounded-full bg-muted/60">
                          <motion.div
                            className="h-full rounded-full bg-linear-to-r from-chart-1 via-chart-2 to-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${62 + (index % 4) * 9}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.45,
                              delay: 0.08 + index * 0.02,
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
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
                    {copy("Security", "Bảo mật")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Enterprise-ready by default",
                    "Sẵn sàng cho doanh nghiệp ngay từ đầu",
                  )}
                </CardTitle>
                <CardDescription>
                  {copy(
                    "Built-in governance controls for creator, partner, and campaign data across global teams.",
                    "Tích hợp sẵn các cơ chế quản trị cho dữ liệu creator, đối tác và chiến dịch trên các đội ngũ toàn cầu.",
                  )}
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
                <div className="grid gap-2 sm:grid-cols-3">
                  {securityPulse.map((pulse) => (
                    <div
                      key={pulse.label}
                      className="rounded-lg border border-border/65 bg-background/75 px-2.5 py-2"
                    >
                      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {pulse.label}
                      </p>
                      <p className="mt-1 font-heading text-lg leading-none font-semibold text-foreground">
                        {pulse.value}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-muted/60">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-chart-2 via-chart-1 to-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pulse.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {SECURITY_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  const translated = translateSecurityFeature(
                    feature.title,
                    feature.description,
                  );
                  return (
                    <div
                      key={feature.title}
                      className="rounded-lg border border-border/65 bg-background/72 px-3 py-3"
                    >
                      <div className="flex items-center gap-2 text-foreground">
                        <Icon className="size-4 text-primary" />
                        <p className="text-sm font-semibold">
                          {translated.title}
                        </p>
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {translated.description}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                        <CircleCheckBig className="size-3.5" />
                        {copy("Compliance active", "Tuân thủ đang hoạt động")}
                      </p>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 rounded-lg border border-border/65 bg-background/72 px-3 py-2.5 text-xs text-muted-foreground">
                  <BarChart3 className="size-3.5 text-primary" />
                  {copy(
                    "Security telemetry updates every 15 seconds",
                    "Dữ liệu bảo mật được cập nhật mỗi 15 giây",
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
