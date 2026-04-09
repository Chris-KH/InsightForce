import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AGENT_MODULES, WORKFLOW_STEPS } from "../data";
import { AsciiTetrahedronCanvas } from "./AsciiTetrahedronCanvas";
import { AsciiWaveCanvas } from "./AsciiWaveCanvas";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";
import { CircleCheckBig, Sparkles, TrendingUp, UsersRound } from "lucide-react";

type StepVisualData = {
  score: number;
  bars: number[];
  outcomes: string[];
};

const STEP_VISUALS: Record<string, StepVisualData> = {
  "Connect creator data": {
    score: 96,
    bars: [62, 74, 82, 88, 92, 96],
    outcomes: [
      "12 channels connected",
      "31 audience segments synced",
      "0 data-loss alerts",
    ],
  },
  "Design agent workflow": {
    score: 91,
    bars: [58, 69, 78, 85, 90, 91],
    outcomes: [
      "17 brief variants approved",
      "96% brand-tone match",
      "4 launch templates ready",
    ],
  },
  "Ship globally": {
    score: 94,
    bars: [55, 66, 73, 86, 91, 94],
    outcomes: [
      "14 markets activated",
      "2.4h to publish globally",
      "Live KPI dashboard enabled",
    ],
  },
};

const MODULE_TRENDS: Record<string, number[]> = {
  "Psychological Guardian": [54, 63, 72, 79, 86, 92],
  "Content Architect": [48, 58, 67, 74, 82, 88],
  "Scout & Executor": [52, 61, 75, 83, 90, 95],
};

