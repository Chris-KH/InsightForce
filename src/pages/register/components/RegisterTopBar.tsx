import { Link } from "react-router";

import { Button } from "@/components/animate-ui/components/buttons/button";

const NAV_ITEMS = ["Product", "Solutions", "Pricing"];

export function RegisterTopBar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-heading text-3xl leading-none font-semibold text-primary italic"
        >
          InsightForge AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              to="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </Link>
          ))}
        </nav>

        <Button asChild className="h-10 rounded-lg px-6 font-semibold">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </header>
  );
}
