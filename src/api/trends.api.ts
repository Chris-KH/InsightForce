import { httpClient } from "@/api/http-client";
import type {
  TrendAnalysesListResponse,
  TrendAnalysisRecordResponse,
} from "@/api/types";

const TRENDS_BASE_PATH = "/api/v1/trends";

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

function normalizeHistoryLimit(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_HISTORY_LIMIT;
  }

  return Math.max(
    MIN_HISTORY_LIMIT,
    Math.min(MAX_HISTORY_LIMIT, Math.round(value)),
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
