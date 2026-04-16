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

type ReasoningStep = {
  id: string;
  title: string;
  detail: string;
  durationMs: number;
};

const TREND_STEPS: ReasoningStep[] = [
  {
    id: "intent",
    title: "Phân tích intent từ prompt",
    detail: "Chuẩn hóa ngữ nghĩa để xác định nhóm chủ đề và mức độ ưu tiên.",
    durationMs: 1600,
  },
  {
    id: "external-signals",
    title: "Thu thập tín hiệu Google Trends",
    detail:
      "Lấy động lượng theo từ khóa, vùng địa lý và mức tăng theo thời điểm.",
    durationMs: 2200,
  },
  {
    id: "social-crosscheck",
    title: "Đối chiếu tín hiệu social",
    detail:
      "So khớp dữ liệu social để lọc nhiễu và phát hiện chủ đề có tiềm năng lan truyền.",
    durationMs: 2100,
  },
  {
    id: "opportunity-ranking",
    title: "Xếp hạng cơ hội nội dung",
    detail:
      "Tính điểm trend_score theo momentum, hashtag overlap và khả năng triển khai.",
    durationMs: 1900,
  },
  {
    id: "response-shaping",
    title: "Chuẩn hóa response trả về",
    detail:
      "Đóng gói kết quả, summary và các gợi ý hành động để render ổn định.",
    durationMs: 1800,
  },
];

const ORCHESTRATOR_STEPS: ReasoningStep[] = [
  {
    id: "prompt-routing",
    title: "Định tuyến prompt và phân rã nhiệm vụ",
    detail:
      "Tách mục tiêu thành lane trend analysis và lane content generation.",
    durationMs: 1700,
  },
  {
    id: "trend-intelligence",
    title: "Tổng hợp intelligence đa nguồn",
    detail:
      "Tập hợp keyword rising, momentum và vùng quan tâm để chọn cơ hội mạnh nhất.",
    durationMs: 2400,
  },
  {
    id: "content-architecture",
    title: "Thiết kế khung kịch bản video",
    detail:
      "Xây hook, timeline section, narrative và CTA phù hợp với mục tiêu tăng trưởng.",
    durationMs: 2500,
  },
  {
    id: "platform-adaptation",
    title: "Tối ưu copy theo nền tảng",
    detail:
      "Điều chỉnh caption, hashtag, best posting window cho TikTok/Facebook/Instagram.",
    durationMs: 2100,
  },
  {
    id: "quality-guard",
    title: "Kiểm tra chất lượng và artifact",
    detail:
      "Chuẩn hóa JSON output, gắn metadata run và kiểm tra tính nhất quán dữ liệu.",
    durationMs: 2000,
  },
];

const TREND_LIVE_TRACE = [
  "Tách cụm chủ đề và xác định độ liên quan theo ý định người dùng.",
  "Đang gom peak region để ưu tiên insight có khả năng chuyển đổi.",
  "So khớp hashtag chồng lấp giữa các từ khóa để phát hiện cụm cơ hội.",
  "Ước lượng độ bền xu hướng theo chuỗi interest_over_day.",
  "Tạo đề xuất hành động theo format short video + prompt follow-up.",
];

const ORCHESTRATOR_LIVE_TRACE = [
  "Đang đồng bộ output trend agent sang content lane.",
  "Tạo cấu trúc video_script với phân đoạn timestamp-ready.",
  "Tinh chỉnh thông điệp CTA theo ngữ cảnh nền tảng mục tiêu.",
  "Chuẩn hóa platform_posts và gợi ý lịch đăng theo khung giờ.",
  "Đóng gói raw response + output file pointer để phục vụ review.",
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
  const t = copy ?? ((_en: string, vi: string) => vi);
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
            {t("Reasoning engine", "Reasoning engine")}
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
            {t("Prompt", "Prompt")}: {promptLine}
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
                sig/s
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
                <p className="font-medium">{step.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {step.detail}
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
          {t("Live trace", "Live trace")}
        </p>

        <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          {liveTrace.map((line) => (
            <p key={line} className="flex items-start gap-2">
              <Gauge className="mt-0.5 size-3 text-primary" />
              <span>{line}</span>
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
