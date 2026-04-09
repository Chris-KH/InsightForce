import { Link } from "react-router";
import { useBilingual } from "@/hooks/use-bilingual";

export function AppFooter() {
  const copy = useBilingual();

  return (
    <footer className="border-t border-border/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          &copy; 2024 InsightForge <span className="text-chart-1">AI</span>{" "}
          {copy("All rights reserved.", "Đã đăng ký bản quyền.")}
        </p>
        <div className="flex items-center gap-6">
          <Link to="#" className="transition-colors hover:text-primary">
            {copy("Legal", "Pháp lý")}
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            {copy("Support", "Hỗ trợ")}
          </Link>
          <Link to="#" className="transition-colors hover:text-primary">
            {copy("Privacy", "Riêng tư")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
