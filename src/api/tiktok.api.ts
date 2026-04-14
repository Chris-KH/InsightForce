import { httpClient } from "@/api/http-client";
import {
  getMockTikTokChannelStatus,
  getMockTikTokRecommendations,
  getMockTikTokTrends,
  getMockTikTokVideo,
  getMockTikTokVideos,
  withApiMockFallback,
} from "@/api/mock-fallback";
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
  return withApiMockFallback(
    "tiktok.channel.status",
    () =>
      httpClient.get<TikTokChannelStatusResponse>(
        `${TIKTOK_BASE_PATH}/channel/status`,
      ),
    () => getMockTikTokChannelStatus(),
  );
}

export function getTikTokTrends() {
  return withApiMockFallback(
    "tiktok.trends",
    () => httpClient.get<TikTokTrendsResponse>(`${TIKTOK_BASE_PATH}/trends`),
    () => getMockTikTokTrends(),
  );
}

export function getTikTokRecommendations() {
  return withApiMockFallback(
    "tiktok.recommendations",
    () =>
      httpClient.get<TikTokRecommendationsResponse>(
        `${TIKTOK_BASE_PATH}/recommendations`,
      ),
    () => getMockTikTokRecommendations(),
  );
}

export function getTikTokVideos() {
  return withApiMockFallback(
    "tiktok.videos",
    () => httpClient.get<TikTokVideosResponse>(`${TIKTOK_BASE_PATH}/videos`),
    () => getMockTikTokVideos(),
  );
}

export function getTikTokVideo(videoId: string) {
  return withApiMockFallback(
    `tiktok.video.${videoId}`,
    () =>
      httpClient.get<TikTokVideoDetailResponse>(
        `${TIKTOK_BASE_PATH}/videos/${encodeURIComponent(videoId)}`,
      ),
    () => getMockTikTokVideo(videoId),
  );
}

export function uploadTikTokVideo(payload: UploadVideoRequest) {
  return httpClient.post<UploadVideoResponse>(
    `${TIKTOK_BASE_PATH}/upload`,
    payload,
  );
}
