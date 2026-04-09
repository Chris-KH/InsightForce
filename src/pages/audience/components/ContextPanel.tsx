import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function ContextPanel() {
  const copy = useBilingual();

  const comments = [
    {
      user: "@creative_mind",
      tone: copy("Negative", "Tiêu cực"),
      toneKey: "negative" as const,
      stamp: "04:10",
      confidence: copy("92% match", "Khớp 92%"),
      text: copy(
        "The transition at 4:10 felt a bit too jarring, lost the flow for a second there.",
        "Đoạn chuyển ở 4:10 hơi gắt, mình bị mất mạch cảm xúc một chút.",
      ),
    },
    {
      user: "@tech_guy_99",
      tone: copy("Neutral", "Trung tính"),
      toneKey: "neutral" as const,
      stamp: "04:12",
      confidence: copy("86% match", "Khớp 86%"),
      text: copy(
        "Is that the new camera rig you were talking about in the last video?",
        "Đó có phải bộ rig máy quay mới bạn nói ở video trước không?",
      ),
    },
    {
      user: "@art_lover",
      tone: copy("Positive", "Tích cực"),
      toneKey: "positive" as const,
      stamp: "04:13",
      confidence: copy("95% match", "Khớp 95%"),
      text: copy(
        "The color grading in this sequence is absolutely stunning. Earthy vibes!",
        "Phối màu ở đoạn này thật sự rất đẹp. Rất nhiều chất liệu tự nhiên!",
      ),
    },
    {
      user: "@mystery_user",
      tone: copy("Positive", "Tích cực"),
      toneKey: "positive" as const,
      stamp: "04:14",
      confidence: copy("89% match", "Khớp 89%"),
      text: copy(
        "Love the background music choice here.",
        "Mình rất thích nhạc nền ở đoạn này.",
      ),
    },
  ] as const;

  return (
    <PanelCard
      title={copy("Context Panel", "Bảng ngữ cảnh")}
      description={copy(
        "Comments matched to the current timestamp (04:12).",
        "Bình luận khớp với mốc thời gian hiện tại (04:12).",
      )}
    >
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div
            key={comment.user}
            className={
              comment.toneKey === "negative"
                ? "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-[0_8px_20px_rgba(185,28,28,0.08)]"
                : comment.toneKey === "positive"
                  ? "rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 shadow-[0_8px_20px_rgba(74,124,89,0.08)]"
                  : "rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
            }
          >
            <div className="mb-2 flex items-center justify-between gap-4 text-[11px] font-semibold tracking-[0.16em] uppercase">
              <span className="text-muted-foreground">{comment.user}</span>
              <span
                className={
                  comment.toneKey === "negative"
                    ? "text-red-600"
                    : comment.toneKey === "positive"
                      ? "text-primary"
                      : "text-foreground"
                }
              >
                {comment.tone}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                {copy("Timestamp", "Mốc thời gian")} {comment.stamp}
              </span>
              <span>{comment.confidence}</span>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              “{comment.text}”
            </p>
          </div>
        ))}
        <Button variant="outline" className="mt-2 rounded-full">
          {copy("View All Comments (1.2k)", "Xem mọi bình luận (1.2k)")}
        </Button>
      </div>
    </PanelCard>
  );
}
