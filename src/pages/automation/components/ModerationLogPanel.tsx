import { motion } from "motion/react";

import { RevealBlock } from "@/components/app-futuristic";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function ModerationLogPanel() {
  const copy = useBilingual();

  const logLines = [
    copy(
      "[09:00:01] System boot sequence initiated...",
      "[09:00:01] Khởi động chuỗi hệ thống...",
    ),
    copy(
      "[09:00:02] Guardian Agent connected.",
      "[09:00:02] Bot Guardian đã kết nối.",
    ),
    copy(
      "[14:21:04] INFO: Scanning message #A92-F1.",
      "[14:21:04] INFO: Đang quét tin nhắn #A92-F1.",
    ),
    copy(
      "[14:21:05] WARN: Potential spam pattern detected in link.",
      "[14:21:05] WARN: Phát hiện mẫu spam tiềm ẩn trong liên kết.",
    ),
    copy(
      "[14:21:06] ACTION: Removed link [bit.ly/xxxx].",
      "[14:21:06] ACTION: Đã gỡ liên kết [bit.ly/xxxx].",
    ),
    copy(
      "[14:22:12] INFO: Sentiment analysis: Neutral.",
      "[14:22:12] INFO: Phân tích cảm xúc: Trung tính.",
    ),
    copy(
      "[14:23:45] INFO: Monitoring user @user_92.",
      "[14:23:45] INFO: Đang theo dõi người dùng @user_92.",
    ),
    copy(
      "[14:24:10] ACTION: Flagged toxic comment [violates p1.2].",
      "[14:24:10] ACTION: Đánh dấu bình luận độc hại [vi phạm p1.2].",
    ),
  ] as const;

  return (
    <PanelCard
      title={copy("Live Moderation Log", "Nhật ký kiểm duyệt trực tiếp")}
      description={copy(
        "A rolling event stream from the Guardian agent.",
        "Luồng sự kiện liên tục từ bot Guardian.",
      )}
    >
      <RevealBlock>
        <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-500/30 bg-linear-to-br from-emerald-50 via-emerald-100/50 to-background p-5 font-mono text-xs leading-6 text-emerald-800 shadow-[0_16px_30px_rgba(4,120,87,0.18)] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-emerald-300 dark:shadow-[0_16px_30px_rgba(2,6,23,0.45)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(16,185,129,0.08)_0px,rgba(16,185,129,0.08)_1px,transparent_1px,transparent_4px)] opacity-35 dark:opacity-25" />
            <motion.div
              className="absolute left-0 h-20 w-full bg-linear-to-b from-transparent via-emerald-500/18 to-transparent dark:via-emerald-400/15"
              animate={{ y: [0, 260, 0] }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              }}
            />
          </div>

          <div className="relative flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">
              {copy("Guardian Stream", "Luồng Guardian")}
            </p>
            <p className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase">
              LIVE
            </p>
          </div>

          <div className="relative mt-3 flex flex-col gap-1">
            {logLines.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={
                  index === 4 || index === 7
                    ? "text-destructive dark:text-red-300"
                    : "text-emerald-800 dark:text-emerald-300"
                }
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="relative mt-3 border-t border-emerald-500/30 pt-2 text-emerald-900 dark:text-emerald-200">
            <span>&gt; guardian_monitor --watch live</span>
            <motion.span
              className="ml-1 inline-block h-3 w-1 bg-current align-middle"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </div>
      </RevealBlock>
    </PanelCard>
  );
}
