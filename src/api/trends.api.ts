import { httpClient } from "@/api/http-client";
import { getMockTrendAnalyze, withApiMockFallback } from "@/api/mock-fallback";
import type {
  TrendAnalysesListResponse,
  TrendAnalysisRecordResponse,
  TrendAnalyzeRequest,
  TrendAnalyzeResponse,
} from "@/api/types";

const TRENDS_BASE_PATH = "/api/v1/trends";

type RequestOptions = {
  signal?: AbortSignal;
};

export type GetTrendHistoryParams = {
  userId?: string;
  limit?: number;
};

export function analyzeTrend(
  payload: TrendAnalyzeRequest,
  options: RequestOptions = {},
) {
  return withApiMockFallback(
    `trends.analyze.${payload.query.trim().toLowerCase()}`,
    () =>
      httpClient.post<TrendAnalyzeResponse>(
        `${TRENDS_BASE_PATH}/analyze`,
        payload,
        {
          signal: options.signal,
        },
      ),
    () => getMockTrendAnalyze(payload.query),
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
        limit: params.limit ?? 20,
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
