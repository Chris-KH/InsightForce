import { httpClient } from "@/api/http-client";
import type {
  TrendAnalysesListResponse,
  TrendAnalyzeRequest,
  TrendAnalyzeResponse,
  TrendAnalysisRecordResponse,
  TrendHistorySearchRequest,
} from "@/api/types";

const TRENDS_BASE_PATH = "/api/v1/trends";
const TREND_ANALYZE_TIMEOUT_MS = 420_000;

type RequestOptions = {
  signal?: AbortSignal;
};

export type GetTrendHistoryParams = {
  userId?: string;
  limit?: number;
};

const MIN_HISTORY_LIMIT = 1;
const MAX_HISTORY_LIMIT = 100;
const DEFAULT_HISTORY_LIMIT = 20;
const MIN_TREND_ANALYZE_LIMIT = 1;
const MAX_TREND_ANALYZE_LIMIT = 5;
const DEFAULT_TREND_ANALYZE_LIMIT = 5;

function normalizeHistoryLimit(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_HISTORY_LIMIT;
  }

  return Math.max(
    MIN_HISTORY_LIMIT,
    Math.min(MAX_HISTORY_LIMIT, Math.round(value)),
  );
}

function normalizeTrendAnalyzeLimit(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_TREND_ANALYZE_LIMIT;
  }

  return Math.max(
    MIN_TREND_ANALYZE_LIMIT,
    Math.min(MAX_TREND_ANALYZE_LIMIT, Math.round(value)),
  );
}

export function analyzeTrend(
  payload: TrendAnalyzeRequest,
  options: RequestOptions = {},
) {
  return httpClient.post<TrendAnalyzeResponse>(
    `${TRENDS_BASE_PATH}/analyze`,
    {
      query: payload.query.trim(),
      limit: normalizeTrendAnalyzeLimit(payload.limit),
      user_id: payload.user_id ?? null,
    },
    {
      signal: options.signal,
      timeoutMs: TREND_ANALYZE_TIMEOUT_MS,
    },
  );
}

export function getTrendHistory(
  params: GetTrendHistoryParams = {},
  options: RequestOptions = {},
) {
  return httpClient.get<TrendAnalysesListResponse>(
    `${TRENDS_BASE_PATH}/history`,
    {
      query: {
        user_id: params.userId,
        limit: normalizeHistoryLimit(params.limit),
      },
      signal: options.signal,
    },
  );
}

export function searchTrendHistory(
  payload: TrendHistorySearchRequest,
  options: RequestOptions = {},
) {
  return httpClient.post<TrendAnalysesListResponse>(
    `${TRENDS_BASE_PATH}/history/search`,
    {
      text: payload.text ?? payload.keyword ?? "",
      keyword: payload.keyword ?? payload.text ?? "",
      user_id: payload.user_id ?? null,
      limit: normalizeHistoryLimit(payload.limit),
    },
    {
      signal: options.signal,
    },
  );
}

export function getTrendAnalysisDetail(
  analysisId: string,
  options: RequestOptions = {},
) {
  return httpClient.get<TrendAnalysisRecordResponse>(
    `${TRENDS_BASE_PATH}/${encodeURIComponent(analysisId)}`,
    {
      signal: options.signal,
    },
  );
}
