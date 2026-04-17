import { useBilingual } from "@/hooks/use-bilingual";

export function RouteHydrateFallback() {
  const copy = useBilingual();

  return (
    <div className="flex min-h-[42vh] items-center justify-center px-6 py-10">
      <div className="rounded-full border border-border/70 bg-card/75 px-4 py-2 text-xs font-medium text-muted-foreground">
        {copy("Loading workspace...", "Đang tải không gian làm việc...")}
      </div>
    </div>
  );
}
