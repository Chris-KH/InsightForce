import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBilingual } from "@/hooks/use-bilingual";
import { SentimentDonut } from "@/pages/audience/components/SentimentDonut";

const SENTIMENT_BARS = [24, 32, 26, 44, 58, 42, 66];

export function SentimentOverviewGrid() {
  const copy = useBilingual();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                {copy("Overall Sentiment Share", "Tỷ trọng cảm xúc tổng thể")}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {copy(
                  "Audience mood across the last 30 days.",
                  "Sắc thái cảm xúc của khán giả trong 30 ngày gần nhất.",
                )}
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
            >
              {copy("65% Positive", "65% Tích cực")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-muted/20 p-4">
            <SentimentDonut />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                {copy(
                  "Sentiment Over Time",
                  "Biến động cảm xúc theo thời gian",
                )}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {copy("Last 7 days", "7 ngày gần nhất")}
              </p>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
            >
              {copy("Trending Up", "Đang tăng")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-end gap-2 rounded-2xl bg-muted/20 p-4">
            {SENTIMENT_BARS.map((bar, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={
                    index === 6
                      ? "w-full rounded-t-2xl bg-primary"
                      : "w-full rounded-t-2xl bg-primary/70"
                  }
                  style={{ height: `${bar}%` }}
                />
                <span className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {
                    [
                      copy("Mon", "T2"),
                      copy("Tue", "T3"),
                      copy("Wed", "T4"),
                      copy("Thu", "T5"),
                      copy("Fri", "T6"),
                      copy("Sat", "T7"),
                      copy("Sun", "CN"),
                    ][index]
                  }
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
