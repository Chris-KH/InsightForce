import { ArrowDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBilingual } from "@/hooks/use-bilingual";

export function TransactionHistoryCard() {
  const copy = useBilingual();

  const transactions = [
    {
      name: copy(
        "Paid Advertising - Q3 Meta Batch",
        "Quảng cáo trả phí - lô Meta Q3",
      ),
      ref: "NVP-99021-AF",
      agent: copy("Scout", "Scout"),
      date: copy("Oct 24, 2024", "24 Th10, 2024"),
      amount: "$12,450.00",
      commission: "$996.00",
      status: copy("Verified", "Đã xác thực"),
      statusKey: "verified" as const,
    },
    {
      name: copy("Cloud GPU Provisioning (A100)", "Cấp phát Cloud GPU (A100)"),
      ref: "AWS-CORE-X2",
      agent: copy("Architect", "Architect"),
      date: copy("Oct 22, 2024", "22 Th10, 2024"),
      amount: "$4,200.00",
      commission: "$336.00",
      status: copy("Verified", "Đã xác thực"),
      statusKey: "verified" as const,
    },
    {
      name: copy(
        "Freelance Design Audit - Landing Page",
        "Kiểm toán thiết kế freelance - trang landing",
      ),
      ref: "JUP-EXT-88",
      agent: copy("Guardian", "Guardian"),
      date: copy("Oct 20, 2024", "20 Th10, 2024"),
      amount: "$1,500.00",
      commission: "$120.00",
      status: copy("Pending", "Chờ xử lý"),
      statusKey: "pending" as const,
    },
  ] as const;

  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">
              {copy("Transaction History", "Lịch sử giao dịch")}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy(
                "Recent payments and commission settlements.",
                "Các khoản thanh toán và đối soát hoa hồng gần đây.",
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
            >
              {copy("Verified 2", "Đã xác thực 2")}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-amber-500/20 text-amber-700"
            >
              {copy("Pending 1", "Chờ xử lý 1")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-4">
                  {copy("Transaction Details", "Chi tiết giao dịch")}
                </th>
                <th className="px-4 py-4">
                  {copy("Executing Agent", "Tác vụ viên thực thi")}
                </th>
                <th className="px-4 py-4">{copy("Date", "Ngày")}</th>
                <th className="px-4 py-4">{copy("Amount", "Số tiền")}</th>
                <th className="px-4 py-4">
                  {copy("Comm. (8%)", "Hoa hồng (8%)")}
                </th>
                <th className="px-4 py-4">{copy("Status", "Trạng thái")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((row, index) => (
                <tr
                  key={row.ref}
                  className={
                    index !== transactions.length - 1
                      ? "border-b border-border/50"
                      : ""
                  }
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {copy("Ref", "Mã")}: {row.ref}
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
                  <td className="px-4 py-4 font-medium text-chart-4">
                    {row.commission}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={
                        row.statusKey === "verified"
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
          {copy("View all transactions", "Xem toàn bộ giao dịch")}{" "}
          <ArrowDownRight className="ml-2 size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
