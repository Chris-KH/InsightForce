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
import { CircleCheckBig, PlugZap, Shield, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";
import { useIsInView } from "@/hooks/use-is-in-view";
import React, { lazy, Suspense, useRef, useState } from "react";

function formatMetric(value: number, prefix?: string, suffix?: string) {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

const METRIC_DELTA = [18, 6, 23, 14];

type IntegrationVisual = {
  icon: string;
  color: string;
  fallback: string;
};

const INTEGRATION_VISUALS: Record<string, IntegrationVisual> = {
  YouTube: {
    icon: "simple-icons:youtube",
    color: "#FF0000",
    fallback: "YT",
  },
  TikTok: {
    icon: "simple-icons:tiktok",
    color: "#111111",
    fallback: "TT",
  },
  Instagram: {
    icon: "simple-icons:instagram",
    color: "#E4405F",
    fallback: "IG",
  },
  Facebook: {
    icon: "simple-icons:facebook",
    color: "#1877F2",
    fallback: "FB",
  },
  Notion: {
    icon: "simple-icons:notion",
    color: "#111111",
    fallback: "NO",
  },
  Figma: {
    icon: "simple-icons:figma",
    color: "#F24E1E",
    fallback: "FG",
  },

  Slack: {
    icon: "simple-icons:slack",
    color: "#4A154B",
    fallback: "SL",
  },
  OpenAI: {
    icon: "simple-icons:openai",
    color: "#10A37F",
    fallback: "AI",
  },
};

const LazyIntegrationPlanetScene = lazy(() =>
  import("./IntegrationPlanetScene").then((module) => ({
    default: module.IntegrationPlanetScene,
  })),
);

type SceneErrorBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
  resetKey?: number;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends React.Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  constructor(props: SceneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Integration scene failed to render", error);
  }

  componentDidUpdate(prevProps: SceneErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

type PlanetSceneFallbackProps = {
  title?: string;
  onRetry?: () => void;
};

function PlanetSceneFallback({
  title = "Loading 3D scene...",
  onRetry,
}: PlanetSceneFallbackProps) {
  return (
    <div className="relative mx-auto h-128 w-full max-w-200 overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(circle_at_50%_36%,#1f3a8a_0%,#0b1c44_42%,#030712_100%)] shadow-[0_44px_150px_-62px_hsl(var(--primary)/0.95)]">
      <motion.div
        className="absolute inset-[16%] rounded-full border border-primary/35"
        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[6%] rounded-full border border-dashed border-border/45"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-42 w-42 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-indigo-400 via-sky-400 to-cyan-300 shadow-[0_30px_100px_-30px_hsl(var(--primary)/0.95)]"
        animate={{ scale: [1, 1.05, 1], y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-primary/35 bg-background/72 px-3 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
        <span>{title}</span>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-primary/35 bg-primary/12 px-2 py-0.5 text-[10px] leading-none"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ExecutiveProjectionsSection() {
  const copy = useBilingual();
  const [orbitSceneRevision, setOrbitSceneRevision] = useState(0);

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

  const translateMetricHint = (hint: string) => {
    if (hint === "Live creator telemetry") {
      return copy(
        "Live creator telemetry",
        "Telemetry creator theo thời gian thực",
      );
    }

    if (hint === "Campaign reliability") {
      return copy("Campaign reliability", "Độ ổn định chiến dịch");
    }

    if (hint === "Response performance") {
      return copy("Response performance", "Hiệu năng phản hồi");
    }

    if (hint === "Global availability") {
      return copy("Global availability", "Khả năng sẵn sàng toàn cầu");
    }

    return hint;
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

  const metricHints = [
    "Live creator telemetry",
    "Campaign reliability",
    "Response performance",
    "Global availability",
  ];

  const orbitNodes = INTEGRATIONS.map((integration) => {
    const visual = INTEGRATION_VISUALS[integration.name] ?? {
      icon: "mdi:hexagon-multiple-outline",
      color: "#334155",
      fallback: integration.name.slice(0, 2).toUpperCase(),
    };

    return {
      ...integration,
      visual,
    };
  });

  const orbitSceneNodes = orbitNodes.map((node) => ({
    name: node.name,
    category: translateIntegrationCategory(node.category),
    icon: node.visual.icon,
    color: node.visual.color,
    fallback: node.visual.fallback,
  }));

  const orbitInViewRef = useRef<HTMLDivElement>(null);
  const { ref: orbitViewportRef, isInView: shouldLoadOrbitScene } =
    useIsInView<HTMLDivElement>(orbitInViewRef, {
      inView: true,
      inViewOnce: true,
      inViewMargin: "0px 0px -18% 0px",
    });

  const securityPulse = [
    {
      label: copy("Threats blocked", "Mối đe dọa đã chặn"),
      value: "2.8M",
      note: copy("Monitored continuously", "Giám sát liên tục"),
    },
    {
      label: copy("Safe workflow runs", "Workflow an toàn"),
      value: "99.7%",
      note: copy("No critical incidents", "Không có sự cố nghiêm trọng"),
    },
    {
      label: copy("Audit trace coverage", "Độ phủ log kiểm toán"),
      value: "100%",
      note: copy("Ready for review", "Sẵn sàng cho kiểm toán"),
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

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Sparkles className="size-3 text-primary" />
                    {translateMetricHint(
                      metricHints[index] ?? "Live creator telemetry",
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <Card className="h-full border-primary/25 bg-card/76 shadow-[0_38px_120px_-56px_hsl(var(--primary)/0.85)]">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <PlugZap className="size-4" />
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                    {copy("Integrations", "Tích hợp")}
                  </p>
                </div>
                <CardTitle className="font-heading text-2xl">
                  {copy(
                    "Orbit-ready creator integrations",
                    "Hệ tích hợp creator theo mô hình quỹ đạo",
                  )}
                </CardTitle>
                <CardDescription>
                  {copy(
                    "Your channels and tools revolve around one campaign core so teams can see the whole ecosystem instantly.",
                    "Các kênh và công cụ của bạn quay quanh một lõi chiến dịch duy nhất để đội ngũ nhìn thấy toàn bộ hệ sinh thái ngay lập tức.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div ref={orbitViewportRef}>
                  {shouldLoadOrbitScene ? (
                    <SceneErrorBoundary
                      resetKey={orbitSceneRevision}
                      fallback={
                        <PlanetSceneFallback
                          title={copy("3D scene paused", "Cảnh 3D tạm dừng")}
                          onRetry={() =>
                            setOrbitSceneRevision((value) => value + 1)
                          }
                        />
                      }
                    >
                      <Suspense
                        fallback={
                          <PlanetSceneFallback
                            title={copy(
                              "Loading 3D scene...",
                              "Đang tải cảnh 3D...",
                            )}
                          />
                        }
                      >
                        <LazyIntegrationPlanetScene
                          key={orbitSceneRevision}
                          nodes={orbitSceneNodes}
                          coreTagline={copy("Campaign Core", "Lõi chiến dịch")}
                          coreName="KOL AI"
                        />
                      </Suspense>
                    </SceneErrorBoundary>
                  ) : (
                    <PlanetSceneFallback
                      title={copy("Loading 3D scene...", "Đang tải cảnh 3D...")}
                    />
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                  <span className="rounded-full border border-border/65 bg-background/82 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {copy("12 platforms synced", "12 nền tảng đồng bộ")}
                  </span>
                  <span className="rounded-full border border-border/65 bg-background/82 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {copy("Dual orbit mode", "Mô hình quỹ đạo kép")}
                  </span>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
                    {copy("3D sync visual", "Trực quan đồng bộ 3D")}
                  </span>
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
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {pulse.note}
                      </p>
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
