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
  "Chủ đề đang trend trong ngày hôm nay về thể thao là gì và tôi nên tạo nội dung như thế nào?";

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
          en: "Run the full Orchestrator pipeline (Trend Agent + Content Agent), inspect structured output, and track saved records in Postgres.",
          vi: "Chạy full pipeline Orchestrator (Trend Agent + Content Agent), kiểm tra structured output và theo dõi record đã lưu trên Postgres.",
        }}
        badge={{ en: "Orchestrator Pipeline", vi: "Pipeline Orchestrator" }}
        icon={FlaskConical}
      />

      {isLoading ? <MetricCardsSkeleton /> : null}

      {firstError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            firstError,
            "Unable to load strategy-lab backend records.",
          )}
        />
      ) : null}

      {!isLoading && !firstError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Trend Analyses", "Số lần phân tích trend")}
            value={formatCompactNumber(latestTrendRecords.length)}
            icon={<Target className="size-5" />}
            detail={copy(
              "From /api/v1/trends/history",
              "Từ /api/v1/trends/history",
            )}
          />
          <MetricCard
            label={copy("Generated Contents", "Nội dung đã tạo")}
            value={formatCompactNumber(latestGeneratedContents.length)}
            icon={<Bot className="size-5" />}
            detail={copy("From /api/v1/contents", "Từ /api/v1/contents")}
          />
          <MetricCard
            label={copy("Top Trend Score", "Điểm trend cao nhất")}
            value={formatPercentValue(getTopTrendScore(trendResults))}
            icon={<Sparkles className="size-5" />}
            detail={copy(
              "From latest orchestrate run",
              "Từ lần chạy orchestrate gần nhất",
            )}
          />
          <MetricCard
            label={copy("Latest Orchestrate", "Lần orchestrate gần nhất")}
            value={
              lastRun
                ? copy("Completed", "Hoàn tất")
                : copy("Waiting", "Đang chờ")
            }
            icon={<FileJson className="size-5" />}
            detail={
              lastRun?.output_file ||
              copy("No run yet in this session", "Chưa chạy trong phiên này")
            }
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <PanelCard
          title={copy("Orchestrator Run Console", "Bảng chạy Orchestrator")}
          description={copy(
            "Send one prompt to /api/v1/agents/orchestrate and receive full trend_analysis + generated_content in one response.",
            "Gửi một prompt tới /api/v1/agents/orchestrate và nhận đồng thời trend_analysis + generated_content trong một response.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
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
                  {copy("User ID (optional)", "User ID (tùy chọn)")}
                </Label>
                <Input
                  id="orchestrator-user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="uuid"
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
                  {copy("Save raw/output files", "Lưu file raw/output")}
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy(
                    "Enable to persist orchestrator_raw_response.json and orchestrator_output.json on backend.",
                    "Bật để backend lưu orchestrator_raw_response.json và orchestrator_output.json.",
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
                ? copy("Running Pipeline...", "Đang chạy pipeline...")
                : copy("Run Orchestrator", "Chạy Orchestrator")}
            </Button>

            {orchestrateMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  orchestrateMutation.error,
                  "Orchestrator request failed.",
                )}
              />
            ) : null}

            {lastRun ? (
              <div className="rounded-2xl border border-border/65 bg-background/60 p-4 text-xs text-muted-foreground">
                <p>
                  {copy("Status", "Trạng thái")}: {lastRun.status}
                </p>
                <p className="mt-1">
                  Trend Analysis ID: {lastRun.trend_analysis_id ?? "--"}
                </p>
                <p className="mt-1">
                  Generated Content ID: {lastRun.generated_content_id ?? "--"}
                </p>
                <p className="mt-1">
                  Raw File: {lastRun.raw_response_file ?? "--"}
                </p>
                <p className="mt-1">
                  Output File: {lastRun.output_file ?? "--"}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Pipeline Output", "Đầu ra pipeline")}
          description={copy(
            "Inspect structured trend and generated content data from the latest orchestrator response.",
            "Kiểm tra dữ liệu trend và generated content có cấu trúc từ response orchestrator mới nhất.",
          )}
        >
          {!lastRun ? (
            <InlineQueryState
              state="empty"
              message={copy(
                "Run one orchestrator prompt to populate this panel.",
                "Hãy chạy một prompt orchestrator để hiển thị dữ liệu ở panel này.",
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/65 bg-background/60 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Trend Summary
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lastRun.output.trend_analysis.markdown_summary || "--"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy("Trend Results", "Kết quả trend")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendResults.map((result) => (
                    <Button
                      key={result.main_keyword}
                      variant={
                        selectedTrendResult?.main_keyword ===
                        result.main_keyword
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
                    {copy("Trend Score", "Điểm xu hướng")}:{" "}
                    {formatPercentValue(selectedTrendResult.trend_score)}
                  </p>
                  <p className="mt-1">
                    {copy("Avg views/hour", "Trung bình views/giờ")}:{" "}
                    {formatCompactNumber(
                      selectedTrendResult.avg_views_per_hour,
                    )}
                  </p>
                  <p className="mt-2">
                    {selectedTrendResult.why_the_trend_happens}
                  </p>
                </div>
              ) : null}

              <div className="rounded-2xl border border-border/65 bg-background/60 p-4 text-sm text-muted-foreground">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase">
                  Generated Content
                </p>
                <p className="mt-2">
                  {copy("Keyword", "Keyword")}: {selectedOutputKeyword ?? "--"}
                </p>
                <p className="mt-1">
                  {copy("Main title", "Tiêu đề chính")}: {mainTitle ?? "--"}
                </p>
                <p className="mt-1">
                  {copy("Music background", "Nhạc nền")}:{" "}
                  {musicBackground ?? "--"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {copy("Platform post blocks", "Số block post nền tảng")}:{" "}
                  {Object.keys(platformPosts).length}
                </p>
              </div>
            </div>
          )}
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Recent Trend Analyses", "Lịch sử trend gần đây")}
          description={copy(
            "Saved records from /api/v1/trends/history.",
            "Record đã lưu từ /api/v1/trends/history.",
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
                    {copy("Results", "Số kết quả")}: {item.results.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No trend analysis records yet.",
                "Chưa có record trend analysis.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Recent Generated Contents", "Nội dung tạo gần đây")}
          description={copy(
            "Saved records from /api/v1/contents.",
            "Record đã lưu từ /api/v1/contents.",
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
                    Keyword: {item.selected_keyword ?? "--"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No generated content records yet.",
                "Chưa có record generated content.",
              )}
            />
          )}
        </PanelCard>
      </div>
    </div>
  );
}
