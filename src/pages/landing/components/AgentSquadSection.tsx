import { Shield, Lightbulb, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AGENTS = [
  {
    icon: Shield,
    title: "Psychological Guardian",
    description:
      "Analyzes audience sentiment and safeguards your brand's emotional resonance. Prevents tone-deaf pivots by monitoring cultural shifts in real-time.",
    metric: "Brand Alignment",
    percentage: 92,
    color:
      "bg-green-600/20 text-green-600 dark:bg-green-400/20 dark:text-green-400",
    barColor: "bg-green-600 dark:bg-green-400",
  },
  {
    icon: Lightbulb,
    title: "Content Architect",
    description:
      "Transmutes raw data into viral content structures. Designs multi-channel strategies that hook interest and sustain deep engagement across platforms.",
    metric: "Viral Potential",
    percentage: 88,
    color:
      "bg-blue-600/20 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400",
    barColor: "bg-blue-600 dark:bg-blue-400",
  },
  {
    icon: Zap,
    title: "Scout & Executor",
    description:
      "Scours the digital landscape for emerging trends and executes placement strategies instantly. Your frontline operative in the battle for attention.",
    metric: "Execution Speed",
    percentage: 95,
    color:
      "bg-yellow-600/20 text-yellow-600 dark:bg-yellow-400/20 dark:text-yellow-400",
    barColor: "bg-yellow-600 dark:bg-yellow-400",
  },
];

export function AgentSquadSection() {
  return (
    <section
      id="solutions"
      className="bg-muted px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          <h2 className="font-heading text-4xl font-bold text-foreground sm:text-5xl lg:text-5xl">
            Meet Your Autonomous Squad
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base">
            InsightForge AI deploys specialized agents that work together to
            amplify your creative output while you stay in control of the
            vision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.title}
                className="rounded-2xl border border-border/50 p-0 shadow-sm transition-all hover:-translate-y-2 hover:shadow-md"
              >
                <CardContent className="flex flex-col items-start gap-5 px-6 pt-8 pb-7 sm:gap-6 sm:px-8 sm:pt-10 sm:pb-8">
                  <div className={`rounded-xl p-3 ${agent.color}`}>
                    <Icon className="size-6" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                      {agent.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {agent.description}
                    </p>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${agent.barColor}`}
                        style={{ width: `${agent.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <span>{agent.metric}</span>
                      <span className={agent.color.split(" ")[1]}>
                        {agent.percentage === 95
                          ? "Instant"
                          : `${agent.percentage}%`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
