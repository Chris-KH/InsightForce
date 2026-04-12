import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getAgentsStatus } from "@/api/agents.api";
import { getHealthStatus } from "@/api/health.api";
import { queryKeys } from "@/api/query-keys";
import {
  getTikTokChannelStatus,
  getTikTokRecommendations,
  getTikTokTrends,
  getTikTokVideo,
  getTikTokVideos,
  uploadTikTokVideo,
} from "@/api/tiktok.api";
import type { ContentPlatform, UploadVideoRequest } from "@/api/types";
import {
  createUploadPostProfile,
  deleteUploadPostProfile,
  generateUploadPostJwt,
  getUploadPostAccount,
  getUploadPostComments,
  getUploadPostHistory,
  getUploadPostPostAnalytics,
  getUploadPostProfile,
  getUploadPostProfileAnalytics,
  getUploadPostProfiles,
  getUploadPostTotalImpressions,
  publishUploadPostContent,
  validateUploadPostJwt,
  type GetUploadPostHistoryParams,
} from "@/api/upload-post.api";
import {
  getYouTubeChannelStatus,
  getYouTubeRecommendations,
  getYouTubeTrends,
  getYouTubeVideo,
  getYouTubeVideos,
  uploadYouTubeVideo,
} from "@/api/youtube.api";

export type UploadPostProfileAnalyticsQueryParams = {
  profileUsername?: string;
  platforms: ContentPlatform[];
  pageId?: string;
  pageUrn?: string;
  enabled?: boolean;
};

export type UploadPostProfileQueryParams = {
  profileUsername?: string;
  enabled?: boolean;
};

export type UploadPostTotalImpressionsQueryParams = {
  profileUsername?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  period?: string;
  platforms?: ContentPlatform[];
  breakdown?: boolean;
  metrics?: string[];
  enabled?: boolean;
};

export type UploadPostPostAnalyticsQueryParams = {
  requestId?: string;
  platform?: ContentPlatform;
  enabled?: boolean;
};

export type UploadPostCommentsQueryParams = {
  platform?: ContentPlatform;
  user?: string;
  postId?: string;
  postUrl?: string;
  enabled?: boolean;
};

export function healthQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.health,
    queryFn: getHealthStatus,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useHealthQuery() {
  return useQuery(healthQueryOptions());
}

export function agentsStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.agents.status,
    queryFn: getAgentsStatus,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useAgentsStatusQuery() {
  return useQuery(agentsStatusQueryOptions());
}

export function tikTokChannelStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.tiktok.channelStatus,
    queryFn: getTikTokChannelStatus,
    staleTime: 60_000,
  });
}

export function useTikTokChannelStatusQuery() {
  return useQuery(tikTokChannelStatusQueryOptions());
}

export function tikTokTrendsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.tiktok.trends,
    queryFn: getTikTokTrends,
    staleTime: 60_000,
  });
}

export function useTikTokTrendsQuery() {
  return useQuery(tikTokTrendsQueryOptions());
}

export function tikTokRecommendationsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.tiktok.recommendations,
    queryFn: getTikTokRecommendations,
    staleTime: 60_000,
  });
}

export function useTikTokRecommendationsQuery() {
  return useQuery(tikTokRecommendationsQueryOptions());
}

export function tikTokVideosQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.tiktok.videos,
    queryFn: getTikTokVideos,
    staleTime: 60_000,
  });
}

export function useTikTokVideosQuery() {
  return useQuery(tikTokVideosQueryOptions());
}

export function tikTokVideoQueryOptions(videoId: string) {
  return queryOptions({
    queryKey: queryKeys.tiktok.video(videoId),
    queryFn: () => getTikTokVideo(videoId),
    staleTime: 60_000,
  });
}

export function useTikTokVideoQuery(videoId?: string) {
  return useQuery({
    ...tikTokVideoQueryOptions(videoId ?? ""),
    enabled: Boolean(videoId),
  });
}

export function youTubeChannelStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.youtube.channelStatus,
    queryFn: getYouTubeChannelStatus,
    staleTime: 60_000,
  });
}

