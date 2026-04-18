import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, SendHorizontal } from "lucide-react";

import type { TrendAnalyzeResultItem } from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatPlatformLabel,
  normalizeGeneratedContent,
} from "@/lib/orchestrator-intelligence";
import {
  extractInterestValues,
  sanitizeTrendResults,
} from "@/lib/trend-intelligence";
import {
  AutomationPriorityGrid,
  AutomationPriorityItem,
} from "@/pages/automation/components/AutomationPriorityGrid";

import { LatestOutputOverviewPanel } from "./latest-output/LatestOutputOverviewPanel";
import { LatestOutputPlatformPostMixPanel } from "./latest-output/LatestOutputPlatformPostMixPanel";
import { LatestOutputScriptBlueprintPanel } from "./latest-output/LatestOutputScriptBlueprintPanel";
import { LatestOutputTrendCharts } from "./latest-output/LatestOutputTrendCharts";

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

const HARDCODED_CONTENT_KEYWORD = "Chăm sóc da mặt";

type AutomationLatestOrchestrationOutputProps = {
  onOpenPublishing?: () => void;
};

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

function toWrappedAxisLabel(value: string) {
  const tokens = value.split(" ").filter(Boolean);

  if (tokens.length <= 1) {
    return value;
  }

  const firstLineLength = Math.ceil(tokens.length / 2);

  return [
    tokens.slice(0, firstLineLength).join(" "),
    tokens.slice(firstLineLength).join(" "),
  ];
}

