import { motion } from "motion/react";
import {
  CheckCircle2,
  Edit3,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";

import {
  FloatingOrb,
  RevealBlock,
  SurfaceGrid,
} from "@/components/app-futuristic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBilingual } from "@/hooks/use-bilingual";

export function ExecutionPlanCard() {
  const copy = useBilingual();

  const outlineItems = [
    {
      key: "impact",
      title: copy("The Invisible Impact:", "Tác động vô hình:"),
      description: copy(
        "Break down the current energy metrics of major data centers versus consumer hardware.",
        "Phân tích các chỉ số năng lượng hiện tại giữa trung tâm dữ liệu lớn và phần cứng tiêu dùng.",
      ),
    },
    {
      key: "revolution",
      title: copy("The Local Revolution:", "Cuộc cách mạng cục bộ:"),
      description: copy(
        "Showcase the new NPUs from Apple, Intel, and AMD that prioritize efficiency.",
        "Giới thiệu các NPU mới từ Apple, Intel và AMD ưu tiên hiệu năng trên mỗi watt.",
      ),
    },
    {
      key: "guide",
      title: copy("Step-by-Step Guide:", "Hướng dẫn từng bước:"),
      description: copy(
        "How to set up LM Studio or Ollama with a focus on undervolting for max efficiency.",
        "Cách thiết lập LM Studio hoặc Ollama, ưu tiên undervolt để tối đa hiệu quả.",
      ),
    },
  ] as const;

  return (
    <Card className="relative overflow-hidden rounded-3xl border-border/70 bg-card/88 shadow-[0_22px_44px_rgba(15,23,42,0.1)]">
      <div className="absolute inset-0">
        <SurfaceGrid className="opacity-25" />
        <FloatingOrb className="-top-28 -right-20 size-52 bg-primary/15" />
        <FloatingOrb
          className="-bottom-28 -left-20 size-52 bg-chart-2/14"
          duration={10}
          delay={0.35}
        />
      </div>

      <CardHeader className="relative border-b border-border/50 bg-muted/18">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-3xl leading-tight font-semibold text-foreground">
              {copy("Draft Execution Plan", "Bản nháp kế hoạch triển khai")}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy(
                "Focus: Eco-friendly AI Hardware (v1.2)",
                "Trọng tâm: Phần cứng AI thân thiện môi trường (v1.2)",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="icon-sm">
              <RefreshCw />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Share2 />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex min-h-190 flex-col gap-6 px-6 pt-6 pb-7 sm:px-8">
        <RevealBlock>
          <div className="relative overflow-hidden rounded-2xl border border-primary/28 bg-linear-to-br from-primary/12 via-primary/7 to-chart-3/12 px-5 py-5">
            <FloatingOrb
              className="-top-14 -right-10 size-36 bg-primary/20"
              duration={9}
            />
            <p className="relative text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              {copy("Content Topic", "Chủ đề nội dung")}
            </p>
            <h3 className="relative mt-3 font-heading text-4xl leading-tight font-semibold text-foreground">
              {copy(
                "The Secret Carbon Cost of Your AI: How to Build Greener Workflows",
                "Chi phí carbon ẩn của AI: Cách xây dựng quy trình xanh hơn",
              )}
            </h3>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.05}>
          <div className="rounded-2xl border border-border/65 bg-muted/25 px-5 py-5">
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              <Sparkles className="size-3.5" />
              {copy("The Hook", "Điểm móc")}
            </div>
            <p className="text-sm leading-7 text-muted-foreground italic">
              {copy(
                '"Every prompt you send to a cloud-based LLM has a water and carbon footprint equivalent to a bottle of water. But what if you could run a 70B parameter model locally on 100% solar power?"',
                '"Mỗi prompt gửi đến LLM chạy trên cloud đều có dấu chân nước và carbon tương đương một chai nước. Nhưng nếu bạn có thể chạy mô hình 70B tham số cục bộ bằng 100% năng lượng mặt trời thì sao?"',
              )}
            </p>
          </div>
        </RevealBlock>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            {copy("Body Outline", "Dàn ý nội dung")}
          </p>
          <ol className="mt-4 flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
            {outlineItems.map((item, index) => (
              <RevealBlock key={item.key} delay={0.08 + index * 0.05}>
                <li className="rounded-2xl border border-border/65 bg-background/82 px-4 py-3.5 shadow-[0_10px_22px_rgba(15,23,42,0.07)]">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span>
                      <strong className="text-foreground">{item.title}</strong>{" "}
                      {item.description}
                    </span>
                  </div>
                </li>
              </RevealBlock>
            ))}
          </ol>
        </div>

        <RevealBlock delay={0.2}>
          <div className="rounded-2xl border border-border/65 bg-muted/25 px-5 py-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {copy("CTA (Call to Action)", "CTA (Kêu gọi hành động)")}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {copy(
                '"Download my Green AI hardware checklist and see which 2024 laptop is best for local inference. Link in bio."',
                '"Tải checklist phần cứng Green AI của mình và xem laptop 2024 nào phù hợp nhất cho suy luận cục bộ. Link trong bio."',
              )}
            </p>
          </div>
        </RevealBlock>

        <div className="grid gap-4 sm:grid-cols-2">
          <RevealBlock delay={0.24}>
            <div className="rounded-2xl border border-border/65 bg-background/82 px-5 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.07)]">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {copy("Resource Allocation", "Phân bổ nguồn lực")}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Edit3 className="size-4" />
                  {copy("Editor", "Biên tập") + " @Elena_VFX"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  {copy("Thumbnails", "Thumbnail") + " @Arto_Design"}
                </span>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock delay={0.28}>
            <div className="relative overflow-hidden rounded-2xl border border-border/65 bg-background/82 px-5 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.07)]">
              <div className="absolute -top-10 -right-10 size-28 rounded-full bg-primary/14 blur-2xl" />
              <p className="relative text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {copy("Estimated Budget", "Ngân sách dự kiến")}
              </p>
              <p className="relative mt-2 font-heading text-4xl font-semibold text-primary">
                $450.00
              </p>
              <p className="relative text-xs text-muted-foreground">
                {copy(
                  "Includes pre-production and ad spend",
                  "Bao gồm tiền kỳ và ngân sách quảng cáo",
                )}
              </p>
            </div>
          </RevealBlock>
        </div>

        <RevealBlock delay={0.34} className="mt-auto flex justify-center pt-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="h-12 rounded-full bg-primary px-8 text-primary-foreground shadow-[0_10px_26px_rgba(37,99,235,0.32)]">
              {copy("Finalize & Execute Plan", "Chốt & Triển khai kế hoạch")}
              <Rocket data-icon="inline-end" />
            </Button>
          </motion.div>
        </RevealBlock>
      </CardContent>
    </Card>
  );
}
