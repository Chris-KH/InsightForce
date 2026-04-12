import { useState, type FormEvent } from "react";
import {
  Bot,
  CheckCircle2,
  Clock3,
  Cpu,
  MessageSquareText,
  Send,
  Server,
  Sparkles,
  Upload,
  Workflow,
} from "lucide-react";

import {
  type ContentPlatform,
  type UploadVideoRequest,
  useAgentsStatusQuery,
  useHealthQuery,
  usePlatformUploadMutation,
  useUploadPostCommentsQuery,
  useTikTokRecommendationsQuery,
  useTikTokVideosQuery,
  useUploadPostHistoryQuery,
  useUploadPostPostAnalyticsQuery,
  useYouTubeRecommendationsQuery,
  useYouTubeVideosQuery,
} from "@/api";
import {
  BarTrendChart,
  DoughnutTrendChart,
  HeatMatrix,
  RadarTrendChart,
} from "@/components/app-data-viz";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { PlatformBadge } from "@/components/platform-badge";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getPlatformSurfaceClassName } from "@/lib/platform-theme";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

type CommentLookupRequest = {
  platform: ContentPlatform;
  user: string;
  postId?: string;
  postUrl?: string;
};

export function AutomationPage() {
  const copy = useBilingual();

  const [uploadPlatform, setUploadPlatform] =
    useState<ContentPlatform>("tiktok");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFilePath, setUploadFilePath] = useState("");
  const [uploadUser, setUploadUser] = useState("blhoang23");
  const [uploadVisibility, setUploadVisibility] =
    useState<NonNullable<UploadVideoRequest["visibility"]>>("public");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadScheduleAt, setUploadScheduleAt] = useState("");
  const [uploadAsync, setUploadAsync] = useState(true);

  const [commentPlatform, setCommentPlatform] =
    useState<ContentPlatform>("youtube");
  const [commentUser, setCommentUser] = useState("blhoang23");
  const [commentPostId, setCommentPostId] = useState("yt9X1aA7cLmQ0");
  const [commentPostUrl, setCommentPostUrl] = useState("");
  const [commentLookupRequest, setCommentLookupRequest] =
    useState<CommentLookupRequest>();

  const uploadMutation = usePlatformUploadMutation(uploadPlatform);
  const agentsStatusQuery = useAgentsStatusQuery();
  const commentsLookupQuery = useUploadPostCommentsQuery({
    platform: commentLookupRequest?.platform,
    user: commentLookupRequest?.user,
    postId: commentLookupRequest?.postId,
    postUrl: commentLookupRequest?.postUrl,
    enabled: Boolean(commentLookupRequest),
  });

  const uploadAndCommentError =
    uploadMutation.error ?? commentsLookupQuery.error;

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = uploadTitle.trim();
    const filePath = uploadFilePath.trim();
    if (!title || !filePath) {
      return;
    }

    const payload: UploadVideoRequest = {
      title,
      description: uploadDescription.trim() || undefined,
      file_path: filePath,
      user: uploadUser.trim() || undefined,
      visibility: uploadVisibility,
      async_upload: uploadAsync,
      schedule_at: uploadScheduleAt
        ? new Date(uploadScheduleAt).toISOString()
        : undefined,
    };

    const normalizedTags = uploadTags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (normalizedTags.length > 0) {
      payload.tags = normalizedTags;
    }

    await uploadMutation.mutateAsync(payload);
  };

  const handleCommentLookupSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = commentUser.trim();
    const postId = commentPostId.trim();
    const postUrl = commentPostUrl.trim();

    if (!user || (!postId && !postUrl)) {
      return;
    }

    setCommentLookupRequest({
      platform: commentPlatform,
      user,
      postId: postId || undefined,
      postUrl: postUrl || undefined,
    });
  };

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

  const visibilityOptions: Array<
    NonNullable<UploadVideoRequest["visibility"]>
  > =
    uploadPlatform === "youtube"
      ? ["public", "unlisted", "private"]
      : ["public", "friends", "followers", "private"];

  const recommendationConfidenceBarData = {
    labels: recommendationQueue
      .slice(0, 8)
      .map((item, index) => `${item.platform}-${index + 1}`),
    datasets: [
      {
        label: copy("Confidence %", "Độ tin cậy %"),
        data: recommendationQueue
          .slice(0, 8)
          .map((item) => item.confidence * 100),
        backgroundColor: "rgba(59, 130, 246, 0.78)",
        borderRadius: 10,
      },
    ],
  };

  const operationOutcomeData = {
    labels: [copy("Success", "Thành công"), copy("Failed", "Thất bại")],
    datasets: [
      {
        data: [
          successfulOperations,
          Math.max(historyItems.length - successfulOperations, 0),
        ],
        backgroundColor: ["rgba(6, 182, 212, 0.8)", "rgba(249, 115, 22, 0.78)"],
        borderWidth: 0,
      },
    ],
  };

  const serviceRadarData = {
    labels: [
      copy("Health", "Sức khỏe"),
      copy("Queue", "Hàng đợi"),
      copy("Backlog", "Kho nội dung"),
      copy("Success", "Thành công"),
      copy("Coverage", "Độ phủ"),
    ],
    datasets: [
      {
        label: copy("Ops signal", "Tín hiệu vận hành"),
        data: [
          healthQuery.data?.status === "ok" ? 100 : 30,
          Math.min(recommendationQueue.length * 12, 100),
          Math.min(contentBacklog * 10, 100),
          operationsSuccessRate * 100,
          Math.min(historyItems.length * 8, 100),
        ],
        borderColor: "rgba(59, 130, 246, 0.95)",
        backgroundColor: "rgba(59, 130, 246, 0.22)",
        pointRadius: 2,
      },
    ],
  };

  const pipelineStages = [
    {
      stage: copy("Ingest", "Nap"),
      count: contentBacklog,
      tone: "border-cyan-500/30 bg-cyan-500/10",
    },
    {
      stage: copy("Queue", "Hang doi"),
      count: recommendationQueue.length,
      tone: "border-blue-500/30 bg-blue-500/10",
    },
    {
      stage: copy("Execute", "Thuc thi"),
      count: historyItems.length,
      tone: "border-violet-500/30 bg-violet-500/10",
    },
    {
      stage: copy("Validate", "Xac nhan"),
      count: successfulOperations,
      tone: "border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  const telemetryHeatMap = (() => {
    const platformEntries = Object.entries(
      latestPostAnalyticsQuery.data?.payload?.platforms ?? {},
    );

    return {
      rows: platformEntries.map(([platform]) => platform),
      columns: [
        copy("Views", "Lượt xem"),
        copy("Likes", "Lượt thích"),
        copy("Comments", "Bình luận"),
        copy("Shares", "Chia sẻ"),
      ],
      values: platformEntries.map(([, payload]) => [
        payload.post_metrics.views,
        payload.post_metrics.likes,
        payload.post_metrics.comments,
        payload.post_metrics.shares,
      ]),
    };
  })();

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

      <PanelCard
        title={copy("Pipeline Stageboard", "Bang stage pipeline")}
        description={copy(
          "A stage-by-stage automation view from content intake to successful delivery.",
          "Goc nhin theo tung stage tu nap noi dung den phan phoi thanh cong.",
        )}
        className="border-cyan-500/26 bg-linear-to-br from-cyan-100/55 via-card to-blue-100/45 dark:from-cyan-500/12 dark:via-card/92 dark:to-blue-500/10"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {pipelineStages.map((item, index) => (
            <div
              key={item.stage}
              className={cn(
                "relative rounded-2xl border p-4",
                item.tone,
                index === 1 || index === 2 ? "md:-translate-y-1" : "",
              )}
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {item.stage}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {item.count}
              </p>
              {index < pipelineStages.length - 1 ? (
                <span className="pointer-events-none absolute top-1/2 -right-2 hidden h-0.5 w-4 -translate-y-1/2 rounded-full bg-primary/45 md:block" />
              ) : null}
            </div>
          ))}
        </div>
      </PanelCard>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Runtime Signal Radar", "Radar tín hiệu runtime")}
          description={copy(
            "Composite operational signal from service and queue metrics.",
            "Tín hiệu vận hành tổng hợp từ chỉ số dịch vụ và hàng đợi.",
          )}
        >
          <RadarTrendChart
            data={serviceRadarData}
            className="bg-linear-to-br from-cyan-100/60 via-card to-blue-100/45 dark:from-cyan-500/12 dark:via-card/90 dark:to-blue-500/10"
          />
        </PanelCard>

        <PanelCard
          title={copy("Operation Outcome Mix", "Tỷ trọng kết quả tác vụ")}
          description={copy(
            "Success and failure distribution from upload operations.",
            "Phân bố thành công và thất bại từ các tác vụ upload.",
          )}
        >
          {historyItems.length > 0 ? (
            <DoughnutTrendChart
              data={operationOutcomeData}
              className="bg-linear-to-br from-blue-100/60 via-card to-orange-100/45 dark:from-blue-500/12 dark:via-card/90 dark:to-orange-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No operation history available for charting.",
                "Chưa có lịch sử tác vụ để dựng biểu đồ.",
              )}
            />
          )}
        </PanelCard>
      </div>

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
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="inline-flex size-3" />
                  {historyItems[0]?.platform ? (
                    <PlatformBadge platform={historyItems[0].platform} />
                  ) : (
                    <span>--</span>
                  )}
                </div>
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
              <>
                <BarTrendChart
                  data={recommendationConfidenceBarData}
                  className="bg-linear-to-br from-blue-100/60 via-card to-violet-100/45 dark:from-blue-500/12 dark:via-card/90 dark:to-violet-500/10"
                />
                {recommendationQueue.slice(0, 6).map((item) => (
                  <div
                    key={`${item.platform}-${item.id}`}
                    className={cn(
                      "rounded-2xl border border-border/55 bg-background/55 p-4",
                      getPlatformSurfaceClassName(item.platform),
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PlatformBadge platform={item.platform} />
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
                ))}
              </>
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
                {telemetryHeatMap.rows.length > 0 ? (
                  <HeatMatrix
                    rows={telemetryHeatMap.rows}
                    columns={telemetryHeatMap.columns}
                    values={telemetryHeatMap.values}
                    valueFormatter={(value) => formatCompactNumber(value)}
                    className="bg-linear-to-br from-cyan-100/60 via-card to-indigo-100/45 dark:from-cyan-500/12 dark:via-card/90 dark:to-indigo-500/10"
                  />
                ) : null}
                <div className="rounded-2xl border border-border/55 bg-background/55 p-4 text-xs text-muted-foreground">
                  {copy("Request ID", "Mã request")}:{" "}
                  {latestPostAnalyticsQuery.data.request_id}
                </div>

                {Object.entries(
                  latestPostAnalyticsQuery.data.payload.platforms,
                ).map(([platform, payload]) => (
                  <div
                    key={platform}
                    className={cn(
                      "rounded-2xl border border-border/55 bg-background/55 p-4",
                      getPlatformSurfaceClassName(platform),
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <PlatformBadge platform={platform} />
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
                  className={cn(
                    "grid gap-2 rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center",
                    getPlatformSurfaceClassName(item.platform),
                  )}
                >
                  <PlatformBadge
                    platform={item.platform}
                    className="justify-self-start"
                  />
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

      <PanelCard
        title={copy("Agent Runtime Mesh", "Lưới runtime agent")}
        description={copy(
          "Live process reachability from /api/v1/agents/status.",
          "Trạng thái kết nối tiến trình theo thời gian thực từ /api/v1/agents/status.",
        )}
        action={
          <Badge variant="outline" className="rounded-full border-primary/25">
            <Server className="mr-2 size-3.5" />
            {(agentsStatusQuery.data?.status ?? "unknown").toUpperCase()}
          </Badge>
        }
      >
        {agentsStatusQuery.isLoading ? (
          <PanelRowsSkeleton rows={3} />
        ) : agentsStatusQuery.error ? (
          <InlineQueryState
            state="error"
            message={getQueryErrorMessage(
              agentsStatusQuery.error,
              "Unable to load agents runtime status.",
            )}
          />
        ) : agentsStatusQuery.data?.processes.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {agentsStatusQuery.data.processes.map((process) => (
              <div
                key={process.name}
                className="rounded-2xl border border-border/55 bg-background/55 p-4"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {process.name}
                </p>
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  {process.url}
                </p>
                <p
                  className={cn(
                    "mt-2 text-sm font-medium",
                    process.reachable ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {process.reachable
                    ? copy("Reachable", "Kết nối được")
                    : copy("Unreachable", "Mất kết nối")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No agent process data returned.",
              "Chưa có dữ liệu tiến trình agent.",
            )}
          />
        )}
      </PanelCard>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy(
            "Content Publishing Console",
            "Bảng điều khiển đăng nội dung",
          )}
          description={copy(
            "Publish real videos via /api/v1/tiktok/upload and /api/v1/youtube/upload.",
            "Đăng video thật qua /api/v1/tiktok/upload và /api/v1/youtube/upload.",
          )}
        >
          <form
            className="space-y-3"
            onSubmit={(event) => {
              void handleUploadSubmit(event);
            }}
          >
            <div className="flex flex-wrap gap-2">
              {(["tiktok", "youtube"] as const).map((platform) => {
                const active = uploadPlatform === platform;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setUploadPlatform(platform)}
                    className={cn(
                      "rounded-full border px-1.5 py-1 transition-colors",
                      active
                        ? "border-primary/45 bg-primary/10"
                        : "border-border/70 bg-background/70",
                    )}
                  >
                    <PlatformBadge platform={platform} />
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="upload-title">{copy("Title", "Tiêu đề")}</Label>
                <Input
                  id="upload-title"
                  value={uploadTitle}
                  onChange={(event) => setUploadTitle(event.target.value)}
                  placeholder="AI Workflow That Saved Me 10 Hours"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="upload-user">
                  {copy("Profile", "Profile")}
                </Label>
                <Input
                  id="upload-user"
                  value={uploadUser}
                  onChange={(event) => setUploadUser(event.target.value)}
                  placeholder="blhoang23"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="upload-file-path">
                {copy("File Path", "Đường dẫn file")}
              </Label>
              <Input
                id="upload-file-path"
                value={uploadFilePath}
                onChange={(event) => setUploadFilePath(event.target.value)}
                placeholder="D:/media/my-video.mp4 or https://..."
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="upload-description">
                {copy("Description", "Mô tả")}
              </Label>
              <Textarea
                id="upload-description"
                value={uploadDescription}
                onChange={(event) => setUploadDescription(event.target.value)}
                placeholder={copy(
                  "Add a short caption or description for upload.",
                  "Thêm caption hoặc mô tả ngắn cho nội dung upload.",
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor="upload-visibility">
                  {copy("Visibility", "Chế độ hiển thị")}
                </Label>
                <select
                  id="upload-visibility"
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                  value={uploadVisibility}
                  onChange={(event) =>
                    setUploadVisibility(
                      event.target.value as NonNullable<
                        UploadVideoRequest["visibility"]
                      >,
                    )
                  }
                >
                  {visibilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="upload-tags">{copy("Tags", "Tags")}</Label>
                <Input
                  id="upload-tags"
                  value={uploadTags}
                  onChange={(event) => setUploadTags(event.target.value)}
                  placeholder="ai, automation, content"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="upload-schedule">
                  {copy("Schedule", "Lịch đăng")}
                </Label>
                <Input
                  id="upload-schedule"
                  type="datetime-local"
                  value={uploadScheduleAt}
                  onChange={(event) => setUploadScheduleAt(event.target.value)}
                />
              </div>
              <label className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={uploadAsync}
                  onChange={(event) => setUploadAsync(event.target.checked)}
                  className="size-4 accent-primary"
                />
                {copy("Async Upload", "Upload bất đồng bộ")}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={uploadMutation.isPending}
            >
              <Upload data-icon="inline-start" />
              {uploadMutation.isPending
                ? copy("Publishing...", "Đang đăng...")
                : copy("Publish Content", "Đăng nội dung")}
            </Button>

            {uploadAndCommentError ? (
              <InlineQueryState
                state="error"
                className="py-3"
                message={getQueryErrorMessage(
                  uploadAndCommentError,
                  "Unable to complete upload or comment lookup operation.",
                )}
              />
            ) : null}

            {uploadMutation.data ? (
              <div className="rounded-2xl border border-border/55 bg-background/70 p-3 text-xs text-muted-foreground">
                <p>
                  {copy("Status", "Trạng thái")}: {uploadMutation.data.status}
                </p>
                <p>
                  {copy("External ID", "Mã ngoài")}:{" "}
                  {uploadMutation.data.external_post_id}
                </p>
                <p>
                  {copy("Mode", "Chế độ")}: {uploadMutation.data.upload_mode}
                </p>
                <p className="mt-1 text-foreground">
                  {uploadMutation.data.message}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Comment Relay Console", "Bảng điều khiển bình luận")}
          description={copy(
            "Lookup comments via /api/v1/upload-post/interactions/comments by post_id or post_url.",
            "Tra cứu bình luận qua /api/v1/upload-post/interactions/comments bằng post_id hoặc post_url.",
          )}
        >
          <form className="space-y-3" onSubmit={handleCommentLookupSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="comment-platform">
                  {copy("Platform", "Nền tảng")}
                </Label>
                <select
                  id="comment-platform"
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                  value={commentPlatform}
                  onChange={(event) =>
                    setCommentPlatform(event.target.value as ContentPlatform)
                  }
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="comment-user">
                  {copy("User", "Người dùng")}
                </Label>
                <Input
                  id="comment-user"
                  value={commentUser}
                  onChange={(event) => setCommentUser(event.target.value)}
                  placeholder="blhoang23"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="comment-post-id">Post ID</Label>
              <Input
                id="comment-post-id"
                value={commentPostId}
                onChange={(event) => setCommentPostId(event.target.value)}
                placeholder="yt9X1aA7cLmQ0"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="comment-post-url">Post URL</Label>
              <Input
                id="comment-post-url"
                value={commentPostUrl}
                onChange={(event) => setCommentPostUrl(event.target.value)}
                placeholder="https://www.tiktok.com/@blhoang23/video/..."
              />
            </div>

            <Button type="submit" className="w-full" variant="outline">
              <Send data-icon="inline-start" />
              {copy("Load Comments", "Tải bình luận")}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {commentsLookupQuery.isFetching ? (
              <PanelRowsSkeleton rows={3} />
            ) : commentsLookupQuery.data?.payload.comments.length ? (
              commentsLookupQuery.data.payload.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-border/55 bg-background/55 p-3"
                >
                  <p className="text-sm leading-6 text-foreground">
                    "{comment.text}"
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>@{comment.user.username}</span>
                    <span>{formatDateTime(comment.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : commentLookupRequest ? (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No comments found for this query.",
                  "Không có bình luận cho truy vấn này.",
                )}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border/65 bg-background/45 p-4 text-xs text-muted-foreground">
                <MessageSquareText className="mb-2 size-4" />
                {copy(
                  "Run a lookup to fetch comments by post id or post URL.",
                  "Thực hiện truy vấn để lấy bình luận theo post id hoặc post URL.",
                )}
              </div>
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
