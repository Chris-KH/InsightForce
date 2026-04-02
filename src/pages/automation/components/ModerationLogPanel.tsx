import { PanelCard } from "@/components/app-section";

const LOG_LINES = [
  "[09:00:01] System boot sequence initiated...",
  "[09:00:02] Guardian Agent connected.",
  "[14:21:04] INFO: Scanning message #A92-F1.",
  "[14:21:05] WARN: Potential spam pattern detected in link.",
  "[14:21:06] ACTION: Removed link [bit.ly/xxxx].",
  "[14:22:12] INFO: Sentiment analysis: Neutral.",
  "[14:23:45] INFO: Monitoring user @user_92.",
  "[14:24:10] ACTION: Flagged toxic comment [violates p1.2].",
] as const;

export function ModerationLogPanel() {
  return (
    <PanelCard
      title="Live Moderation Log"
      description="A rolling event stream from the Guardian agent."
    >
      <div className="rounded-[1.5rem] border border-emerald-900/50 bg-zinc-950 p-5 font-mono text-xs leading-6 text-emerald-400 shadow-[0_14px_28px_rgba(0,0,0,0.4)]">
        <div className="space-y-1">
          {LOG_LINES.map((line, index) => (
            <p
              key={index}
              className={
                index === 4 || index === 7 ? "text-red-400" : "text-emerald-300"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
