import { BrainCircuit, Gauge, ScanSearch, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReasoningTimelineProps = {
  isPending: boolean;
  elapsedMs: number;
  mode?: "trend" | "orchestrator";
  promptPreview?: string;
  copy?: (en: string, vi: string) => string;
};

type BilingualText = {
  en: string;
  vi: string;
};

type ReasoningStep = {
  id: string;
  title: BilingualText;
  detail: BilingualText;
  durationMs: number;
};

const TREND_STEPS: ReasoningStep[] = [
  {
    id: "intent",
    title: {
      en: "Parse intent from prompt",
      vi: "Phân tích ý định từ prompt",
    },
    detail: {
      en: "Normalize semantics to determine topic clusters and priority levels.",
      vi: "Chuẩn hóa ngữ nghĩa để xác định nhóm chủ đề và mức độ ưu tiên.",
    },
    durationMs: 1600,
  },
  {
    id: "external-signals",
    title: {
      en: "Collect Google Trends signals",
      vi: "Thu thập tín hiệu Google Trends",
    },
    detail: {
      en: "Capture keyword momentum, region concentration, and growth by time window.",
      vi: "Lấy động lượng theo từ khóa, vùng địa lý và mức tăng theo từng khung thời gian.",
    },
    durationMs: 2200,
  },
  {
    id: "social-crosscheck",
    title: {
      en: "Cross-check social signals",
      vi: "Đối chiếu tín hiệu mạng xã hội",
    },
    detail: {
      en: "Match social data to remove noise and detect topics with strong viral potential.",
      vi: "So khớp dữ liệu mạng xã hội để lọc nhiễu và phát hiện chủ đề có tiềm năng lan truyền.",
    },
    durationMs: 2100,
  },
  {
    id: "opportunity-ranking",
    title: {
      en: "Rank content opportunities",
      vi: "Xếp hạng cơ hội nội dung",
    },
    detail: {
      en: "Score opportunities from momentum, hashtag overlap, and execution readiness.",
      vi: "Tính điểm trend_score theo động lượng, độ chồng hashtag và khả năng triển khai.",
    },
    durationMs: 1900,
  },
  {
    id: "response-shaping",
    title: {
      en: "Shape output response",
      vi: "Chuẩn hóa phản hồi đầu ra",
    },
    detail: {
      en: "Package results, summary, and suggested actions for stable rendering.",
      vi: "Đóng gói kết quả, phần tóm tắt và gợi ý hành động để hiển thị ổn định.",
    },
    durationMs: 1800,
  },
];

const ORCHESTRATOR_STEPS: ReasoningStep[] = [
  {
    id: "prompt-routing",
    title: {
      en: "Route prompt and split tasks",
      vi: "Định tuyến prompt và phân rã nhiệm vụ",
    },
    detail: {
      en: "Split the objective into trend-analysis and content-generation lanes.",
      vi: "Tách mục tiêu thành luồng phân tích xu hướng và luồng tạo nội dung.",
    },
    durationMs: 1700,
  },
  {
    id: "trend-intelligence",
    title: {
      en: "Aggregate multi-source intelligence",
      vi: "Tổng hợp tín hiệu từ nhiều nguồn",
    },
    detail: {
      en: "Combine rising keywords, momentum, and interest regions to pick the strongest opportunities.",
      vi: "Kết hợp từ khóa tăng trưởng, động lượng và vùng quan tâm để chọn cơ hội nổi bật nhất.",
    },
    durationMs: 2400,
  },
  {
    id: "content-architecture",
    title: {
      en: "Design video script architecture",
      vi: "Thiết kế khung kịch bản video",
    },
    detail: {
      en: "Build hooks, timeline sections, narrative flow, and CTA aligned with growth goals.",
      vi: "Xây hook, các phân đoạn timeline, mạch kể chuyện và CTA phù hợp với mục tiêu tăng trưởng.",
    },
    durationMs: 2500,
  },
  {
    id: "platform-adaptation",
    title: {
      en: "Adapt copy for each platform",
      vi: "Tối ưu nội dung theo nền tảng",
    },
    detail: {
      en: "Adjust captions, hashtags, and best posting windows for TikTok, Facebook, and Instagram.",
      vi: "Điều chỉnh caption, hashtag và khung giờ đăng phù hợp cho TikTok, Facebook, Instagram.",
    },
    durationMs: 2100,
  },
  {
    id: "quality-guard",
    title: {
      en: "Run quality guard checks",
      vi: "Kiểm tra chất lượng đầu ra",
    },
    detail: {
      en: "Validate output JSON, attach run metadata, and verify data consistency.",
      vi: "Chuẩn hóa JSON đầu ra, gắn metadata phiên chạy và kiểm tra tính nhất quán dữ liệu.",
    },
    durationMs: 2000,
  },
];

const TREND_LIVE_TRACE: BilingualText[] = [
  {
    en: "Clustering topics and scoring relevance by user intent.",
    vi: "Đang gom cụm chủ đề và chấm mức liên quan theo ý định người dùng.",
  },
  {
    en: "Aggregating peak regions to prioritize high-conversion insights.",
    vi: "Đang tổng hợp vùng tăng mạnh để ưu tiên insight có khả năng chuyển đổi.",
  },
  {
    en: "Cross-matching hashtag overlap across keywords to detect opportunity clusters.",
    vi: "Đang đối chiếu hashtag chồng lấp giữa các từ khóa để phát hiện cụm cơ hội.",
  },
  {
    en: "Estimating trend durability from interest-over-time signals.",
    vi: "Đang ước lượng độ bền xu hướng từ tín hiệu interest_over_day.",
  },
  {
    en: "Generating action suggestions in short-video format with follow-up prompts.",
    vi: "Đang tạo gợi ý hành động theo định dạng video ngắn và prompt tiếp nối.",
  },
];

const ORCHESTRATOR_LIVE_TRACE: BilingualText[] = [
  {
    en: "Syncing trend-agent output into the content lane.",
    vi: "Đang đồng bộ đầu ra từ trend agent sang luồng nội dung.",
  },
  {
    en: "Building video_script structure with timestamp-ready sections.",
    vi: "Đang tạo cấu trúc video_script với các phân đoạn sẵn mốc thời gian.",
  },
  {
    en: "Refining CTA messaging for the target platform context.",
    vi: "Đang tinh chỉnh thông điệp CTA theo ngữ cảnh nền tảng mục tiêu.",
  },
  {
    en: "Normalizing platform_posts and suggesting optimal posting windows.",
    vi: "Đang chuẩn hóa platform_posts và đề xuất khung giờ đăng tối ưu.",
  },
  {
    en: "Packaging raw response and output pointers for review.",
    vi: "Đang đóng gói phản hồi thô và đường dẫn output để phục vụ review.",
  },
];

function pickSteps(mode: "trend" | "orchestrator") {
  return mode === "orchestrator" ? ORCHESTRATOR_STEPS : TREND_STEPS;
}

function pickTrace(mode: "trend" | "orchestrator") {
  return mode === "orchestrator" ? ORCHESTRATOR_LIVE_TRACE : TREND_LIVE_TRACE;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function summarizePrompt(prompt: string | undefined) {
  const normalized = (prompt ?? "").trim();
  if (normalized.length <= 110) {
    return normalized;
  }

  return `${normalized.slice(0, 107)}...`;
}

export function ReasoningTimeline({
  isPending,
  elapsedMs,
  mode = "trend",
  promptPreview,
  copy,
}: ReasoningTimelineProps) {
  const t = copy ?? ((en: string) => en);
  const steps = pickSteps(mode);
  const traces = pickTrace(mode);

  const totalDurationMs = steps.reduce((sum, step) => sum + step.durationMs, 0);
  const safeElapsedMs = Math.max(elapsedMs, 0);

  const activeIndex = (() => {
    if (!isPending) {
      return -1;
    }

    let consumed = 0;
    for (let index = 0; index < steps.length; index += 1) {
      consumed += steps[index].durationMs;
      if (safeElapsedMs < consumed) {
        return index;
      }
    }

    return steps.length - 1;
  })();

  const isRunFinished = !isPending && safeElapsedMs > 0;
  const progressRatio = isPending
    ? clamp(safeElapsedMs / Math.max(totalDurationMs, 1), 0, 0.98)
    : isRunFinished
      ? 1
      : 0;

  const confidence = isPending
    ? clamp(55 + Math.floor(safeElapsedMs / 180), 55, 97)
    : isRunFinished
      ? 99
      : 0;

  const signalRate = isPending
    ? clamp(8 + Math.floor(safeElapsedMs / 1100), 8, 32)
    : isRunFinished
      ? 24
      : 0;

  const candidateCount = isPending
    ? clamp(3 + Math.floor(safeElapsedMs / 540), 3, 28)
    : isRunFinished
      ? 14
      : 0;

  const traceCursor = Math.floor(safeElapsedMs / 950);
  const liveTrace = [0, 1, 2].map(
    (offset) => traces[(traceCursor + offset) % traces.length],
  );

  const promptLine = summarizePrompt(promptPreview);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/65 bg-background/55 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <BrainCircuit className="size-3.5 text-primary" />
            {t("Reasoning engine", "Bộ suy luận")}
          </p>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-[10px]",
              isPending && "border-primary/35 bg-primary/10 text-primary",
              isRunFinished &&
                "border-emerald-500/35 bg-emerald-500/10 text-emerald-700",
            )}
          >
            {isPending
              ? t("Live", "Đang chạy")
              : isRunFinished
                ? t("Completed", "Hoàn tất")
                : t("Idle", "Chờ chạy")}
          </Badge>
        </div>

        {promptLine ? (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {t("Prompt", "Yêu cầu")}: {promptLine}
          </p>
        ) : null}

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/70">
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-500 via-primary to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              {t("Confidence", "Độ tin cậy")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {confidence}%
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              {t("Signal rate", "Tốc độ tín hiệu")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {signalRate}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                {t("sig/s", "tín hiệu/giây")}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">
              {t("Candidates", "Số phương án")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {candidateCount}
            </p>
          </div>
        </div>
      </div>

      {steps.map((step, index) => {
        const isActive = isPending && index === activeIndex;
        const isCompleted = isPending ? index < activeIndex : isRunFinished;

        const beforeDuration = steps
          .slice(0, index)
          .reduce((sum, current) => sum + current.durationMs, 0);
        const elapsedInsideStep = safeElapsedMs - beforeDuration;
        const stepRatio = isCompleted
          ? 1
          : isActive
            ? clamp(elapsedInsideStep / step.durationMs, 0.1, 1)
            : isRunFinished
              ? 1
              : 0;

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground",
              isCompleted &&
                "border-emerald-500/35 bg-emerald-500/10 text-emerald-700",
              isActive &&
                "border-primary/35 bg-primary/10 text-foreground shadow-[0_0_0_1px_rgba(59,130,246,0.25)_inset]",
            )}
          >
            <div className="flex items-start gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "mt-0.5 rounded-full text-[10px]",
                  isActive && "border-primary/35 text-primary",
                  isCompleted && "border-emerald-500/35 text-emerald-700",
                )}
              >
                {index + 1}
              </Badge>

              <div className="min-w-0 flex-1">
                <p className="font-medium">{t(step.title.en, step.title.vi)}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t(step.detail.en, step.detail.vi)}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isCompleted && "bg-emerald-500/70",
                      isActive && "bg-primary/80",
                      !isCompleted && !isActive && "bg-border",
                    )}
                    style={{ width: `${Math.round(stepRatio * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <ScanSearch className="size-3.5 text-primary" />
          {t("Live trace", "Dấu vết thời gian thực")}
        </p>

        <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          {liveTrace.map((line) => (
            <p key={line.en} className="flex items-start gap-2">
              <Gauge className="mt-0.5 size-3 text-primary" />
              <span>{t(line.en, line.vi)}</span>
            </p>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="size-3.5 text-amber-500" />
          {isPending
            ? t(
                "Reasoning simulation is active while waiting for API response.",
                "Mô phỏng reasoning đang hoạt động trong lúc chờ API trả kết quả.",
              )
            : t(
                "Reasoning simulation will run when you start a new request.",
                "Reasoning simulation sẽ chạy khi bạn bắt đầu request mới.",
              )}
        </p>
      </div>
    </div>
  );
}
