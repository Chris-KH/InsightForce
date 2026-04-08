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
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-muted px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <motion.div
        className="pointer-events-none absolute top-20 -left-20 size-80 rounded-full bg-primary/10 blur-[120px]"
        animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <motion.div
          className="flex flex-col gap-3 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Cultivate Your Growth
          </motion.h2>
          <motion.p
            className="text-[15px] leading-7 text-muted-foreground sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Plans designed to scale from early shoots to global forests.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3 lg:gap-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{
                y: plan.highlighted ? 0 : -8,
                rotate: plan.highlighted ? 0 : -0.2,
                transition: { duration: 0.3 },
              }}
            >
              <Card
                className={cn(
                  "relative h-full overflow-visible border border-border/70 transition-all",
                  plan.highlighted &&
                    "scale-[1.02] border-primary pt-7 shadow-2xl",
                )}
              >
                {plan.highlighted && (
                  <motion.div
                    className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap text-primary-foreground uppercase shadow-md"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Most Popular
                  </motion.div>
                )}
                {plan.highlighted && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] border border-primary/45"
                    animate={{ opacity: [0.45, 0.15, 0.45] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                  />
                )}
                <CardHeader className="gap-3">
                  <motion.p
                    className="text-xs font-semibold tracking-[0.13em] text-primary uppercase"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    {plan.name}
                  </motion.p>
                  <motion.div
                    className="flex items-end gap-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <p className="font-heading text-[2.8rem] leading-none font-semibold sm:text-5xl">
                      {plan.price}
                    </p>
                    <span className="pb-1 text-muted-foreground">/mo</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardDescription className="leading-6">
                      {plan.subtitle}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.ul
                    className="flex flex-col gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {plan.features.map((feature) => (
                      <motion.li
                        key={feature}
                        className="flex items-center gap-2.5 text-sm leading-6"
                        variants={itemVariants}
                      >
                        <CheckCircle2 className="size-4 text-primary" />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
                <CardFooter>
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="h-12 w-full"
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
