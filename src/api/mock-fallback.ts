import { ApiError } from "@/api/http-client";
import type { AgentsStatusResponse, TrendAnalyzeResponse } from "@/api/types";

const OFFLINE_BACKOFF_MS = 5 * 60 * 1000;
const FALLBACK_STATUSES = new Set([0, 400, 404, 422, 429, 500, 502, 503, 504]);
const endpointOfflineUntil = new Map<string, number>();

const FALLBACK_TREND_KEYWORDS = [
  "creator economy",
  "short video hooks",
  "authentic storytelling",
  "community challenge",
  "micro tutorial",
];

function now() {
  return Date.now();
}

function isEndpointOffline(endpointKey: string) {
  const offlineUntil = endpointOfflineUntil.get(endpointKey);
  if (!offlineUntil) {
    return false;
  }

  if (offlineUntil <= now()) {
    endpointOfflineUntil.delete(endpointKey);
    return false;
  }

  return true;
}

function markEndpointOffline(endpointKey: string) {
  endpointOfflineUntil.set(endpointKey, now() + OFFLINE_BACKOFF_MS);
}

function shouldFallback(error: unknown) {
  if (!(error instanceof ApiError)) {
    return true;
  }

  return FALLBACK_STATUSES.has(error.status);
}

export async function withApiMockFallback<T>(
  endpointKey: string,
  requestFn: () => Promise<T>,
  mockFn: () => T,
): Promise<T> {
  if (isEndpointOffline(endpointKey)) {
    return mockFn();
  }

  try {
    return await requestFn();
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    markEndpointOffline(endpointKey);
    return mockFn();
  }
}

export function getMockAgentsStatus(): AgentsStatusResponse {
  return {
    status: "fallback",
    processes: [
      {
        name: "routing_orchestrator",
        url: "/api/v1/agents/orchestrate",
        reachable: true,
        detail: "Running in fallback mode",
      },
      {
        name: "trend_agent",
        url: "/api/v1/trends/analyze",
        reachable: true,
        detail: "Using fallback analyzer",
      },
      {
        name: "content_agent",
        url: "/api/v1/contents/generate",
        reachable: false,
        detail: "Backend unavailable, fallback active",
      },
      {
        name: "posting_agent",
        url: "/api/v1/upload-post/publish",
        reachable: false,
        detail: "Backend unavailable, fallback active",
      },
    ],
  };
}

function buildHashtags(keyword: string) {
  const compact = keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");

  return [`#${compact || "trend"}`, "#creator", "#growth"];
}

export function getMockTrendAnalyze(query: string): TrendAnalyzeResponse {
  const normalizedQuery = query.trim() || "general social trend";

  const results = FALLBACK_TREND_KEYWORDS.slice(0, 3).map((keyword, index) => {
    const trendScore = 78 - index * 8;

    return {
      main_keyword: keyword,
      why_the_trend_happens:
        "Audience demand is increasing for concise, actionable, and relatable content formats.",
      trend_score: trendScore,
      interest_over_day: [
        42 + index * 4,
        48 + index * 3,
        56 + index * 2,
        63 + index,
        69 - index,
        72 - index,
        76 - index * 2,
      ],
      avg_views_per_hour: 1200 - index * 190,
      recommended_action:
        "Ship one short content experiment today and track retention milestones at 3s, 8s, and 15s.",
      top_hashtags: buildHashtags(keyword),
      google: null,
      tiktok: null,
      threads: null,
    };
  });

  return {
    analysis_id: null,
    query: normalizedQuery,
    results,
    markdown_summary: [
      "## Fallback Trend Summary",
      `- Query: ${normalizedQuery}`,
      "- Signal quality: simulated",
      "- Use this output for UI continuity only",
    ].join("\n"),
    error: {
      source: "fallback",
      reason: "Trend service unavailable",
    },
  };
}
