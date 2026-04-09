import { motion } from "motion/react";
import { Clock3, MoreVertical, PlayCircle, Shield, Wand2 } from "lucide-react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function AgentStatusGrid() {
  const copy = useBilingual();

  const agents = [
    {
      name: copy("Guardian Agent", "Bot Guardian"),
      status: copy("Active", "Đang hoạt động"),
      statusKey: "active" as const,
      icon: Shield,
      reason: copy("Content Integrity", "Toàn vẹn nội dung"),
      progress: 84,
      detail: copy(
        "Analyzing semantic drift in community thread #429 for potential toxic pivot.",
        "Đang phân tích lệch nghĩa trong luồng cộng đồng #429 để phát hiện rủi ro chuyển hướng tiêu cực.",
      ),
      impact: copy(
        "122 actions prevented spam today.",
        "122 hành động đã chặn spam hôm nay.",
      ),
    },
    {
      name: copy("Content Architect", "Thiết kế phân luồng nội dung"),
      status: copy("Active", "Đang hoạt động"),
      statusKey: "active" as const,
      icon: Wand2,
      reason: copy("Campaign Structuring", "Cấu trúc chiến dịch"),
      progress: 32,
      detail: copy(
        "Drafting modular response templates for the next launch based on 2023 engagement data.",
        "Đang xây dựng mẫu phản hồi theo module cho đợt ra mắt tiếp theo dựa trên dữ liệu tương tác 2023.",
      ),
      impact: copy(
        "Generated 4 high-quality campaign drafts.",
        "Đã tạo 4 bản nháp chiến dịch chất lượng cao.",
      ),
    },
    {
      name: copy("Scout Executor", "Scout thực thi"),
      status: copy("Idle", "Tạm nghỉ"),
      statusKey: "idle" as const,
      icon: PlayCircle,
      reason: copy("Waiting for trigger", "Đang chờ kích hoạt"),
      progress: 0,
      detail: copy(
        "Ready to deploy data extraction tasks on the next signal.",
        "Sẵn sàng triển khai tác vụ trích xuất dữ liệu khi có tín hiệu tiếp theo.",
      ),
      impact: copy(
        "Last active: 22 minutes ago.",
        "Hoạt động gần nhất: 22 phút trước.",
      ),
    },
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {agents.map((agent, index) => {
        const Icon = agent.icon;
        const isIdle = agent.statusKey === "idle";

        return (
          <RevealBlock key={agent.name} delay={index * 0.06}>
            <motion.div whileHover={{ y: -3 }}>
              <Card
                className={
                  isIdle
                    ? "relative overflow-hidden rounded-3xl border-border/70 bg-muted/22 shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
                    : "relative overflow-hidden rounded-3xl border-border/70 bg-card/86 shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
                }
              >
                <div className="absolute inset-0">
                  <SurfaceGrid
                    className={isIdle ? "opacity-18" : "opacity-26"}
                  />
                </div>

                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="size-5" />
                        {!isIdle ? (
                          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
                        ) : null}
                      </div>
                      <div>
                        <CardTitle className="font-heading text-[1.6rem] leading-tight font-semibold text-foreground">
                          {agent.name}
                        </CardTitle>
                        <div className="mt-1 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                          <span
                            className={
                              isIdle
                                ? "size-2 rounded-full bg-muted-foreground"
                                : "size-2 rounded-full bg-primary"
                            }
                          />
                          {agent.status}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground"
                    >
                      <MoreVertical />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="relative flex flex-col gap-5">
                  <div className="rounded-2xl border border-border/65 bg-background/75 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {copy("Reasoning", "Lập luận")}: {agent.reason}
                      </span>
                      <span>{agent.progress}%</span>
                    </div>
                    <ProgressBar value={agent.progress} className="h-2.5" />
                  </div>

                  <div className="rounded-2xl border border-border/65 bg-muted/30 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    <strong className="text-foreground">
                      {copy("Live Logic:", "Logic trực tiếp:")}
                    </strong>{" "}
                    {agent.detail}
                  </div>

                  <div className="flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    <Clock3 className="size-4" />
                    <span>{agent.impact}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </RevealBlock>
        );
      })}
    </div>
  );
}
