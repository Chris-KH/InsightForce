import { Link } from "react-router";
import { ArrowRight, Bot, Sprout, Video } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterFooter } from "@/pages/register/components/RegisterFooter";
import { RegisterTopBar } from "@/pages/register/components/RegisterTopBar";

export function RegisterSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.div
          className="absolute -top-16 -left-14 size-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 10, 0], y: [0, 15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-14 -bottom-14 size-80 rounded-full bg-chart-1/15 blur-3xl"
          animate={{ x: [0, -15, 0], y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      <RegisterTopBar activeStep="profile" />

      <motion.main
        className="flex flex-1 items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="rounded-3xl border border-border/70 bg-card shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
            <CardContent className="px-6 pt-10 pb-9 text-center sm:px-10 sm:pt-12 sm:pb-11">
              <motion.div
                className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-primary/20 text-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.08, rotate: -8 }}
              >
                <Sprout className="size-12" />
              </motion.div>

              <motion.h1
                className="font-heading text-6xl leading-tight font-semibold tracking-tight text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Welcome Home,
                <br />
                Creator
              </motion.h1>
              <motion.p
                className="mx-auto mt-4 max-w-xl text-2xl leading-relaxed text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Your InsightForge account is ready. Your agents are standing by
                to analyze your channel.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="mt-8 h-14 rounded-2xl px-8 text-xl font-semibold"
                >
                  <Link to="/app/dashboard">
                    Go to Dashboard
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </motion.div>

              <Separator className="mt-10 mb-7" />

              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  {
                    icon: Video,
                    title: "Connect YouTube",
                    desc: "Sync your latest videos",
                    bg: "bg-secondary/20",
                    color: "text-secondary",
                  },
                  {
                    icon: Bot,
                    title: "Tune Your Persona",
                    desc: "Define your AI's voice",
                    bg: "bg-chart-1/20",
                    color: "text-chart-1",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left"
                      variants={itemVariants}
                      whileHover={{
                        y: -3,
                        rotate: 0.35,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-full ${item.bg} ${item.color}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>

      <RegisterFooter />
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
