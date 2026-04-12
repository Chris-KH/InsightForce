import { httpClient } from "@/api/http-client";
import type {
  ContentPlatform,
  UploadPostAnalyticsEnvelope,
  UploadPostCommentsEnvelope,
  UploadPostHistoryEnvelope,
  UploadPostPostAnalyticsEnvelope,
  UploadPostTotalImpressionsEnvelope,
} from "@/api/types";

const UPLOAD_POST_BASE_PATH = "/api/v1/upload-post";

export type GetUploadPostHistoryParams = {
  page?: number;
  limit?: number;
};

export type GetUploadPostProfileAnalyticsParams = {
  profileUsername: string;
  platforms: ContentPlatform[];
  pageId?: string;
  pageUrn?: string;
};

export type GetUploadPostTotalImpressionsParams = {
  profileUsername: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  period?: string;
  platforms?: ContentPlatform[];
  breakdown?: boolean;
  metrics?: string[];
};

export type GetUploadPostPostAnalyticsParams = {
  requestId: string;
  platform?: ContentPlatform;
};

export type GetUploadPostCommentsParams = {
  platform: ContentPlatform;
  user: string;
  postId?: string;
  postUrl?: string;
};

export function getUploadPostHistory(params: GetUploadPostHistoryParams = {}) {
  return httpClient.get<UploadPostHistoryEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/history`,
    {
      query: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    },
  );
}

export function getUploadPostProfileAnalytics(
  params: GetUploadPostProfileAnalyticsParams,
) {
  return httpClient.get<UploadPostAnalyticsEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/analytics/profiles/${encodeURIComponent(params.profileUsername)}`,
    {
      query: {
        platforms: params.platforms,
        page_id: params.pageId,
        page_urn: params.pageUrn,
      },
    },
  );
}

export function getUploadPostTotalImpressions(
  params: GetUploadPostTotalImpressionsParams,
) {
  return httpClient.get<UploadPostTotalImpressionsEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/analytics/profiles/${encodeURIComponent(params.profileUsername)}/total-impressions`,
    {
      query: {
        date: params.date,
        start_date: params.startDate,
        end_date: params.endDate,
        period: params.period,
        platform: params.platforms,
        breakdown: params.breakdown,
        metrics: params.metrics,
      },
    },
  );
}

export function getUploadPostPostAnalytics(
  params: GetUploadPostPostAnalyticsParams,
) {
  return httpClient.get<UploadPostPostAnalyticsEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/analytics/posts/${encodeURIComponent(params.requestId)}`,
    {
      query: {
        platform: params.platform,
      },
    },
  );
}

export function getUploadPostComments(params: GetUploadPostCommentsParams) {
  return httpClient.get<UploadPostCommentsEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/interactions/comments`,
    {
      query: {
        platform: params.platform,
        user: params.user,
        post_id: params.postId,
        post_url: params.postUrl,
      },
    },
  );
}
