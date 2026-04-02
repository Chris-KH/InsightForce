import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/app-section";

const TRENDS = [
  {
    category: "Tech & Climate",
    score: 94,
    title: "Eco-friendly AI Hardware",
    copy: "Your audience is showing a 40% spike in sustainable tech queries alongside local-hosting discussions.",
    pills: ["High Growth", "B2B Focused"],
    active: true,
  },
  {
    category: "Art & Creativity",
    score: 82,
    title: "Generative Sculpting",
    copy: "Emerging interest in 3D-printed AI assets aligns with your Future of Design series.",
    pills: ["Viral Potential"],
    active: false,
  },
  {
    category: "Productivity",
    score: 68,
    title: "Minimalist Automations",
    copy: "Slight overlap with your Solo-Preneur segment looking for low-code solutions.",
    pills: ["Workflow Fit"],
    active: false,
  },
] as const;

export function TrendFeed() {
  return (
    <div className="flex flex-col gap-4">
      {TRENDS.map((trend) => (
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
                  Match Score
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm leading-7 text-muted-foreground">
              {trend.copy}
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
