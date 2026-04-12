import { httpClient } from "@/api/http-client";
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
  return httpClient.get<YouTubeChannelStatusResponse>(
    `${YOUTUBE_BASE_PATH}/channel/status`,
  );
}

export function getYouTubeTrends() {
  return httpClient.get<YouTubeTrendsResponse>(`${YOUTUBE_BASE_PATH}/trends`);
}

export function getYouTubeRecommendations() {
  return httpClient.get<YouTubeRecommendationsResponse>(
    `${YOUTUBE_BASE_PATH}/recommendations`,
  );
}

export function getYouTubeVideos() {
  return httpClient.get<YouTubeVideosResponse>(`${YOUTUBE_BASE_PATH}/videos`);
}

export function getYouTubeVideo(videoId: string) {
  return httpClient.get<YouTubeVideoDetailResponse>(
    `${YOUTUBE_BASE_PATH}/videos/${encodeURIComponent(videoId)}`,
  );
}

export function uploadYouTubeVideo(payload: UploadVideoRequest) {
  return httpClient.post<UploadVideoResponse>(
    `${YOUTUBE_BASE_PATH}/upload`,
    payload,
  );
}
