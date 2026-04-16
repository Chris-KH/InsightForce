import { useMemo } from "react";

import type { TrendAnalyzeResultItem } from "@/api";
import {
  BarTrendChart,
  DoughnutTrendChart,
  LineTrendChart,
} from "@/components/app-data-viz";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import {
  formatPlatformLabel,
  normalizeGeneratedContent,
  summarizeCaptionLength,
  toPublishingWindowTokens,
} from "@/lib/orchestrator-intelligence";
import {
  extractInterestValues,
  sanitizeTrendResults,
} from "@/lib/trend-intelligence";

const INTEREST_CURVE_COLORS = [
  {
    border: "rgba(59, 130, 246, 0.95)",
    background: "rgba(59, 130, 246, 0.14)",
  },
  {
    border: "rgba(16, 185, 129, 0.92)",
    background: "rgba(16, 185, 129, 0.14)",
  },
  {
    border: "rgba(249, 115, 22, 0.9)",
    background: "rgba(249, 115, 22, 0.14)",
  },
];

function computeAverageTrendScore(results: TrendAnalyzeResultItem[]) {
  if (results.length === 0) {
    return 0;
  }

  return (
    results.reduce((total, result) => total + result.trend_score, 0) /
    results.length
  );
}

function buildInterestLabels(count: number) {
  return Array.from({ length: count }, (_, index) => `T${index + 1}`);
}

