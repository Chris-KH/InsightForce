import {
  CheckCircle2,
  Edit3,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBilingual } from "@/hooks/use-bilingual";

export function ExecutionPlanCard() {
  const copy = useBilingual();

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20">
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

      <CardContent className="flex min-h-190 flex-col gap-6 px-6 pt-6 pb-7 sm:px-8">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            {copy("Content Topic", "Chủ đề nội dung")}
          </p>
          <h3 className="mt-3 font-heading text-4xl leading-tight font-semibold text-foreground">
            {copy(
              "The Secret Carbon Cost of Your AI: How to Build Greener Workflows",
              "Chi phí carbon ẩn của AI: Cách xây dựng quy trình xanh hơn",
            )}
          </h3>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/25 px-5 py-5">
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

        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            {copy("Body Outline", "Dàn ý nội dung")}
          </p>
          <ol className="mt-4 flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                1
              </span>
              <span>
                <strong className="text-foreground">
                  {copy("The Invisible Impact:", "Tác động vô hình:")}
                </strong>{" "}
                {copy(
                  "Break down the current energy metrics of major data centers versus consumer hardware.",
                  "Phân tích các chỉ số năng lượng hiện tại giữa trung tâm dữ liệu lớn và phần cứng tiêu dùng.",
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                2
              </span>
              <span>
                <strong className="text-foreground">
                  {copy("The Local Revolution:", "Cuộc cách mạng cục bộ:")}
                </strong>{" "}
                {copy(
                  "Showcase the new NPUs from Apple, Intel, and AMD that prioritize efficiency.",
                  "Giới thiệu các NPU mới từ Apple, Intel và AMD ưu tiên hiệu năng trên mỗi watt.",
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                3
              </span>
              <span>
                <strong className="text-foreground">
                  {copy("Step-by-Step Guide:", "Hướng dẫn từng bước:")}
                </strong>{" "}
                {copy(
                  "How to set up LM Studio or Ollama with a focus on undervolting for max efficiency.",
                  "Cách thiết lập LM Studio hoặc Ollama, ưu tiên undervolt để tối đa hiệu quả.",
                )}
              </span>
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/25 px-5 py-5">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background px-5 py-4">
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
          <div className="rounded-2xl border border-border/60 bg-background px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {copy("Estimated Budget", "Ngân sách dự kiến")}
            </p>
            <p className="mt-2 font-heading text-4xl font-semibold text-primary">
              $450.00
            </p>
            <p className="text-xs text-muted-foreground">
              {copy(
                "Includes pre-production and ad spend",
                "Bao gồm tiền kỳ và ngân sách quảng cáo",
              )}
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-center pt-2">
          <Button className="h-12 rounded-full bg-primary px-8 text-primary-foreground">
            {copy("Finalize & Execute Plan", "Chốt & Triển khai kế hoạch")}
            <Rocket data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
