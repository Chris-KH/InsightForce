import { httpClient } from "@/api/http-client";
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
  return httpClient.post<TrendAnalyzeResponse>(
    `${TRENDS_BASE_PATH}/analyze`,
    payload,
  );
}

export function getTrendOverview(params: GetTrendOverviewParams = {}) {
  return httpClient.get<TrendOverviewResponse>(
    `${TRENDS_BASE_PATH}/mock/overview`,
    {
      query: {
        keyword: params.keyword,
        region: params.region,
        hashtag: params.hashtag,
      },
    },
  );
}