export function useYouTubeChannelStatusQuery() {
  return useQuery(youTubeChannelStatusQueryOptions());
}

export function youTubeTrendsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.youtube.trends,
    queryFn: getYouTubeTrends,
    staleTime: 60_000,
  });
}

export function useYouTubeTrendsQuery() {
  return useQuery(youTubeTrendsQueryOptions());
}

export function youTubeRecommendationsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.youtube.recommendations,
    queryFn: getYouTubeRecommendations,
    staleTime: 60_000,
  });
}

export function useYouTubeRecommendationsQuery() {
  return useQuery(youTubeRecommendationsQueryOptions());
}

export function youTubeVideosQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.youtube.videos,
    queryFn: getYouTubeVideos,
    staleTime: 60_000,
  });
}

export function useYouTubeVideosQuery() {
  return useQuery(youTubeVideosQueryOptions());
}

export function youTubeVideoQueryOptions(videoId: string) {
  return queryOptions({
    queryKey: queryKeys.youtube.video(videoId),
    queryFn: () => getYouTubeVideo(videoId),
    staleTime: 60_000,
  });
}

export function useYouTubeVideoQuery(videoId?: string) {
  return useQuery({
    ...youTubeVideoQueryOptions(videoId ?? ""),
    enabled: Boolean(videoId),
  });
}

export function uploadPostAccountQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.uploadPost.account,
    queryFn: getUploadPostAccount,
    staleTime: 60_000,
  });
}

export function useUploadPostAccountQuery(enabled = true) {
  return useQuery({
    ...uploadPostAccountQueryOptions(),
    enabled,
  });
}

export function uploadPostProfilesQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.uploadPost.profiles,
    queryFn: getUploadPostProfiles,
    staleTime: 60_000,
  });
}

export function useUploadPostProfilesQuery(enabled = true) {
  return useQuery({
    ...uploadPostProfilesQueryOptions(),
    enabled,
  });
}

export function uploadPostProfileQueryOptions(profileUsername: string) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.profile(profileUsername),
    queryFn: () => getUploadPostProfile(profileUsername),
    staleTime: 60_000,
  });
}

export function useUploadPostProfileQuery(
  params: UploadPostProfileQueryParams,
) {
  const enabled = (params.enabled ?? true) && Boolean(params.profileUsername);

  return useQuery({
    ...uploadPostProfileQueryOptions(params.profileUsername ?? ""),
    enabled,
  });
}

export function uploadPostHistoryQueryOptions(
  params: GetUploadPostHistoryParams = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return queryOptions({
    queryKey: queryKeys.uploadPost.history(page, limit),
    queryFn: () => getUploadPostHistory({ page, limit }),
    staleTime: 30_000,
  });
}

export function useUploadPostHistoryQuery(
  params: GetUploadPostHistoryParams = {},
) {
  return useQuery(uploadPostHistoryQueryOptions(params));
}

export function uploadPostProfileAnalyticsQueryOptions(
  params: UploadPostProfileAnalyticsQueryParams,
) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.profileAnalytics(
      params.profileUsername ?? "",
      params.platforms,
      params.pageId,
      params.pageUrn,
    ),
    queryFn: () =>
      getUploadPostProfileAnalytics({
        profileUsername: params.profileUsername ?? "",
        platforms: params.platforms,
        pageId: params.pageId,
        pageUrn: params.pageUrn,
      }),
    staleTime: 30_000,
  });
}

export function useUploadPostProfileAnalyticsQuery(
  params: UploadPostProfileAnalyticsQueryParams,
) {
  const enabled =
    (params.enabled ?? true) &&
    Boolean(params.profileUsername) &&
    params.platforms.length > 0;

  return useQuery({
    ...uploadPostProfileAnalyticsQueryOptions(params),
    enabled,
  });
}

