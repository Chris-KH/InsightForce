import { Link } from "react-router";
import { ArrowRight, Bot, Sprout, Video } from "lucide-react";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterFooter } from "@/pages/register/components/RegisterFooter";
import { RegisterTopBar } from "@/pages/register/components/RegisterTopBar";

export function RegisterSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -left-14 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-14 -bottom-14 size-80 rounded-full bg-chart-1/15 blur-3xl" />
      </div>

      <RegisterTopBar activeStep="profile" />

      <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <Card className="rounded-3xl border border-border/70 bg-card shadow-[0_4px_20px_rgba(46,50,48,0.06)]">
            <CardContent className="px-6 pt-10 pb-9 text-center sm:px-10 sm:pt-12 sm:pb-11">
              <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Sprout className="size-12" />
              </div>

              <h1 className="font-heading text-6xl leading-tight font-semibold tracking-tight text-foreground">
                Welcome Home,
                <br />
                Creator
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-2xl leading-relaxed text-muted-foreground">
                Your InsightForge account is ready. Your agents are standing by
                to analyze your channel.
              </p>

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

              <Separator className="mt-10 mb-7" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                    <Video className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Connect YouTube
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sync your latest videos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left">
                  <div className="flex size-10 items-center justify-center rounded-full bg-chart-1/20 text-chart-1">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Tune Your Persona
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Define your AI&apos;s voice
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
}
