import { httpClient } from "@/api/http-client";
import type {
  PublishJobResponse,
  PublishJobsListResponse,
  UploadPostPublishRequest,
  UploadPostPublishResponse,
} from "@/api/types";

const UPLOAD_POST_BASE_PATH = "/api/v1/upload-post";

export type GetPublishJobsParams = {
  userId?: string;
  generatedContentId?: string;
  limit?: number;
};

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

  if (payload.user_id) {
    formData.append("user_id", payload.user_id);
  }

  if (payload.generated_content_id) {
    formData.append("generated_content_id", payload.generated_content_id);
  }

  return httpClient.post<UploadPostPublishResponse>(
    `${UPLOAD_POST_BASE_PATH}/publish`,
    formData,
  );
}

export function getUploadPostPublishJobs(params: GetPublishJobsParams = {}) {
  return httpClient.get<PublishJobsListResponse>(
    `${UPLOAD_POST_BASE_PATH}/publish-jobs`,
    {
      query: {
        user_id: params.userId,
        generated_content_id: params.generatedContentId,
        limit: params.limit ?? 20,
      },
    },
  );
}

export function getUploadPostPublishJob(publishJobId: string) {
  return httpClient.get<PublishJobResponse>(
    `${UPLOAD_POST_BASE_PATH}/publish-jobs/${encodeURIComponent(publishJobId)}`,
  );
}
