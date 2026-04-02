import { Link } from "react-router";

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>&copy; 2024 InsightForge AI</p>
        <div className="flex items-center gap-6">
          <Link to="#" className="transition-colors hover:text-primary">
            Legal
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            Support
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
