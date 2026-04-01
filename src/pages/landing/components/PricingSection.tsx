import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "../data";

export function PricingSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            Cultivate Your Growth
          </h2>
          <p className="text-[15px] leading-7 text-muted-foreground sm:text-base">
            Plans designed to scale from early shoots to global forests.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-7">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-visible border border-border/70",
                plan.highlighted &&
                  "scale-[1.02] border-primary pt-7 shadow-2xl",
              )}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap text-primary-foreground uppercase shadow-md">
                  Most Popular
                </div>
              )}
              <CardHeader className="gap-3">
                <p className="text-xs font-semibold tracking-[0.13em] text-primary uppercase">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <p className="font-heading text-[2.8rem] leading-none font-semibold sm:text-5xl">
                    {plan.price}
                  </p>
                  <span className="pb-1 text-muted-foreground">/mo</span>
                </div>
                <CardDescription className="leading-6">
                  {plan.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm leading-6"
                    >
                      <CheckCircle2 className="size-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="h-12 w-full"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
