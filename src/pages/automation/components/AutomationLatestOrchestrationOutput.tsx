import { useMemo } from "react";
import { motion } from "motion/react";

import type { TrendAnalyzeResultItem } from "@/api";
import { useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatPlatformLabel,
  normalizeGeneratedContent,
  toPublishingWindowTokens,
} from "@/lib/orchestrator-intelligence";
import {
  extractInterestValues,
  sanitizeTrendResults,
} from "@/lib/trend-intelligence";

import { LatestOutputMetadataPanel } from "./latest-output/LatestOutputMetadataPanel";
import { LatestOutputOverviewPanel } from "./latest-output/LatestOutputOverviewPanel";
import { LatestOutputPlatformPostMixPanel } from "./latest-output/LatestOutputPlatformPostMixPanel";
import { LatestOutputScriptBlueprintPanel } from "./latest-output/LatestOutputScriptBlueprintPanel";
import { LatestOutputStoryboardPanel } from "./latest-output/LatestOutputStoryboardPanel";
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
      <motion.section
        id="latest-orchestration-output"
        className="grid scroll-mt-28 gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <LatestOutputOverviewPanel
          copy={copy}
          latestTrendResults={latestTrendResults}
          latestGeneratedContent={latestGeneratedContent}
          averageLatestTrendScore={averageLatestTrendScore}
          latestTopTrend={latestTopTrend}
          latestHashtags={latestHashtags}
          markdownSummary={
            latestOrchestrationOutput?.trend_analysis.markdown_summary
          }
        />

        <LatestOutputMetadataPanel
          copy={copy}
          latestOrchestrationResponse={latestOrchestrationResponse}
          latestGeneratedContent={latestGeneratedContent}
        />
      </motion.section>

      <motion.div
        className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <LatestOutputPlatformPostMixPanel
          copy={copy}
          latestGeneratedContent={latestGeneratedContent}
          latestPlatformMixData={latestPlatformMixData}
        />
        <LatestOutputStoryboardPanel
          copy={copy}
          sections={latestGeneratedContent.sections}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.52, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <LatestOutputScriptBlueprintPanel
          copy={copy}
          latestGeneratedContent={latestGeneratedContent}
          latestPublishingWindows={latestPublishingWindows}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.46, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      >
        <LatestOutputTrendCharts
          copy={copy}
          latestTrendResults={latestTrendResults}
          latestTrendBarData={latestTrendBarData}
          latestInterestLineData={latestInterestLineData}
        />
      </motion.div>
    </>
  );
}
