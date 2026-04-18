import type { TrendAnalyzeResultItem } from "@/api";
import {
  createTrendSessionId,
  extractInterestValues,
} from "@/lib/trend-intelligence";

import type {
  BilingualCopy,
  TrendSessionState,
} from "./strategy-workspace.types";

export function getDefaultTrendPromptSuggestions(copy: BilingualCopy) {
  return [
    copy("Find health trends in Vietnam", "Tìm xu hướng sức khỏe tại Việt Nam"),
    copy(
      "Find educational trends for parents",
      "Tìm xu hướng giáo dục cho phụ huynh",
    ),
    copy(
      "Find beauty and skincare trends for Gen Z",
      "Tìm xu hướng làm đẹp và skincare cho Gen Z",
    ),
    copy(
      "Find trending hooks for clinic creators",
      "Tìm hook đang thịnh hành cho creator mảng phòng khám",
    ),
    copy(
      "Find rising short-video topics this week",
      "Tìm chủ đề video ngắn đang tăng tuần này",
    ),
  ];
}

export function loadTrendSessionState(
  storageKey: string,
  defaultSuggestions: string[],
): TrendSessionState {
  const fallback: TrendSessionState = {
    sessionId: createTrendSessionId(),
    prompts: [],
    suggestions: defaultSuggestions,
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<TrendSessionState>;

    return {
      sessionId:
        typeof parsed.sessionId === "string" && parsed.sessionId
          ? parsed.sessionId
          : fallback.sessionId,
      prompts: Array.isArray(parsed.prompts)
        ? parsed.prompts.slice(-20)
        : fallback.prompts,
      suggestions:
        Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
          ? parsed.suggestions.slice(0, 10)
          : fallback.suggestions,
    };
  } catch {
    return fallback;
  }
}

export function toGrowthPercent(result: TrendAnalyzeResultItem) {
  const points = extractInterestValues(result);

  if (points.length >= 2) {
    const first = points[0] ?? 1;
    const last = points[points.length - 1] ?? first;
    const growth = ((last - first) / Math.max(first, 1)) * 100;
    return Number.isFinite(growth) ? growth : 0;
  }

  return Math.max(result.trend_score - 50, 0);
}

export function toSparklineValues(result: TrendAnalyzeResultItem) {
  const extracted = extractInterestValues(result);

  if (extracted.length >= 5) {
    return extracted
      .slice(-5)
      .map((value) => Math.max(Math.min(value, 100), 0));
  }

  const base = Math.max(result.trend_score - 18, 10);
  return [
    base,
    base + 6,
    base + 10,
    result.trend_score - 3,
    result.trend_score,
  ].map((value) => Math.max(Math.min(value, 100), 0));
}

export function aiStatusText(
  isPending: boolean,
  elapsedMs: number,
  topicCount: number,
  hasRun: boolean,
  copy: BilingualCopy,
) {
  if (isPending) {
    const phase = Math.floor(elapsedMs / 1600) % 3;

    if (phase === 0) {
      return copy("Scouting 14 platforms...", "Đang quét 14 nền tảng...");
    }

    if (phase === 1) {
      return copy(
        "Analyzing audience sentiment...",
        "Đang phân tích cảm xúc khán giả...",
      );
    }

    return copy(
      "Ranking creator opportunities...",
      "Đang xếp hạng cơ hội cho creator...",
    );
  }

  if (hasRun && topicCount > 0) {
    return copy(
      `Found ${topicCount} hot topics`,
      `Đã tìm thấy ${topicCount} chủ đề nóng`,
    );
  }

  return copy(
    "Ready to scout your next trend brief",
    "Sẵn sàng quét xu hướng theo brief tiếp theo",
  );
}
