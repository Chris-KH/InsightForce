import { AlertTriangle, Coins, Eye, ShieldCheck, Wallet } from "lucide-react";

import {
  useGeneratedContentsQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

export function FinanceControlPage() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const trendHistoryQuery = useTrendHistoryQuery({ limit: 20 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 40 });

  const anyLoading =
    usersQuery.isLoading ||
    trendHistoryQuery.isLoading ||
    generatedContentsQuery.isLoading ||
    publishJobsQuery.isLoading;

  const anyError =
    usersQuery.error ||
    trendHistoryQuery.error ||
    generatedContentsQuery.error ||
    publishJobsQuery.error;

  const publishJobs = publishJobsQuery.data?.items ?? [];
  const publishedCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const failedCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const pendingCount = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;

  const completed = publishedCount + failedCount;
  const deliveryRatio = completed > 0 ? publishedCount / completed : 0;

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Finance Control", vi: "Điều phối tài chính" }}
        description={{
          en: "Operational finance lane built on validated docs endpoints: user base, content throughput, and publishing outcomes.",
          vi: "Luồng tài chính vận hành dựa trên endpoint hợp lệ trong docs: user, thông lượng nội dung và kết quả xuất bản.",
        }}
        badge={{ en: "Cost Guardrail", vi: "Rào chắn chi phí" }}
        icon={ShieldCheck}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load finance control data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Active Accounts", "Tài khoản hoạt động")}
            value={formatCompactNumber(usersQuery.data?.users.length ?? 0)}
            icon={<Wallet className="size-5" />}
            detail={copy(
              "Available for orchestration and publishing",
              "Sẵn sàng cho orchestration và xuất bản",
            )}
          />
          <MetricCard
            label={copy("Publish Delivery", "Tỷ lệ giao bài")}
            value={formatPercentFromRatio(deliveryRatio)}
            icon={<Coins className="size-5" />}
            detail={copy(
              "Published vs failed jobs",
              "So sánh job published và failed",
            )}
          />
          <MetricCard
            label={copy("Pending Spending Queue", "Hàng đợi chi phí chờ xử lý")}
            value={formatCompactNumber(pendingCount)}
            icon={<Eye className="size-5" />}
            detail={copy("Jobs not finished yet", "Các job chưa hoàn tất")}
          />
          <MetricCard
            label={copy("Content Throughput", "Thông lượng nội dung")}
            value={formatCompactNumber(
              generatedContentsQuery.data?.items.length ?? 0,
            )}
            icon={<ShieldCheck className="size-5" />}
            detail={copy(
              "Generated content ready for publish",
              "Nội dung đã tạo sẵn sàng để xuất bản",
            )}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Financial Guardrails", "Rào chắn tài chính")}
          description={copy(
            "Action-first reminders to reduce failed output and wasted posting cycles.",
            "Nhắc nhở ưu tiên hành động để giảm đầu ra lỗi và chu kỳ đăng bài lãng phí.",
          )}
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="size-4" />
                {copy("Before Scheduling", "Trước khi lên lịch")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Only schedule jobs when trend direction and generated content are already reviewed.",
                  "Chỉ lên lịch khi hướng trend và nội dung tạo ra đã được kiểm tra.",
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Failure Follow-up", "Theo dõi lỗi")}
              </p>
              <p className="mt-1.5">
                {copy("Failed jobs", "Job lỗi")}:{" "}
                {formatCompactNumber(failedCount)}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Review title, platforms, and scheduling window before re-run.",
                  "Rà soát tiêu đề, nền tảng và khung thời gian trước khi chạy lại.",
                )}
              </p>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title={copy(
            "Recent Cost-Relevant Activity",
            "Hoạt động gần đây liên quan chi phí",
          )}
          description={copy(
            "Track latest trend sessions and publish jobs as cost-driving signals.",
            "Theo dõi phiên trend và publish job gần nhất như tín hiệu tác động chi phí.",
          )}
        >
          {anyLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : (
            <div className="space-y-3">
              {trendHistoryQuery.data?.items.slice(0, 4).map((record) => (
                <div
                  key={
                    record.analysis_id ?? `${record.query}-${record.created_at}`
                  }
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {record.query}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Trend session", "Phiên trend")}:{" "}
                    {formatDateTime(record.created_at)}
                  </p>
                </div>
              ))}

              {publishJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {job.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Status", "Trạng thái")}: {job.status}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Tạo lúc")}:{" "}
                    {formatDateTime(job.created_at)}
                  </p>
                </div>
              ))}

              {(trendHistoryQuery.data?.items.length ?? 0) === 0 &&
              publishJobs.length === 0 ? (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No recent activity found for finance control.",
                    "Chưa có hoạt động gần đây cho điều phối tài chính.",
                  )}
                />
              ) : null}
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );
}
