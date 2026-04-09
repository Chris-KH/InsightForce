import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../data";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500",
        isScrolled ? "top-4 right-4 left-4" : "top-0 right-0 left-0",
      )}
    >
      <nav
        className={cn(
          "mx-auto transition-all duration-500",
          isScrolled || isMobileMenuOpen
            ? "max-w-7xl rounded-2xl border border-border/70 bg-background/85 shadow-lg backdrop-blur-xl"
            : "max-w-352 bg-transparent",
        )}
      >
        <motion.div
          className={cn(
            "flex items-center justify-between px-5 sm:px-6",
            isScrolled ? "h-14" : "h-18",
          )}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <NavLink to="/" className="group inline-flex items-center gap-2">
            <span
              className={cn(
                "font-heading leading-none font-semibold tracking-tight text-primary transition-all duration-500",
                isScrolled ? "text-[1.35rem]" : "text-[1.7rem]",
              )}
            >
              Insight<span className="text-chart-1">Forge AI</span>
            </span>
          </NavLink>

          <div className="hidden items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <NavLink to="/login">
              <Button variant="ghost" className="rounded-full px-5">
                Sign in
              </Button>
            </NavLink>
            <NavLink to="/register">
              <Button className="rounded-full px-6">Start creating</Button>
            </NavLink>
          </div>

          <button
            type="button"
            className="rounded-md p-2 md:hidden"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </motion.div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col px-8 pt-28 pb-8">
          <div className="flex flex-1 flex-col justify-center gap-8">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "font-heading text-5xl leading-none tracking-tight text-foreground transition-all duration-500",
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 70}ms` : "0ms",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div
            className={cn(
              "flex gap-3 border-t border-border/60 pt-8 transition-all duration-500",
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMobileMenuOpen ? "260ms" : "0ms" }}
          >
            <NavLink
              to="/login"
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button variant="outline" className="h-12 w-full rounded-full">
                Sign in
              </Button>
            </NavLink>
            <NavLink
              to="/register"
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button className="h-12 w-full rounded-full">
                Start creating
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
