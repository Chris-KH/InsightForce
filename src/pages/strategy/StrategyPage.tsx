import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Clock3,
  Compass,
  ListChecks,
  MousePointerClick,
  RefreshCw,
  Rocket,
  SendHorizontal,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import {
  type TrendAnalyzeResponse,
  type TrendAnalyzeResultItem,
  useTrendAnalyzeMutation,
  useTrendGeneralQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatPercentValue,
} from "@/lib/insight-formatters";
import {
  buildSessionSuggestions,
  createTrendSessionId,
  DEFAULT_TREND_PROMPT_SUGGESTIONS,
  sanitizeTrendResults,
  type TrendGraphNode,
} from "@/lib/trend-intelligence";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";
import { PromptSuggestionBar } from "@/pages/strategy/components/PromptSuggestionBar";
import { ReasoningTimeline } from "@/pages/strategy/components/ReasoningTimeline";
import { TrendForceGraph } from "@/pages/strategy/components/TrendForceGraph";
import { TrendResultCards } from "@/pages/strategy/components/TrendResultCards";

const TREND_SESSION_STORAGE_KEY = "insightforce.trend.session.v1";
const GENERAL_REFRESH_INTERVAL_MS = 180_000;

type TrendSessionState = {
  sessionId: string;
  prompts: string[];
  suggestions: string[];
};

function computeAverageScore(results: TrendAnalyzeResultItem[]) {
  if (results.length === 0) {
    return 0;
  }
  return (
    results.reduce((total, item) => total + item.trend_score, 0) /
    results.length
  );
}

function computeAverageViewsPerHour(results: TrendAnalyzeResultItem[]) {
  if (results.length === 0) {
    return 0;
  }
  return (
    results.reduce((total, item) => total + item.avg_views_per_hour, 0) /
    results.length
  );
}

function buildGeneralTrendPlans(
  result: TrendAnalyzeResultItem,
  copy: (en: string, vi: string) => string,
) {
  const firstTag = result.top_hashtags[0] ?? "#trend";

  return [
    result.recommended_action,
    copy(
      `Ship 2 formats for ${result.main_keyword}: one short explainer and one 24-hour execution case study.`,
      `Triển khai 2 format cho ${result.main_keyword}: 1 video ngắn giải thích + 1 case study thực thi trong 24 giờ.`,
    ),
    copy(
      `A/B test two opening hooks using ${firstTag} and measure retention at 3s, 8s, and 15s to lock the highest-performing format.`,
      `A/B test hai mở bài dựa trên ${firstTag} và đo retention tại mốc 3s, 8s, 15s để chốt format hiệu quả.`,
    ),
  ];
}

function buildGeneralTrendPrompts(
  result: TrendAnalyzeResultItem,
  copy: (en: string, vi: string) => string,
) {
  const unique = new Set<string>();
  const topTags = result.top_hashtags.slice(0, 3);

  unique.add(
    copy(
      `deeper analysis for ${result.main_keyword}`,
      `phân tích sâu hơn về ${result.main_keyword}`,
    ),
  );
  unique.add(
    copy(
      `build a 7-day content plan for ${result.main_keyword}`,
      `lập kế hoạch nội dung 7 ngày cho ${result.main_keyword}`,
    ),
  );
  unique.add(
    copy(
      `create 5 short-video hooks for ${result.main_keyword}`,
      `tạo 5 hook video ngắn cho ${result.main_keyword}`,
    ),
  );

  for (const tag of topTags) {
    unique.add(
      copy(
        `build a content campaign around ${tag}`,
        `xây dựng chiến dịch nội dung xoay quanh ${tag}`,
      ),
    );
  }

  return [...unique].slice(0, 6);
}

