import { useMemo, useState, type FormEvent } from "react";
import {
  Bot,
  FileJson,
  FlaskConical,
  Loader2,
  PlayCircle,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import {
  type GeneratedContentResponse,
  type OrchestratorResponse,
  type TrendAnalyzeResultItem,
  useAgentsOrchestrateMutation,
  useGeneratedContentsQuery,
  useTrendHistoryQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatPercentValue,
} from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

const DEFAULT_PROMPT =
  "Hôm nay mình nên làm nội dung gì để tăng tương tác tự nhiên trong tệp người theo dõi hiện tại?";

const QUICK_PROMPTS = [
  "Chọn 3 chủ đề hot nhất hôm nay cho creator mảng lifestyle, ưu tiên khả năng viral tự nhiên.",
  "Tìm giúp mình góc nội dung dễ quay tại nhà nhưng vẫn đủ khác biệt với đối thủ.",
  "Đề xuất 5 ý tưởng video ngắn có hook mạnh cho tuần này và gợi ý CTA phù hợp.",
  "Nếu muốn tăng tỉ lệ lưu bài, mình nên đi theo chủ đề nào trong 7 ngày tới?",
];

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getTopTrendScore(results: TrendAnalyzeResultItem[]) {
  if (results.length === 0) {
    return 0;
  }
  return Math.max(...results.map((item) => item.trend_score));
}

function getRecentMainTitle(record: GeneratedContentResponse) {
  return record.main_title || record.selected_keyword || "--";
}

export function StrategyLabPage() {
  const copy = useBilingual();

  const trendHistoryQuery = useTrendHistoryQuery({ limit: 10 });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 10 });
  const orchestrateMutation = useAgentsOrchestrateMutation();

  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [saveFiles, setSaveFiles] = useState(true);
  const [userId, setUserId] = useState("");
  const [lastRun, setLastRun] = useState<OrchestratorResponse | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | undefined>();

  const latestTrendRecords = trendHistoryQuery.data?.items ?? [];
  const latestGeneratedContents = generatedContentsQuery.data?.items ?? [];

  const trendResults = useMemo(() => {
    return lastRun?.output?.trend_analysis?.results ?? [];
  }, [lastRun?.output?.trend_analysis?.results]);

  const selectedTrendResult = useMemo(() => {
    if (trendResults.length === 0) {
      return undefined;
    }

    if (!selectedKeyword) {
      return trendResults[0];
    }

    return (
      trendResults.find((item) => item.main_keyword === selectedKeyword) ??
      trendResults[0]
    );
  }, [trendResults, selectedKeyword]);

  const generatedOutput = useMemo(
    () => asRecord(lastRun?.output?.generated_content),
    [lastRun?.output?.generated_content],
  );

  const platformPosts = useMemo(
    () => asRecord(generatedOutput.platform_posts),
    [generatedOutput.platform_posts],
  );

  const selectedOutputKeyword = asString(generatedOutput.selected_keyword);
  const mainTitle = asString(generatedOutput.main_title);
  const musicBackground = asString(generatedOutput.music_background);

  const isLoading =
    trendHistoryQuery.isLoading || generatedContentsQuery.isLoading;
  const firstError = trendHistoryQuery.error || generatedContentsQuery.error;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || orchestrateMutation.isPending) {
      return;
    }

    const normalizedUserId = userId.trim();

    const response = await orchestrateMutation.mutateAsync({
      prompt: normalizedPrompt,
      save_files: saveFiles,
      user_id: normalizedUserId || undefined,
    });

    setLastRun(response);
    setSelectedKeyword(response.output.trend_analysis.results[0]?.main_keyword);
  };

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Strategy Lab", vi: "Phòng lab chiến lược" }}
        description={{
          en: "Turn one idea into clear trend insights and actionable content suggestions for your next campaign.",
          vi: "Biến một ý tưởng thành insight xu hướng rõ ràng và gợi ý nội dung có thể triển khai ngay cho chiến dịch tiếp theo.",
        }}
        badge={{ en: "Creative Strategy Studio", vi: "Studio chiến lược sáng tạo" }}
        icon={FlaskConical}
      />

      {isLoading ? <MetricCardsSkeleton /> : null}

      {firstError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            firstError,
            "Unable to load strategy records right now.",
          )}
        />
      ) : null}

      {!isLoading && !firstError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Trend Sessions", "Phiên phân tích xu hướng")}
            value={formatCompactNumber(latestTrendRecords.length)}
            icon={<Target className="size-5" />}
            detail={copy(
              "Recent strategic research rounds",
              "Số phiên nghiên cứu chiến lược gần đây",
            )}
          />
          <MetricCard
            label={copy("Content Drafts", "Bản nháp nội dung")}
            value={formatCompactNumber(latestGeneratedContents.length)}
            icon={<Bot className="size-5" />}
            detail={copy(
              "Drafts ready for publishing workflow",
              "Bản nháp sẵn sàng cho luồng đăng bài",
            )}
          />
          <MetricCard
            label={copy("Top Momentum", "Độ nóng cao nhất")}
            value={formatPercentValue(getTopTrendScore(trendResults))}
            icon={<Sparkles className="size-5" />}
            detail={copy(
              "From your latest strategy run",
              "Từ lần chạy chiến lược gần nhất",
            )}
          />
          <MetricCard
            label={copy("Latest Run", "Lần chạy gần nhất")}
            value={
              lastRun
                ? copy("Ready", "Đã sẵn sàng")
                : copy("Waiting", "Đang chờ")
            }
            icon={<FileJson className="size-5" />}
            detail={
              lastRun
                ? copy(
                    "New insight pack just generated",
                    "Vừa tạo xong bộ insight mới",
                  )
                : copy("Run your first prompt", "Hãy chạy prompt đầu tiên")
            }
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <PanelCard
          title={copy("Strategy Prompt Studio", "Studio prompt chiến lược")}
          description={copy(
            "Write one prompt and let the assistant generate trend direction plus content-ready output.",
            "Viết một prompt và để trợ lý tạo định hướng xu hướng cùng đầu ra nội dung có thể dùng ngay.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {copy("Quick Prompt Ideas", "Gợi ý prompt nhanh")}
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPrompt(item)}
                    className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/45 hover:text-primary"
                  >
                    {item.length > 46 ? `${item.slice(0, 46)}...` : item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orchestrator-prompt">
                {copy("Prompt", "Prompt")}
              </Label>
              <Textarea
                id="orchestrator-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                placeholder={DEFAULT_PROMPT}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="orchestrator-user-id">
                  {copy("Workspace Account (optional)", "Tài khoản làm việc (tùy chọn)")}
                </Label>
                <Input
                  id="orchestrator-user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder={copy("Account code", "Mã tài khoản")}
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border"
                    checked={saveFiles}
                    onChange={(event) => setSaveFiles(event.target.checked)}
                  />
                  {copy(
                    "Save a detailed project log",
                    "Lưu bản ghi chi tiết cho dự án",
                  )}
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy(
                    "Useful when your operation team needs to review generated outputs later.",
                    "Hữu ích khi đội vận hành cần xem lại đầu ra đã tạo vào lúc khác.",
                  )}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={orchestrateMutation.isPending || !prompt.trim()}
            >
              {orchestrateMutation.isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <PlayCircle data-icon="inline-start" />
              )}
              {orchestrateMutation.isPending
                ? copy("Analyzing...", "Đang phân tích...")
                : copy("Run Strategy", "Chạy chiến lược")}
            </Button>

            {orchestrateMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  orchestrateMutation.error,
                  "The strategy run did not complete successfully.",
                )}
              />
            ) : null}

            {lastRun ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {copy(
                    "Your strategy package is ready",
                    "Bộ chiến lược của bạn đã sẵn sàng",
                  )}
                </p>
                <p className="mt-1">
                  {copy(
                    "Trend insights and content draft were generated successfully.",
                    "Insight xu hướng và bản nháp nội dung đã được tạo thành công.",
                  )}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Output Preview", "Xem trước đầu ra")}
          description={copy(
            "Review trend takeaways and content direction from your latest run.",
            "Xem điểm chính về xu hướng và hướng nội dung từ lần chạy gần nhất.",
          )}
        >
          {!lastRun ? (
            <InlineQueryState
              state="empty"
              message={copy(
                "Run one strategy prompt to populate this panel.",
                "Hãy chạy một prompt chiến lược để hiển thị dữ liệu ở đây.",
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/65 bg-background/60 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Trend Summary", "Tóm tắt xu hướng")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lastRun.output.trend_analysis.markdown_summary || "--"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Top Keywords", "Keyword nổi bật")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendResults.map((result) => (
                    <Button
                      key={result.main_keyword}
                      variant={
                        selectedTrendResult?.main_keyword === result.main_keyword
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedKeyword(result.main_keyword)}
                    >
                      <WandSparkles data-icon="inline-start" />
                      {result.main_keyword}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedTrendResult ? (
                <div className="rounded-2xl border border-border/65 bg-background/60 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    {selectedTrendResult.main_keyword}
                  </p>
                  <p className="mt-1">
                    {copy("Momentum", "Độ nóng")}: {formatPercentValue(selectedTrendResult.trend_score)}
                  </p>
                  <p className="mt-1">
                    {copy("Estimated views/hour", "Ước tính views/giờ")}: {formatCompactNumber(selectedTrendResult.avg_views_per_hour)}
                  </p>
                  <p className="mt-2">{selectedTrendResult.why_the_trend_happens}</p>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border/65 bg-background/60 p-4 text-sm text-muted-foreground">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                  {copy("Content Direction", "Định hướng nội dung")}
                </p>
                <p className="mt-2">
                  {copy("Focus keyword", "Keyword trọng tâm")}: {selectedOutputKeyword ?? "--"}
                </p>
                <p className="mt-1">
                  {copy("Main title", "Tiêu đề chính")}: {mainTitle ?? "--"}
                </p>
                <p className="mt-1">
                  {copy("Mood suggestion", "Gợi ý cảm hứng nhạc")}: {musicBackground ?? "--"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {copy("Channel-specific post drafts", "Bản nháp theo từng kênh")}: {Object.keys(platformPosts).length}
                </p>
              </div>
            </div>
          )}
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Recent Trend Sessions", "Phiên xu hướng gần đây")}
          description={copy(
            "Your latest trend research sessions.",
            "Các phiên nghiên cứu xu hướng gần đây của bạn.",
          )}
        >
          {trendHistoryQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : latestTrendRecords.length > 0 ? (
            <div className="space-y-3">
              {latestTrendRecords.slice(0, 6).map((item) => (
                <div
                  key={item.analysis_id ?? `${item.query}-${item.created_at}`}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {item.query}
                    </p>
                    <Badge variant="outline" className="rounded-full">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {copy("Insights", "Số insight")}: {item.results.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend sessions yet.",
                "Chưa có phiên phân tích xu hướng nào.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Recent Content Drafts", "Bản nháp nội dung gần đây")}
          description={copy(
            "Latest generated drafts ready for editing or publishing.",
            "Các bản nháp mới tạo sẵn sàng để chỉnh sửa hoặc lên lịch đăng.",
          )}
        >
          {generatedContentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : latestGeneratedContents.length > 0 ? (
            <div className="space-y-3">
              {latestGeneratedContents.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {getRecentMainTitle(item)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {copy("Status", "Trạng thái")}: {item.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {copy("Keyword", "Keyword")}: {item.selected_keyword ?? "--"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No generated drafts yet.",
                "Chưa có bản nháp nội dung nào.",
              )}
            />
          )}
        </PanelCard>
      </div>
    </div>
  );
}
