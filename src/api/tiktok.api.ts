import { httpClient } from "@/api/http-client";
import type {
  TikTokChannelStatusResponse,
  TikTokRecommendationsResponse,
  TikTokTrendsResponse,
  TikTokVideoDetailResponse,
  TikTokVideosResponse,
  UploadVideoRequest,
  UploadVideoResponse,
} from "@/api/types";

const TIKTOK_BASE_PATH = "/api/v1/tiktok";

export function getTikTokChannelStatus() {
  return httpClient.get<TikTokChannelStatusResponse>(
    `${TIKTOK_BASE_PATH}/channel/status`,
  );
}

export function getTikTokTrends() {
  return httpClient.get<TikTokTrendsResponse>(`${TIKTOK_BASE_PATH}/trends`);
}

export function getTikTokRecommendations() {
  return httpClient.get<TikTokRecommendationsResponse>(
    `${TIKTOK_BASE_PATH}/recommendations`,
  );
}

export function getTikTokVideos() {
  return httpClient.get<TikTokVideosResponse>(`${TIKTOK_BASE_PATH}/videos`);
}

export function getTikTokVideo(videoId: string) {
  return httpClient.get<TikTokVideoDetailResponse>(
    `${TIKTOK_BASE_PATH}/videos/${encodeURIComponent(videoId)}`,
  );
}

export function uploadTikTokVideo(payload: UploadVideoRequest) {
  return httpClient.post<UploadVideoResponse>(
    `${TIKTOK_BASE_PATH}/upload`,
    payload,
  );
}
