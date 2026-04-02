import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";

const COMMENTS = [
  {
    user: "@creative_mind",
    tone: "Negative",
    stamp: "04:10",
    confidence: "92% match",
    text: "The transition at 4:10 felt a bit too jarring, lost the flow for a second there.",
  },
  {
    user: "@tech_guy_99",
    tone: "Neutral",
    stamp: "04:12",
    confidence: "86% match",
    text: "Is that the new camera rig you were talking about in the last video?",
  },
  {
    user: "@art_lover",
    tone: "Positive",
    stamp: "04:13",
    confidence: "95% match",
    text: "The color grading in this sequence is absolutely stunning. Earthy vibes!",
  },
  {
    user: "@mystery_user",
    tone: "Positive",
    stamp: "04:14",
    confidence: "89% match",
    text: "Love the background music choice here.",
  },
] as const;

export function ContextPanel() {
  return (
    <PanelCard
      title="Context Panel"
      description="Comments matched to the current timestamp (04:12)."
    >
      <div className="flex flex-col gap-3">
        {COMMENTS.map((comment) => (
          <div
            key={comment.user}
            className={
              comment.tone === "Negative"
                ? "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-[0_8px_20px_rgba(185,28,28,0.08)]"
                : comment.tone === "Positive"
                  ? "rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 shadow-[0_8px_20px_rgba(74,124,89,0.08)]"
                  : "rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
            }
          >
            <div className="mb-2 flex items-center justify-between gap-4 text-[11px] font-semibold tracking-[0.16em] uppercase">
              <span className="text-muted-foreground">{comment.user}</span>
              <span
                className={
                  comment.tone === "Negative"
                    ? "text-red-600"
                    : comment.tone === "Positive"
                      ? "text-primary"
                      : "text-foreground"
                }
              >
                {comment.tone}
              </span>
            </div>
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Timestamp {comment.stamp}</span>
              <span>{comment.confidence}</span>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              “{comment.text}”
            </p>
          </div>
        ))}
        <Button variant="outline" className="mt-2 rounded-full">
          View All Comments (1.2k)
        </Button>
      </div>
    </PanelCard>
  );
}
