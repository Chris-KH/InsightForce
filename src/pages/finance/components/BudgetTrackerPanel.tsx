import { Button } from "@/components/ui/button";
import { PanelCard, ProgressBar } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

export function BudgetTrackerPanel() {
  const copy = useBilingual();

  const allocations = [
    {
      label: copy("Ads & Marketing", "Quảng cáo & Tiếp thị"),
      value: 80,
      amount: "$64,000 / $80k",
      note: copy("Controlled by Scout Agent", "Do tác vụ viên Scout điều phối"),
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
      <div className="flex flex-col gap-7">
        {allocations.map((allocation) => (
          <div key={allocation.label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">
                  {allocation.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {allocation.note}
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {allocation.amount}
              </span>
            </div>
            <ProgressBar
              value={allocation.value}
              tone={allocation.tone}
              className="h-3"
            />
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
