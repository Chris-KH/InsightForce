import {
  Bot,
  CheckCircle2,
  Clock3,
  Cpu,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  useHealthQuery,
  useTikTokRecommendationsQuery,
  useTikTokVideosQuery,
  useUploadPostHistoryQuery,
  useUploadPostPostAnalyticsQuery,
  useYouTubeRecommendationsQuery,
  useYouTubeVideosQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

export function AutomationPage() {
  const copy = useBilingual();

  const healthQuery = useHealthQuery();
  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });
  const tikTokRecommendationsQuery = useTikTokRecommendationsQuery();
  const youTubeRecommendationsQuery = useYouTubeRecommendationsQuery();
  const tikTokVideosQuery = useTikTokVideosQuery();
  const youTubeVideosQuery = useYouTubeVideosQuery();

  const latestRequestId = historyQuery.data?.payload.history[0]?.request_id;

  const latestPostAnalyticsQuery = useUploadPostPostAnalyticsQuery({
    requestId: latestRequestId,
    enabled: Boolean(latestRequestId),
  });

  const allQueries = [
    healthQuery,
    historyQuery,
    tikTokRecommendationsQuery,
    youTubeRecommendationsQuery,
    tikTokVideosQuery,
    youTubeVideosQuery,
    latestPostAnalyticsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const firstError = allQueries.find((query) => query.error)?.error;

  const historyItems = historyQuery.data?.payload.history ?? [];
  const successfulOperations = historyItems.filter(
    (item) => item.success,
  ).length;
  const operationsSuccessRate = historyItems.length
    ? successfulOperations / historyItems.length
    : 0;

  const recommendationQueue = [
    ...(tikTokRecommendationsQuery.data?.recommendations ?? []).map((item) => ({
      platform: "tiktok" as const,
      id: item.recommendation_id,
      idea: item.content_idea,
      confidence: item.confidence_score,
      rationale: item.reasoning,
    })),
    ...(youTubeRecommendationsQuery.data?.recommendations ?? []).map(
      (item) => ({
        platform: "youtube" as const,
        id: item.recommendation_id,
        idea: item.content_idea,
        confidence: item.confidence_score,
        rationale: item.reasoning,
      }),
    ),
  ].sort((left, right) => right.confidence - left.confidence);

  const contentBacklog =
    (tikTokVideosQuery.data?.videos.length ?? 0) +
    (youTubeVideosQuery.data?.videos.length ?? 0);

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Automation Ops", "Vận hành tự động")}
        title={copy("Backend Orchestration Hub", "Trung tâm điều phối backend")}
        description={copy(
          "Operational status from health checks, recommendation queues, upload history, and latest request analytics.",
          "Trạng thái vận hành từ health check, hàng đợi đề xuất, lịch sử upload và phân tích request gần nhất.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {healthQuery.data?.status === "ok"
              ? copy("API Online", "API trực tuyến")
              : copy("API Status Unknown", "Chưa rõ trạng thái API")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load automation telemetry.",
          )}
          hint={copy(
            "Automation telemetry consumes /health, /recommendations, /videos, and /upload-post/history endpoints.",
            "Telemetry tự động hóa dùng endpoint /health, /recommendations, /videos và /upload-post/history.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Operation Success Rate", "Tỷ lệ tác vụ thành công")}
            value={
              isLoading ? "--" : formatPercentFromRatio(operationsSuccessRate)
            }
            detail={copy(
              "Computed from upload history outcomes",
              "Tính từ kết quả lịch sử upload",
            )}
            icon={<CheckCircle2 className="size-5" />}
          />
          <MetricCard
            label={copy("Queue Depth", "Độ sâu hàng đợi")}
            value={isLoading ? "--" : String(recommendationQueue.length)}
            detail={copy(
              "Strategy recommendations waiting to execute",
              "Đề xuất chiến lược chờ thực thi",
            )}
            icon={<Workflow className="size-5" />}
          />
          <MetricCard
            label={copy("Content Backlog", "Kho nội dung")}
            value={isLoading ? "--" : String(contentBacklog)}
            detail={copy(
              "Videos available in backend feeds",
              "Số video có trong feed backend",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Processed Operations", "Tác vụ đã xử lý")}
            value={isLoading ? "--" : formatCompactNumber(historyItems.length)}
            detail={copy(
              "From upload-post history ledger",
              "Từ sổ lịch sử upload-post",
            )}
            icon={<Cpu className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelCard
          title={copy("Service Runtime Status", "Trạng thái runtime dịch vụ")}
          description={copy(
            "Health and subsystem checks derived from active API routes.",
            "Kiểm tra sức khỏe và phân hệ từ các route API đang hoạt động.",
          )}
        >
          {isInitialLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Health API
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {healthQuery.data?.status ?? copy("Unknown", "Chưa rõ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {healthQuery.data?.service ?? "insightforge-api"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Recommendation Engine
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {recommendationQueue.length}{" "}
                  {copy("items queued", "mục đang chờ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  TikTok + YouTube /recommendations
                </p>
              </div>

              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Upload Ledger
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {historyItems.length} {copy("records", "bản ghi")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /upload-post/history
                </p>
              </div>

              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Last Operation
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {historyItems[0]
                    ? formatDateTime(historyItems[0].upload_timestamp)
                    : copy("No recent operation", "Chưa có tác vụ gần đây")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Clock3 className="mr-1 inline-flex size-3" />
                  {historyItems[0]?.platform ?? "--"}
                </p>
              </div>
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Recommendation Queue", "Hàng đợi đề xuất")}
          description={copy(
            "Queued content opportunities ordered by confidence score.",
            "Cơ hội nội dung được xếp theo điểm độ tin cậy.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : recommendationQueue.length > 0 ? (
              recommendationQueue.slice(0, 8).map((item) => (
                <div
                  key={`${item.platform}-${item.id}`}
                  className="rounded-2xl border border-border/55 bg-background/55 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {item.platform}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentFromRatio(item.confidence)} confidence
                    </p>
                  </div>
                  <p className="mt-2 font-medium text-foreground">
                    {item.idea}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.rationale}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No recommendation queue items available.",
                  "Chưa có mục trong hàng đợi đề xuất.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Latest Request Telemetry", "Telemetry request mới nhất")}
          description={copy(
            "Per-platform delivery and engagement metrics for the latest request.",
            "Chỉ số phân phối và tương tác theo nền tảng cho request mới nhất.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : latestPostAnalyticsQuery.data?.payload ? (
              <>
                <div className="rounded-2xl border border-border/55 bg-background/55 p-4 text-xs text-muted-foreground">
                  {copy("Request ID", "Mã request")}:{" "}
                  {latestPostAnalyticsQuery.data.request_id}
                </div>

                {Object.entries(
                  latestPostAnalyticsQuery.data.payload.platforms,
                ).map(([platform, payload]) => (
                  <div
                    key={platform}
                    className="rounded-2xl border border-border/55 bg-background/55 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full capitalize"
                      >
                        {platform}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {payload.success
                          ? copy("Delivered", "Đã phân phối")
                          : copy("Delivery failed", "Phân phối thất bại")}
                      </p>
                    </div>
                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <p>
                        {copy("Views", "Lượt xem")}:{" "}
                        {formatCompactNumber(payload.post_metrics.views)}
                      </p>
                      <p>
                        {copy("Likes", "Lượt thích")}:{" "}
                        {formatCompactNumber(payload.post_metrics.likes)}
                      </p>
                      <p>
                        {copy("Comments", "Bình luận")}:{" "}
                        {formatCompactNumber(payload.post_metrics.comments)}
                      </p>
                      <p>
                        {copy("Shares", "Chia sẻ")}:{" "}
                        {formatCompactNumber(payload.post_metrics.shares)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No request telemetry available.",
                  "Chưa có telemetry cho request.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Operation Timeline", "Dòng thời gian tác vụ")}
          description={copy(
            "Chronological view from upload history records.",
            "Góc nhìn theo thời gian từ bản ghi lịch sử upload.",
          )}
        >
          <div className="space-y-2">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={5} />
            ) : historyItems.length > 0 ? (
              historyItems.slice(0, 12).map((item) => (
                <div
                  key={`${item.request_id}-${item.platform}-${item.job_id}`}
                  className="grid gap-2 rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <Badge variant="outline" className="rounded-full capitalize">
                    {item.platform}
                  </Badge>
                  <div>
                    <p className="font-medium text-foreground">
                      {item.post_title}
                    </p>
                    <p className="text-muted-foreground">
                      {formatDateTime(item.upload_timestamp)}
                    </p>
                  </div>
                  <p
                    className={
                      item.success ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {item.success
                      ? copy("Success", "Thành công")
                      : copy("Failed", "Thất bại")}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No operations recorded yet.",
                  "Chưa có tác vụ nào được ghi nhận.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
