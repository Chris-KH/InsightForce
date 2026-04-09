import { Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function ReasoningTracePanel() {
  const copy = useBilingual();

  return (
    <PanelCard
      title={copy("Reasoning Trace Viewer", "Trình xem chuỗi lập luận")}
      description={copy(
        "Context-aware moderation flow from raw signal to action.",
        "Luồng kiểm duyệt theo ngữ cảnh từ tín hiệu thô đến hành động.",
      )}
      action={
        <Badge
          variant="outline"
          className="rounded-full border-primary/20 text-primary"
        >
          {copy(
            "Focused: Guardian Action @14:24:10",
            "Tiêu điểm: Hành động Guardian @14:24:10",
          )}
        </Badge>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-4">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            <TriangleAlert className="size-3.5" />
            {copy("Input Signal Extraction", "Trích xuất tín hiệu đầu vào")}
          </p>
          <p className="mt-3 rounded-2xl bg-background px-4 py-4 text-sm leading-7 text-muted-foreground">
            {copy(
              '"The user @user_92 posted: \"This project is absolute trash, you should all quit.\" in Thread #81."',
              '"Người dùng @user_92 đã đăng: \"Dự án này quá tệ, mọi người nên nghỉ hết đi.\" trong luồng #81."',
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background px-4 py-4">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            {copy("Chain of Thought Analysis", "Phân tích chuỗi lập luận")}
          </p>
          <ol className="mt-4 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">1.</strong>{" "}
              {copy(
                "Identity Check: user_92 is an unverified account created 2 hours ago.",
                "Kiểm tra danh tính: user_92 là tài khoản chưa xác minh, tạo cách đây 2 giờ.",
              )}
            </li>
            <li>
              <strong className="text-foreground">2.</strong>{" "}
              {copy(
                "Semantic Check: keywords imply abusive language and a direct threat to community morale.",
                "Kiểm tra ngữ nghĩa: từ khóa cho thấy ngôn ngữ lăng mạ và đe dọa trực tiếp tinh thần cộng đồng.",
              )}
            </li>
            <li>
              <strong className="text-foreground">3.</strong>{" "}
              {copy(
                "Context Check: thread #81 uses strict moderation settings and has prior reports.",
                "Kiểm tra ngữ cảnh: luồng #81 dùng cấu hình kiểm duyệt nghiêm ngặt và đã có báo cáo trước đó.",
              )}
            </li>
            <li>
              <strong className="text-foreground">4.</strong>{" "}
              {copy(
                "Synthesis: content violates policy and should be removed immediately.",
                "Tổng hợp: nội dung vi phạm chính sách và cần được gỡ ngay lập tức.",
              )}
            </li>
          </ol>
        </div>
      </div>
    </PanelCard>
  );
}
