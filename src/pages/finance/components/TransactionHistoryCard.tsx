import { ArrowDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TRANSACTIONS = [
  {
    name: "Paid Advertising - Q3 Meta Batch",
    ref: "NVP-99021-AF",
    agent: "Scout",
    date: "Oct 24, 2024",
    amount: "$12,450.00",
    commission: "$996.00",
    status: "Verified",
  },
  {
    name: "Cloud GPU Provisioning (A100)",
    ref: "AWS-CORE-X2",
    agent: "Architect",
    date: "Oct 22, 2024",
    amount: "$4,200.00",
    commission: "$336.00",
    status: "Verified",
  },
  {
    name: "Freelance Design Audit - Landing Page",
    ref: "JUP-EXT-88",
    agent: "Guardian",
    date: "Oct 20, 2024",
    amount: "$1,500.00",
    commission: "$120.00",
    status: "Pending",
  },
] as const;

export function TransactionHistoryCard() {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">
              Transaction History
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent payments and commission settlements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
            >
              Verified 2
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-amber-500/20 text-amber-700"
            >
              Pending 1
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-4">Transaction Details</th>
                <th className="px-4 py-4">Executing Agent</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Comm. (8%)</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((row, index) => (
                <tr
                  key={row.ref}
                  className={
                    index !== TRANSACTIONS.length - 1
                      ? "border-b border-border/50"
                      : ""
                  }
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {row.ref}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {row.agent.slice(0, 1)}
                      </span>
                      {row.agent}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.date}
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">
                    {row.amount}
                  </td>
                  <td className="px-4 py-4 font-medium text-chart-1">
                    {row.commission}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={
                        row.status === "Verified"
                          ? "rounded-full border-primary/20 text-primary"
                          : "rounded-full border-amber-500/20 text-amber-700"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center pt-5 text-sm text-primary">
          View all transactions <ArrowDownRight className="ml-2 size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
