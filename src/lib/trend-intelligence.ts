import type { TrendAnalyzeResultItem } from "@/api/types";

export type TrendGraphNode = {
  id: string;
  keyword: string;
  trendScore: number;
  avgViewsPerHour: number;
  why: string;
  hashtags: string[];
  radius: number;
  color: string;
  x?: number;
  y?: number;
};

export type TrendGraphLink = {
  source: string;
  target: string;
  sharedTags: string[];
  weight: number;
};

export type TrendGraphData = {
  nodes: TrendGraphNode[];
  links: TrendGraphLink[];
};

export type TrendFilterOptions = {
  minScore?: number;
  hashtagQuery?: string;
};

export const DEFAULT_TREND_PROMPT_SUGGESTIONS = [
  "xu hướng video ngắn cho creator Việt Nam",
  "chủ đề AI cho phòng khám trong 7 ngày tới",
  "ý tưởng content cho nhà thuốc và sức khỏe",
  "trend social media cho ngành giáo dục",
  "chủ đề đang tăng trưởng trên TikTok hôm nay",
];

export function sanitizeTrendResults(
  results: TrendAnalyzeResultItem[] | undefined,
): TrendAnalyzeResultItem[] {
  if (!results || results.length === 0) {
    return [];
  }

  return results
    .map((result, index) => ({
      ...result,
      main_keyword: result.main_keyword?.trim() || `trend-${index + 1}`,
      why_the_trend_happens:
        result.why_the_trend_happens?.trim() || "Không có diễn giải.",
      trend_score: Number.isFinite(result.trend_score) ? result.trend_score : 0,
      avg_views_per_hour: Number.isFinite(result.avg_views_per_hour)
        ? result.avg_views_per_hour
        : 0,
      top_hashtags: (result.top_hashtags ?? []).filter(Boolean),
      interest_over_day: result.interest_over_day ?? [],
      recommended_action:
        result.recommended_action?.trim() || "Tiếp tục theo dõi thêm tín hiệu.",
    }))
    .filter((item) => item.main_keyword);
}

export function extractInterestValues(
  result: TrendAnalyzeResultItem,
): number[] {
  return (result.interest_over_day ?? [])
    .map((point) => {
      if (typeof point === "number" && Number.isFinite(point)) {
        return point;
      }

      if (
        typeof point === "object" &&
        point !== null &&
        "value" in point &&
        typeof (point as { value?: unknown }).value === "number"
      ) {
        return (point as { value: number }).value;
      }

      return null;
    })
    .filter((value): value is number => value !== null);
}

function toNodeColor(score: number): string {
  if (score >= 80) {
    return "#10b981";
  }
  if (score >= 60) {
    return "#0ea5e9";
  }
  if (score >= 40) {
    return "#f59e0b";
  }
  return "#64748b";
}

function toNodeRadius(score: number): number {
  return Math.max(9, Math.min(34, 8 + score * 0.35));
}

export function buildTrendGraphData(
  results: TrendAnalyzeResultItem[],
): TrendGraphData {
  const nodes: TrendGraphNode[] = sanitizeTrendResults(results).map(
    (result, index) => ({
      id: `${result.main_keyword}-${index}`,
      keyword: result.main_keyword,
      trendScore: result.trend_score,
      avgViewsPerHour: result.avg_views_per_hour,
      why: result.why_the_trend_happens,
      hashtags: result.top_hashtags,
      radius: toNodeRadius(result.trend_score),
      color: toNodeColor(result.trend_score),
    }),
  );

  const links: TrendGraphLink[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const leftTags = new Set(
        nodes[i].hashtags.map((tag) => tag.toLowerCase()),
      );
      const rightTags = new Set(
        nodes[j].hashtags.map((tag) => tag.toLowerCase()),
      );
      const sharedTags = [...leftTags].filter((tag) => rightTags.has(tag));

      if (
        sharedTags.length > 0 ||
        Math.abs(nodes[i].trendScore - nodes[j].trendScore) <= 10
      ) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          sharedTags,
          weight: Math.max(1, sharedTags.length),
        });
      }
    }
  }

  if (links.length === 0 && nodes.length > 1) {
    for (let i = 1; i < nodes.length; i += 1) {
      links.push({
        source: nodes[i - 1].id,
        target: nodes[i].id,
        sharedTags: [],
        weight: 1,
      });
    }
  }

  return { nodes, links };
}

export function filterTrendResults(
  results: TrendAnalyzeResultItem[],
  options: TrendFilterOptions = {},
) {
  const minScore = options.minScore ?? 0;
  const hashtagQuery = options.hashtagQuery?.trim().toLowerCase() ?? "";

  return sanitizeTrendResults(results).filter((result) => {
    if (result.trend_score < minScore) {
      return false;
    }

    if (!hashtagQuery) {
      return true;
    }

    const keywordMatches = result.main_keyword
      .toLowerCase()
      .includes(hashtagQuery);
    const hashtagMatches = result.top_hashtags.some((hashtag) =>
      hashtag.toLowerCase().includes(hashtagQuery),
    );

    return keywordMatches || hashtagMatches;
  });
}

export function buildSessionSuggestions(
  prompts: string[],
  results: TrendAnalyzeResultItem[],
  fallback: string[] = DEFAULT_TREND_PROMPT_SUGGESTIONS,
): string[] {
  const unique = new Set<string>();

  for (const fallbackPrompt of fallback) {
    unique.add(fallbackPrompt);
  }

  const latestPrompts = prompts.slice(-4);
  for (const prompt of latestPrompts) {
    unique.add(`mở rộng thêm cho ${prompt}`);
  }

  for (const result of sanitizeTrendResults(results).slice(0, 4)) {
    unique.add(`phân tích sâu hơn về ${result.main_keyword}`);
    for (const hashtag of result.top_hashtags.slice(0, 2)) {
      unique.add(`lập kế hoạch nội dung cho ${hashtag}`);
    }
  }

  return [...unique].slice(0, 10);
}

export function createTrendSessionId() {
  const random = Math.random().toString(36).slice(2, 8);
  return `trend-${Date.now().toString(36)}-${random}`;
}
