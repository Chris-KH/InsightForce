import { Badge } from "@/components/ui/badge";
import { CAPABILITY_ITEMS, TRUSTED_COMPANIES } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

type CapabilityVisual = {
  score: number;
  trend: number[];
  kpi: string;
  velocity: string;
};

type CapabilityTheme = {
  surface: string;
  chip: string;
  glow: string;
  ring: string;
  sparkFrom: string;
  sparkTo: string;
};

const CAPABILITY_VISUALS: Record<string, CapabilityVisual> = {
  "Audience Signal Graph": {
    score: 93,
    trend: [48, 58, 66, 75, 84, 93],
    kpi: "Opportunity windows surfaced",
    velocity: "Signal velocity +19%",
  },
  "Narrative Blueprinting": {
    score: 89,
    trend: [44, 56, 64, 73, 81, 89],
    kpi: "Average hook lift",
    velocity: "Hook resonance +14%",
  },
  "KOL Match Intelligence": {
    score: 95,
    trend: [52, 61, 70, 79, 88, 95],
    kpi: "Creator fit precision",
    velocity: "Match quality +22%",
  },
  "Brand Safety Guardian": {
    score: 97,
    trend: [58, 66, 74, 82, 90, 97],
    kpi: "Tone-risk incidents prevented",
    velocity: "Risk suppression +27%",
  },
};

const CAPABILITY_LAYOUTS = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-8",
] as const;

const CAPABILITY_THEMES: CapabilityTheme[] = [
  {
    surface:
      "bg-linear-to-br from-sky-500/20 via-cyan-500/10 to-transparent dark:from-sky-400/24 dark:via-cyan-400/10",
    chip: "border-sky-400/35 bg-sky-500/10 text-sky-700 dark:text-sky-200",
    glow: "bg-sky-400/30",
    ring: "#0ea5e9",
    sparkFrom: "#38bdf8",
    sparkTo: "#22d3ee",
  },
  {
    surface:
      "bg-linear-to-br from-indigo-500/20 via-violet-500/12 to-transparent dark:from-indigo-400/22 dark:via-violet-400/10",
    chip: "border-indigo-400/35 bg-indigo-500/10 text-indigo-700 dark:text-indigo-200",
    glow: "bg-indigo-400/28",
    ring: "#6366f1",
    sparkFrom: "#818cf8",
    sparkTo: "#a78bfa",
  },
  {
    surface:
      "bg-linear-to-br from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-400/24 dark:via-teal-400/10",
    chip: "border-emerald-400/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    glow: "bg-emerald-400/28",
    ring: "#10b981",
    sparkFrom: "#34d399",
    sparkTo: "#2dd4bf",
  },
  {
    surface:
      "bg-linear-to-br from-rose-500/20 via-orange-500/11 to-transparent dark:from-rose-400/24 dark:via-orange-400/11",
    chip: "border-rose-400/35 bg-rose-500/10 text-rose-700 dark:text-rose-200",
    glow: "bg-rose-400/28",
    ring: "#f43f5e",
    sparkFrom: "#fb7185",
    sparkTo: "#fb923c",
  },
];

function sparkPoints(trend: number[]) {
  return trend
    .map((value, index) => `${index * 24},${46 - Math.round(value * 0.31)}`)
    .join(" ");
}

