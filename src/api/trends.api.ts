import { httpClient } from "@/api/http-client";
import { getMockTrendAnalyze, withApiMockFallback } from "@/api/mock-fallback";
import type {
  TrendAnalysesListResponse,
  TrendAnalysisRecordResponse,
  TrendAnalyzeRequest,
  TrendAnalyzeResponse,
} from "@/api/types";

const TRENDS_BASE_PATH = "/api/v1/trends";

export type GetTrendHistoryParams = {
  userId?: string;
  limit?: number;
};

export function analyzeTrend(payload: TrendAnalyzeRequest) {
  return withApiMockFallback(
    `trends.analyze.${payload.query.trim().toLowerCase()}`,
    () =>
      httpClient.post<TrendAnalyzeResponse>(
        `${TRENDS_BASE_PATH}/analyze`,
        payload,
      ),
    () => getMockTrendAnalyze(payload.query),
  );
}

export function getTrendHistory(params: GetTrendHistoryParams = {}) {
  return httpClient.get<TrendAnalysesListResponse>(
    `${TRENDS_BASE_PATH}/history`,
    {
      query: {
        user_id: params.userId,
        limit: params.limit ?? 20,
      },
    },
  );
}

export function getTrendAnalysisDetail(analysisId: string) {
  return httpClient.get<TrendAnalysisRecordResponse>(
    `${TRENDS_BASE_PATH}/${encodeURIComponent(analysisId)}`,
  );
}
