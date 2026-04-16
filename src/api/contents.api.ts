import { httpClient } from "@/api/http-client";
import type {
  ContentGenerateRequest,
  GeneratedContentResponse,
  GeneratedContentsListResponse,
} from "@/api/types";

const CONTENTS_BASE_PATH = "/api/v1/contents";

type RequestOptions = {
  signal?: AbortSignal;
};

export type GetGeneratedContentsParams = {
  userId?: string;
  limit?: number;
};

export function generateContent(payload: ContentGenerateRequest) {
  return httpClient.post<GeneratedContentResponse>(
    `${CONTENTS_BASE_PATH}/generate`,
    payload,
  );
}

export function getGeneratedContents(
  params: GetGeneratedContentsParams = {},
  options: RequestOptions = {},
) {
  return httpClient.get<GeneratedContentsListResponse>(CONTENTS_BASE_PATH, {
    query: {
      user_id: params.userId,
      limit: params.limit ?? 20,
    },
    signal: options.signal,
  });
}

export function getGeneratedContent(
  contentId: string,
  options: RequestOptions = {},
) {
  return httpClient.get<GeneratedContentResponse>(
    `${CONTENTS_BASE_PATH}/${encodeURIComponent(contentId)}`,
    {
      signal: options.signal,
    },
  );
}