export function AutomationLatestOrchestrationOutput() {
  const copy = useBilingual();
  const latestOrchestrationResponse = useAppSelector(
    (state) => state.runtimeTasks.automation.orchestration.data,
  );

  const latestOrchestrationOutput = latestOrchestrationResponse?.output;

  const latestTrendResults = useMemo(
    () =>
      sanitizeTrendResults(latestOrchestrationOutput?.trend_analysis.results),
    [latestOrchestrationOutput?.trend_analysis.results],
  );

  const latestGeneratedContent = useMemo(
    () =>
      normalizeGeneratedContent(latestOrchestrationOutput?.generated_content),
    [latestOrchestrationOutput?.generated_content],
  );

  const averageLatestTrendScore = useMemo(
    () => computeAverageTrendScore(latestTrendResults),
    [latestTrendResults],
  );

  const latestTopTrend = latestTrendResults[0];

  const latestTrendBarData = useMemo(
    () => ({
      labels: latestTrendResults.map((result) => result.main_keyword),
      datasets: [
        {
          label: copy("Trend score", "Điểm trend"),
          data: latestTrendResults.map((result) => result.trend_score),
          borderRadius: 10,
          backgroundColor: [
            "rgba(59, 130, 246, 0.85)",
            "rgba(16, 185, 129, 0.82)",
            "rgba(249, 115, 22, 0.82)",
            "rgba(168, 85, 247, 0.82)",
            "rgba(236, 72, 153, 0.8)",
          ],
        },
      ],
    }),
    [copy, latestTrendResults],
  );

  const latestInterestLineData = useMemo(() => {
    const trendWithSeries = latestTrendResults
      .slice(0, 3)
      .map((result) => ({
        keyword: result.main_keyword,
        values: extractInterestValues(result),
      }))
      .filter((item) => item.values.length > 0);

    const maxSeriesLength = trendWithSeries.reduce(
      (maxLength, item) => Math.max(maxLength, item.values.length),
      0,
    );

    if (maxSeriesLength === 0) {
      return null;
    }

    return {
      labels: buildInterestLabels(maxSeriesLength),
      datasets: trendWithSeries.map((item, index) => {
        const palette =
          INTEREST_CURVE_COLORS[index % INTEREST_CURVE_COLORS.length];

        return {
          label: item.keyword,
          data: Array.from({ length: maxSeriesLength }, (_, pointIndex) => {
            const value = item.values[pointIndex];
            return Number.isFinite(value) ? value : 0;
          }),
          borderColor: palette.border,
          backgroundColor: palette.background,
          fill: true,
          tension: 0.32,
          pointRadius: 2.6,
          pointHoverRadius: 4,
          borderWidth: 2,
        };
      }),
    };
  }, [latestTrendResults]);

  const latestPlatformMixData = useMemo(() => {
    if (latestGeneratedContent.platformPosts.length === 0) {
      return null;
    }

    return {
      labels: latestGeneratedContent.platformPosts.map((post) =>
        formatPlatformLabel(post.platform),
      ),
      datasets: [
        {
          label: copy("Hashtag volume", "Khối lượng hashtag"),
          data: latestGeneratedContent.platformPosts.map((post) =>
            Math.max(post.hashtags.length, 1),
          ),
          backgroundColor: [
            "rgba(59, 130, 246, 0.82)",
            "rgba(16, 185, 129, 0.82)",
            "rgba(249, 115, 22, 0.82)",
            "rgba(236, 72, 153, 0.78)",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [copy, latestGeneratedContent.platformPosts]);

  const latestPublishingWindows = useMemo(
    () =>
      latestGeneratedContent.platformPosts.flatMap((post) => {
        const windows = toPublishingWindowTokens(post.bestPostTime);

        if (windows.length === 0) {
          return [];
        }

        return windows.map((windowLabel) => ({
          platform: formatPlatformLabel(post.platform),
          windowLabel,
        }));
      }),
    [latestGeneratedContent.platformPosts],
  );

  const latestHashtags = useMemo(() => {
    const allTags = latestTrendResults.flatMap((result) => result.top_hashtags);
    return [...new Set(allTags.map((tag) => tag.trim()).filter(Boolean))].slice(
      0,
      14,
    );
  }, [latestTrendResults]);

  if (!latestOrchestrationResponse) {
    return null;
  }

  return (
    <>
      <section
        id="latest-orchestration-output"
        className="grid scroll-mt-28 gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <PanelCard
          title={copy(
            "Latest Orchestration Output",
            "Output orchestration mới nhất",
          )}
          description={copy(
            "Freshly generated trend intelligence and content package from your latest run.",
            "Gói trend intelligence và nội dung vừa được tạo từ phiên chạy gần nhất.",
          )}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                {copy("Trend signals", "Tín hiệu trend")}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatCompactNumber(latestTrendResults.length)}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                {copy("Average score", "Điểm trung bình")}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatPercentFromRatio(averageLatestTrendScore / 100)}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                {copy("Storyboard sections", "Số phân đoạn")}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatCompactNumber(latestGeneratedContent.sections.length)}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="text-[10px] tracking-[0.13em] text-muted-foreground uppercase">
                {copy("Platform packs", "Gói nền tảng")}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatCompactNumber(
                  latestGeneratedContent.platformPosts.length,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-primary/22 bg-primary/7 p-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
              {copy("Selected keyword", "Keyword được chọn")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {latestGeneratedContent.selectedKeyword ||
                latestTopTrend?.main_keyword ||
                "--"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {latestGeneratedContent.mainTitle ||
                latestGeneratedContent.videoScriptTitle ||
                "--"}
            </p>
          </div>

          {latestOrchestrationOutput?.trend_analysis.markdown_summary ? (
            <div className="mt-4 rounded-2xl border border-border/55 bg-background/60 p-4 text-sm text-muted-foreground">
              <p className="mb-1 text-xs font-semibold tracking-[0.12em] uppercase">
                {copy("Narrative summary", "Tóm tắt diễn giải")}
              </p>
              <p className="whitespace-pre-wrap">
                {latestOrchestrationOutput.trend_analysis.markdown_summary}
              </p>
            </div>
          ) : null}

          {latestHashtags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {latestHashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </PanelCard>

        <PanelCard
          title={copy("Run Metadata", "Metadata phiên chạy")}
          description={copy(
            "Operational identifiers and artifact pointers returned by backend orchestrator.",
            "Định danh vận hành và đường dẫn artifact được trả về từ backend orchestrator.",
          )}
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
              <p>
                {copy("Status", "Trạng thái")}:{" "}
                {latestOrchestrationResponse.status}
              </p>
              <p className="mt-1">
                {copy("Trend Analysis ID", "Trend Analysis ID")}:{" "}
                {latestOrchestrationResponse.trend_analysis_id ?? "--"}
              </p>
              <p className="mt-1">
                {copy("Generated Content ID", "Generated Content ID")}:{" "}
                {latestOrchestrationResponse.generated_content_id ?? "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
              <p>
                {copy("Raw response file", "File raw response")}:{" "}
                {latestOrchestrationResponse.raw_response_file ?? "--"}
              </p>
              <p className="mt-1">
                {copy("Output file", "File output")}:{" "}
                {latestOrchestrationResponse.output_file ?? "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
              <p>
                {copy("Run duration profile", "Hồ sơ thời lượng")}:{" "}
                {latestGeneratedContent.durationEstimate || "60s"}
              </p>
              <p className="mt-1">
                {copy("Music mood", "Mood nhạc")}:{" "}
                {latestGeneratedContent.musicMood ||
                  latestGeneratedContent.musicBackground ||
                  "--"}
              </p>
              <p className="mt-1">
                {copy("Captions style", "Phong cách phụ đề")}:{" "}
                {latestGeneratedContent.captionsStyle || "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("Quality signal", "Tín hiệu chất lượng")}
              </p>
              <p className="mt-1">
                {latestGeneratedContent.hasError
                  ? copy(
                      "Generated content includes an error marker. Review output before publishing.",
                      "Generated content có cờ lỗi. Hãy kiểm tra output trước khi xuất bản.",
                    )
                  : copy(
                      "No error marker detected in generated content block.",
                      "Không phát hiện cờ lỗi trong generated content block.",
                    )}
              </p>
            </div>
          </div>
        </PanelCard>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Trend Score Distribution", "Phân bố điểm trend")}
          description={copy(
            "Score comparison of ranked opportunities returned by orchestrator.",
            "So sánh điểm của các cơ hội đã xếp hạng từ orchestrator.",
          )}
        >
          {latestTrendResults.length > 0 ? (
            <BarTrendChart
              data={latestTrendBarData}
              className="bg-linear-to-br from-sky-100/55 via-card to-indigo-100/45 dark:from-sky-500/12 dark:via-card/90 dark:to-indigo-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend result returned from latest orchestration run.",
                "Phiên orchestration gần nhất chưa trả về trend result.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Interest Pulse Timeline", "Đường xung quan tâm")}
          description={copy(
            "Short-horizon momentum from interest_over_day of the strongest trend signals.",
            "Động lượng ngắn hạn từ interest_over_day của các tín hiệu trend mạnh nhất.",
          )}
        >
          {latestInterestLineData ? (
            <LineTrendChart
              data={latestInterestLineData}
              className="bg-linear-to-br from-emerald-100/55 via-card to-cyan-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-cyan-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No interest timeline values available in current output.",
                "Không có giá trị timeline interest trong output hiện tại.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Platform Post Mix", "Phân bổ post theo nền tảng")}
          description={copy(
            "Caption package readiness for each social platform in generated_content.platform_posts.",
            "Mức sẵn sàng gói caption cho từng nền tảng trong generated_content.platform_posts.",
          )}
        >
          {latestPlatformMixData ? (
            <DoughnutTrendChart
              data={latestPlatformMixData}
              className="bg-linear-to-br from-violet-100/55 via-card to-fuchsia-100/45 dark:from-violet-500/12 dark:via-card/90 dark:to-fuchsia-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No platform post package found in generated content output.",
                "Chưa có gói post nền tảng trong generated content output.",
              )}
            />
          )}

          {latestGeneratedContent.platformPosts.length > 0 ? (
            <div className="mt-4 space-y-3">
              {latestGeneratedContent.platformPosts.map((post) => (
                <div
                  key={post.platform}
                  className="rounded-2xl border border-border/60 bg-background/65 p-3"
                >
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {formatPlatformLabel(post.platform)}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {post.caption || "--"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {copy("Caption length", "Độ dài caption")}:{" "}
                    {formatCompactNumber(summarizeCaptionLength(post.caption))}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Best posting window", "Khung giờ đăng")}:{" "}
                    {post.bestPostTime || "--"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("CTA", "CTA")}: {post.cta || "--"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <Badge
                        key={`${post.platform}-${tag}`}
                        variant="outline"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </PanelCard>

        <PanelCard
          title={copy("Script Blueprint", "Blueprint kịch bản")}
          description={copy(
            "Scene-by-scene script structure generated by the backend content agent.",
            "Cấu trúc kịch bản theo từng cảnh được backend content agent tạo ra.",
          )}
        >
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {copy("Hook", "Hook")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {latestGeneratedContent.hook || "--"}
            </p>
          </div>

          {latestGeneratedContent.sections.length > 0 ? (
            <div className="mt-4 space-y-3">
              {latestGeneratedContent.sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-border/60 bg-background/65 p-3"
                >
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                    {section.timestamp}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {section.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {section.narration || "--"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Editing notes", "Ghi chú dựng")}:{" "}
                    {section.notes || "--"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No script sections returned in latest generated content.",
                "Chưa có script sections trong generated content gần nhất.",
              )}
            />
          )}

          {latestPublishingWindows.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-border/60 bg-background/65 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy(
                  "Publishing windows detected",
                  "Khung giờ đăng được phát hiện",
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {latestPublishingWindows.map((item, index) => (
                  <Badge
                    key={`${item.platform}-${item.windowLabel}-${index}`}
                    variant="outline"
                    className="rounded-full"
                  >
                    {item.platform}: {item.windowLabel}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </PanelCard>
      </div>

      <PanelCard
        title={copy(
          "Storyboard Preview (Mock Images)",
          "Storyboard preview (ảnh mock)",
        )}
        description={copy(
          "Images are mocked while section thumbnail output paths are not public URLs.",
          "Ảnh đang dùng mock trong khi output_path thumbnail chưa phải public URL.",
        )}
      >
        {latestGeneratedContent.sections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {latestGeneratedContent.sections.map((section) => (
              <article
                key={`storyboard-${section.id}`}
                className="overflow-hidden rounded-2xl border border-border/65 bg-background/70"
              >
                <img
                  src={section.imageUrl}
                  alt={`${section.label} mock preview`}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-1.5 p-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                    {section.timestamp}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {section.label}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {section.thumbnailPrompt || section.narration || "--"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {copy("Output path", "Output path")}:{" "}
                    {section.thumbnailOutputPath || "(mock-only)"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No storyboard sections available to preview yet.",
              "Chưa có phân đoạn storyboard để preview.",
            )}
          />
        )}
      </PanelCard>
    </>
  );
}
