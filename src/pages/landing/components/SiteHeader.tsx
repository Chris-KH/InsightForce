import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:h-[74px] sm:px-6 lg:px-8">
        <p className="font-heading text-[1.65rem] leading-none font-semibold tracking-tight text-primary sm:text-[1.8rem]">
          InsightForge AI
        </p>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item}
              href="#"
              className={cn(
                "pb-1 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                index === 0 && "border-b-2 border-primary text-primary",
              )}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button className="h-10 px-5 sm:h-11 sm:px-6">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
