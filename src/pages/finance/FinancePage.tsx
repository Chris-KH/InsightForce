import { BarChart3, Coins, Eye, History, Sparkles, Wallet } from "lucide-react";

import {
  useUploadPostHistoryQuery,
  useUploadPostPostAnalyticsQuery,
  useUploadPostProfileAnalyticsQuery,
  useUploadPostTotalImpressionsQuery,
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
  formatNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";

export function FinancePage() {
  const copy = useBilingual();

  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });

  const historyItems = historyQuery.data?.payload.history ?? [];
  const profileUsername = historyItems[0]?.profile_username;
  const latestRequestId = historyItems[0]?.request_id;

  const profileAnalyticsQuery = useUploadPostProfileAnalyticsQuery({
    profileUsername,
    platforms: ["youtube", "tiktok"],
    enabled: Boolean(profileUsername),
  });

  const totalImpressionsQuery = useUploadPostTotalImpressionsQuery({
    profileUsername,
    period: "last_week",
    platforms: ["youtube", "tiktok"],
    metrics: ["impressions", "likes", "comments", "shares"],
    breakdown: true,
    enabled: Boolean(profileUsername),
  });

  const latestPostAnalyticsQuery = useUploadPostPostAnalyticsQuery({
    requestId: latestRequestId,
    enabled: Boolean(latestRequestId),
  });

  const allQueries = [
    historyQuery,
    profileAnalyticsQuery,
    totalImpressionsQuery,
    latestPostAnalyticsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const firstError = allQueries.find((query) => query.error)?.error;

  const summary = profileAnalyticsQuery.data?.payload.summary;
  const totals = totalImpressionsQuery.data?.payload.metrics;
  const breakdown = totalImpressionsQuery.data?.payload.breakdown;

  const successfulUploads = historyItems.filter((item) => item.success).length;
  const uploadSuccessRate = historyItems.length
    ? successfulUploads / historyItems.length
    : 0;

  const impressionsTimeline = Object.entries(
    totalImpressionsQuery.data?.payload.per_day.impressions ?? {},
  ).sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Monetization Ops", "Vận hành kiếm tiền")}
        title={copy(
          "Upload-Post Analytics Center",
          "Trung tâm phân tích Upload-Post",
        )}
        description={copy(
          "Finance screens now mirror real profile analytics, total impressions, and post-level performance from backend upload-post endpoints.",
          "Màn hình tài chính hiện phản ánh dữ liệu thật từ endpoint upload-post gồm profile analytics, total impressions và hiệu suất từng bài đăng.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {profileUsername
              ? `${copy("Profile", "Hồ sơ")}: ${profileUsername}`
              : copy("Profile loading", "Đang tải hồ sơ")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={getQueryErrorMessage(
            firstError,
            "Unable to load finance analytics.",
          )}
          hint={copy(
            "Finance view requires /upload-post/history, /analytics/profiles, and /analytics/posts endpoints.",
            "Màn hình tài chính cần các endpoint /upload-post/history, /analytics/profiles và /analytics/posts.",
          )}
        />
      ) : null}

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Total Impressions", "Tổng impressions")}
            value={
              isLoading
                ? "--"
                : formatCompactNumber(
                    totals?.impressions ?? summary?.impressions ?? 0,
                  )
            }
            detail={copy(
              "From total-impressions endpoint",
              "Lấy từ endpoint total-impressions",
            )}
            icon={<Eye className="size-5" />}
          />
          <MetricCard
            label={copy("Total Engagement", "Tổng tương tác")}
            value={
              isLoading
                ? "--"
                : formatCompactNumber(
                    (totals?.likes ?? 0) +
                      (totals?.comments ?? 0) +
                      (totals?.shares ?? 0),
                  )
            }
            detail={copy(
              "Likes + comments + shares",
              "Likes + comments + shares",
            )}
            icon={<Coins className="size-5" />}
          />
          <MetricCard
            label={copy("Cross-Platform Followers", "Follower đa nền tảng")}
            value={
              isLoading ? "--" : formatCompactNumber(summary?.followers ?? 0)
            }
            detail={copy(
              "Summed from selected platforms",
              "Tổng hợp từ các nền tảng đã chọn",
            )}
            icon={<Wallet className="size-5" />}
          />
          <MetricCard
            label={copy("Upload Success Rate", "Tỷ lệ upload thành công")}
            value={isLoading ? "--" : formatPercentFromRatio(uploadSuccessRate)}
            detail={copy(
              "Calculated from upload history",
              "Tính từ lịch sử upload",
            )}
            icon={<BarChart3 className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Platform Breakdown", "Phân rã theo nền tảng")}
          description={copy(
            "Per-platform performance from profile analytics and total impressions.",
            "Hiệu suất theo nền tảng từ profile analytics và total impressions.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : Object.entries(
                profileAnalyticsQuery.data?.payload.platforms ?? {},
              ).length > 0 ? (
              Object.entries(
                profileAnalyticsQuery.data?.payload.platforms ?? {},
              ).map(([platform, metrics]) => {
                const platformImpressions =
                  breakdown?.[platform]?.impressions ?? metrics.impressions;

                return (
                  <div
                    key={platform}
                    className="rounded-2xl border border-border/55 bg-background/55 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full capitalize"
                      >
                        {platform}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {copy("Followers", "Follower")}:{" "}
                        {formatNumber(metrics.followers)}
                      </p>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <p>
                        {copy("Reach", "Độ phủ")}:{" "}
                        {formatCompactNumber(metrics.reach)}
                      </p>
                      <p>
                        {copy("Views", "Lượt xem")}:{" "}
                        {formatCompactNumber(metrics.views)}
                      </p>
                      <p>
                        {copy("Impressions", "Impressions")}:{" "}
                        {formatCompactNumber(platformImpressions)}
                      </p>
                      <p>
                        {copy("Comments", "Bình luận")}:{" "}
                        {formatCompactNumber(metrics.comments)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No platform breakdown available.",
                  "Chưa có dữ liệu phân rã theo nền tảng.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Impressions Timeline", "Dòng thời gian impressions")}
          description={copy(
            "Daily totals from /total-impressions per_day.impressions.",
            "Tổng theo ngày từ /total-impressions per_day.impressions.",
          )}
        >
          <div className="space-y-2">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : impressionsTimeline.length > 0 ? (
              impressionsTimeline.map(([date, value]) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{date}</span>
                  <span className="font-medium text-foreground">
                    {formatCompactNumber(value)}
                  </span>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No timeline values available.",
                  "Chưa có giá trị dòng thời gian.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelCard
          title={copy("Latest Request Analytics", "Phân tích request mới nhất")}
          description={copy(
            "Detail view from /analytics/posts/{request_id}.",
            "Chi tiết từ /analytics/posts/{request_id}.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : latestPostAnalyticsQuery.data?.payload ? (
              <>
                <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                  <p className="text-xs text-muted-foreground">
                    {copy("Request", "Request")}:{" "}
                    {latestPostAnalyticsQuery.data.request_id}
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {latestPostAnalyticsQuery.data.payload.post.post_title}
                  </p>
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
                          ? copy("Success", "Thành công")
                          : copy("Failed", "Thất bại")}
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
                  "No post analytics available for latest request.",
                  "Chưa có analytics bài đăng cho request mới nhất.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Upload History", "Lịch sử upload")}
          description={copy(
            "Operational ledger from /upload-post/history.",
            "Sổ vận hành từ /upload-post/history.",
          )}
          action={
            <Badge variant="outline" className="rounded-full">
              <History className="mr-2 size-3.5" />
              {historyItems.length} {copy("entries", "bản ghi")}
            </Badge>
          }
        >
          <div className="space-y-2">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={5} />
            ) : historyItems.length > 0 ? (
              historyItems.slice(0, 10).map((item) => (
                <div
                  key={`${item.request_id}-${item.platform}`}
                  className="grid gap-2 rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center"
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
                  <p className="text-muted-foreground">
                    {formatCompactNumber(item.media_size_bytes)}{" "}
                    {copy("bytes", "bytes")}
                  </p>
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
                  "No upload history available.",
                  "Chưa có lịch sử upload.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
