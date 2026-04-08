import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HERO_IMAGE, TRUSTED_AVATARS } from "../data";
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-18 sm:px-6 sm:pt-14 sm:pb-22 lg:px-8 lg:pt-18 lg:pb-28">
      <motion.div
        className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-[100px]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -left-24 size-125 rounded-full bg-chart-1/20 blur-[120px]"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="z-20 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col gap-8"
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[10px] leading-none font-semibold tracking-[0.15em] text-primary uppercase sm:text-xs"
            variants={itemVariants}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(var(--color-primary), 0.2)",
            }}
          >
            Next-Gen Agentic Intelligence for High-Impact Creators
          </motion.div>

          <motion.div
            className="flex flex-col gap-5"
            variants={containerVariants}
          >
            <motion.h1
              className="font-heading text-[2.5rem] leading-[0.98] font-semibold tracking-tight text-foreground sm:text-[3.35rem] lg:text-[4.8rem]"
              variants={itemVariants}
            >
              The{" "}
              <span className="text-primary italic">Agentic Revolution</span>{" "}
              Rooted in Human Intuition
            </motion.h1>
            <motion.p
              className="max-w-[60ch] text-[15px] leading-7 text-muted-foreground sm:text-lg"
              variants={itemVariants}
            >
              Move beyond simple automation. Deploy autonomous AI agents that
              protect your brand, architect your content, and execute your
              strategy with surgical precision.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="lg" className="h-12 px-8 text-[15px] font-semibold">
                Summon Your Agents
              </Button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-[15px] font-semibold"
              >
                View the Forge in Action
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            variants={itemVariants}
          >
            <motion.div className="flex">
              {TRUSTED_AVATARS.map((avatar, index) => (
                <motion.img
                  key={avatar}
                  src={avatar}
                  alt="Team member avatar"
                  className={cn(
                    "size-9 rounded-full border-2 border-background object-cover sm:size-10",
                    index !== 0 && "-ml-2",
                  )}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.15 }}
                />
              ))}
            </motion.div>
            <motion.p
              className="text-sm leading-6 text-muted-foreground"
              variants={itemVariants}
            >
              Trusted by 2,000+ top-tier creative agencies
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rotate-4 rounded-2xl bg-primary/15"
            animate={{ rotate: [4, 6, 4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            whileHover={{ y: -10, rotate: -0.4 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden rounded-2xl border border-border/70 p-0 shadow-2xl">
              <motion.img
                src={HERO_IMAGE}
                alt="Analytics dashboard overview"
                className="h-85 w-full object-cover sm:h-105"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-background/12 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="absolute right-4 bottom-4 left-4 gap-3 rounded-xl border border-border/60 bg-background/80 py-5 backdrop-blur-md sm:right-5 sm:bottom-5 sm:left-5">
                  <CardContent className="flex flex-col gap-3 px-4">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                      <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
                      <span>Guardian Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-chart-1">
                      <span className="inline-block size-2 animate-pulse rounded-full bg-chart-1" />
                      <span>Architect Planning</span>
                    </div>
                  </CardContent>
                  <Separator className="my-0" />
                  <CardHeader className="px-4 py-3 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">
                        Agent Influence Score
                      </CardTitle>
                      <p className="text-sm font-semibold text-primary">
                        +24.8% Reach
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex h-12 items-end gap-1.5 sm:h-14 lg:h-16">
                      {[30, 45, 40, 65, 92, 78].map((height, index) => (
                        <motion.div
                          key={`${height}-${index}`}
                          className="w-full rounded-sm bg-primary/70"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.7 + index * 0.08,
                            duration: 0.45,
                          }}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
