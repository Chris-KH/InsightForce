import { Link } from "react-router";

export function RegisterFooter() {
  return (
    <footer className="border-t border-border/70 bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="font-heading text-3xl text-primary italic">
            InsightForge AI
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 InsightForge AI. Rooted in Intelligence.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="#" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <Link to="#" className="transition-colors hover:text-foreground">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
