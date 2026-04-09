import { Clock3, MoreVertical, PlayCircle, Shield, Wand2 } from "lucide-react";

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
      {agents.map((agent) => {
        const Icon = agent.icon;
        const isIdle = agent.statusKey === "idle";

        return (
          <Card
            key={agent.name}
            className={
              isIdle
                ? "rounded-3xl border-border/60 bg-muted/20 opacity-80 shadow-sm"
                : "rounded-3xl border-border/60 shadow-sm"
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
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
            <CardContent className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {copy("Reasoning", "Lập luận")}: {agent.reason}
                  </span>
                  <span>{agent.progress}%</span>
                </div>
                <ProgressBar value={agent.progress} />
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-4 text-sm leading-7 text-muted-foreground">
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
        );
      })}
    </div>
  );
}