export function AutomationLatestOrchestrationOutput({
  onOpenPublishing,
}: AutomationLatestOrchestrationOutputProps) {
  const copy = useBilingual();
  const [selectedContentKeyword, setSelectedContentKeyword] = useState<
    string | null
  >(null);
  const [isContentExpanded, setIsContentExpanded] = useState(true);
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
        toWrappedAxisLabel(formatPlatformLabel(post.platform)),
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

  const latestHashtags = useMemo(() => {
    const allTags = latestTrendResults.flatMap((result) => result.top_hashtags);
    return [...new Set(allTags.map((tag) => tag.trim()).filter(Boolean))].slice(
      0,
      14,
    );
  }, [latestTrendResults]);

  const contentKeywordOptions = useMemo(() => {
    const trendKeywords = latestTrendResults
      .map((result) => result.main_keyword.trim())
      .filter(Boolean);
    const generatedKeyword = latestGeneratedContent.selectedKeyword.trim();

    return Array.from(
      new Set(
        [...trendKeywords, generatedKeyword].filter((keyword) => keyword),
      ),
    );
  }, [latestGeneratedContent.selectedKeyword, latestTrendResults]);

  const selectedTrend = latestTrendResults.find(
    (result) => result.main_keyword === selectedContentKeyword,
  );

  const canShowHardcodedContent =
    selectedContentKeyword === HARDCODED_CONTENT_KEYWORD &&
    latestGeneratedContent.selectedKeyword === HARDCODED_CONTENT_KEYWORD;
  const selectedOverviewTrendResults = selectedTrend
    ? [selectedTrend]
    : latestTrendResults;
  const selectedAverageTrendScore =
    selectedTrend?.trend_score ?? averageLatestTrendScore;
  const selectedHashtags =
    selectedTrend && selectedTrend.top_hashtags.length > 0
      ? selectedTrend.top_hashtags
      : latestHashtags;

  const handleSelectContentKeyword = (keyword: string) => {
    setSelectedContentKeyword(keyword);
    setIsContentExpanded(true);
  };

  if (!latestOrchestrationResponse) {
    return null;
  }

  return (
    <AutomationPriorityGrid>
      <AutomationPriorityItem priority="high" className="scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          <LatestOutputTrendCharts
            copy={copy}
            latestTrendResults={latestTrendResults}
            latestTrendBarData={latestTrendBarData}
            latestInterestLineData={latestInterestLineData}
          />
        </motion.div>
      </AutomationPriorityItem>

      <AutomationPriorityItem priority="high">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <PanelCard
            title={copy(
              "Create content with keyword",
              "Tạo nội dung với từ khóa",
            )}
            description={copy(
              "Select a trend keyword to open the generated content workspace for that topic.",
              "Chọn một keyword xu hướng để mở không gian nội dung đã tạo cho chủ đề đó.",
            )}
            action={
              selectedContentKeyword ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 bg-primary/10 text-primary"
                  >
                    {selectedContentKeyword}
                  </Badge>

                  {canShowHardcodedContent ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-expanded={isContentExpanded}
                      onClick={() =>
                        setIsContentExpanded((current) => !current)
                      }
                    >
                      {isContentExpanded ? (
                        <ChevronUp data-icon="inline-start" />
                      ) : (
                        <ChevronDown data-icon="inline-start" />
                      )}
                      {isContentExpanded
                        ? copy("Collapse content", "Thu gọn nội dung")
                        : copy("Expand content", "Bung nội dung")}
                    </Button>
                  ) : null}
                </div>
              ) : null
            }
            contentClassName="pb-4"
          >
            {contentKeywordOptions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {contentKeywordOptions.map((keyword) => (
                    <Button
                      key={keyword}
                      type="button"
                      size="sm"
                      variant={
                        selectedContentKeyword === keyword
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleSelectContentKeyword(keyword)}
                    >
                      {keyword}
                    </Button>
                  ))}
                </div>

                {canShowHardcodedContent ? (
                  <Alert className="border-emerald-500/35 bg-emerald-500/10">
                    <AlertTitle>
                      {copy(
                        "Content generation completed",
                        "Nội dung đã được tạo hoàn tất",
                      )}
                    </AlertTitle>
                    <AlertDescription>
                      {copy(
                        "Trend and content outputs were generated successfully for the selected keyword.",
                        "Trend và nội dung đã được tạo thành công cho keyword đang chọn.",
                      )}
                    </AlertDescription>
                    {onOpenPublishing ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={onOpenPublishing}
                      >
                        <SendHorizontal data-icon="inline-start" />
                        {copy("Continue to Publishing", "Chuyển sang Xuất bản")}
                      </Button>
                    ) : null}
                  </Alert>
                ) : null}
              </div>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No trend keyword is available from the latest run.",
                  "Chưa có keyword xu hướng từ phiên chạy mới nhất.",
                )}
              />
            )}
          </PanelCard>
        </motion.div>
      </AutomationPriorityItem>

      {canShowHardcodedContent ? (
        isContentExpanded ? (
          <>
            <AutomationPriorityItem priority="medium">
              <motion.section
                id="latest-orchestration-output"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <LatestOutputOverviewPanel
                  copy={copy}
                  latestTrendResults={selectedOverviewTrendResults}
                  latestGeneratedContent={latestGeneratedContent}
                  averageLatestTrendScore={selectedAverageTrendScore}
                  latestTopTrend={selectedTrend ?? latestTopTrend}
                  latestHashtags={selectedHashtags}
                  markdownSummary={
                    latestOrchestrationOutput?.trend_analysis.markdown_summary
                  }
                />
              </motion.section>
            </AutomationPriorityItem>

            <AutomationPriorityItem priority="medium">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <LatestOutputPlatformPostMixPanel
                  copy={copy}
                  latestGeneratedContent={latestGeneratedContent}
                  latestPlatformMixData={latestPlatformMixData}
                />
              </motion.div>
            </AutomationPriorityItem>

            <AutomationPriorityItem priority="high">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <LatestOutputScriptBlueprintPanel
                  key={`${selectedContentKeyword}-${latestGeneratedContent.sections
                    .map((section) => `${section.id}:${section.label}`)
                    .join("|")}`}
                  copy={copy}
                  latestGeneratedContent={latestGeneratedContent}
                />
              </motion.div>
            </AutomationPriorityItem>
          </>
        ) : null
      ) : selectedContentKeyword ? (
        <AutomationPriorityItem priority="high">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <PanelCard
              title={copy(
                "Content workspace not wired yet",
                "Chưa nối UI nội dung cho keyword này",
              )}
              description={copy(
                "For now, the generated content UI is hardcoded for the skincare keyword.",
                "Tạm thời UI nội dung đang hardcode cho keyword Chăm sóc da mặt.",
              )}
              contentClassName="pb-4"
            >
              <InlineQueryState
                state="empty"
                message={copy(
                  'Select "Chăm sóc da mặt" to open the current hardcoded content package.',
                  'Chọn "Chăm sóc da mặt" để mở gói nội dung hardcode hiện tại.',
                )}
              />
            </PanelCard>
          </motion.div>
        </AutomationPriorityItem>
      ) : null}
    </AutomationPriorityGrid>
  );
}
