import { CircleGauge, Shield, Star, Target, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const BARS = [34, 50, 78, 64, 94, 100];

export function RegisterSidebar() {
  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
      <Card className="rounded-3xl border border-border/80 bg-card">
        <CardContent className="flex flex-col gap-5 px-6 pt-6 pb-7">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-4 fill-current" />
            ))}
          </div>

          <p className="text-[1.03rem] leading-9 text-muted-foreground italic">
            "InsightForge predicted my niche&apos;s pivot three months before it
            happened. My revenue doubled without increasing my upload
            frequency."
          </p>

          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5jB5ub8HvouQ_MA787yJqdbAvPn22CkbOxIbsBAmspNj5MUcwLe5eoTI0nIBiHN8Ww7nJHmdDA0C9xiRAJaepDyhQXqjWQuUIX-rMxRZ_242IbdAbXsdF5E_3vEJG3En7yA9qRxFs5OMOxxkDVFGfWbaAobzOU-pBvKQf41ox2-q_oPmNd3xrl6OkRGx9ph0PmbrHHOjm46kjqghvuv4BjOzsMiDib7R1n7X-zQXNxTGExktnlJ9Ll2JFwYYtc5ahLUZmVT3WiR4F"
              alt="Marcus Chen"
              className="size-11 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Marcus Chen</p>
              <p className="text-sm text-muted-foreground">
                Tech Reviewer (1.2M Subs)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-primary text-primary-foreground shadow-lg">
        <CardContent className="relative flex flex-col gap-4 px-6 pt-7 pb-6">
          <CircleGauge className="absolute top-4 right-4 size-12 text-primary-foreground/25" />
          <h3 className="font-heading text-[2rem] leading-none font-semibold">
            Predictive Revenue
          </h3>

          <div className="mt-2 flex h-28 items-end gap-2">
            {BARS.map((bar, index) => (
              <div
                key={index}
                className={
                  index === BARS.length - 1
                    ? "w-full rounded-t-md bg-amber-200/55"
                    : "w-full rounded-t-md bg-primary-foreground/35"
                }
                style={{ height: `${bar}%` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-lg">
            <span>Growth Projection</span>
            <span className="text-4xl font-semibold">+42%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
        <CardContent className="flex flex-col gap-6 px-6 pt-7 pb-7">
          <h3 className="font-heading text-[2rem] leading-none font-semibold">
            Why InsightForge?
          </h3>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-xl font-semibold">Neural Sentiment</p>
                <p className="text-sm text-muted-foreground">
                  Deep analysis of audience emotional drivers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Target className="size-4" />
              </div>
              <div>
                <p className="text-xl font-semibold">24/7 Strategy</p>
                <p className="text-sm text-muted-foreground">
                  Real-time adjustments to your content calendar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-xl font-semibold">Brand Guardian</p>
                <p className="text-sm text-muted-foreground">
                  Proactive risk monitoring for your reputation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
