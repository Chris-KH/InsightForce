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
import { useBilingual } from "@/hooks/use-bilingual";

function formatMetric(value: number, prefix?: string, suffix?: string) {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

export function ExecutiveProjectionsSection() {
  const copy = useBilingual();

  const translatePerformanceLabel = (label: string) => {
    if (label === "Audience events processed today") {
      return copy(
        "Audience events processed today",
        "Sự kiện khách hàng đã xử lý hôm nay",
      );
    }

    if (label === "Campaign uptime this quarter") {
      return copy(
        "Campaign uptime this quarter",
        "Thời gian hoạt động chiến dịch quý này",
      );
    }

    if (label === "Average agent response") {
      return copy("Average agent response", "Phản hồi bot trung bình");
    }

    if (label === "Countries activated") {
      return copy("Countries activated", "Số quốc gia đã kích hoạt");
    }

    return label;
  };

  const translateIntegrationCategory = (category: string) => {
    if (category === "Creator Channel") {
      return copy("Creator Channel", "Kênh creator");
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
          "Kiểm soát truy cập chi tiết theo chiến dịch, đội ngũ và cộng tác viên bên ngoài.",
        ),
      };
    }

    return {
      title,
      description,
    };
  };

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
            {copy("Scale Visibility", "Quan sát tăng trưởng")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            {copy(
              "Performance, integrations, and compliance from one control plane",
              "Hiệu năng, tích hợp và tuân thủ trong một mặt phẳng điều khiển",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Track real-time throughput, activate your existing toolchain, and protect every workflow with enterprise security defaults.",
              "Theo dõi thông lượng theo thời gian thực, kích hoạt toolchain hiện có và bảo vệ mọi quy trình với chuẩn bảo mật doanh nghiệp mặc định.",
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
                  <p className="font-heading text-[1.8rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.1rem]">
                    {formatMetric(metric.value, metric.prefix, metric.suffix)}
                  </p>
                  <p className="mt-2 text-[11px] tracking-widest text-muted-foreground uppercase">
                    {translatePerformanceLabel(metric.label)}
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
                    {copy("Integrations", "Tích hợp")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Connect your stack in minutes",
                    "Kết nối stack trong vài phút",
                  )}
                </CardTitle>
                <CardDescription>
                  {copy(
                    "Activate cross-platform workflows with prebuilt connectors for channels, CRM, payments, and collaboration.",
                    "Kích hoạt quy trình đa nền tảng bằng connector dựng sẵn cho kênh, CRM, thanh toán và cộng tác.",
                  )}
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
                        {translateIntegrationCategory(integration.category)}
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
                    {copy("Security", "Bảo mật")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Enterprise-ready by default",
                    "Sẵn sàng cho doanh nghiệp theo mặc định",
                  )}
                </CardTitle>
                <CardDescription>
                  {copy(
                    "Built-in governance controls for creator, partner, and campaign data across global teams.",
                    "Tích hợp kiểm soát quản trị cho dữ liệu creator, đối tác và chiến dịch trên các đội ngũ toàn cầu.",
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
