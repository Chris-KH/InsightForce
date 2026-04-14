import { httpClient } from "@/api/http-client";
import {
  getMockYouTubeChannelStatus,
  getMockYouTubeRecommendations,
  getMockYouTubeTrends,
  getMockYouTubeVideo,
  getMockYouTubeVideos,
  withApiMockFallback,
} from "@/api/mock-fallback";
import type {
  UploadVideoRequest,
  UploadVideoResponse,
  YouTubeChannelStatusResponse,
  YouTubeRecommendationsResponse,
  YouTubeTrendsResponse,
  YouTubeVideoDetailResponse,
  YouTubeVideosResponse,
} from "@/api/types";

const YOUTUBE_BASE_PATH = "/api/v1/youtube";

export function getYouTubeChannelStatus() {
  return withApiMockFallback(
    "youtube.channel.status",
    () =>
      httpClient.get<YouTubeChannelStatusResponse>(
        `${YOUTUBE_BASE_PATH}/channel/status`,
      ),
    () => getMockYouTubeChannelStatus(),
  );
}

export function getYouTubeTrends() {
  return withApiMockFallback(
    "youtube.trends",
    () => httpClient.get<YouTubeTrendsResponse>(`${YOUTUBE_BASE_PATH}/trends`),
    () => getMockYouTubeTrends(),
  );
}

export function getYouTubeRecommendations() {
  return withApiMockFallback(
    "youtube.recommendations",
    () =>
      httpClient.get<YouTubeRecommendationsResponse>(
        `${YOUTUBE_BASE_PATH}/recommendations`,
      ),
    () => getMockYouTubeRecommendations(),
  );
}

export function getYouTubeVideos() {
  return withApiMockFallback(
    "youtube.videos",
    () => httpClient.get<YouTubeVideosResponse>(`${YOUTUBE_BASE_PATH}/videos`),
    () => getMockYouTubeVideos(),
  );
}

export function getYouTubeVideo(videoId: string) {
  return withApiMockFallback(
    `youtube.video.${videoId}`,
    () =>
      httpClient.get<YouTubeVideoDetailResponse>(
        `${YOUTUBE_BASE_PATH}/videos/${encodeURIComponent(videoId)}`,
      ),
    () => getMockYouTubeVideo(videoId),
  );
}

export function uploadYouTubeVideo(payload: UploadVideoRequest) {
  return httpClient.post<UploadVideoResponse>(
    `${YOUTUBE_BASE_PATH}/upload`,
    payload,
  );
}
