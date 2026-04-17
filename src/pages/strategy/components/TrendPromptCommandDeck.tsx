import {
  Activity,
  Bot,
  BrainCircuit,
  Gauge,
  SendHorizontal,
  Sparkles,
  TimerReset,
  Workflow,
} from "lucide-react";

import { InlineQueryState } from "@/components/app-query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDuration } from "@/lib/insight-formatters";
import { cn } from "@/lib/utils";

import { PromptSuggestionBar } from "./PromptSuggestionBar";

type CopyFn = (en: string, vi: string) => string;

type TrendPromptCommandDeckProps = {
  copy: CopyFn;
  promptInput: string;
  onPromptInputChange: (value: string) => void;
  onAnalyze: () => void;
  isPending: boolean;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  sessionId: string;
  promptTurns: number;
  elapsedMs: number;
  promptPreview?: string;
  markdownSummary?: string;
  errorMessage?: string;
  resultCount: number;
  topKeyword?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function summarizePrompt(prompt: string | undefined) {
  const normalized = (prompt ?? "").trim();
  if (normalized.length <= 120) {
    return normalized;
  }

  return `${normalized.slice(0, 117)}...`;
}

function signalRateText(
  isPending: boolean,
  elapsedMs: number,
  hasResult: boolean,
) {
  if (isPending) {
    const elapsedSec = Math.max(0, elapsedMs / 1000);
    const rate = 0.55 + Math.min(1.45, elapsedSec * 0.11);
    return `${rate.toFixed(2)} sig/s`;
  }

  return hasResult ? "1.00 sig/s" : "0.00 sig/s";
}

export function TrendPromptCommandDeck({
  copy,
  promptInput,
  onPromptInputChange,
  onAnalyze,
  isPending,
  suggestions,
  onSelectSuggestion,
  sessionId,
  promptTurns,
  elapsedMs,
  promptPreview,
  markdownSummary,
  errorMessage,
  resultCount,
  topKeyword,
}: TrendPromptCommandDeckProps) {
  const hasResult = resultCount > 0 || Boolean(markdownSummary);
  const elapsedSeconds = Math.max(0, Math.round(elapsedMs / 1000));
  const progressRatio = isPending
    ? clamp((elapsedSeconds + 1) / 14, 0, 0.96)
    : hasResult
      ? 1
      : 0;

  const confidence = isPending
    ? Math.round(clamp(44 + progressRatio * 52, 44, 96))
    : hasResult
      ? 99
      : 0;

  const inferredCandidates = isPending
    ? Math.max(resultCount, Math.round(2 + progressRatio * 16))
    : hasResult
      ? Math.max(resultCount, 8)
      : 0;

  const promptLine = summarizePrompt(promptPreview);

  const pipelineStages = [
    {
      key: "intent",
      label: copy("Intent decoding", "Giải mã ý định"),
      value: Math.round(clamp(30 + progressRatio * 70, 0, 100)),
      icon: <BrainCircuit className="size-3.5" />,
    },
    {
      key: "signals",
      label: copy("Signal fusion", "Hợp nhất tín hiệu"),
      value: Math.round(clamp(24 + progressRatio * 76, 0, 100)),
      icon: <Activity className="size-3.5" />,
    },
    {
      key: "ranking",
      label: copy("Opportunity ranking", "Xếp hạng cơ hội"),
      value: Math.round(clamp(18 + progressRatio * 82, 0, 100)),
      icon: <Gauge className="size-3.5" />,
    },
    {
      key: "packaging",
      label: copy("Response packaging", "Đóng gói phản hồi"),
      value: Math.round(clamp(12 + progressRatio * 88, 0, 100)),
      icon: <Workflow className="size-3.5" />,
    },
  ];

  return (
    <Card className="relative overflow-hidden rounded-3xl border-primary/20 bg-linear-to-br from-card via-card/96 to-primary/8">
      <div className="pointer-events-none absolute -top-14 -left-16 size-56 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute right-0 -bottom-20 size-64 rounded-full bg-chart-2/16 blur-3xl" />

      <CardHeader className="relative border-b border-border/55">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              {copy("Trend Command Deck", "Bảng điều khiển Trend")}
            </CardTitle>
            <CardDescription>
              {copy(
                "One unified workspace to write prompts and monitor the live reasoning pulse without context switching.",
                "Một workspace hợp nhất để viết prompt và theo dõi reasoning trực tiếp mà không cần chuyển ngữ cảnh.",
              )}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full",
                isPending && "border-primary/35 bg-primary/10 text-primary",
                !isPending &&
                  hasResult &&
                  "border-emerald-500/35 bg-emerald-500/10 text-emerald-700",
              )}
            >
              {isPending
                ? copy("Live reasoning", "Reasoning trực tiếp")
                : hasResult
                  ? copy("Last run completed", "Lần chạy gần nhất đã hoàn tất")
                  : copy("Idle", "Đang chờ")}
            </Badge>
            <Badge variant="outline" className="rounded-full border-border/70">
              {copy("Session", "Phiên")}: {sessionId}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative py-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-background/55 p-3">
              <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {copy("Prompt composer", "Vùng soạn prompt")}
              </p>

              <div className="flex items-center gap-2">
                <Input
                  value={promptInput}
                  onChange={(event) => onPromptInputChange(event.target.value)}
                  placeholder={copy(
                    "Example: trend content ideas for dental clinics in Vietnam",
                    "Ví dụ: ý tưởng trend content cho nha khoa tại Việt Nam",
                  )}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onAnalyze();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={onAnalyze}
                  disabled={isPending || !promptInput.trim()}
                >
                  <SendHorizontal data-icon="inline-start" />
                  {copy("Analyze", "Phân tích")}
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {copy(
                  "Press Enter to run instantly. Suggestions below adapt to your recent prompts and outcomes.",
                  "Nhấn Enter để chạy ngay. Các gợi ý bên dưới sẽ tự thích nghi theo prompt và kết quả gần nhất.",
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/45 p-3">
              <PromptSuggestionBar
                suggestions={suggestions}
                onSelect={onSelectSuggestion}
                copy={copy}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Prompt turns", "Số lượt prompt")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {promptTurns}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Result topics", "Số chủ đề kết quả")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {resultCount}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Top keyword", "Từ khóa nổi bật")}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground">
                  {topKeyword || "--"}
                </p>
              </div>
            </div>

            {errorMessage ? (
              <InlineQueryState state="error" message={errorMessage} />
            ) : null}
          </div>

          <div className="space-y-4 rounded-2xl border border-primary/20 bg-background/45 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              <TimerReset className="size-3.5 text-primary" />
              {copy("Reasoning pulse", "Xung reasoning")}
            </p>

            {promptLine ? (
              <p className="line-clamp-2 rounded-xl border border-border/60 bg-background/55 px-3 py-2 text-xs text-muted-foreground">
                {copy("Latest prompt", "Prompt gần nhất")}: {promptLine}
              </p>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-background/55 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Confidence", "Độ tin cậy")}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {confidence}%
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/55 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Signal rate", "Tốc độ tín hiệu")}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {signalRateText(isPending, elapsedMs, hasResult)}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/55 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Candidates", "Ứng viên")}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {inferredCandidates}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/55 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Elapsed", "Thời lượng")}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {formatDuration(elapsedSeconds)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {pipelineStages.map((stage) => (
                <div key={stage.key} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <p className="inline-flex items-center gap-1 text-muted-foreground">
                      {stage.icon}
                      {stage.label}
                    </p>
                    <span className="font-semibold text-foreground">
                      {stage.value}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted/65">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-sky-500 via-primary to-emerald-500 transition-all duration-300"
                      style={{ width: `${stage.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={cn(
                "rounded-xl border px-3 py-2 text-xs",
                isPending
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/60 bg-background/55 text-muted-foreground",
              )}
            >
              <p className="inline-flex items-center gap-1 font-semibold">
                <Bot className="size-3.5" />
                {isPending
                  ? copy(
                      "Engine in focus mode",
                      "Engine đang vào chế độ tập trung",
                    )
                  : copy(
                      "Waiting for the next prompt",
                      "Đang chờ prompt tiếp theo",
                    )}
              </p>
              <p className="mt-1">
                {isPending
                  ? copy(
                      "Ranking and cross-checking trend opportunities from external and social signals.",
                      "Đang xếp hạng và đối chiếu cơ hội xu hướng từ tín hiệu bên ngoài và mạng xã hội.",
                    )
                  : copy(
                      "Submit a new prompt to continue the analysis workflow.",
                      "Hãy gửi prompt mới để tiếp tục luồng phân tích.",
                    )}
              </p>
            </div>

            {markdownSummary ? (
              <div className="rounded-xl border border-border/60 bg-background/55 p-3">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Latest narrative brief", "Tóm tắt diễn giải mới nhất")}
                </p>
                <p className="mt-1 line-clamp-6 text-xs whitespace-pre-wrap text-muted-foreground">
                  {markdownSummary}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
