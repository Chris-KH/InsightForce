import { Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/app-section";
import { BudgetTrackerPanel } from "@/pages/finance/components/BudgetTrackerPanel";
import { FinanceMetrics } from "@/pages/finance/components/FinanceMetrics";
import { RoiPredictorPanel } from "@/pages/finance/components/RoiPredictorPanel";
import { TransactionHistoryCard } from "@/pages/finance/components/TransactionHistoryCard";

export function FinancePage() {
  return (
    <div className="grid gap-8">
      <SectionHeader
        title="Finance Execution Center"
        description="Manage your AI-driven monetization streams, optimize campaign budgets, and track real-time agent commissions with full transparency."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <Filter data-icon="inline-start" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background"
            >
              <Download data-icon="inline-start" />
              Export
            </Button>
          </div>
        }
      />

      <FinanceMetrics />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <BudgetTrackerPanel />
        <RoiPredictorPanel />
      </div>

      <TransactionHistoryCard />
    </div>
  );
}
