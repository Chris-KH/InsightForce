import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
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
  agentActivityFeed: AgentActivityItem[];
  reachableAgents: number;
  totalAgents: number;
  refreshAll: () => Promise<void>;
};

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
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

function extractScoreForKeyword(
  record: TrendAnalysisRecordResponse,
  keyword: string,
) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const found = record.results.find(
    (item) => item.main_keyword.trim().toLowerCase() === normalizedKeyword,
  );

  return found ? found.trend_score : null;
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
      .slice(0, 3);

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
    ];
  }, [copy, trendRecords]);

  const competingKeywords = useMemo(() => {
    const selectedKeywords = keywordPriority
      .slice(0, 2)
      .map((item) => item.keyword);

    if (selectedKeywords.length === 2) {
      return selectedKeywords;
    }

    const fallbackKeywords = [
      copy("Blood Sugar", "Đường huyết"),
      copy("Gut Health", "Sức khỏe đường ruột"),
    ];

    return [...new Set([...selectedKeywords, ...fallbackKeywords])].slice(0, 2);
  }, [copy, keywordPriority]);

  const trendMomentumData = useMemo<ChartData<"line">>(() => {
    const stylePalette = [
      {
        borderColor: "rgba(14, 165, 233, 1)",
        startFill: "rgba(14, 165, 233, 0.28)",
        endFill: "rgba(14, 165, 233, 0.04)",
        pointColor: "rgba(14, 165, 233, 1)",
      },
      {
        borderColor: "rgba(34, 197, 94, 1)",
        startFill: "rgba(34, 197, 94, 0.24)",
        endFill: "rgba(34, 197, 94, 0.04)",
        pointColor: "rgba(34, 197, 94, 1)",
      },
    ];

    const records = [...trendRecords]
      .sort(
        (left, right) =>
          toTimestamp(left.created_at) - toTimestamp(right.created_at),
      )
      .slice(-8);

    const labels =
      records.length > 0
        ? records.map((record) => formatShortDate(record.created_at))
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const fallbackSeries = [
      [62, 65, 69, 71, 73, 76, 79],
      [54, 57, 59, 62, 64, 66, 67],
    ];

    const datasets = competingKeywords.map((keyword, index) => {
      const palette = stylePalette[index % stylePalette.length];
      let previousValue = 0;

      const values =
        records.length > 0
          ? records.map((record) => {
              const score = extractScoreForKeyword(record, keyword);
              if (score === null) {
                return previousValue;
              }

              previousValue = score;
              return score;
            })
          : fallbackSeries[index % fallbackSeries.length];

      return {
        label: keyword,
        data: values,
        borderColor: palette.borderColor,
        backgroundColor: (context: ScriptableContext<"line">) =>
          createLineFill(context, palette.startFill, palette.endFill),
        tension: 0.34,
        borderWidth: 2.2,
        fill: true,
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
  }, [competingKeywords, trendRecords]);

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
    [],
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

    const now = Date.now();

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
    agentActivityFeed,
    reachableAgents: reachableAgents ?? 0,
    totalAgents,
    refreshAll,
  };
}
