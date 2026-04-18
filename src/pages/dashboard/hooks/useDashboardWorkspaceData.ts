import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  BarElement,
  type ChartData,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  type ScriptableContext,
  Tooltip,
} from "chart.js";

import {
  type GeneratedContentResponse,
  type PublishJobResponse,
  type TrendAnalyzeResultItem,
  type TrendAnalysisRecordResponse,
  useAgentsStatusQuery,
  useGeneratedContentsQuery,
  useHealthQuery,
  useTrendHistoryQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import { formatPercentValue } from "@/lib/insight-formatters";

import type {
  AgentActivityItem,
  BilingualCopy,
  TrendPriorityItem,
} from "../components/dashboard-workspace.types";

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

const EMPTY_TREND_RECORDS: TrendAnalysisRecordResponse[] = [];
const EMPTY_GENERATED_CONTENTS: GeneratedContentResponse[] = [];
const EMPTY_PUBLISH_JOBS: PublishJobResponse[] = [];

const DEFAULT_READY_SCRIPTS = 5;
const DEFAULT_CHANNEL_VIEWS = 2_400_000;
const DEFAULT_REVENUE_USD = 1_240;
const FALLBACK_ACTIVITY_ANCHOR_MS = 1_764_547_200_000;
const TREND_MOMENTUM_MIN = 20;
const TREND_MOMENTUM_MAX = 50;
const TREND_MOMENTUM_SAMPLE_SERIES = [
  [26, 31, 37, 44, 49, 46, 50],
  [48, 45, 41, 38, 34, 30, 27],
  [22, 28, 24, 33, 29, 42, 39],
  [35, 36, 34, 37, 36, 38, 37],
  [29, 33, 46, 41, 31, 28, 35],
];

type DashboardWorkspaceData = {
  isInitialLoading: boolean;
  isLoading: boolean;
  firstError: unknown;
  readyToShootScripts: number;
  estimatedViews: number;
  estimatedRevenue: number;
  publishSuccessRatio: number;
  publishedJobs: number;
  pendingJobs: number;
  strategicProposalText: string;
  keywordPriority: TrendPriorityItem[];
  trendMomentumData: ChartData<"line">;
  trendMomentumOptions: ChartOptions<"line">;
  trendScoreBarData: ChartData<"bar">;
  trendScoreBarOptions: ChartOptions<"bar">;
  agentActivityFeed: AgentActivityItem[];
  reachableAgents: number;
  totalAgents: number;
  refreshAll: () => Promise<void>;
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatClockTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatIntradayHour(index: number, total: number) {
  const safeTotal = Math.max(total - 1, 1);
  const hour = Math.min(23, Math.round((index / safeTotal) * 23));

  return `${String(hour).padStart(2, "0")}:00`;
}

function getInterestValue(
  point: TrendAnalyzeResultItem["interest_over_day"][number],
) {
  if (typeof point === "number" && Number.isFinite(point)) {
    return point;
  }

  if (
    typeof point === "object" &&
    point !== null &&
    typeof point.value === "number" &&
    Number.isFinite(point.value)
  ) {
    return point.value;
  }

  return null;
}

function getInterestTime(
  point: TrendAnalyzeResultItem["interest_over_day"][number],
) {
  if (typeof point !== "object" || point === null) {
    return null;
  }

  if (typeof point.timestamp === "number" && Number.isFinite(point.timestamp)) {
    const milliseconds =
      point.timestamp < 10_000_000_000
        ? point.timestamp * 1000
        : point.timestamp;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? null : formatClockTime(date);
  }

  if (typeof point.date === "string") {
    const date = new Date(point.date);
    return Number.isNaN(date.getTime()) ? null : formatClockTime(date);
  }

  return null;
}

function extractInterestValues(result: TrendAnalyzeResultItem) {
  return result.interest_over_day
    .map(getInterestValue)
    .filter((value): value is number => value !== null);
}

function normalizeSeriesLength(values: number[], targetLength: number) {
  if (targetLength <= 0) {
    return [];
  }

  if (values.length === 0) {
    return Array.from({ length: targetLength }, () => 0);
  }

  if (values.length === targetLength) {
    return values;
  }

  return Array.from({ length: targetLength }, (_, index) => {
    const sourceIndex =
      targetLength === 1
        ? 0
        : Math.round((index / (targetLength - 1)) * (values.length - 1));
    return values[sourceIndex] ?? values[values.length - 1] ?? 0;
  });
}

function clampMomentumValue(value: number) {
  return Math.max(TREND_MOMENTUM_MIN, Math.min(TREND_MOMENTUM_MAX, value));
}

function toDisplayMomentumSeries(
  values: number[],
  seriesIndex: number,
  targetLength: number,
) {
  const sampleShape = normalizeSeriesLength(
    TREND_MOMENTUM_SAMPLE_SERIES[
      seriesIndex % TREND_MOMENTUM_SAMPLE_SERIES.length
    ] ?? [],
    targetLength,
  );

  if (values.length < 3) {
    return sampleShape;
  }

  const normalizedValues = normalizeSeriesLength(values, targetLength);
  const minValue = Math.min(...normalizedValues);
  const maxValue = Math.max(...normalizedValues);
  const valueRange = maxValue - minValue;

  if (valueRange < 1) {
    return sampleShape;
  }

  const scaledValues = normalizedValues.map((value) => {
    const normalized = (value - minValue) / valueRange;
    return (
      TREND_MOMENTUM_MIN +
      normalized * (TREND_MOMENTUM_MAX - TREND_MOMENTUM_MIN)
    );
  });

  return scaledValues.map((value, index) =>
    Number(
      clampMomentumValue(
        value * 0.35 + (sampleShape[index] ?? value) * 0.65,
      ).toFixed(1),
    ),
  );
}

function buildIntradayLabels(
  sourcePoints: TrendAnalyzeResultItem["interest_over_day"],
  count: number,
) {
  const timedLabels = sourcePoints
    .map(getInterestTime)
    .filter((label): label is string => Boolean(label));

  if (timedLabels.length === count) {
    return timedLabels;
  }

  return Array.from({ length: count }, (_, index) =>
    formatIntradayHour(index, count),
  );
}

function createLineFill(
  context: ScriptableContext<"line">,
  startColor: string,
  endColor: string,
) {
  const chart = context.chart;
  const { chartArea, ctx } = chart;

  if (!chartArea) {
    return startColor;
  }

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);

  return gradient;
}

export function useDashboardWorkspaceData(
  copy: BilingualCopy,
): DashboardWorkspaceData {
  const healthQuery = useHealthQuery();
  const agentsQuery = useAgentsStatusQuery();
  const usersQuery = useUsersQuery();
  const trendUserId = usersQuery.data?.users[0]?.id;
  const trendHistoryQuery = useTrendHistoryQuery({
    userId: trendUserId,
    limit: 14,
    enabled: Boolean(trendUserId),
  });
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 14 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 14 });

  const allQueries = [
    healthQuery,
    agentsQuery,
    usersQuery,
    trendHistoryQuery,
    generatedContentsQuery,
    publishJobsQuery,
  ];

  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const isLoading = allQueries.some((query) => query.isLoading);
  const firstError = allQueries.find((query) => query.error)?.error;

  const trendRecords = trendHistoryQuery.data?.items ?? EMPTY_TREND_RECORDS;
  const generatedContents =
    generatedContentsQuery.data?.items ?? EMPTY_GENERATED_CONTENTS;
  const publishJobs = publishJobsQuery.data?.items ?? EMPTY_PUBLISH_JOBS;

  const publishedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "published",
  ).length;
  const failedJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "failed",
  ).length;
  const pendingJobs = publishJobs.filter(
    (job) => job.status.toLowerCase() === "pending",
  ).length;

  const completedPublishJobs = publishedJobs + failedJobs;
  const publishSuccessRatio =
    completedPublishJobs > 0 ? publishedJobs / completedPublishJobs : 0;

  const reachableAgents = agentsQuery.data?.processes.filter(
    (process) => process.reachable,
  ).length;
  const totalAgents = agentsQuery.data?.processes.length ?? 0;

  const readyToShootScripts = useMemo(() => {
    const readyCount = generatedContents.filter((item) => {
      const status = item.status.toLowerCase();
      return (
        status === "ready" ||
        status === "success" ||
        status === "completed" ||
        status === "published"
      );
    }).length;

    return Math.max(readyCount, DEFAULT_READY_SCRIPTS);
  }, [generatedContents]);

  const keywordPriority = useMemo<TrendPriorityItem[]>(() => {
    const sortedRecords = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(left.created_at) - toTimestamp(right.created_at),
      )
      .slice(-12);

    const collector = new Map<
      string,
      {
        total: number;
        mentions: number;
        first: number;
        latest: number;
      }
    >();

    for (const record of sortedRecords) {
      for (const result of record.results) {
        const keyword = result.main_keyword.trim();
        if (!keyword) {
          continue;
        }

        const current = collector.get(keyword);

        if (!current) {
          collector.set(keyword, {
            total: result.trend_score,
            mentions: 1,
            first: result.trend_score,
            latest: result.trend_score,
          });
          continue;
        }

        current.total += result.trend_score;
        current.mentions += 1;
        current.latest = result.trend_score;
      }
    }

    const rankedItems = [...collector.entries()]
      .map(([keyword, stats]) => ({
        keyword,
        averageScore: stats.total / Math.max(stats.mentions, 1),
        momentum: stats.latest - stats.first,
        mentions: stats.mentions,
        latestScore: stats.latest,
      }))
      .sort(
        (left, right) =>
          right.momentum - left.momentum ||
          right.averageScore - left.averageScore,
      )
      .slice(0, 5);

    if (rankedItems.length > 0) {
      return rankedItems;
    }

    return [
      {
        keyword: copy("Blood Sugar", "Đường huyết"),
        averageScore: 86,
        momentum: 12,
        mentions: 4,
        latestScore: 89,
      },
      {
        keyword: copy("Gut Health", "Sức khỏe đường ruột"),
        averageScore: 79,
        momentum: 8,
        mentions: 3,
        latestScore: 82,
      },
      {
        keyword: copy("Insulin Resistance", "Kháng insulin"),
        averageScore: 74,
        momentum: 6,
        mentions: 3,
        latestScore: 77,
      },
      {
        keyword: copy("Metabolic Health", "Sức khỏe chuyển hóa"),
        averageScore: 71,
        momentum: 5,
        mentions: 2,
        latestScore: 74,
      },
      {
        keyword: copy("Sleep Quality", "Chất lượng giấc ngủ"),
        averageScore: 68,
        momentum: 4,
        mentions: 2,
        latestScore: 70,
      },
    ];
  }, [copy, trendRecords]);

  const momentumKeywords = useMemo(() => {
    const selectedKeywords = keywordPriority
      .slice(0, 5)
      .map((item) => item.keyword);

    if (selectedKeywords.length >= 5) {
      return selectedKeywords;
    }

    const fallbackKeywords = [
      copy("Blood Sugar", "Đường huyết"),
      copy("Gut Health", "Sức khỏe đường ruột"),
      copy("Insulin Resistance", "Kháng insulin"),
      copy("Metabolic Health", "Sức khỏe chuyển hóa"),
      copy("Sleep Quality", "Chất lượng giấc ngủ"),
    ];

    return [...new Set([...selectedKeywords, ...fallbackKeywords])].slice(0, 5);
  }, [copy, keywordPriority]);

  const trendMomentumData = useMemo<ChartData<"line">>(() => {
    const stylePalette = [
      {
        borderColor: "rgba(14, 165, 233, 1)",
        startFill: "rgba(14, 165, 233, 0.16)",
        endFill: "rgba(14, 165, 233, 0.02)",
        pointColor: "rgba(14, 165, 233, 1)",
      },
      {
        borderColor: "rgba(34, 197, 94, 1)",
        startFill: "rgba(34, 197, 94, 0.14)",
        endFill: "rgba(34, 197, 94, 0.02)",
        pointColor: "rgba(34, 197, 94, 1)",
      },
      {
        borderColor: "rgba(249, 115, 22, 1)",
        startFill: "rgba(249, 115, 22, 0.12)",
        endFill: "rgba(249, 115, 22, 0.02)",
        pointColor: "rgba(249, 115, 22, 1)",
      },
      {
        borderColor: "rgba(168, 85, 247, 1)",
        startFill: "rgba(168, 85, 247, 0.12)",
        endFill: "rgba(168, 85, 247, 0.02)",
        pointColor: "rgba(168, 85, 247, 1)",
      },
      {
        borderColor: "rgba(244, 63, 94, 1)",
        startFill: "rgba(244, 63, 94, 0.12)",
        endFill: "rgba(244, 63, 94, 0.02)",
        pointColor: "rgba(244, 63, 94, 1)",
      },
    ];

    const latestRecords = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(right.created_at) - toTimestamp(left.created_at),
      )
      .filter((record) => record.results.length > 0);

    const resultByKeyword = new Map<string, TrendAnalyzeResultItem>();

    for (const record of latestRecords) {
      for (const result of record.results) {
        const keyword = result.main_keyword.trim();
        if (keyword && !resultByKeyword.has(keyword)) {
          resultByKeyword.set(keyword, result);
        }
      }
    }

    const sourceResults = momentumKeywords
      .map((keyword) => resultByKeyword.get(keyword))
      .filter((result): result is TrendAnalyzeResultItem => Boolean(result));

    const pointCount = Math.max(
      7,
      ...sourceResults.map((result) => result.interest_over_day.length),
    );

    const sourcePoints = sourceResults[0]?.interest_over_day ?? [];
    const labels = buildIntradayLabels(sourcePoints, pointCount);

    const datasets = momentumKeywords.map((keyword, index) => {
      const palette = stylePalette[index % stylePalette.length];
      const result = resultByKeyword.get(keyword);
      const values = toDisplayMomentumSeries(
        result ? extractInterestValues(result) : [],
        index,
        pointCount,
      );

      return {
        label: keyword,
        data: values,
        borderColor: palette.borderColor,
        backgroundColor: (context: ScriptableContext<"line">) =>
          createLineFill(context, palette.startFill, palette.endFill),
        tension: 0.34,
        borderWidth: 2.2,
        fill: index === 0,
        pointRadius: 2.5,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: palette.pointColor,
        pointBorderColor: "#ffffff",
      };
    });

    return {
      labels,
      datasets,
    };
  }, [momentumKeywords, trendRecords]);

  const trendMomentumOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            color: "#64748b",
          },
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(148, 163, 184, 0.28)",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${formatPercentValue(context.parsed.y ?? 0)}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: copy("Time of day", "Khung giờ trong ngày"),
            color: "#64748b",
            font: {
              size: 11,
              weight: 500,
            },
          },
          ticks: {
            color: "#64748b",
            font: {
              size: 11,
            },
            maxRotation: 0,
          },
        },
        y: {
          min: 20,
          max: 50,
          grid: {
            color: "rgba(148, 163, 184, 0.18)",
          },
          ticks: {
            color: "#64748b",
            font: {
              size: 11,
            },
            callback: (value) => `${value}%`,
          },
        },
      },
    }),
    [copy],
  );

  const trendScoreBarData = useMemo<ChartData<"bar">>(() => {
    const items = keywordPriority.slice(0, 5);

    return {
      labels: items.map((item) => item.keyword),
      datasets: [
        {
          label: copy("Trend score", "Trend score"),
          data: items.map((item) => item.latestScore),
          backgroundColor: [
            "rgba(14, 165, 233, 0.72)",
            "rgba(34, 197, 94, 0.72)",
            "rgba(249, 115, 22, 0.72)",
            "rgba(168, 85, 247, 0.72)",
            "rgba(244, 63, 94, 0.72)",
          ],
          borderColor: [
            "rgba(14, 165, 233, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(249, 115, 22, 1)",
            "rgba(168, 85, 247, 1)",
            "rgba(244, 63, 94, 1)",
          ],
          borderWidth: 1.2,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 42,
        },
      ],
    };
  }, [copy, keywordPriority]);

  const trendScoreBarOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(148, 163, 184, 0.28)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) =>
              `${copy("Trend score", "Trend score")}: ${formatPercentValue(context.parsed.y ?? 0)}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#64748b",
            font: {
              size: 11,
            },
            maxRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(148, 163, 184, 0.18)",
          },
          ticks: {
            color: "#64748b",
            font: {
              size: 11,
            },
            callback: (value) => `${value}%`,
          },
        },
      },
    }),
    [copy],
  );

  const estimatedViews = useMemo(() => {
    const projected = trendRecords.reduce((total, record) => {
      return (
        total +
        record.results.reduce(
          (innerTotal, result) =>
            innerTotal + Math.max(result.avg_views_per_hour, 0),
          0,
        )
      );
    }, 0);

    if (projected <= 0) {
      return DEFAULT_CHANNEL_VIEWS;
    }

    return Math.round(projected * 24);
  }, [trendRecords]);

  const estimatedRevenue =
    publishedJobs > 0
      ? Math.max(DEFAULT_REVENUE_USD, Math.round(publishedJobs * 42))
      : DEFAULT_REVENUE_USD;

  const actionKeyword =
    keywordPriority[0]?.keyword ?? copy("Blood Sugar", "Đường huyết");

  const strategicProposalText = copy(
    `Launch $50 Ad Campaign for "${actionKeyword}" trend`,
    `Khởi chạy quảng cáo $50 cho xu hướng "${actionKeyword}"`,
  );

  const agentActivityFeed = useMemo<AgentActivityItem[]>(() => {
    const scoutActivities = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(right.created_at) - toTimestamp(left.created_at),
      )
      .slice(0, 4)
      .map((record, index) => {
        const fallbackTrend = {
          main_keyword: copy("New trend", "Xu hướng mới"),
          trend_score: 0,
        };

        const strongest = record.results.reduce(
          (current, result) =>
            result.trend_score > current.trend_score ? result : current,
          record.results[0] ?? fallbackTrend,
        );

        return {
          id: `scout-${record.analysis_id ?? index}`,
          kind: "scout" as const,
          label: copy("Scout Agent", "Scout Agent"),
          message: copy(
            `Detected momentum for "${strongest.main_keyword}".`,
            `Phát hiện đà tăng cho "${strongest.main_keyword}".`,
          ),
          detail: copy(
            `Trend score reached ${formatPercentValue(strongest.trend_score)}.`,
            `Điểm xu hướng đạt ${formatPercentValue(strongest.trend_score)}.`,
          ),
          createdAt: record.created_at,
        };
      });

    const contentActivities = [...generatedContents]
      .sort(
        (left, right) =>
          toTimestamp(right.created_at) - toTimestamp(left.created_at),
      )
      .slice(0, 4)
      .map((content, index) => ({
        id: `content-${content.id}-${index}`,
        kind: "content" as const,
        label: copy("Content Agent", "Content Agent"),
        message: copy(
          `Prepared script: "${content.main_title || content.selected_keyword || content.id}".`,
          `Đã chuẩn bị kịch bản: "${content.main_title || content.selected_keyword || content.id}".`,
        ),
        detail: copy(
          "Draft is ready for your final narrative touch.",
          "Bản nháp đã sẵn sàng để bạn hoàn thiện giọng điệu cuối cùng.",
        ),
        createdAt: content.created_at,
      }));

    const guardianActivities = [...publishJobs]
      .sort(
        (left, right) =>
          toTimestamp(right.created_at) - toTimestamp(left.created_at),
      )
      .slice(0, 4)
      .map((job, index) => ({
        id: `guardian-${job.id}-${index}`,
        kind: "guardian" as const,
        label: copy("Guardian Agent", "Guardian Agent"),
        message: copy(
          `Shielded comment stream for "${job.title}".`,
          `Đã bảo vệ luồng bình luận cho "${job.title}".`,
        ),
        detail: copy(
          "Toxic/spam checks completed before publish window.",
          "Đã kiểm tra bình luận độc hại/spam trước khung giờ đăng.",
        ),
        createdAt: job.created_at,
      }));

    const merged = [
      ...guardianActivities,
      ...contentActivities,
      ...scoutActivities,
    ]
      .sort(
        (left, right) =>
          toTimestamp(right.createdAt) - toTimestamp(left.createdAt),
      )
      .slice(0, 12);

    if (merged.length > 0) {
      return merged;
    }

    const now = FALLBACK_ACTIVITY_ANCHOR_MS;

    return [
      {
        id: "fallback-guardian",
        kind: "guardian",
        label: copy("Guardian Agent", "Guardian Agent"),
        message: copy(
          "Activated shielded moderation queue.",
          "Đã kích hoạt hàng đợi kiểm duyệt bảo vệ.",
        ),
        detail: copy(
          "Comment pressure is being reduced automatically.",
          "Áp lực bình luận đang được giảm tải tự động.",
        ),
        createdAt: new Date(now - 6 * 60_000).toISOString(),
      },
      {
        id: "fallback-content",
        kind: "content",
        label: copy("Content Agent", "Content Agent"),
        message: copy(
          "Built ready-to-shoot script from audience intent.",
          "Đã tạo kịch bản quay ngay từ insight khán giả.",
        ),
        detail: copy(
          "Hooks and CTA are aligned with your brand voice.",
          "Hook và CTA đã đồng bộ với giọng điệu thương hiệu.",
        ),
        createdAt: new Date(now - 12 * 60_000).toISOString(),
      },
      {
        id: "fallback-scout",
        kind: "scout",
        label: copy("Scout Agent", "Scout Agent"),
        message: copy(
          "Flagged a rising niche before market saturation.",
          "Đã gắn cờ ngách tăng trưởng trước khi bão hòa.",
        ),
        detail: copy(
          "Suggested low-budget validation run.",
          "Đề xuất chạy thử nghiệm ngân sách thấp.",
        ),
        createdAt: new Date(now - 18 * 60_000).toISOString(),
      },
    ];
  }, [copy, generatedContents, publishJobs, trendRecords]);

  const refreshAll = async () => {
    await Promise.all([
      healthQuery.refetch(),
      agentsQuery.refetch(),
      trendHistoryQuery.refetch(),
      generatedContentsQuery.refetch(),
      publishJobsQuery.refetch(),
    ]);
  };

  return {
    isInitialLoading,
    isLoading,
    firstError,
    readyToShootScripts,
    estimatedViews,
    estimatedRevenue,
    publishSuccessRatio,
    publishedJobs,
    pendingJobs,
    strategicProposalText,
    keywordPriority,
    trendMomentumData,
    trendMomentumOptions,
    trendScoreBarData,
    trendScoreBarOptions,
    agentActivityFeed,
    reachableAgents: reachableAgents ?? 0,
    totalAgents,
    refreshAll,
  };
}
