import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  Bot,
  CheckCircle2,
  Cpu,
  MessageSquareText,
  Send,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

import {
  type ContentPlatform,
  useAgentsStatusQuery,
  useHealthQuery,
  useUploadPostCommentsQuery,
  useUploadPostHistoryQuery,
  useUploadPostPostAnalyticsQuery,
  useTikTokRecommendationsQuery,
  useTikTokVideosQuery,
  useYouTubeRecommendationsQuery,
  useYouTubeVideosQuery,
} from "@/api";
import { BarTrendChart, DoughnutTrendChart } from "@/components/app-data-viz";
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

type RecommendationQueueItem = {
  platform: "tiktok" | "youtube";
  id: string;
  idea: string;
  confidence: number;
  rationale: string;
};

export function AutomationPage() {
  const copy = useBilingual();

  const [commentPlatform, setCommentPlatform] =
    useState<ContentPlatform>("youtube");
  const [commentUser, setCommentUser] = useState("blhoang23");
  const [commentPostId, setCommentPostId] = useState("yt9X1aA7cLmQ0");
  const [commentPostUrl, setCommentPostUrl] = useState("");
  const [commentLookupRequest, setCommentLookupRequest] =
    useState<CommentLookupRequest>();

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
  const agentsStatusQuery = useAgentsStatusQuery();

  const latestRequestId = historyQuery.data?.payload.history[0]?.request_id;
  const latestPostAnalyticsQuery = useUploadPostPostAnalyticsQuery({
    requestId: latestRequestId,
    enabled: Boolean(latestRequestId),
  });

  const commentsLookupQuery = useUploadPostCommentsQuery({
    platform: commentLookupRequest?.platform,
    user: commentLookupRequest?.user,
    postId: commentLookupRequest?.postId,
    postUrl: commentLookupRequest?.postUrl,
    enabled: Boolean(commentLookupRequest),
  });

  const dashboardQueries = [
    healthQuery,
    historyQuery,
    tikTokRecommendationsQuery,
    youTubeRecommendationsQuery,
    tikTokVideosQuery,
    youTubeVideosQuery,
    latestPostAnalyticsQuery,
    agentsStatusQuery,
  ];

  const isInitialLoading = dashboardQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const isLoading = dashboardQueries.some((query) => query.isLoading);
  const firstError = dashboardQueries.find((query) => query.error)?.error;

  const historyItems = historyQuery.data?.payload.history ?? [];
  const successfulOperations = historyItems.filter(
    (item) => item.success,
  ).length;
  const operationsSuccessRate = historyItems.length
    ? successfulOperations / historyItems.length
    : 0;

  const contentBacklog =
    (tikTokVideosQuery.data?.videos.length ?? 0) +
    (youTubeVideosQuery.data?.videos.length ?? 0);

  const recommendationQueue: RecommendationQueueItem[] = [
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

  const latestPlatforms = latestPostAnalyticsQuery.data?.payload?.platforms;

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Automation Ops", "Vận hành tự động")}
        title={copy("Automation Command Center", "Trung tâm tự động hóa")}
        description={copy(
          "Operational status from health checks, recommendation queues, publishing history, and performance signals.",
          "Trạng thái vận hành từ kiểm tra hệ thống, hàng đợi đề xuất, lịch sử đăng bài và các tín hiệu hiệu suất.",
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
            "Some data sources may be syncing. You can continue working and refresh shortly.",
            "Một số nguồn dữ liệu có thể đang đồng bộ. Bạn vẫn có thể làm việc và thử làm mới sau ít phút.",
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
              "Videos currently ready in your content pipeline",
              "Số video hiện sẵn sàng trong luồng nội dung",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Processed Operations", "Tác vụ đã xử lý")}
            value={isLoading ? "--" : formatCompactNumber(historyItems.length)}
            detail={copy(
              "Based on recent publishing activity",
              "Dựa trên hoạt động đăng bài gần đây",
            )}
            icon={<Cpu className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Publish Operations Path", "Lộ trình vận hành publish")}
          description={copy(
            "Publishing is handled in a dedicated workspace to keep this page focused on monitoring and decision support.",
            "Publish được xử lý ở một không gian chuyên biệt để trang này tập trung vào theo dõi và hỗ trợ quyết định.",
          )}
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/25 bg-primary/8 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Canonical Publish UI", "Giao diện publish chuẩn")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Use Publish Ops to prepare channels, captions, schedule timing, and media assets in one guided flow.",
                  "Dùng Publish Ops để chuẩn bị kênh đăng, caption, lịch đăng và media trong một luồng hướng dẫn duy nhất.",
                )}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild>
                <Link to="/app/publish-ops">
                  <Workflow className="mr-1.5 size-4" />
                  {copy("Open Publish Ops", "Mở Publish Ops")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/app/finance-control">
                  <Cpu className="mr-1.5 size-4" />
                  {copy("Check Finance Control", "Kiểm tra Finance Control")}
                </Link>
              </Button>
            </div>

            {historyItems[0] ? (
              <div className="rounded-2xl border border-border/55 bg-background/55 p-4 text-xs text-muted-foreground">
                <p>
                  {copy("Latest campaign", "Chiến dịch gần nhất")}:{" "}
                  {historyItems[0].post_title ||
                    copy("Untitled post", "Bài chưa đặt tiêu đề")}
                </p>
                <p className="mt-1">
                  {copy("Platform", "Nền tảng")}: {historyItems[0].platform}
                </p>
                <p className="mt-1">
                  {copy("Uploaded", "Tải lên")}:{" "}
                  {formatDateTime(historyItems[0].upload_timestamp)}
                </p>
              </div>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No publish request history found yet.",
                  "Chưa có lịch sử request publish.",
                )}
              />
            )}

            {latestPlatforms ? (
              <div className="space-y-2">
                {Object.entries(latestPlatforms).map(([platform, payload]) => (
                  <div
                    key={platform}
                    className={cn(
                      "rounded-xl border border-border/55 bg-background/55 px-3 py-2 text-xs text-muted-foreground",
                      getPlatformSurfaceClassName(platform),
                    )}
                  >
                    <p className="font-medium text-foreground">{platform}</p>
                    <p>
                      {copy("Views", "Lượt xem")}:{" "}
                      {formatCompactNumber(payload.post_metrics.views)}
                    </p>
                    <p>
                      {copy("Likes", "Lượt thích")}:{" "}
                      {formatCompactNumber(payload.post_metrics.likes)}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
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
          "Live readiness of each assistant used in your automation workflow.",
          "Mức sẵn sàng theo thời gian thực của từng trợ lý trong luồng tự động hóa của bạn.",
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
                <p className="mt-2 text-xs text-muted-foreground">
                  {process.reachable
                    ? copy(
                        "Ready to support your workflow.",
                        "Sẵn sàng hỗ trợ luồng làm việc của bạn.",
                      )
                    : copy(
                        "Temporarily unavailable, retrying automatically.",
                        "Tạm thời gián đoạn, hệ thống sẽ tự thử lại.",
                      )}
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

      <PanelCard
        title={copy("Comment Relay Console", "Bảng điều khiển bình luận")}
        description={copy(
          "Look up comments by post code or post link to understand audience reactions quickly.",
          "Tra cứu bình luận theo mã bài hoặc đường dẫn bài đăng để nắm phản hồi khán giả nhanh hơn.",
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
              <Label htmlFor="comment-user">{copy("User", "Người dùng")}</Label>
              <Input
                id="comment-user"
                value={commentUser}
                onChange={(event) => setCommentUser(event.target.value)}
                placeholder="blhoang23"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="comment-post-id">
              {copy("Post Code", "Mã bài đăng")}
            </Label>
            <Input
              id="comment-post-id"
              value={commentPostId}
              onChange={(event) => setCommentPostId(event.target.value)}
              placeholder="yt9X1aA7cLmQ0"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="comment-post-url">
              {copy("Post Link", "Đường dẫn bài đăng")}
            </Label>
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
  );
}
