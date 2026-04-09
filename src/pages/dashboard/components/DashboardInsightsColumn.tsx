import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function DashboardInsightsColumn() {
  const copy = useBilingual();

  return (
    <aside className="flex flex-col gap-6">
      <RevealBlock>
        <Card className="relative overflow-hidden rounded-3xl border border-amber-300/65 bg-linear-to-br from-amber-100/88 via-amber-50/72 to-card/88 shadow-[0_22px_44px_rgba(180,83,9,0.16)] dark:border-amber-300/20 dark:from-amber-300/12 dark:via-card/92 dark:to-card/86 dark:shadow-[0_22px_46px_rgba(2,6,23,0.35)]">
          <div className="absolute inset-0">
            <SurfaceGrid className="opacity-20 dark:opacity-14" />
          </div>

          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                {copy("AI Strategy", "Chiến lược AI")}
              </CardTitle>
              <Sparkles className="size-5 text-primary" />
            </div>
          </CardHeader>

          <CardContent className="relative flex flex-col gap-4">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-amber-500/35 bg-background/80 text-amber-700 dark:text-amber-300"
            >
              {copy("Action Required", "Cần xử lý")}
            </Badge>

            <p className="text-sm leading-7 text-foreground/85">
              {copy(
                "Scout Agent wants to launch a $50 ad campaign for",
                "Bot Scout muốn triển khai chiến dịch quảng cáo $50 cho",
              )}{" "}
              <strong>{copy("Spring Gear Review", "Đánh giá đồ xuân")}</strong>.
            </p>

            <div className="flex gap-3">
              <motion.div className="flex-1" whileHover={{ y: -2 }}>
                <Button className="w-full rounded-full bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(59,130,246,0.3)]">
                  {copy("Approve", "Duyệt")}
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ y: -2 }}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-border/70 bg-background/85"
                >
                  {copy("Reject", "Từ chối")}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </RevealBlock>

      <RevealBlock delay={0.05}>
        <PanelCard
          className="overflow-hidden"
          title={copy("Optimization Tip", "Gợi ý tối ưu")}
          description={copy(
            "AI suggestions to improve retention and watch depth.",
            "Gợi ý từ AI để cải thiện giữ chân và độ sâu theo dõi.",
          )}
        >
          <div className="relative flex flex-col gap-5">
            <SurfaceGrid className="opacity-20" />

            <div className="relative rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-sm leading-7 text-muted-foreground">
              {copy("Your audience loves the", "Khách hàng của bạn rất thích")}{" "}
              <span className="font-medium text-primary">
                {copy('"behind-the-scenes"', '"hậu trường"')}
              </span>{" "}
              {copy(
                "segments. Consider adding one more in your next video to increase retention.",
                "trong video. Hãy thêm một phân đoạn nữa ở video kế tiếp để tăng tỷ lệ giữ chân.",
              )}
            </div>

            <Button
              variant="outline"
              className="relative rounded-full bg-background/85"
            >
              {copy("View Full Report", "Xem báo cáo đầy đủ")}
            </Button>
          </div>
        </PanelCard>
      </RevealBlock>

      <RevealBlock delay={0.1}>
        <PanelCard
          title={copy("Guardian Status", "Trạng thái Guardian")}
          description={copy(
            "Spam and sentiment protection across the channel.",
            "Bảo vệ spam và cảm xúc trên toàn bộ kênh.",
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {copy("Spam hidden", "Spam đã ẩn")}
              </span>
              <span className="font-semibold text-foreground">124</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "76%" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-linear-to-r from-primary to-chart-2"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {copy(
                "Active protection over comments and mentions.",
                "Bảo vệ chủ động cho bình luận và lượt nhắc tên.",
              )}
            </p>
          </div>
        </PanelCard>
      </RevealBlock>

      <RevealBlock delay={0.15}>
        <Card className="overflow-hidden rounded-3xl border border-border/65 shadow-[0_20px_40px_rgba(51,65,85,0.13)] dark:shadow-[0_22px_45px_rgba(2,6,23,0.4)]">
          <div
            className="relative min-h-56 overflow-hidden p-6 text-background"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(15,23,42,0.84) 0%, rgba(51,65,85,0.48) 45%, rgba(30,64,175,0.56) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_40%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-background/70 uppercase">
                  {copy("Next Milestone", "Cột mốc tiếp theo")}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold">
                  {copy("Reach 10k Subs", "Đạt 10k đăng ký")}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-background/20">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "72%" }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                    className="h-full rounded-full bg-background"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-background/80">
                  <span>72%</span>
                  <span>
                    {copy("Projected this month", "Dự kiến tháng này")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </RevealBlock>
    </aside>
  );
}
