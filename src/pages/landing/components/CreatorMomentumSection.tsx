import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CAPABILITY_ITEMS, TRUSTED_COMPANIES } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";

export function CreatorMomentumSection() {
  return (
    <section
      id="capabilities"
      className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-[74%]"
          cellSize={112}
          strength="soft"
          fade="diagonal"
        />

        <CometTrails
          className="absolute inset-0 opacity-90"
          density="medium"
          direction="diagonal"
          tone="mixed"
        />

        <FloatingShards
          className="absolute inset-0"
          density="high"
          tone="mixed"
        />

        <OrbitRings
          className="absolute top-2 right-[8%] hidden h-72 w-72 lg:block"
          tone="mixed"
          spin="slow"
        />

        <motion.div
          className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-primary/12 blur-[110px]"
          animate={{ opacity: [0.24, 0.42, 0.24], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-chart-1/10 blur-[100px]"
          animate={{ opacity: [0.2, 0.34, 0.2], scale: [1, 1.12, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            Core Capabilities
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            The command layer behind high-converting creator campaigns
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Replace disconnected tools with one intelligence stack that maps
            audience demand, designs narratives, matches KOL partners, and
            protects every message before launch.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12">
          {CAPABILITY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-border/65 bg-card/65 shadow-sm backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-start justify-between gap-5 pb-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                        {item.number}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-border/65 bg-card/55 backdrop-blur-sm lg:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="flex w-max items-center gap-8 px-5 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map(
              (company, index) => (
                <span
                  key={`${company}-${index}`}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  {company}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
