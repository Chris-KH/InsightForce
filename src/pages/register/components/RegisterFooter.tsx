import { Link } from "react-router";

export function RegisterFooter() {
  return (
    <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; 2024 InsightForge AI. Rooted in creativity.
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="#" className="transition-colors hover:text-primary">
            Terms of Service
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
