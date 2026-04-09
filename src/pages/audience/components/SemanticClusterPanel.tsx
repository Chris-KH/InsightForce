import { ScanSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function SemanticClusterPanel() {
  const copy = useBilingual();

  return (
    <PanelCard
      title={copy("Semantic Cluster Map", "Bản đồ cụm ngữ nghĩa")}
      description={copy(
        "Real-time co-mention clusters from comments, transcripts, and watch-time spikes.",
        "Cụm đồng nhắc theo thời gian thực từ bình luận, transcript và đỉnh thời lượng xem.",
      )}
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 text-primary"
        >
          <ScanSearch className="mr-1 size-3.5" />
          {copy("Live Clustering", "Phân cụm trực tiếp")}
        </Badge>
      }
    >
      <div className="relative min-h-105 overflow-hidden rounded-3xl bg-muted/15 p-6">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle, #4a7c59 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full bg-background/90">
            {copy("Comment Topics", "Chủ đề bình luận")}
          </Badge>
          <Badge variant="secondary" className="rounded-full bg-background/90">
            {copy("Watch-time Dips", "Điểm rơi thời lượng xem")}
          </Badge>
          <Badge variant="secondary" className="rounded-full bg-background/90">
            {copy("Viral Hooks", "Móc câu lan truyền")}
          </Badge>
        </div>
        <div className="relative h-90 rounded-2xl border border-border/50 bg-background/20 p-2">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M18 20 C30 10, 42 14, 50 18"
              stroke="rgba(74,124,89,0.35)"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M50 18 C62 22, 74 16, 82 18"
              stroke="rgba(209,176,107,0.35)"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M50 18 C58 30, 66 38, 72 42"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M50 18 C44 30, 36 40, 28 44"
              stroke="rgba(74,124,89,0.28)"
              strokeWidth="0.6"
              fill="none"
            />
          </svg>
          <div className="absolute top-16 left-16 flex size-48 flex-col items-center justify-center rounded-full border-2 border-primary/30 bg-primary/20 text-center shadow-[0_18px_28px_rgba(0,0,0,0.12)]">
            <span className="font-semibold text-primary">
              {copy("Video Quality", "Chất lượng video")}
            </span>
            <span className="text-xs text-muted-foreground">
              {copy("4.2k Mentions", "4.2k lượt nhắc")}
            </span>
          </div>
          <div className="absolute top-10 left-[52%] flex size-40 flex-col items-center justify-center rounded-full border-2 border-amber-700/30 bg-amber-500/15 text-center shadow-[0_14px_24px_rgba(0,0,0,0.1)]">
            <span className="font-semibold text-amber-900">
              {copy("Humor", "Hài hước")}
            </span>
            <span className="text-xs text-muted-foreground">
              {copy("2.8k Mentions", "2.8k lượt nhắc")}
            </span>
          </div>
          <div className="absolute top-24 right-20 flex size-24 flex-col items-center justify-center rounded-full border border-border bg-card text-center">
            <span className="text-sm font-semibold text-foreground">
              {copy("Pacing", "Nhịp độ")}
            </span>
            <span className="text-xs text-muted-foreground">420</span>
          </div>
          <div className="absolute right-36 bottom-24 flex size-36 flex-col items-center justify-center rounded-full border-2 border-border bg-background text-center">
            <span className="font-semibold text-foreground">
              {copy("Critiques", "Phê bình")}
            </span>
            <span className="text-xs text-muted-foreground">
              {copy("1.5k Mentions", "1.5k lượt nhắc")}
            </span>
          </div>
          <div className="absolute bottom-24 left-[48%] flex size-28 flex-col items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-center">
            <span className="font-semibold text-primary">
              {copy("Editing", "Dựng phim")}
            </span>
            <span className="text-xs text-muted-foreground">
              {copy("900 Mentions", "900 lượt nhắc")}
            </span>
          </div>
          <div className="absolute bottom-14 left-10 flex size-20 flex-col items-center justify-center rounded-full border border-border bg-card text-center">
            <span className="text-sm font-semibold text-foreground">
              {copy("Audio", "Âm thanh")}
            </span>
            <span className="text-xs text-muted-foreground">310</span>
          </div>
          <div className="absolute right-4 bottom-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
            {copy("142 semantic nodes", "142 nút ngữ nghĩa")}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
