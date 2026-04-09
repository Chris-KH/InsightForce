import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function TopVideosPanel() {
  const copy = useBilingual();

  const videoRows = [
    {
      title: copy("The Future of AI...", "Tương lai của AI..."),
      views: "842K",
      reactions: "42.5K",
      sentiment: "94%",
      tone: "primary",
    },
    {
      title: copy("Daily Vlog: Minimalist...", "Vlog hằng ngày: Tối giản..."),
      views: "612K",
      reactions: "18.2K",
      sentiment: "89%",
      tone: "primary",
    },
    {
      title: copy("Setup Tour 2024", "Tham quan góc setup 2024"),
      views: "501K",
      reactions: "31.0K",
      sentiment: "78%",
      tone: "secondary",
    },
  ] as const;

  return (
    <PanelCard
      title={copy("Top Performing Videos", "Video hiệu suất cao")}
      description={copy(
        "The strongest content driving retention and revenue.",
        "Những nội dung hiệu quả nhất thúc đẩy giữ chân và doanh thu.",
      )}
    >
      <RevealBlock>
        <div className="relative overflow-hidden rounded-2xl border border-border/65 bg-background/85">
          <SurfaceGrid className="opacity-22" />

          <table className="relative w-full text-left text-sm">
            <thead className="bg-muted/35 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-4">{copy("Title", "Tiêu đề")}</th>
                <th className="px-4 py-4">{copy("Views", "Lượt xem")}</th>
                <th className="px-4 py-4">{copy("Reactions", "Phản hồi")}</th>
                <th className="px-4 py-4">
                  {copy("Sentiment Score", "Điểm cảm xúc")}
                </th>
              </tr>
            </thead>
            <tbody>
              {videoRows.map((row, index) => (
                <motion.tr
                  key={row.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.28,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className={
                    index !== videoRows.length - 1
                      ? "border-b border-border/50 transition-colors hover:bg-muted/18"
                      : "transition-colors hover:bg-muted/18"
                  }
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-12 rounded-lg border border-primary/20 shadow-[0_6px_16px_rgba(59,130,246,0.22)]"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, rgba(59,130,246,0.88), rgba(14,165,233,0.72), rgba(245,158,11,0.62))",
                        }}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                          {row.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {copy(
                            "Short-form + long-form multi-channel lift",
                            "Tăng trưởng đa kênh từ nội dung ngắn + dài",
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.views}
                  </td>
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      <div className="flex justify-end pt-5">
        <Button variant="link" className="h-auto px-0 text-primary">
          {copy("View All Content", "Xem toàn bộ nội dung")}
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </PanelCard>
  );
}
