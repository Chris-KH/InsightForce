import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FOOTER_LINK_GROUPS, SOCIAL_LINKS, TRUSTED_COMPANIES } from "../data";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { NavLink } from "react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/45 px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="overflow-hidden rounded-2xl border border-border/65 bg-background/80 p-6 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                Ready To Launch
              </p>
              <h3 className="mt-2 font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Turn audience intelligence into your next growth engine.
              </h3>
              <p className="mt-3 max-w-[56ch] text-sm leading-6 text-muted-foreground sm:text-base">
                Move from scattered decisions to one connected system for
                creator strategy, content, and campaign execution.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <NavLink to="/register">
                <Button className="h-11 rounded-full px-6">
                  Start creating
                  <ArrowRight className="size-4" />
                </Button>
              </NavLink>
              <NavLink to="/login">
                <Button variant="outline" className="h-11 rounded-full px-6">
                  Book demo
                </Button>
              </NavLink>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TRUSTED_COMPANIES.map((company) => (
            <span
              key={company}
              className="rounded-full border border-border/65 bg-background/72 px-3 py-1 text-xs text-muted-foreground"
            >
              {company}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-tight text-primary">
              Insight<span className="text-chart-1">Force AI</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Creator intelligence infrastructure for teams that need speed,
              precision, and brand-safe scale.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINK_GROUPS).map(([group, links]) => (
            <div key={group}>
              <p className="font-heading text-base font-semibold">{group}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-8" />

        <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 InsightForce AI. All rights reserved.</p>
          <p>Built for creator operators and KOL growth teams.</p>
        </div>
      </div>
    </footer>
  );
}
