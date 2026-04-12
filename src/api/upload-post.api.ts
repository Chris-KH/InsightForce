import { httpClient } from "@/api/http-client";
import type {
  ContentPlatform,
  UploadPostAnalyticsEnvelope,
  UploadPostCreateProfileRequest,
  UploadPostCommentsEnvelope,
  UploadPostCurrentUserResponse,
  UploadPostDeleteProfileResponse,
  UploadPostGenerateJwtRequest,
  UploadPostGenerateJwtResponse,
  UploadPostHistoryEnvelope,
  UploadPostPublishEnvelope,
  UploadPostPublishRequest,
  UploadPostPostAnalyticsEnvelope,
  UploadPostProfileResponse,
  UploadPostProfilesResponse,
  UploadPostTotalImpressionsEnvelope,
  UploadPostValidateJwtRequest,
  UploadPostValidateJwtResponse,
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

export function getUploadPostAccount() {
  return httpClient.get<UploadPostCurrentUserResponse>(
    `${UPLOAD_POST_BASE_PATH}/account/me`,
  );
}

export function createUploadPostProfile(
  payload: UploadPostCreateProfileRequest,
) {
  return httpClient.post<UploadPostProfileResponse>(
    `${UPLOAD_POST_BASE_PATH}/users`,
    payload,
  );
}

export function getUploadPostProfiles() {
  return httpClient.get<UploadPostProfilesResponse>(
    `${UPLOAD_POST_BASE_PATH}/users`,
  );
}

export function getUploadPostProfile(profileUsername: string) {
  return httpClient.get<UploadPostProfileResponse>(
    `${UPLOAD_POST_BASE_PATH}/users/${encodeURIComponent(profileUsername)}`,
  );
}

export function deleteUploadPostProfile(profileUsername: string) {
  return httpClient.delete<UploadPostDeleteProfileResponse>(
    `${UPLOAD_POST_BASE_PATH}/users/${encodeURIComponent(profileUsername)}`,
  );
}

export function generateUploadPostJwt(payload: UploadPostGenerateJwtRequest) {
  return httpClient.post<UploadPostGenerateJwtResponse>(
    `${UPLOAD_POST_BASE_PATH}/jwt/generate`,
    payload,
  );
}

export function validateUploadPostJwt(payload: UploadPostValidateJwtRequest) {
  return httpClient.post<UploadPostValidateJwtResponse>(
    `${UPLOAD_POST_BASE_PATH}/jwt/validate`,
    payload,
  );
}

export function publishUploadPostContent(payload: UploadPostPublishRequest) {
  const formData = new FormData();

  formData.append("user", payload.user.trim());
  formData.append(
    "platforms",
    payload.platforms
      .map((platform) => String(platform).trim())
      .filter(Boolean)
      .join(","),
  );
  formData.append("title", payload.title.trim());

  const description = payload.description?.trim();
  if (description) {
    formData.append("description", description);
  }

  const tags = (payload.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
  if (tags.length > 0) {
    formData.append("tags", tags.join(","));
  }

  const firstComment = payload.first_comment?.trim();
  if (firstComment) {
    formData.append("first_comment", firstComment);
  }

  const schedulePost = payload.schedule_post?.trim();
  if (schedulePost) {
    formData.append("schedule_post", schedulePost);
  }

  const linkUrl = payload.link_url?.trim();
  if (linkUrl) {
    formData.append("link_url", linkUrl);
  }

  const subreddit = payload.subreddit?.trim();
  if (subreddit) {
    formData.append("subreddit", subreddit);
  }

  const assetUrls = (payload.asset_urls ?? [])
    .map((url) => url.trim())
    .filter(Boolean);
  if (assetUrls.length > 0) {
    formData.append("asset_urls", assetUrls.join(","));
  }

  for (const file of payload.files ?? []) {
    formData.append("files", file);
  }

  return httpClient.post<UploadPostPublishEnvelope>(
    `${UPLOAD_POST_BASE_PATH}/publish`,
    formData,
  );
}

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
