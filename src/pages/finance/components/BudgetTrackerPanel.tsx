import { motion } from "motion/react";

import { RevealBlock, SurfaceGrid } from "@/components/app-futuristic";
import { Button } from "@/components/ui/button";
import { PanelCard, ProgressBar } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { cn } from "@/lib/utils";

export function BudgetTrackerPanel() {
  const copy = useBilingual();

  const allocations = [
    {
      label: copy("Ads & Marketing", "Quảng cáo & Tiếp thị"),
      value: 80,
      amount: "$64,000 / $80k",
      note: copy("Controlled by Scout Agent", "Do bot Scout điều phối"),
      tone: "primary" as const,
    },
    {
      label: copy("Strategic Outsourcing", "Thuê ngoài chiến lược"),
      value: 64,
      amount: "$32,000 / $50k",
      note: copy("Managed via Architect APIs", "Quản lý qua API của Architect"),
      tone: "secondary" as const,
    },
    {
      label: copy("Tooling & Infrastructure", "Công cụ & Hạ tầng"),
      value: 72,
      amount: "$18,200 / $25k",
      note: copy("Infrastructure feed costs", "Chi phí nguồn dữ liệu hạ tầng"),
      tone: "tertiary" as const,
    },
  ] as const;

  const getToneClass = (tone: "primary" | "secondary" | "tertiary") =>
    tone === "primary"
      ? "border-primary/25 bg-primary/6"
      : tone === "secondary"
        ? "border-chart-2/30 bg-chart-2/8"
        : "border-chart-3/30 bg-chart-3/8";

  return (
    <PanelCard
      title={copy("AI Budget Tracker", "Bộ theo dõi ngân sách AI")}
      description={copy(
        "Balanced allocation across marketing, outsourcing, and infrastructure.",
        "Phân bổ cân bằng giữa tiếp thị, thuê ngoài và hạ tầng.",
      )}
      action={
        <Button variant="link" className="h-auto px-0 text-primary">
          {copy("Manage Allocation", "Quản lý phân bổ")}
        </Button>
      }
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-background/65 p-4">
        <SurfaceGrid className="opacity-28" />

        <div className="relative flex flex-col gap-4">
          {allocations.map((allocation, index) => (
            <RevealBlock key={allocation.label} delay={index * 0.06}>
              <motion.div
                whileHover={{ y: -2 }}
                className={cn(
                  "rounded-2xl border px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)]",
                  getToneClass(allocation.tone),
                )}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {allocation.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {allocation.note}
                    </p>
                  </div>
                  <span className="rounded-full border border-border/65 bg-background/85 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {allocation.amount}
                  </span>
                </div>

                <ProgressBar
                  value={allocation.value}
                  tone={allocation.tone}
                  className="h-3"
                />
              </motion.div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
