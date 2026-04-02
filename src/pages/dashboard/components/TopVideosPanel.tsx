import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";

const VIDEO_ROWS = [
  {
    title: "The Future of AI...",
    views: "842K",
    reactions: "42.5K",
    sentiment: "94%",
    tone: "primary",
  },
  {
    title: "Daily Vlog: Minimalist...",
    views: "612K",
    reactions: "18.2K",
    sentiment: "89%",
    tone: "primary",
  },
  {
    title: "Setup Tour 2024",
    views: "501K",
    reactions: "31.0K",
    sentiment: "78%",
    tone: "secondary",
  },
] as const;

export function TopVideosPanel() {
  return (
    <PanelCard
      title="Top Performing Videos"
      description="The strongest content driving retention and revenue."
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-4">Title</th>
              <th className="px-4 py-4">Views</th>
              <th className="px-4 py-4">Reactions</th>
              <th className="px-4 py-4">Sentiment Score</th>
            </tr>
          </thead>
          <tbody>
            {VIDEO_ROWS.map((row, index) => (
              <tr
                key={row.title}
                className={
                  index !== VIDEO_ROWS.length - 1
                    ? "border-b border-border/50"
                    : ""
                }
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-lg"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, rgba(74,124,89,0.9), rgba(196,166,106,0.8), rgba(112,92,48,0.7))",
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {row.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Short-form + long-form multi-channel lift
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{row.views}</td>
                <td className="px-4 py-4 text-muted-foreground">
                  {row.reactions}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    <span
                      className={
                        row.tone === "primary"
                          ? "size-2 rounded-full bg-primary"
                          : "size-2 rounded-full bg-secondary"
                      }
                    />
                    {row.sentiment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end pt-5">
        <Button variant="link" className="h-auto px-0 text-primary">
          View All Content
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </PanelCard>
  );
}
