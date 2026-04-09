import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { AGENT_MODULES, WORKFLOW_STEPS } from "../data";
import { motion } from "motion/react";

export function AgentSquadSection() {
  return (
    <section
      id="workflow"
      className="bg-muted/35 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            Workflow Engine
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            Build, validate, and ship campaigns with specialized AI agents
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Connect your data, assign agent responsibilities, and launch
            globally from a single playbook that keeps strategy, execution, and
            quality in sync.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <Card className="border-border/65 bg-card/70 shadow-sm">
                  <CardHeader className="gap-3 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                        {step.number}
                      </span>
                      <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <CardDescription className="text-sm leading-6">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background/78 p-4 text-[12px] leading-6 text-muted-foreground">
                      <code>{step.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {AGENT_MODULES.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: 0.16 + index * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <Card className="border-border/65 bg-card/72 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-border/70 bg-background/80 p-2 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold tracking-tight">
                          {module.title}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {module.detail}
                      </p>
                      <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                        {module.metric}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
