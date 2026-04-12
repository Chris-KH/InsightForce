import type { ContentPlatform } from "@/api/types";

export const queryKeys = {
  health: ["health"] as const,
  agents: {
    status: ["agents", "status"] as const,
  },
  tiktok: {
    channelStatus: ["tiktok", "channel-status"] as const,
    trends: ["tiktok", "trends"] as const,
    recommendations: ["tiktok", "recommendations"] as const,
    videos: ["tiktok", "videos"] as const,
    video: (videoId: string) => ["tiktok", "video", videoId] as const,
  },
  youtube: {
    channelStatus: ["youtube", "channel-status"] as const,
    trends: ["youtube", "trends"] as const,
    recommendations: ["youtube", "recommendations"] as const,
    videos: ["youtube", "videos"] as const,
    video: (videoId: string) => ["youtube", "video", videoId] as const,
  },
  uploadPost: {
    account: ["upload-post", "account", "me"] as const,
    profiles: ["upload-post", "profiles"] as const,
    profile: (profileUsername: string) =>
      ["upload-post", "profile", profileUsername] as const,
    history: (page: number, limit: number) =>
      ["upload-post", "history", page, limit] as const,
    profileAnalytics: (
      profileUsername: string,
      platforms: ContentPlatform[],
      pageId?: string,
      pageUrn?: string,
    ) =>
      [
        "upload-post",
        "profile-analytics",
        profileUsername,
        platforms,
        pageId,
        pageUrn,
      ] as const,
    totalImpressions: (
      profileUsername: string,
      options: {
        date?: string;
        startDate?: string;
        endDate?: string;
        period?: string;
        platforms?: ContentPlatform[];
        breakdown?: boolean;
        metrics?: string[];
      },
    ) =>
      ["upload-post", "total-impressions", profileUsername, options] as const,
    postAnalytics: (requestId: string, platform?: ContentPlatform) =>
      ["upload-post", "post-analytics", requestId, platform] as const,
    comments: (
      platform: ContentPlatform,
      user: string,
      postId?: string,
      postUrl?: string,
    ) => ["upload-post", "comments", platform, user, postId, postUrl] as const,
  },
};
