import { Card } from "@/components/ui/card";
import { HEATMAP_IMAGE } from "../data";
import { motion } from "motion/react";

export function GuardianWatchSection() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col gap-3 text-center"
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
            The Guardian&apos;s Watch
          </motion.h2>
          <motion.p
            className="text-[15px] leading-7 text-muted-foreground sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Psychological Guardian agent maps the world&apos;s emotional
            terrain. Layer cultural nuance over raw data to find where your
            message resonates deepest.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -4 }}
        >
          <Card className="relative overflow-hidden rounded-2xl border border-border/50 p-0">
            <motion.img
              src={HEATMAP_IMAGE}
              alt="World heatmap visualization"
              className="h-95 w-full object-cover grayscale sm:h-125"
              loading="lazy"
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-background/20 via-transparent to-background/35"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.div
              className="absolute top-[30%] left-8 size-24 rounded-full bg-primary/35 blur-3xl"
              animate={{
                x: [0, 10, 0],
                y: [0, 15, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.75, 0.4],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-[22%] right-[18%] size-32 rounded-full bg-chart-1/45 blur-3xl"
              animate={{
                x: [0, -15, 0],
                y: [0, -10, 0],
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute bottom-4 left-4 flex flex-col gap-2.5 sm:bottom-6 sm:left-6 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div
                className="rounded-xl border border-border/40 bg-background/75 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-xs font-medium sm:text-sm">
                  Resonance Surge: +4.2k High-Intent Leads
                </p>
              </motion.div>
              <motion.div
                className="rounded-xl border border-border/40 bg-background/75 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-xs font-medium sm:text-sm">
                  Tonal Friction: Action required in EU East
                </p>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
