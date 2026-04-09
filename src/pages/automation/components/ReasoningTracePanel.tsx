import { motion } from "motion/react";
import { Sparkles, TriangleAlert } from "lucide-react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";

export function ReasoningTracePanel() {
  const copy = useBilingual();

  const reasoningSteps = [
    copy(
      "Identity Check: user_92 is an unverified account created 2 hours ago.",
      "Kiểm tra danh tính: user_92 là tài khoản chưa xác minh, tạo cách đây 2 giờ.",
    ),
    copy(
      "Semantic Check: keywords imply abusive language and a direct threat to community morale.",
      "Kiểm tra ngữ nghĩa: từ khóa cho thấy ngôn ngữ lăng mạ và đe dọa trực tiếp tinh thần cộng đồng.",
    ),
    copy(
      "Context Check: thread #81 uses strict moderation settings and has prior reports.",
      "Kiểm tra ngữ cảnh: luồng #81 dùng cấu hình kiểm duyệt nghiêm ngặt và đã có báo cáo trước đó.",
    ),
    copy(
      "Synthesis: content violates policy and should be removed immediately.",
      "Tổng hợp: nội dung vi phạm chính sách và cần được gỡ ngay lập tức.",
    ),
  ] as const;

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
          className="rounded-full border-primary/20 bg-background/80 text-primary"
        >
          {copy(
            "Focused: Guardian Action @14:24:10",
            "Tiêu điểm: Hành động Guardian @14:24:10",
          )}
        </Badge>
      }
    >
      <div className="flex flex-col gap-5">
        <RevealBlock>
          <div className="relative overflow-hidden rounded-2xl border border-border/65 bg-muted/30 px-4 py-4">
            <SurfaceGrid className="opacity-24" />
            <p className="relative inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              <TriangleAlert className="size-3.5" />
              {copy("Input Signal Extraction", "Trích xuất tín hiệu đầu vào")}
            </p>
            <p className="relative mt-3 rounded-2xl border border-border/65 bg-background/80 px-4 py-4 text-sm leading-7 text-muted-foreground">
              {copy(
                '"The user @user_92 posted: \"This project is absolute trash, you should all quit.\" in Thread #81."',
                '"Người dùng @user_92 đã đăng: \"Dự án này quá tệ, mọi người nên nghỉ hết đi.\" trong luồng #81."',
              )}
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.08}>
          <div className="rounded-2xl border border-border/65 bg-background/82 px-4 py-4">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              <Sparkles className="size-3.5" />
              {copy("Chain of Thought Analysis", "Phân tích chuỗi lập luận")}
            </p>

            <ol className="relative mt-4 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
              <div
                aria-hidden
                className="absolute top-2 left-3 h-[calc(100%-1rem)] w-px bg-border/80"
              />

              {reasoningSteps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="relative rounded-xl border border-border/60 bg-muted/25 px-3.5 py-2.5"
                >
                  <span className="absolute top-3 -left-[0.39rem] size-2.5 rounded-full border border-primary/25 bg-primary" />
                  <strong className="mr-1 text-foreground">{index + 1}.</strong>
                  {step}
                </motion.li>
              ))}
            </ol>
          </div>
        </RevealBlock>
      </div>
    </PanelCard>
  );
}
