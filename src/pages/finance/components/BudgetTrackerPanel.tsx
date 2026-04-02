import { Button } from "@/components/ui/button";
import { PanelCard, ProgressBar } from "@/components/app-section";

const ALLOCATIONS = [
  {
    label: "Ads & Marketing",
    value: 80,
    amount: "$64,000 / $80k",
    note: "Controlled by Scout Agent",
    tone: "primary" as const,
  },
  {
    label: "Strategic Outsourcing",
    value: 64,
    amount: "$32,000 / $50k",
    note: "Managed via Architect APIs",
    tone: "secondary" as const,
  },
  {
    label: "Tooling & Infrastructure",
    value: 72,
    amount: "$18,200 / $25k",
    note: "Infrastructure feed costs",
    tone: "tertiary" as const,
  },
] as const;

export function BudgetTrackerPanel() {
  return (
    <PanelCard
      title="AI Budget Tracker"
      description="Balanced allocation across marketing, outsourcing, and infrastructure."
      action={
        <Button variant="link" className="h-auto px-0 text-primary">
          Manage Allocation
        </Button>
      }
    >
      <div className="flex flex-col gap-7">
        {ALLOCATIONS.map((allocation) => (
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
