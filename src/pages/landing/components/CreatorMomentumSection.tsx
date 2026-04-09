import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Flame, Globe2, Mic2, Sparkles, TrendingUp, Video } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const CREATOR_STORY_IMAGE =
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80";

const APP_MOCKUP_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551281044-8b3a2bf9a7f6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80",
];

const PLATFORM_TAGS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "LinkedIn",
  "Podcast",
  "X",
];

const CREATOR_WINS = [
  { label: "Follower Growth", value: "+312%" },
  { label: "Campaign ROI", value: "8.7x" },
  { label: "Weekly Watch Time", value: "+94h" },
];

const SIGNAL_CARDS = [
  {
    icon: Video,
    title: "Short-Form Breakout",
    stat: "96.4",
    unit: "Virality Score",
    copy: "Scout predicts a 48-hour trend window across short-form channels.",
    progress: 96,
    tone: "bg-primary/15 text-primary",
  },
  {
    icon: Flame,
    title: "Narrative Heat",
    stat: "11.2K",
    unit: "Intent Mentions",
    copy: "Guardian detects urgency spikes in creator comments before competitors.",
    progress: 88,
    tone: "bg-chart-1/20 text-chart-1",
  },
  {
    icon: Mic2,
    title: "KOL Echo Power",
    stat: "74",
    unit: "Partner Matches",
    copy: "Architect identifies aligned KOL voices by trust overlap and audience fit.",
    progress: 82,
    tone: "bg-secondary/30 text-secondary-foreground",
  },
];

const CASE_STUDIES = [
  {
    creator: "Ari Vega",
    segment: "Beauty KOL",
    objective: "Launch a clean-beauty capsule with higher trust among Gen Z.",
    challenge:
      "Previous campaigns had views but weak conversion due to mismatched creator language.",
    playbook:
      "Guardian mapped emotional objections, Architect rebuilt hook sequencing, and Scout timed drops by audience intent spikes.",
    channels: ["TikTok", "Instagram Reels", "YouTube Shorts"],
    lift: "+63% ROAS",
    outcome: "Sold out in 4 days with 3.2x more qualified clicks.",
  },
  {
    creator: "Noah Kwon",
    segment: "Tech Creator",
    objective:
      "Position a new creator tool for business creators and consultants.",
    challenge:
      "High traffic, low retention after first touchpoint across long-form videos.",
    playbook:
      "Architect generated a 5-part narrative arc, while Scout deployed micro-clips with platform-specific CTA variants.",
    channels: ["LinkedIn", "YouTube", "X"],
    lift: "+41% Watch Retention",
    outcome: "Pipeline-quality leads doubled in 21 days.",
  },
  {
    creator: "Lina Duarte",
    segment: "Lifestyle Agency",
    objective:
      "Scale KOL partner campaigns across three regions without brand drift.",
    challenge:
      "Regional collabs looked inconsistent and diluted premium brand positioning.",
    playbook:
      "Guardian monitored tonal integrity by market, and Architect generated localized creative briefs with shared brand guardrails.",
    channels: ["Instagram", "Podcast", "Creator Events"],
    lift: "+38% Engagement Lift",
    outcome:
      "Regional campaigns hit target CPM while preserving brand cohesion.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Our launch went from guesswork to precision. InsightForge found the creator angle that tripled paid conversion in one week.",
    name: "Nadia Tran",
    role: "Beauty Creator, 2.1M followers",
  },
  {
    quote:
      "I used to spend nights studying trends. Now the AI squad briefs me every morning with exact hooks and posting windows.",
    name: "Marco Vela",
    role: "Lifestyle KOL",
  },
  {
    quote:
      "As an agency, we onboard clients faster because we can show projected outcomes before content goes live.",
    name: "Shin Park",
    role: "Creative Director, PulseHouse",
  },
  {
    quote:
      "The Guardian alerts saved us from a cultural miss that would have damaged brand trust. This is now our control tower.",
    name: "Elle Morgan",
    role: "CMO, Creator Commerce Brand",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65 },
  },
};

