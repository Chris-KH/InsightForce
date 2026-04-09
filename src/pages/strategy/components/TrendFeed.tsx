import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function TrendFeed() {
  const copy = useBilingual();

  const trends = [
    {
      category: copy("Tech & Climate", "Công nghệ & Khí hậu"),
      score: 94,
      title: copy(
        "Eco-friendly AI Hardware",
        "Phần cứng AI thân thiện môi trường",
      ),
      description: copy(
        "Your audience is showing a 40% spike in sustainable tech queries alongside local-hosting discussions.",
        "Khán giả của bạn đang tăng 40% truy vấn về công nghệ bền vững cùng các thảo luận về self-host cục bộ.",
      ),
      pills: [
        copy("High Growth", "Tăng trưởng cao"),
        copy("B2B Focused", "Tập trung B2B"),
      ],
      active: true,
    },
    {
      category: copy("Art & Creativity", "Nghệ thuật & Sáng tạo"),
      score: 82,
      title: copy("Generative Sculpting", "Điêu khắc tạo sinh"),
      description: copy(
        "Emerging interest in 3D-printed AI assets aligns with your Future of Design series.",
        "Mối quan tâm mới với tài sản AI in 3D phù hợp với series Future of Design của bạn.",
      ),
      pills: [copy("Viral Potential", "Tiềm năng lan truyền")],
      active: false,
    },
    {
      category: copy("Productivity", "Năng suất"),
      score: 68,
      title: copy("Minimalist Automations", "Tự động hóa tối giản"),
      description: copy(
        "Slight overlap with your Solo-Preneur segment looking for low-code solutions.",
        "Có mức giao thoa nhẹ với nhóm Solo-Preneur đang tìm kiếm giải pháp low-code.",
      ),
      pills: [copy("Workflow Fit", "Phù hợp quy trình")],
      active: false,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      {trends.map((trend) => (
        <Card
          key={trend.title}
          className={
            trend.active
              ? "rounded-3xl border-primary/30 bg-card shadow-sm"
              : "rounded-3xl border-border/60 shadow-sm"
          }
        >
          <CardHeader
            className={
              trend.active
                ? "border-l-4 border-l-primary pb-4"
                : "border-l-4 border-l-transparent pb-4"
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                  {trend.category}
                </p>
                <CardTitle className="mt-2 font-heading text-3xl leading-tight font-semibold text-foreground">
                  {trend.title}
                </CardTitle>
              </div>
              <div className="text-right">
                <p className="font-heading text-4xl font-semibold text-primary">
                  {trend.score}%
                </p>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  {copy("Match Score", "Điểm phù hợp")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm leading-7 text-muted-foreground">
              {trend.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {trend.pills.map((pill) => (
                <Badge
                  key={pill}
                  variant="outline"
                  className="rounded-full border-border/70 bg-background text-muted-foreground"
                >
                  {pill}
                </Badge>
              ))}
            </div>
            <ProgressBar value={trend.score} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
