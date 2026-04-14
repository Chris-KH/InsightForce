import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReasoningTimelineProps = {
  isPending: boolean;
  elapsedMs: number;
};

const TIMELINE_STEPS = [
  "Đang phân tích intent từ prompt",
  "Đang lấy tín hiệu Google Trends",
  "Đang đối chiếu tín hiệu social",
  "Đang xếp hạng và tổng hợp cơ hội",
  "Đang chuẩn hóa kết quả trả về",
];

export function ReasoningTimeline({
  isPending,
  elapsedMs,
}: ReasoningTimelineProps) {
  const activeIndex = isPending
    ? Math.min(TIMELINE_STEPS.length - 1, Math.floor(elapsedMs / 2200))
    : -1;

  return (
    <div className="space-y-2">
      {TIMELINE_STEPS.map((step, index) => {
        const isDone = !isPending && elapsedMs > 0;
        const isActive = isPending && index === activeIndex;
        const isCompleted = isPending ? index < activeIndex : isDone;

        return (
          <div
            key={step}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground",
              isCompleted &&
                "border-emerald-500/35 bg-emerald-500/10 text-emerald-700",
              isActive &&
                "border-primary/35 bg-primary/10 text-foreground shadow-[0_0_0_1px_rgba(59,130,246,0.25)_inset]",
            )}
          >
            <Badge
              variant="outline"
              className={cn(
                "rounded-full text-[10px]",
                isActive && "border-primary/35 text-primary",
                isCompleted && "border-emerald-500/35 text-emerald-700",
              )}
            >
              {index + 1}
            </Badge>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