export function CreatorMomentumSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxSlow = useTransform(scrollYProgress, [0, 1], [30, -40]);
  const parallaxMedium = useTransform(scrollYProgress, [0, 1], [55, -60]);
  const parallaxFast = useTransform(scrollYProgress, [0, 1], [80, -78]);

  return (
    <section
      ref={sectionRef}
      id="academy"
      className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="absolute -top-22 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[150px]"
          style={{ y: parallaxSlow }}
          animate={{ opacity: [0.2, 0.42, 0.2], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-16 -bottom-26 size-[24rem] rounded-full bg-chart-1/10 blur-[140px]"
          style={{ y: parallaxMedium }}
          animate={{ opacity: [0.2, 0.34, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 0.9 }}
        />

        <motion.svg
          viewBox="0 0 56 56"
          className="absolute -top-2 -left-2 hidden h-14 w-14 text-primary/16 md:block"
          style={{ y: parallaxFast }}
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 8.5, repeat: Infinity }}
        >
          <circle
            cx="28"
            cy="28"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <circle
            cx="28"
            cy="28"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </motion.svg>

        <motion.div
          className="absolute top-[10%] right-[2%] hidden h-24 w-30 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:9px_9px] text-primary/18 md:block"
          style={{ y: parallaxMedium }}
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <motion.svg
          viewBox="0 0 320 90"
          className="absolute right-0 -bottom-1 w-64 text-chart-1/16 sm:w-84 lg:w-[24rem]"
          style={{ y: parallaxMedium }}
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        >
          <path
            d="M0 56 C40 22 82 80 126 56 C170 30 212 76 256 52 C284 38 302 40 320 34 V90 H0 Z"
            fill="currentColor"
          />
        </motion.svg>

        <motion.svg
          viewBox="0 0 120 120"
          className="absolute bottom-[20%] left-[4%] hidden h-16 w-16 text-secondary/18 lg:block"
          style={{ y: parallaxSlow }}
          animate={{ rotate: [0, -6, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <path
            d="M104 52 C106 78 88 100 64 104 C42 108 18 92 14 68 C10 42 26 16 52 12 C78 8 102 24 104 52 Z"
            fill="currentColor"
          />
        </motion.svg>

        <motion.svg
          viewBox="0 0 240 100"
          className="absolute top-[38%] left-[-2rem] hidden w-44 text-muted-foreground/20 xl:block"
          style={{ y: parallaxFast }}
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
        >
          <path
            d="M4 74 C34 42 58 86 88 58 C118 30 142 72 170 48 C194 28 214 38 236 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
        </motion.svg>
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 sm:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={itemVariants}
        >
          <Badge className="border border-primary/30 bg-primary/12 px-3.5 py-1 text-[10px] tracking-[0.14em] uppercase sm:text-[11px]">
            Creator Momentum Engine
          </Badge>
          <h2 className="mt-4 font-heading text-[2.15rem] leading-tight font-semibold tracking-tight sm:text-[2.9rem]">
            Built for Creators and KOLs Who Move Culture
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Launch with confidence using predictive audience intelligence,
            creator-market fit scoring, and agent-led timing recommendations
            across your channels.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {PLATFORM_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-border/70 bg-card/55 px-3 py-1 text-[11px] font-medium backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.22fr_0.78fr]">
          <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
            <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-0 shadow-2xl backdrop-blur-md">
              <motion.img
                src={CREATOR_STORY_IMAGE}
                alt="Content creator studio dashboard"
                className="h-[26rem] w-full object-cover sm:h-[30rem]"
                loading="lazy"
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
              <motion.div
                className="absolute top-4 left-4 rounded-xl border border-border/60 bg-card/75 px-3 py-2 text-xs font-medium backdrop-blur-md sm:top-6 sm:left-6"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              >
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <Sparkles className="size-3.5" />
                  Live Campaign Pulse
                </span>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute top-5 right-4 hidden w-44 rotate-[4deg] overflow-hidden rounded-xl border border-border/70 bg-background/82 shadow-2xl md:block"
                style={{ y: parallaxFast }}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <img
                  src={APP_MOCKUP_IMAGES[0]}
                  alt="Creator dashboard trend card"
                  className="h-22 w-full object-cover"
                  loading="lazy"
                />
                <div className="border-t border-border/55 px-2.5 py-2">
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    Trend Signal
                  </p>
                  <p className="mt-1 text-xs font-medium text-primary">
                    Hook confidence +24%
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute bottom-24 left-4 hidden w-38 -rotate-[5deg] overflow-hidden rounded-xl border border-border/70 bg-background/82 shadow-xl lg:block"
                style={{ y: parallaxMedium }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <img
                  src={APP_MOCKUP_IMAGES[1]}
                  alt="KOL matchboard preview"
                  className="h-20 w-full object-cover"
                  loading="lazy"
                />
                <p className="border-t border-border/55 px-2.5 py-1.5 text-[11px] font-medium text-foreground/90">
                  KOL matchboard live
                </p>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute top-1/2 right-8 hidden w-34 -translate-y-1/2 rotate-[2deg] overflow-hidden rounded-lg border border-border/70 bg-background/82 shadow-lg xl:block"
                style={{ y: parallaxSlow }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.62, duration: 0.55 }}
              >
                <img
                  src={APP_MOCKUP_IMAGES[2]}
                  alt="Regional market pulse preview"
                  className="h-18 w-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              <div className="absolute right-4 bottom-4 left-4 grid gap-3 sm:right-6 sm:bottom-6 sm:left-6 sm:grid-cols-3">
                {CREATOR_WINS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl border border-border/65 bg-background/70 px-3 py-3 backdrop-blur-md"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.08, duration: 0.5 }}
                  >
                    <p className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-xl font-semibold text-foreground sm:text-2xl">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div className="grid gap-4" variants={itemVariants}>
            {SIGNAL_CARDS.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <motion.div
                  key={signal.title}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border border-border/60 bg-card/55 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${signal.tone}`}>
                            <Icon className="size-4" />
                          </div>
                          <p className="text-sm font-semibold">
                            {signal.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-2xl leading-none sm:text-[1.7rem]">
                            {signal.stat}
                          </p>
                          <p className="mt-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                            {signal.unit}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-6">
                        {signal.copy}
                      </CardDescription>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted/80">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${signal.progress}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.35 + index * 0.08,
                            duration: 0.9,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            <motion.div
              className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/15 p-2 text-accent">
                  <Globe2 className="size-4" />
                </div>
                <p className="text-sm font-semibold">
                  Global Opportunity Radar
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Real-time recommendations for regional creator collabs, posting
                windows, and local narrative hooks based on audience heat
                shifts.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>12 regions monitored</span>
                <span className="inline-flex items-center gap-1 text-primary">
                  <TrendingUp className="size-3.5" />
                  +38% engagement lift
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {CASE_STUDIES.map((study, index) => (
            <motion.article
              key={study.creator}
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.72,
                delay: 0.16 + index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
            >
              <Card className="h-full border border-border/60 bg-card/58 shadow-sm backdrop-blur-sm">
                <CardHeader className="gap-3 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className="border-primary/35 bg-primary/10 text-[10px] tracking-[0.12em] uppercase"
                    >
                      {study.segment}
                    </Badge>
                    <span className="text-[11px] font-semibold tracking-[0.1em] text-primary uppercase">
                      {study.lift}
                    </span>
                  </div>
                  <h3 className="font-heading text-[1.45rem] leading-none font-semibold tracking-tight">
                    {study.creator}
                  </h3>
                  <CardDescription className="text-sm leading-6">
                    {study.challenge}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                      Objective
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/90">
                      {study.objective}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                      Playbook
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {study.playbook}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {study.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="outline"
                        className="rounded-full border-border/70 bg-background/65 px-2.5 py-1 text-[10px]"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border/60 bg-background/68 px-3 py-2.5">
                    <p className="text-[10px] font-semibold tracking-[0.13em] text-muted-foreground uppercase">
                      Outcome
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-foreground">
                      {study.outcome}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-border/60 bg-card/55 shadow-sm backdrop-blur-sm"
          variants={itemVariants}
        >
          <motion.div
            className="flex w-max gap-4 px-4 py-4 sm:px-6 sm:py-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
              <Card
                key={`${item.name}-${index}`}
                className="w-[19.5rem] border-border/60 bg-background/70 shadow-none"
              >
                <CardContent className="p-4 sm:p-5">
                  <p className="text-sm leading-6 text-foreground/90">
                    {item.quote}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
