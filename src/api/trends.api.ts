import { httpClient } from "@/api/http-client";
import {
  getMockTrendAnalyze,
  getMockTrendOverview,
  withApiMockFallback,
} from "@/api/mock-fallback";
import type {
  TrendAnalyzeRequest,
  TrendAnalyzeResponse,
  TrendOverviewResponse,
} from "@/api/types";

const TRENDS_BASE_PATH = "/api/v1/trends";

export type GetTrendOverviewParams = {
  keyword?: string;
  region?: string;
  hashtag?: string;
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

export function getTrendOverview(params: GetTrendOverviewParams = {}) {
  return withApiMockFallback(
    `trends.overview.${params.keyword?.trim().toLowerCase() ?? "all"}`,
    () =>
      httpClient.get<TrendOverviewResponse>(
        `${TRENDS_BASE_PATH}/mock/overview`,
        {
          query: {
            keyword: params.keyword,
            region: params.region,
            hashtag: params.hashtag,
          },
        },
      ),
    () => getMockTrendOverview(params),
  );
}
