import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { AGENT_MODULES, WORKFLOW_STEPS } from "../data";
import { AsciiTetrahedronCanvas } from "./AsciiTetrahedronCanvas";
import { AsciiWaveCanvas } from "./AsciiWaveCanvas";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

export function AgentSquadSection() {
  const copy = useBilingual();

  const translateStepTitle = (title: string) => {
    if (title === "Connect creator data") {
      return copy("Connect creator data", "Kết nối dữ liệu creator");
    }

    if (title === "Design agent workflow") {
      return copy("Design agent workflow", "Thiết kế quy trình bot");
    }

    if (title === "Ship globally") {
      return copy("Ship globally", "Triển khai toàn cầu");
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
        "Đồng bộ kênh, CRM, nền tảng quảng cáo và phân tích creator chỉ trong vài phút mà không cần dựng pipeline tùy chỉnh.",
      );
    }

    if (
      description ===
      "Compose Guardian, Architect, and Scout playbooks with measurable checkpoints and approvals."
    ) {
      return copy(
        "Compose Guardian, Architect, and Scout playbooks with measurable checkpoints and approvals.",
        "Xây dựng playbook cho Guardian, Architect và Scout với các checkpoint đo lường rõ ràng cùng quy trình phê duyệt.",
      );
    }

    if (
      description ===
      "Launch campaign assets, creator outreach, and reporting dashboards across markets with one command."
    ) {
      return copy(
        "Launch campaign assets, creator outreach, and reporting dashboards across markets with one command.",
        "Ra mắt tài nguyên chiến dịch, hoạt động kết nối creator và dashboard báo cáo xuyên thị trường chỉ với một lệnh.",
      );
    }

    return description;
  };

  const translateModuleTitle = (title: string) => {
    if (title === "Psychological Guardian") {
      return copy("Psychological Guardian", "Guardian tâm lý");
    }

    if (title === "Content Architect") {
      return copy("Content Architect", "Thiết kế phân luồng nội dung");
    }

    if (title === "Scout & Executor") {
      return copy("Scout & Executor", "Scout & thực thi");
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
        "Theo dõi dịch chuyển cảm xúc khách hàng và gắn cờ những thông điệp có thể làm ảnh hưởng uy tín.",
      );
    }

    if (
      detail ===
      "Builds narrative systems that convert short-form attention into long-term community."
    ) {
      return copy(
        "Builds narrative systems that convert short-form attention into long-term community.",
        "Xây dựng hệ thống tường thuật chuyển sự chú ý ngắn hạn thành cộng đồng dài hạn.",
      );
    }

    if (
      detail ===
      "Scans market momentum and deploys campaign actions at optimal launch windows."
    ) {
      return copy(
        "Scans market momentum and deploys campaign actions at optimal launch windows.",
        "Quét động lượng thị trường và triển khai hành động chiến dịch ở khung thời gian ra mắt tối ưu.",
      );
    }

    return detail;
  };

  const translateModuleMetric = (metric: string) => {
    if (metric === "92% alignment confidence") {
      return copy("92% alignment confidence", "92% độ tin cậy đồng bộ");
    }

    if (metric === "88% viral pattern match") {
      return copy("88% viral pattern match", "88% độ khớp mẫu lan truyền");
    }

    if (metric === "95% timing precision") {
      return copy("95% timing precision", "95% độ chính xác thời điểm");
    }

    return metric;
  };

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
            {copy("Workflow Engine", "Bộ máy quy trình")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            {copy(
              "Build, validate, and ship campaigns with specialized AI agents",
              "Xây dựng, kiểm định và triển khai chiến dịch với bot AI chuyên biệt",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Connect your data, assign agent responsibilities, and launch globally from a single playbook that keeps strategy, execution, and quality in sync.",
              "Kết nối dữ liệu, phân công trách nhiệm cho bot và ra mắt toàn cầu từ một playbook duy nhất giúp chiến lược, thực thi và chất lượng luôn đồng bộ.",
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <Card className="border-border/65 bg-card/70 shadow-sm">
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
                  <CardContent>
                    <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/78 p-4 text-[12px] leading-6 text-muted-foreground">
                      <code>{step.code}</code>
                    </pre>
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
                      <p className="text-sm leading-6 text-muted-foreground">
                        {translateModuleDetail(module.detail)}
                      </p>
                      <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                        {translateModuleMetric(module.metric)}
                      </p>
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