export function StrategyPage() {
  const copy = useBilingual();
  const promptStudioRef = useRef<HTMLDivElement | null>(null);

  const [nowTick, setNowTick] = useState(Date.now());
  const [promptInput, setPromptInput] = useState("");
  const [promptResponse, setPromptResponse] =
    useState<TrendAnalyzeResponse | null>(null);

  const [sessionId, setSessionId] = useState(createTrendSessionId());
  const [sessionPrompts, setSessionPrompts] = useState<string[]>([]);
  const [sessionSuggestions, setSessionSuggestions] = useState<string[]>(
    DEFAULT_TREND_PROMPT_SUGGESTIONS,
  );
  const [sessionReady, setSessionReady] = useState(false);

  const [selectedGeneralKeyword, setSelectedGeneralKeyword] = useState<
    string | undefined
  >();
  const [selectedPromptKeyword, setSelectedPromptKeyword] = useState<
    string | undefined
  >();

  const [reasoningStartedAt, setReasoningStartedAt] = useState<number | null>(
    null,
  );
  const [reasoningElapsedMs, setReasoningElapsedMs] = useState(0);

  const generalTrendQuery = useTrendGeneralQuery({
    limit: 5,
    refetchIntervalMs: GENERAL_REFRESH_INTERVAL_MS,
  });
  const trendAnalyzeMutation = useTrendAnalyzeMutation();

  const generalResults = useMemo(
    () => sanitizeTrendResults(generalTrendQuery.data?.results),
    [generalTrendQuery.data?.results],
  );

  const promptResults = useMemo(
    () => sanitizeTrendResults(promptResponse?.results),
    [promptResponse?.results],
  );

  const strongestGeneralResult = generalResults[0];
  const averageGeneralScore = computeAverageScore(generalResults);
  const averageGeneralViewsPerHour = computeAverageViewsPerHour(generalResults);

  const generalSelectedResult = useMemo(
    () =>
      generalResults.find(
        (result) => result.main_keyword === selectedGeneralKeyword,
      ),
    [generalResults, selectedGeneralKeyword],
  );

  const generalPlanSuggestions = useMemo(
    () =>
      generalSelectedResult
        ? buildGeneralTrendPlans(generalSelectedResult, copy)
        : [],
    [copy, generalSelectedResult],
  );

  const generalPromptSuggestions = useMemo(
    () =>
      generalSelectedResult
        ? buildGeneralTrendPrompts(generalSelectedResult, copy)
        : [],
    [copy, generalSelectedResult],
  );

  const promptSelectedResult = useMemo(
    () =>
      promptResults.find(
        (result) => result.main_keyword === selectedPromptKeyword,
      ) ?? promptResults[0],
    [promptResults, selectedPromptKeyword],
  );

  const selectedGeneralNodeId = useMemo(() => {
    if (!generalSelectedResult) {
      return undefined;
    }

    const index = generalResults.findIndex(
      (result) => result.main_keyword === generalSelectedResult.main_keyword,
    );
    return index >= 0
      ? `${generalSelectedResult.main_keyword}-${index}`
      : undefined;
  }, [generalResults, generalSelectedResult]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(TREND_SESSION_STORAGE_KEY);

    if (!raw) {
      setSessionReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as TrendSessionState;

      if (parsed.sessionId) {
        setSessionId(parsed.sessionId);
      }
      if (Array.isArray(parsed.prompts)) {
        setSessionPrompts(parsed.prompts.slice(-20));
      }
      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        setSessionSuggestions(parsed.suggestions.slice(0, 10));
      }
    } catch {
      // Ignore corrupted local session payload and fallback to defaults.
    }

    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    const payload: TrendSessionState = {
      sessionId,
      prompts: sessionPrompts,
      suggestions: sessionSuggestions,
    };

    window.localStorage.setItem(
      TREND_SESSION_STORAGE_KEY,
      JSON.stringify(payload),
    );
  }, [sessionReady, sessionId, sessionPrompts, sessionSuggestions]);

  useEffect(() => {
    if (!trendAnalyzeMutation.isPending || !reasoningStartedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setReasoningElapsedMs(Date.now() - reasoningStartedAt);
    }, 180);

    return () => window.clearInterval(timer);
  }, [trendAnalyzeMutation.isPending, reasoningStartedAt]);

  useEffect(() => {
    if (!selectedGeneralKeyword) {
      return;
    }

    if (
      !generalResults.some(
        (result) => result.main_keyword === selectedGeneralKeyword,
      )
    ) {
      setSelectedGeneralKeyword(undefined);
    }
  }, [generalResults, selectedGeneralKeyword]);

  useEffect(() => {
    if (promptResults.length === 0) {
      return;
    }

    if (
      !selectedPromptKeyword ||
      !promptResults.some(
        (result) => result.main_keyword === selectedPromptKeyword,
      )
    ) {
      setSelectedPromptKeyword(promptResults[0].main_keyword);
    }
  }, [promptResults, selectedPromptKeyword]);

  const runTrendPromptAnalyze = async (
    rawPrompt: string,
    options: {
      keepInput?: boolean;
      scrollToPromptStudio?: boolean;
    } = {},
  ) => {
    const normalizedPrompt = rawPrompt.trim();
    if (!normalizedPrompt) {
      return;
    }

    if (trendAnalyzeMutation.isPending) {
      return;
    }

    if (options.scrollToPromptStudio) {
      promptStudioRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setPromptInput(normalizedPrompt);

    let nextPrompts: string[] = [];
    setSessionPrompts((currentPrompts) => {
      nextPrompts = [...currentPrompts, normalizedPrompt].slice(-20);
      return nextPrompts;
    });

    setReasoningStartedAt(Date.now());
    setReasoningElapsedMs(0);

    try {
      const response = await trendAnalyzeMutation.mutateAsync({
        query: normalizedPrompt,
        limit: 5,
      });

      const normalizedResults = sanitizeTrendResults(response.results);
      setPromptResponse(response);

      if (!options.keepInput) {
        setPromptInput("");
      }

      setSessionSuggestions((currentSuggestions) =>
        buildSessionSuggestions(
          nextPrompts,
          normalizedResults,
          currentSuggestions,
        ),
      );

      if (normalizedResults[0]) {
        setSelectedPromptKeyword(normalizedResults[0].main_keyword);
      }
    } finally {
      setReasoningStartedAt(null);
    }
  };

  const handleAnalyzeSubmit = async () => {
    await runTrendPromptAnalyze(promptInput);
  };

  const handleGeneralPromptSuggestionClick = (suggestion: string) => {
    void runTrendPromptAnalyze(suggestion, {
      keepInput: true,
      scrollToPromptStudio: true,
    });
  };

  const handleSelectGeneralNode = (node: TrendGraphNode) => {
    setSelectedGeneralKeyword(node.keyword);
  };

  const refreshInSeconds = generalTrendQuery.dataUpdatedAt
    ? Math.max(
        0,
        Math.ceil(
          (generalTrendQuery.dataUpdatedAt +
            GENERAL_REFRESH_INTERVAL_MS -
            nowTick) /
            1000,
        ),
      )
    : null;

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Trend Intelligence", "Trí tuệ xu hướng")}
        title={copy(
          "Live Trend Graph And Prompt Studio",
          "Đồ thị xu hướng trực tiếp và Prompt Studio",
        )}
        description={copy(
          "A dedicated strategy workspace with auto-refresh general trend mapping and interactive prompt-driven trend discovery.",
          "Không gian chiến lược chuyên biệt với bản đồ trend chung tự làm mới và luồng khám phá trend theo prompt tương tác.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <RefreshCw className="mr-2 size-3.5" />
            {copy("Auto Refresh 3m", "Tự làm mới 3 phút")}
          </Badge>
        }
      />

      {generalTrendQuery.isLoading && !generalTrendQuery.data ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("General Trend Entries", "Số entry trend chung")}
            value={String(generalResults.length)}
            detail={copy(
              "From periodic trend polling",
              "Lấy từ polling trend định kỳ",
            )}
            icon={<Compass className="size-5" />}
          />
          <MetricCard
            label={copy("Top Trend Score", "Điểm trend cao nhất")}
            value={
              strongestGeneralResult
                ? formatPercentValue(strongestGeneralResult.trend_score)
                : "--"
            }
            detail={strongestGeneralResult?.main_keyword ?? "--"}
            icon={<Target className="size-5" />}
          />
          <MetricCard
            label={copy("Avg Views / Hour", "Trung bình views / giờ")}
            value={formatCompactNumber(averageGeneralViewsPerHour)}
            detail={copy(
              "Average from general trend results",
              "Trung bình từ danh sách trend chung",
            )}
            icon={<Bot className="size-5" />}
          />
          <MetricCard
            label={copy("Avg Trend Score", "Điểm trend trung bình")}
            value={formatPercentValue(averageGeneralScore)}
            detail={
              refreshInSeconds !== null
                ? copy(
                    `Refresh in ${refreshInSeconds}s`,
                    `Làm mới sau ${refreshInSeconds}s`,
                  )
                : copy("Waiting first refresh", "Đang chờ lần làm mới đầu")
            }
            icon={<Clock3 className="size-5" />}
          />
        </div>
      )}

      {generalTrendQuery.error ? (
        <QueryStateCard
          state="error"
          title={copy("Trend Load Error", "Lỗi tải trend")}
          description={getQueryErrorMessage(
            generalTrendQuery.error,
            "Unable to fetch general trend data.",
          )}
          hint={copy(
            "Trend data is syncing. Please try again in a moment.",
            "Dữ liệu xu hướng đang đồng bộ. Vui lòng thử lại sau ít phút.",
          )}
        />
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PanelCard
          title={copy("General Trend Graph", "Đồ thị trend tổng quát")}
          description={copy(
            "Each node is one trend result; higher trend score means larger node. You can zoom, pan, and drag nodes.",
            "Mỗi node là một trend result; điểm càng cao node càng to. Bạn có thể zoom, pan và kéo node.",
          )}
          action={
            <Badge variant="outline" className="rounded-full border-primary/25">
              <Sparkles className="mr-1.5 size-3.5" />
              {copy("Interactive Graph", "Đồ thị tương tác")}
            </Badge>
          }
        >
          <TrendForceGraph
            results={generalResults}
            selectedNodeId={selectedGeneralNodeId}
            onSelectNode={handleSelectGeneralNode}
          />
        </PanelCard>

        <PanelCard
          title={copy("General Trend Feed", "Danh sách trend tổng quát")}
          description={copy(
            "Select one node on the graph to reveal full insight, action plans, and one-click prompts.",
            "Hãy chọn một node trên đồ thị để mở phân tích chi tiết, kế hoạch gợi ý và prompt 1 chạm.",
          )}
        >
          {generalSelectedResult ? (
            <div className="space-y-4">
              <Card className="border-primary/22 bg-primary/7" size="sm">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>
                        {copy("Selected Opportunity", "Cơ hội đang chọn")}
                      </CardTitle>
                      <CardDescription>
                        {generalSelectedResult.main_keyword}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/30 bg-background/80"
                    >
                      <Target className="mr-1.5 size-3.5" />
                      {formatPercentValue(generalSelectedResult.trend_score)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{generalSelectedResult.why_the_trend_happens}</p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background/65 p-3">
                      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase">
                        {copy("Avg views / hour", "Trung bình views / giờ")}
                      </p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {formatCompactNumber(
                          generalSelectedResult.avg_views_per_hour,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/65 p-3">
                      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase">
                        {copy("Recommended action", "Hành động chính")}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {generalSelectedResult.recommended_action}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {generalSelectedResult.top_hashtags.map((hashtag) => (
                      <Badge
                        key={hashtag}
                        variant="outline"
                        className="rounded-full"
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/55" size="sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecks className="size-4 text-primary" />
                    {copy("Suggested Plan", "Kế hoạch gợi ý")}
                  </CardTitle>
                  <CardDescription>
                    {copy(
                      "Execution checklist generated from the selected trend signal.",
                      "Checklist triển khai được tạo từ tín hiệu trend đang chọn.",
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {generalPlanSuggestions.map((plan, index) => (
                    <div
                      key={`${generalSelectedResult.main_keyword}-plan-${index}`}
                      className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-muted-foreground"
                    >
                      <span className="mr-2 text-primary">{index + 1}.</span>
                      {plan}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-2 rounded-2xl border border-border/65 bg-background/55 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  <WandSparkles className="size-3.5 text-primary" />
                  {copy(
                    "Prompt Suggestions For This Trend",
                    "Prompt Gợi Ý Cho Trend Này",
                  )}
                </p>

                <div className="flex flex-wrap gap-2">
                  {generalPromptSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="max-w-full truncate"
                      disabled={trendAnalyzeMutation.isPending}
                      onClick={() =>
                        handleGeneralPromptSuggestionClick(suggestion)
                      }
                    >
                      <Rocket data-icon="inline-start" />
                      {suggestion}
                    </Button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  {copy(
                    "Click one prompt to jump to Prompt Trend Studio and run analysis immediately.",
                    "Bấm một prompt để nhảy xuống Prompt Trend Studio và chạy phân tích ngay.",
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-linear-to-br from-background/75 via-background/40 to-muted/28 px-5 py-7">
              <div className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 size-44 rounded-full bg-chart-2/10 blur-3xl" />

              <div className="relative space-y-4">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  <MousePointerClick className="size-3.5" />
                  {copy("Awaiting Node Selection", "Đang chờ bạn chọn node")}
                </p>

                <p className="max-w-xl text-sm text-muted-foreground">
                  {copy(
                    "General Trend Feed stays in preview mode until you click a node in the graph. Once selected, this panel will reveal detailed insight, action plans, and one-click prompts.",
                    "General Trend Feed sẽ để chế độ trang trí cho tới khi bạn click vào một node trên đồ thị. Sau khi chọn, panel này sẽ hiện phân tích chi tiết, kế hoạch hành động và prompt 1 chạm.",
                  )}
                </p>

                <div className="flex flex-wrap gap-2">
                  {generalResults.slice(0, 4).map((item) => (
                    <Badge
                      key={`decor-${item.main_keyword}`}
                      variant="outline"
                      className="rounded-full border-border/65 bg-background/75 text-muted-foreground"
                    >
                      {item.main_keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div ref={promptStudioRef}>
          <Card className="rounded-3xl border-border/75 bg-linear-to-br from-card via-card/95 to-muted/28">
            <CardHeader>
              <CardTitle>
                {copy("Prompt Trend Studio", "Prompt Trend Studio")}
              </CardTitle>
              <CardDescription>
                {copy(
                  "Ask for trend ideas with context; suggestion chips evolve through your current session.",
                  "Yêu cầu xu hướng theo ngữ cảnh; các gợi ý sẽ thay đổi theo phiên hiện tại của bạn.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 p-2">
                <Input
                  value={promptInput}
                  onChange={(event) => setPromptInput(event.target.value)}
                  placeholder={copy(
                    "Example: trend content ideas for dental clinics in Vietnam",
                    "Ví dụ: ý tưởng trend content cho nha khoa tại Việt Nam",
                  )}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAnalyzeSubmit();
                    }
                  }}
                />
                <Button
                  onClick={() => void handleAnalyzeSubmit()}
                  disabled={
                    trendAnalyzeMutation.isPending || !promptInput.trim()
                  }
                >
                  <SendHorizontal data-icon="inline-start" />
                  {copy("Analyze", "Phân tích")}
                </Button>
              </div>

              <PromptSuggestionBar
                suggestions={sessionSuggestions}
                onSelect={setPromptInput}
              />

              <div className="rounded-2xl border border-border/55 bg-background/45 p-3 text-xs text-muted-foreground">
                <p>
                  {copy("Session ID", "Session ID")}: {sessionId}
                </p>
                <p className="mt-1">
                  {copy("Prompt turns", "Số lượt prompt")}:{" "}
                  {sessionPrompts.length}
                </p>
              </div>

              {trendAnalyzeMutation.error ? (
                <InlineQueryState
                  state="error"
                  message={getQueryErrorMessage(
                    trendAnalyzeMutation.error,
                    "Unable to analyze trend prompt.",
                  )}
                />
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-border/75 bg-linear-to-br from-card via-card/95 to-muted/28">
          <CardHeader>
            <CardTitle>
              {copy("Reasoning Status", "Trạng thái reasoning")}
            </CardTitle>
            <CardDescription>
              {copy(
                "Live reasoning progress while waiting for prompt analysis result.",
                "Tiến trình reasoning trực tiếp trong lúc chờ kết quả phân tích prompt.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReasoningTimeline
              isPending={trendAnalyzeMutation.isPending}
              elapsedMs={reasoningElapsedMs}
            />

            <div
              className={cn(
                "rounded-2xl border border-border/55 bg-background/50 p-4 text-xs",
                trendAnalyzeMutation.isPending
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {trendAnalyzeMutation.isPending
                ? copy("Agent is reasoning...", "Agent đang reasoning...")
                : copy(
                    "Waiting for next prompt.",
                    "Đang chờ prompt tiếp theo.",
                  )}
            </div>

            {promptResponse?.markdown_summary ? (
              <div className="rounded-2xl border border-border/55 bg-background/50 p-4 text-sm text-muted-foreground">
                <p className="mb-1 text-xs font-semibold tracking-[0.14em] uppercase">
                  {copy("Narrative Summary", "Tóm tắt diễn giải")}
                </p>
                <p className="whitespace-pre-wrap">
                  {promptResponse.markdown_summary}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <PanelCard
        title={copy("Prompt Trend Results", "Kết quả trend từ prompt")}
        description={copy(
          "Ranked opportunities from your prompt-driven analysis flow.",
          "Các cơ hội được xếp hạng từ luồng phân tích dựa trên prompt của bạn.",
        )}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <TrendResultCards
            results={promptResults}
            selectedKeyword={promptSelectedResult?.main_keyword}
            onSelect={(result) => setSelectedPromptKeyword(result.main_keyword)}
          />

          {promptSelectedResult ? (
            <Card
              className="h-fit rounded-2xl border-primary/22 bg-primary/6"
              size="sm"
            >
              <CardHeader>
                <CardTitle>{promptSelectedResult.main_keyword}</CardTitle>
                <CardDescription>
                  {copy("Deep-dive insight", "Phân tích chi tiết")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{promptSelectedResult.why_the_trend_happens}</p>
                <p>
                  {copy("Action", "Hành động")}:{" "}
                  {promptSelectedResult.recommended_action}
                </p>
                <p>
                  {copy("Avg views / hour", "Trung bình views / giờ")}:{" "}
                  {formatCompactNumber(promptSelectedResult.avg_views_per_hour)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {promptSelectedResult.top_hashtags.map((hashtag) => (
                    <Badge
                      key={hashtag}
                      variant="outline"
                      className="rounded-full"
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "Submit a prompt to generate ranked trend opportunities.",
                "Hãy gửi prompt để tạo danh sách cơ hội trend được xếp hạng.",
              )}
            />
          )}
        </div>
      </PanelCard>
    </div>
  );
}
