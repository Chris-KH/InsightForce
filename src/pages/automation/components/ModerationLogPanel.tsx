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
      "[09:00:02] Tác vụ viên Guardian đã kết nối.",
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
        "Luồng sự kiện liên tục từ tác vụ viên Guardian.",
      )}
    >
      <div className="rounded-[1.5rem] border border-emerald-900/50 bg-zinc-950 p-5 font-mono text-xs leading-6 text-emerald-400 shadow-[0_14px_28px_rgba(0,0,0,0.4)]">
        <div className="space-y-1">
          {logLines.map((line, index) => (
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