export function CreatorMomentumSection() {
  const copy = useBilingual();

  const creatorSignals = [
    {
      name: copy("KOL Discovery", "Khám phá KOL"),
      value: "1.9K",
      detail: copy("Profiles scored weekly", "Hồ sơ được chấm điểm mỗi tuần"),
      tag: copy("Live scoring", "Chấm điểm trực tiếp"),
      color: "bg-sky-400",
    },
    {
      name: copy("Content Studio", "Studio nội dung"),
      value: "340",
      detail: copy("Briefs generated per month", "Brief tạo mới mỗi tháng"),
      tag: copy("Adaptive briefs", "Brief thích ứng"),
      color: "bg-indigo-400",
    },
    {
      name: copy("Campaign Ops", "Vận hành chiến dịch"),
      value: "96%",
      detail: copy(
        "On-time creator deliverables",
        "Nội dung creator giao đúng hạn",
      ),
      tag: copy("Global launch SLA", "SLA ra mắt toàn cầu"),
      color: "bg-emerald-400",
    },
  ];

  const commandBullets = [
    copy("Audience demand maps in one board", "Bản đồ nhu cầu trên một bảng"),
    copy("Creative sequencing across channels", "Chuỗi sáng tạo đa kênh"),
    copy(
      "Creator matching with conversion score",
      "Ghép creator theo điểm chuyển đổi",
    ),
  ];

  const translateCapabilityTitle = (title: string) => {
    if (title === "Audience Signal Graph") {
      return copy(
        "Audience Signal Graph",
        "Biểu đồ tín hiệu khách hàng mục tiêu",
      );
    }

    if (title === "Narrative Blueprinting") {
      return copy("Narrative Blueprinting", "Xây dựng khung câu chuyện");
    }

    if (title === "KOL Match Intelligence") {
      return copy("KOL Match Intelligence", "Ghép KOL thông minh");
    }

    if (title === "Brand Safety Guardian") {
      return copy("Brand Safety Guardian", "Giám sát an toàn thương hiệu");
    }

    return title;
  };

  const translateCapabilityDescription = (description: string) => {
    if (
      description ===
      "Cluster creator comments, search intent, and purchase language into clear opportunity maps before you publish."
    ) {
      return copy(
        "Cluster creator comments, search intent, and purchase language into clear opportunity maps before you publish.",
        "Phân nhóm bình luận, ý định tìm kiếm và ngôn ngữ mua hàng thành bản đồ cơ hội rõ ràng trước khi xuất bản.",
      );
    }

    if (
      description ===
      "Generate platform-specific content arcs with hook variants, emotional cues, and CTA sequencing tuned for each audience segment."
    ) {
      return copy(
        "Generate platform-specific content arcs with hook variants, emotional cues, and CTA sequencing tuned for each audience segment.",
        "Tạo mạch nội dung riêng cho từng nền tảng với các biến thể hook, tín hiệu cảm xúc và chuỗi CTA được tinh chỉnh cho từng phân khúc khách hàng.",
      );
    }

    if (
      description ===
      "Prioritize partner creators using trust overlap, category authority, and conversion-fit scoring across regions."
    ) {
      return copy(
        "Prioritize partner creators using trust overlap, category authority, and conversion-fit scoring across regions.",
        "Ưu tiên creator đối tác dựa trên mức độ tin cậy tương đồng, uy tín theo ngành hàng và điểm phù hợp chuyển đổi ở từng khu vực.",
      );
    }

    if (
      description ===
      "Detect tonal drift and cultural risk in real time, with guardrails that keep every campaign aligned with brand values."
    ) {
      return copy(
        "Detect tonal drift and cultural risk in real time, with guardrails that keep every campaign aligned with brand values.",
        "Phát hiện lệch tông và rủi ro văn hóa theo thời gian thực, với các rào chắn bảo vệ giúp mọi chiến dịch luôn bám sát giá trị thương hiệu.",
      );
    }

    return description;
  };

  const translateCapabilityKpi = (kpi: string) => {
    if (kpi === "Opportunity windows surfaced") {
      return copy(
        "Opportunity windows surfaced",
        "Cơ hội tăng trưởng được phát hiện",
      );
    }

    if (kpi === "Average hook lift") {
      return copy("Average hook lift", "Mức tăng hiệu quả hook trung bình");
    }

    if (kpi === "Creator fit precision") {
      return copy("Creator fit precision", "Độ chính xác ghép creator");
    }

    if (kpi === "Tone-risk incidents prevented") {
      return copy(
        "Tone-risk incidents prevented",
        "Sự cố lệch tông đã được ngăn chặn",
      );
    }

    return kpi;
  };

  const translateVelocity = (velocity: string) => {
    if (velocity === "Signal velocity +19%") {
      return copy("Signal velocity +19%", "Tốc độ tín hiệu +19%");
    }

    if (velocity === "Hook resonance +14%") {
      return copy("Hook resonance +14%", "Độ cộng hưởng hook +14%");
    }

    if (velocity === "Match quality +22%") {
      return copy("Match quality +22%", "Chất lượng ghép +22%");
    }

    if (velocity === "Risk suppression +27%") {
      return copy("Risk suppression +27%", "Khả năng giảm rủi ro +27%");
    }

    return velocity;
  };

  return (
    <section
      id="capabilities"
      className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-[74%]"
          cellSize={112}
          strength="soft"
          fade="diagonal"
        />

        <CometTrails
          className="absolute inset-0 opacity-90"
          density="medium"
          direction="diagonal"
          tone="mixed"
        />

        <FloatingShards
          className="absolute inset-0"
          density="high"
          tone="mixed"
        />

        <OrbitRings
          className="absolute top-2 right-[8%] hidden h-72 w-72 lg:block"
          tone="mixed"
          spin="slow"
        />

        <motion.div
          className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-primary/12 blur-[110px]"
          animate={{ opacity: [0.24, 0.42, 0.24], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-chart-1/10 blur-[100px]"
          animate={{ opacity: [0.2, 0.34, 0.2], scale: [1, 1.12, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
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
            {copy("Core Capabilities", "Năng lực cốt lõi")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            {copy(
              "The command layer behind high-converting creator campaigns",
              "Hệ điều phối phía sau các chiến dịch creator chuyển đổi cao",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Replace disconnected tools with one intelligence stack that maps audience demand, designs narratives, matches KOL partners, and protects every message before launch.",
              "Thay thế các công cụ rời rạc bằng một stack trí tuệ thống nhất để lập bản đồ nhu cầu khách hàng, thiết kế câu chuyện, ghép KOL phù hợp và bảo vệ mọi thông điệp trước khi ra mắt.",
            )}
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-border/65 bg-card/65 p-5 shadow-sm backdrop-blur-sm lg:col-span-7 lg:p-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div className="pointer-events-none absolute -top-8 -right-6 h-34 w-34 rounded-full bg-chart-1/18 blur-[30px]" />
            <div className="pointer-events-none absolute -bottom-12 left-[12%] h-34 w-34 rounded-full bg-chart-2/18 blur-[34px]" />

            <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              {copy("Campaign Reactor", "Lõi phản ứng chiến dịch")}
            </p>
            <h3 className="mt-2 font-heading text-[1.7rem] leading-tight font-semibold tracking-tight sm:text-[2rem]">
              {copy(
                "Asymmetric insight board for creator teams",
                "Bảng insight bất đối xứng cho đội creator",
              )}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy(
                "A mixed visual system that keeps discovery, narrative, and execution signals visible without repeating the same UI pattern.",
                "Một hệ trực quan hỗn hợp giúp nhóm luôn thấy tín hiệu khám phá, narrative và thực thi mà không lặp lại cùng một mẫu giao diện.",
              )}
            </p>

            <div className="mt-4 space-y-2">
              {commandBullets.map((bullet, index) => (
                <motion.div
                  key={bullet}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs font-medium text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        index % 3 === 0
                          ? "#38bdf8"
                          : index % 3 === 1
                            ? "#818cf8"
                            : "#34d399",
                    }}
                  />
                  {bullet}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-border/65 bg-card/62 p-5 shadow-sm backdrop-blur-sm lg:col-span-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className="pointer-events-none absolute top-0 right-0 h-28 w-28 rounded-full bg-primary/16 blur-[30px]" />

            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {copy("Live Command Snapshot", "Ảnh chụp điều phối trực tiếp")}
            </p>

            <div className="mt-3 grid gap-2">
              {creatorSignals.map((signal, index) => (
                <motion.div
                  key={signal.name}
                  className="rounded-xl border border-border/70 bg-background/74 px-3.5 py-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
                        {signal.name}
                      </p>
                      <p className="mt-1 font-heading text-3xl leading-none font-semibold tracking-tight text-foreground">
                        {signal.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {signal.detail}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[10px] font-semibold text-foreground uppercase">
                      <span
                        className={`inline-block size-1.5 rounded-full ${signal.color}`}
                      />
                      {signal.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-5 lg:auto-rows-[minmax(210px,auto)] lg:grid-cols-12">
          {CAPABILITY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const visual = CAPABILITY_VISUALS[item.title] ?? {
              score: 86,
              trend: [52, 61, 67, 74, 79, 86],
              kpi: "Opportunity windows surfaced",
              velocity: "Signal velocity +19%",
            };
            const theme = CAPABILITY_THEMES[index % CAPABILITY_THEMES.length];
            const layout =
              CAPABILITY_LAYOUTS[index % CAPABILITY_LAYOUTS.length];
            const sparklineId = `spark-${item.number}`;

            return (
              <motion.article
                key={item.title}
                className={`${layout} relative overflow-hidden rounded-3xl border border-border/65 bg-card/66 shadow-sm backdrop-blur-sm`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`pointer-events-none absolute inset-0 ${theme.surface}`}
                />
                <div
                  className={`pointer-events-none absolute -top-12 -right-6 h-28 w-28 rounded-full blur-[36px] ${theme.glow}`}
                />

                <div className="relative flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                        {item.number}
                      </p>
                      <h3 className="mt-2 font-heading text-[1.9rem] leading-tight font-semibold tracking-tight">
                        {translateCapabilityTitle(item.title)}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/78 p-3 text-primary shadow-sm">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {translateCapabilityDescription(item.description)}
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
                          {copy("Confidence vector", "Vector độ tin cậy")}
                        </p>
                        <p className="mt-1 font-heading text-[1.85rem] leading-none font-semibold tracking-tight">
                          {visual.score}%
                        </p>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {translateVelocity(visual.velocity)}
                        </p>
                      </div>

                      <div
                        className="relative grid size-17 place-items-center rounded-full p-[3px]"
                        style={{
                          background: `conic-gradient(${theme.ring} ${visual.score * 3.6}deg, rgba(148,163,184,0.25) 0deg)`,
                        }}
                      >
                        <div className="grid size-full place-items-center rounded-full bg-background/88">
                          <span className="text-[10px] font-semibold text-foreground">
                            {visual.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-border/65 bg-background/64 px-2.5 py-2">
                      <svg viewBox="0 0 120 48" className="h-10 w-full">
                        <defs>
                          <linearGradient
                            id={sparklineId}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor={theme.sparkFrom} />
                            <stop offset="100%" stopColor={theme.sparkTo} />
                          </linearGradient>
                        </defs>
                        <polyline
                          fill="none"
                          stroke={`url(#${sparklineId})`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={sparkPoints(visual.trend)}
                        />
                      </svg>
                    </div>

                    <p
                      className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${theme.chip}`}
                    >
                      {translateCapabilityKpi(visual.kpi)}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-border/65 bg-card/55 backdrop-blur-sm lg:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="flex w-max items-center gap-8 px-5 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map(
              (company, index) => (
                <span
                  key={`${company}-${index}`}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  {company}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