export function AgentSquadSection() {
  const copy = useBilingual();

  const translateStepTitle = (title: string) => {
    if (title === "Connect creator data") {
      return copy("Connect creator data", "Kết nối dữ liệu creator");
    }

    if (title === "Design agent workflow") {
      return copy("Design agent workflow", "Thiết kế quy trình agent");
    }

    if (title === "Ship globally") {
      return copy("Ship globally", "Triển khai trên toàn cầu");
    }

    return title;
  };

  const translateStepDescription = (description: string) => {
    if (
      description ===
      "Sync channels, CRM, ad platforms, and creator analytics in minutes with no custom pipeline setup."
    ) {
      return copy(
        "Sync channels, CRM, ad platforms, and creator analytics in minutes with no custom pipeline setup.",
        "Đồng bộ kênh, CRM, nền tảng quảng cáo và dữ liệu phân tích creator chỉ trong vài phút mà không cần thiết lập pipeline tùy chỉnh.",
      );
    }

    if (
      description ===
      "Compose Guardian, Architect, and Scout playbooks with measurable checkpoints and approvals."
    ) {
      return copy(
        "Compose Guardian, Architect, and Scout playbooks with measurable checkpoints and approvals.",
        "Xây dựng playbook cho Guardian, Architect và Scout với các mốc kiểm tra có thể đo lường cùng quy trình phê duyệt.",
      );
    }

    if (
      description ===
      "Launch campaign assets, creator outreach, and reporting dashboards across markets with one command."
    ) {
      return copy(
        "Launch campaign assets, creator outreach, and reporting dashboards across markets with one command.",
        "Triển khai tài nguyên chiến dịch, hoạt động tiếp cận creator và dashboard báo cáo trên nhiều thị trường chỉ với một lệnh.",
      );
    }

    return description;
  };

  const translateModuleTitle = (title: string) => {
    if (title === "Psychological Guardian") {
      return copy("Psychological Guardian", "Guardian tâm lý");
    }

    if (title === "Content Architect") {
      return copy("Content Architect", "Kiến trúc nội dung");
    }

    if (title === "Scout & Executor") {
      return copy("Scout & Executor", "Scout & triển khai");
    }

    return title;
  };

  const translateModuleDetail = (detail: string) => {
    if (
      detail ===
      "Monitors audience sentiment shifts and flags messages that may weaken trust."
    ) {
      return copy(
        "Monitors audience sentiment shifts and flags messages that may weaken trust.",
        "Theo dõi thay đổi cảm xúc của khách hàng và gắn cờ những thông điệp có thể làm suy yếu niềm tin.",
      );
    }

    if (
      detail ===
      "Builds narrative systems that convert short-form attention into long-term community."
    ) {
      return copy(
        "Builds narrative systems that convert short-form attention into long-term community.",
        "Xây dựng hệ thống câu chuyện biến sự chú ý ngắn hạn thành cộng đồng lâu dài.",
      );
    }

    if (
      detail ===
      "Scans market momentum and deploys campaign actions at optimal launch windows."
    ) {
      return copy(
        "Scans market momentum and deploys campaign actions at optimal launch windows.",
        "Quét động lực thị trường và triển khai hành động chiến dịch vào thời điểm ra mắt tối ưu.",
      );
    }

    return detail;
  };

  const translateModuleMetric = (metric: string) => {
    if (metric === "92% alignment confidence") {
      return copy("92% alignment confidence", "92% độ tin cậy đồng bộ");
    }

    if (metric === "88% viral pattern match") {
      return copy(
        "88% viral pattern match",
        "88% mức độ khớp xu hướng lan truyền",
      );
    }

    if (metric === "95% timing precision") {
      return copy("95% timing precision", "95% độ chính xác về thời điểm");
    }

    return metric;
  };

  const translateStepOutcome = (outcome: string) => {
    if (outcome === "12 channels connected") {
      return copy("12 channels connected", "Đã kết nối 12 kênh");
    }

    if (outcome === "31 audience segments synced") {
      return copy(
        "31 audience segments synced",
        "Đồng bộ 31 phân khúc khách hàng",
      );
    }

    if (outcome === "0 data-loss alerts") {
      return copy("0 data-loss alerts", "0 cảnh báo mất dữ liệu");
    }

    if (outcome === "17 brief variants approved") {
      return copy("17 brief variants approved", "17 phiên bản brief đã duyệt");
    }

    if (outcome === "96% brand-tone match") {
      return copy("96% brand-tone match", "96% khớp tông thương hiệu");
    }

    if (outcome === "4 launch templates ready") {
      return copy("4 launch templates ready", "4 mẫu ra mắt sẵn sàng");
    }

    if (outcome === "14 markets activated") {
      return copy("14 markets activated", "14 thị trường đã kích hoạt");
    }

    if (outcome === "2.4h to publish globally") {
      return copy("2.4h to publish globally", "2,4 giờ để xuất bản toàn cầu");
    }

    if (outcome === "Live KPI dashboard enabled") {
      return copy(
        "Live KPI dashboard enabled",
        "Đã bật dashboard KPI thời gian thực",
      );
    }

    return outcome;
  };

  const workflowHighlights = [
    {
      icon: UsersRound,
      value: "72",
      label: copy("Creators onboarded", "Creator onboard"),
      detail: copy("This week", "Tuần này"),
    },
    {
      icon: TrendingUp,
      value: "91%",
      label: copy("On-time publishing", "Xuất bản đúng tiến độ"),
      detail: copy("Across active campaigns", "Trên các chiến dịch đang chạy"),
    },
    {
      icon: Sparkles,
      value: "4.8/5",
      label: copy("Creative quality", "Chất lượng sáng tạo"),
      detail: copy(
        "Average creator rating",
        "Điểm đánh giá creator trung bình",
      ),
    },
  ];

  return (
    <section
      id="workflow"
      className="relative isolate overflow-hidden bg-muted/28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute -bottom-2 -z-10 h-64 w-full overflow-hidden opacity-30">
        <AsciiWaveCanvas />
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-160"
          cellSize={104}
          strength="soft"
          fade="top-to-bottom"
        />

        <motion.div
          className="absolute top-0 right-16 hidden size-96 xl:block"
          animate={{
            opacity: [0.36, 0.64, 0.36],
            y: [0, -8, 0],
            rotate: [0, 6, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <AsciiTetrahedronCanvas />
        </motion.div>

        <motion.div
          className="absolute -bottom-6 -left-8 hidden size-80 lg:block"
          animate={{ opacity: [0.12, 0.3, 0.12], x: [0, 10, 0] }}
          transition={{ duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <AsciiWaveCanvas />
        </motion.div>

        <motion.div
          className="absolute -top-10 left-[16%] size-44 rounded-full bg-primary/10 blur-[95px]"
          animate={{ opacity: [0.16, 0.38, 0.16], scale: [1, 1.09, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            {copy("Creator Workflow Board", "Bảng điều phối workflow creator")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            {copy(
              "From idea to launch, every campaign step is visual and easy to control",
              "Từ ý tưởng đến ra mắt, mọi bước chiến dịch đều trực quan và dễ kiểm soát",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "No technical scripts needed. Connect channels, assign responsibilities, and monitor campaign readiness with one visual board built for KOL and creator teams.",
              "Không cần script kỹ thuật. Kết nối kênh, phân công nhiệm vụ và theo dõi độ sẵn sàng chiến dịch trên một bảng trực quan dành cho đội ngũ KOL và creator.",
            )}
          </p>
        </motion.div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {workflowHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full border-border/65 bg-card/70">
                  <CardContent className="flex items-start gap-3 px-4 py-4">
                    <div className="rounded-lg border border-border/70 bg-background/75 p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-heading text-2xl leading-none font-semibold tracking-tight">
                        {highlight.value}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {highlight.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {highlight.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <Card className="border-border/65 bg-card/72 shadow-sm">
                  <CardHeader className="gap-3 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                        {step.number}
                      </span>
                      <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                        {translateStepTitle(step.title)}
                      </h3>
                    </div>
                    <CardDescription className="text-sm leading-6">
                      {translateStepDescription(step.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-1">
                    {(() => {
                      const stepVisual = STEP_VISUALS[step.title];
                      const score = stepVisual?.score ?? 85;
                      const bars = stepVisual?.bars ?? [52, 61, 69, 75, 82, 85];
                      const outcomes = stepVisual?.outcomes ?? [];

                      return (
                        <>
                          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>{copy("Readiness", "Mức sẵn sàng")}</span>
                            <span className="text-primary">{score}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/60">
                            <motion.div
                              className="h-full rounded-full bg-linear-to-r from-chart-1 via-chart-2 to-primary"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${score}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.7,
                                delay: 0.08 + index * 0.06,
                              }}
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-6 gap-1.5">
                            {bars.map((height, barIndex) => (
                              <div
                                key={`${step.title}-${height}-${barIndex}`}
                                className="relative h-10 overflow-hidden rounded-sm bg-muted/55"
                              >
                                <motion.span
                                  className={cn(
                                    "absolute inset-x-0 bottom-0 rounded-sm",
                                    barIndex % 3 === 0 && "bg-chart-1/80",
                                    barIndex % 3 === 1 && "bg-chart-2/80",
                                    barIndex % 3 === 2 && "bg-primary/80",
                                  )}
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${height}%` }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.45,
                                    delay:
                                      0.12 + index * 0.05 + barIndex * 0.03,
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {outcomes.map((outcome) => (
                              <span
                                key={`${step.title}-${outcome}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium"
                              >
                                <CircleCheckBig className="size-3 text-primary" />
                                {translateStepOutcome(outcome)}
                              </span>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {AGENT_MODULES.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: 0.16 + index * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <Card className="border-border/65 bg-card/72 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-border/70 bg-background/80 p-2 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold tracking-tight">
                          {translateModuleTitle(module.title)}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const confidence = Number.parseInt(module.metric, 10);
                        const normalizedConfidence = Number.isNaN(confidence)
                          ? 78
                          : confidence;
                        const trendBars = MODULE_TRENDS[module.title] ?? [
                          50, 58, 63, 70, 76, 82,
                        ];

                        return (
                          <>
                            <div className="flex items-center justify-between gap-4">
                              <div className="relative grid size-16 place-items-center rounded-full bg-muted/70">
                                <div
                                  className="absolute inset-0 rounded-full"
                                  style={{
                                    background: `conic-gradient(hsl(var(--primary)) ${normalizedConfidence * 3.6}deg, hsl(var(--muted)) 0deg)`,
                                  }}
                                />
                                <div className="absolute inset-1.5 rounded-full bg-card/95" />
                                <span className="relative text-[11px] font-semibold text-foreground">
                                  {normalizedConfidence}%
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="grid grid-cols-6 gap-1.5">
                                  {trendBars.map((value, trendIndex) => (
                                    <span
                                      key={`${module.title}-${value}-${trendIndex}`}
                                      className="block h-8 rounded-sm bg-primary/18"
                                      style={{
                                        height: `${Math.max(22, value * 0.4)}px`,
                                        backgroundColor:
                                          trendIndex % 2 === 0
                                            ? "hsl(var(--chart-1) / 0.62)"
                                            : "hsl(var(--chart-2) / 0.62)",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                              {translateModuleDetail(module.detail)}
                            </p>
                            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                              <CircleCheckBig className="size-3.5" />
                              {translateModuleMetric(module.metric)}
                            </p>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
