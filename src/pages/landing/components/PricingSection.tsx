import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRICING_TIERS, TESTIMONIALS } from "../data";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const priceRows = useMemo(
    () =>
      PRICING_TIERS.map((tier) => {
        if (tier.monthly === null) {
          return {
            name: tier.name,
            displayPrice: "Custom",
            period: "",
            savingsText: "",
          };
        }

        const selected =
          annualBilling && tier.annual !== null ? tier.annual : tier.monthly;
        const savings =
          annualBilling && tier.annual !== null
            ? Math.round(((tier.monthly - tier.annual) / tier.monthly) * 100)
            : 0;

        return {
          name: tier.name,
          displayPrice: `$${selected}`,
          period: "/mo",
          savingsText: savings > 0 ? `Save ${savings}% with annual` : "",
        };
      }),
    [annualBilling],
  );

  return (
    <section
      id="pricing"
      className="bg-background/72 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            Pricing
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            Pick the plan that fits your creator growth stage
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Start with a focused setup and expand into multi-market
            orchestration as your campaigns scale.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-border/70 bg-card/65 p-1">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annualBilling
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                annualBilling
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              Annual
            </button>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => {
            const priceMeta = priceRows[index];

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: tier.highlighted ? 0 : -5 }}
              >
                <Card
                  className={cn(
                    "relative h-full border-border/70 bg-card/70",
                    tier.highlighted &&
                      "scale-[1.01] border-primary shadow-2xl",
                  )}
                >
                  {tier.highlighted && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary-foreground uppercase">
                      Most Popular
                    </span>
                  )}

                  <CardHeader>
                    <p className="text-xs font-semibold tracking-[0.13em] text-primary uppercase">
                      {tier.name}
                    </p>
                    <CardTitle className="font-heading text-4xl leading-none sm:text-5xl">
                      {priceMeta.displayPrice}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        {priceMeta.period}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {tier.description}
                    </CardDescription>
                    {priceMeta.savingsText && (
                      <p className="text-xs font-semibold tracking-[0.11em] text-primary uppercase">
                        {priceMeta.savingsText}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6"
                        >
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant={tier.highlighted ? "default" : "outline"}
                      className="h-11 w-full"
                    >
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Card className="h-full border-border/65 bg-card/68">
                <CardContent className="space-y-3 px-4 py-4">
                  <p className="text-sm leading-6 text-foreground/90">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                    {testimonial.keyResult}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
