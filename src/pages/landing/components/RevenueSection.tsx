import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function ExecutiveProjectionsSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-foreground to-foreground/95 px-4 py-16 text-background sm:px-6 sm:py-20 lg:px-8 lg:py-24 dark:from-background dark:to-background dark:text-foreground">
      <motion.div
        className="pointer-events-none absolute -top-16 -right-24 size-96 rounded-full bg-primary/15 blur-[120px]"
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <motion.div
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="flex max-w-3xl flex-col gap-4"
            variants={containerVariants}
          >
            <motion.h2
              className="font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]"
              variants={itemVariants}
            >
              Executive Intelligence Projections
            </motion.h2>
            <motion.p
              className="text-[15px] leading-7 text-background/75 sm:text-base dark:text-muted-foreground"
              variants={itemVariants}
            >
              The Scout & Executor agent doesn&apos;t just run campaigns; it
              calculates future outcomes. See your revenue trajectory before you
              spend a single dollar on production.
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="h-12 w-fit bg-primary px-7 text-primary-foreground hover:bg-primary/80">
                Unlock Premium Projections
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-[0.9fr_2.1fr]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-white/10 bg-white/5 text-background backdrop-blur-sm dark:border-border dark:bg-card/50 dark:text-foreground">
              <CardHeader>
                <CardTitle className="font-heading text-[2.4rem] leading-none text-chart-1">
                  $4.2M
                </CardTitle>
                <CardDescription className="tracking-[0.12em] text-background/70 uppercase dark:text-muted-foreground">
                  Projected Creator ARR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-20 items-end gap-1.5">
                  {[40, 62, 48, 90, 76, 96].map((height, index) => (
                    <motion.div
                      key={height}
                      className="w-2 rounded-full bg-chart-1/80 dark:bg-chart-1"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        duration: 0.8,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-chart-1/90 dark:text-muted-foreground">
                  Scout Confidence: 94.2%
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-white/10 bg-white/5 text-background backdrop-blur-sm dark:border-border dark:bg-card/50 dark:text-foreground">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Audience Retention Forecast</CardTitle>
                  <div className="flex items-center gap-4 text-xs dark:text-foreground/80">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-primary" />
                      Retention
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-destructive" />
                      Risk
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-56 border-b border-white/10 pb-3 dark:border-border/40">
                  <motion.svg
                    viewBox="0 0 420 120"
                    className="size-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.path
                      d="M0 95 Q52 12 104 86 T210 62 T318 35 T420 70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-primary"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.6,
                        duration: 1.5,
                      }}
                    />
                    <motion.circle
                      cx="104"
                      cy="86"
                      r="5"
                      className="fill-background stroke-primary dark:fill-card"
                      strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 0.5 }}
                    />
                    <motion.circle
                      cx="318"
                      cy="35"
                      r="5"
                      className="fill-background stroke-primary dark:fill-card"
                      strokeWidth="2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    />
                  </motion.svg>
                </div>
                <motion.div
                  className="mt-4 grid grid-cols-4 text-center text-[11px] tracking-[0.12em] text-background/70 uppercase dark:text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <span>Phase 1: Deployment</span>
                  <span>Phase 2: Scaling</span>
                  <span>Phase 3: Optimization</span>
                  <span>Phase 4: Domination</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