export function uploadPostTotalImpressionsQueryOptions(
  params: UploadPostTotalImpressionsQueryParams,
) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.totalImpressions(
      params.profileUsername ?? "",
      {
        date: params.date,
        startDate: params.startDate,
        endDate: params.endDate,
        period: params.period,
        platforms: params.platforms,
        breakdown: params.breakdown,
        metrics: params.metrics,
      },
    ),
    queryFn: () =>
      getUploadPostTotalImpressions({
        profileUsername: params.profileUsername ?? "",
        date: params.date,
        startDate: params.startDate,
        endDate: params.endDate,
        period: params.period,
        platforms: params.platforms,
        breakdown: params.breakdown,
        metrics: params.metrics,
      }),
    staleTime: 30_000,
  });
}

export function useUploadPostTotalImpressionsQuery(
  params: UploadPostTotalImpressionsQueryParams,
) {
  const enabled = (params.enabled ?? true) && Boolean(params.profileUsername);

  return useQuery({
    ...uploadPostTotalImpressionsQueryOptions(params),
    enabled,
  });
}

export function uploadPostPostAnalyticsQueryOptions(
  params: UploadPostPostAnalyticsQueryParams,
) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.postAnalytics(
      params.requestId ?? "",
      params.platform,
    ),
    queryFn: () =>
      getUploadPostPostAnalytics({
        requestId: params.requestId ?? "",
        platform: params.platform,
      }),
    staleTime: 30_000,
  });
}

export function useUploadPostPostAnalyticsQuery(
  params: UploadPostPostAnalyticsQueryParams,
) {
  const enabled = (params.enabled ?? true) && Boolean(params.requestId);

  return useQuery({
    ...uploadPostPostAnalyticsQueryOptions(params),
    enabled,
  });
}

export function uploadPostCommentsQueryOptions(
  params: UploadPostCommentsQueryParams,
) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.comments(
      params.platform ?? "tiktok",
      params.user ?? "",
      params.postId,
      params.postUrl,
    ),
    queryFn: () =>
      getUploadPostComments({
        platform: params.platform ?? "tiktok",
        user: params.user ?? "",
        postId: params.postId,
        postUrl: params.postUrl,
      }),
    staleTime: 30_000,
  });
}

export function useUploadPostCommentsQuery(
  params: UploadPostCommentsQueryParams,
) {
  const enabled =
    (params.enabled ?? true) &&
    Boolean(params.platform) &&
    Boolean(params.user) &&
    Boolean(params.postId || params.postUrl);

  return useQuery({
    ...uploadPostCommentsQueryOptions(params),
    enabled,
  });
}

export function useCreateUploadPostProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upload-post", "create-profile"],
    mutationFn: createUploadPostProfile,
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.uploadPost.account,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.uploadPost.profiles,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.uploadPost.profile(result.profile.username),
        }),
      ]);
    },
  });
}

export function useDeleteUploadPostProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upload-post", "delete-profile"],
    mutationFn: deleteUploadPostProfile,
    onSuccess: async (_result, profileUsername) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.uploadPost.profiles,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.uploadPost.profile(profileUsername),
        }),
      ]);
    },
  });
}

export function useGenerateUploadPostJwtMutation() {
  return useMutation({
    mutationKey: ["upload-post", "jwt", "generate"],
    mutationFn: generateUploadPostJwt,
  });
}

export function useValidateUploadPostJwtMutation() {
  return useMutation({
    mutationKey: ["upload-post", "jwt", "validate"],
    mutationFn: validateUploadPostJwt,
  });
}

export function useUploadPostPublishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.uploadPost.publish,
    mutationFn: publishUploadPostContent,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["upload-post", "history"] }),
        queryClient.invalidateQueries({
          queryKey: ["upload-post", "post-analytics"],
        }),
      ]);
    },
  });
}

function getUploadMutation(platform: ContentPlatform) {
  return platform === "tiktok" ? uploadTikTokVideo : uploadYouTubeVideo;
}

export function usePlatformUploadMutation(platform: ContentPlatform) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upload", platform],
    mutationFn: (payload: UploadVideoRequest) =>
      getUploadMutation(platform)(payload),
    onSuccess: async () => {
      if (platform === "tiktok") {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.tiktok.videos,
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.youtube.videos,
        });
      }
    },
  });
}
