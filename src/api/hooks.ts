import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getAgentsStatus, orchestrateAgentsPipeline } from "@/api/agents.api";
import {
  generateContent,
  getGeneratedContent,
  getGeneratedContents,
  type GetGeneratedContentsParams,
} from "@/api/contents.api";
import { getHealthStatus } from "@/api/health.api";
import { queryKeys } from "@/api/query-keys";
import {
  analyzeTrend,
  getTrendAnalysisDetail,
  getTrendHistory,
  type GetTrendHistoryParams,
} from "@/api/trends.api";
import type {
  ContentGenerateRequest,
  OrchestratorRequest,
  TrendAnalyzeRequest,
  UserProfileUpdateRequest,
} from "@/api/types";
import {
  getUploadPostPublishJob,
  getUploadPostPublishJobs,
  publishUploadPostContent,
  type GetPublishJobsParams,
} from "@/api/upload-post.api";
import {
  createUser,
  getUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "@/api/users.api";
import { getDefaultGeneralTrendQuery } from "@/lib/trend-query";

const ENABLE_API_POLLING = import.meta.env.VITE_ENABLE_API_POLLING === "true";

export type TrendGeneralQueryParams = {
  query?: string;
  limit?: number;
  enabled?: boolean;
};

export type TrendHistoryQueryParams = GetTrendHistoryParams & {
  enabled?: boolean;
};

export type TrendDetailQueryParams = {
  analysisId?: string;
  enabled?: boolean;
};

export type GeneratedContentsQueryParams = GetGeneratedContentsParams & {
  enabled?: boolean;
};

export type GeneratedContentQueryParams = {
  contentId?: string;
  enabled?: boolean;
};

export type PublishJobsQueryParams = GetPublishJobsParams & {
  enabled?: boolean;
};

export type PublishJobQueryParams = {
  publishJobId?: string;
  enabled?: boolean;
};

export type UserProfileQueryParams = {
  userId?: string;
  enabled?: boolean;
};

export function healthQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.health,
    queryFn: ({ signal }) => getHealthStatus({ signal }),
    staleTime: 30_000,
    refetchInterval: ENABLE_API_POLLING ? 60_000 : false,
  });
}

export function useHealthQuery() {
  return useQuery(healthQueryOptions());
}

export function trendGeneralQueryOptions(params: TrendGeneralQueryParams = {}) {
  const normalizedQuery = params.query?.trim();
  const query =
    normalizedQuery && normalizedQuery.length >= 2
      ? normalizedQuery
      : getDefaultGeneralTrendQuery();
  const limit = Math.max(1, Math.min(5, params.limit ?? 5));

  return queryOptions({
    queryKey: queryKeys.trend.general(query, limit),
    queryFn: ({ signal }) => analyzeTrend({ query, limit }, { signal }),
    staleTime: 15 * 60 * 1000,
  });
}

export function useTrendGeneralQuery(params: TrendGeneralQueryParams = {}) {
  return useQuery({
    ...trendGeneralQueryOptions(params),
    enabled: params.enabled ?? false,
  });
}

export function useTrendAnalyzeMutation() {
  return useMutation({
    mutationKey: ["trend", "analyze"],
    mutationFn: (payload: TrendAnalyzeRequest) => analyzeTrend(payload),
  });
}

export function trendHistoryQueryOptions(params: TrendHistoryQueryParams = {}) {
  const limit = params.limit ?? 20;

  return queryOptions({
    queryKey: queryKeys.trend.history(params.userId, limit),
    queryFn: ({ signal }) =>
      getTrendHistory({ userId: params.userId, limit }, { signal }),
    staleTime: 30_000,
  });
}

export function useTrendHistoryQuery(params: TrendHistoryQueryParams = {}) {
  return useQuery({
    ...trendHistoryQueryOptions(params),
    enabled: params.enabled ?? true,
  });
}

export function trendDetailQueryOptions(analysisId: string) {
  return queryOptions({
    queryKey: queryKeys.trend.detail(analysisId),
    queryFn: ({ signal }) => getTrendAnalysisDetail(analysisId, { signal }),
    staleTime: 30_000,
  });
}

export function useTrendDetailQuery(params: TrendDetailQueryParams) {
  return useQuery({
    ...trendDetailQueryOptions(params.analysisId ?? ""),
    enabled: (params.enabled ?? true) && Boolean(params.analysisId),
  });
}

export function agentsStatusQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.agents.status,
    queryFn: ({ signal }) => getAgentsStatus({ signal }),
    staleTime: 30_000,
    refetchInterval: ENABLE_API_POLLING ? 60_000 : false,
  });
}

export function useAgentsStatusQuery() {
  return useQuery(agentsStatusQueryOptions());
}

export function useAgentsOrchestrateMutation() {
  const queryClient = useQueryClient();
  const trendHistoryRootKey = trendHistoryQueryOptions().queryKey.slice(0, 2);
  const generatedContentsRootKey =
    generatedContentsQueryOptions().queryKey.slice(0, 2);
  const publishJobsRootKey = uploadPostPublishJobsQueryOptions().queryKey.slice(
    0,
    2,
  );

  return useMutation({
    mutationKey: queryKeys.agents.orchestrate,
    mutationFn: (payload: OrchestratorRequest) =>
      orchestrateAgentsPipeline(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: trendHistoryRootKey }),
        queryClient.invalidateQueries({ queryKey: generatedContentsRootKey }),
        queryClient.invalidateQueries({ queryKey: publishJobsRootKey }),
      ]);
    },
  });
}

export function generatedContentsQueryOptions(
  params: GeneratedContentsQueryParams = {},
) {
  const limit = params.limit ?? 20;

  return queryOptions({
    queryKey: queryKeys.contents.list(params.userId, limit),
    queryFn: ({ signal }) =>
      getGeneratedContents({ userId: params.userId, limit }, { signal }),
    staleTime: 30_000,
  });
}

export function useGeneratedContentsQuery(
  params: GeneratedContentsQueryParams = {},
) {
  return useQuery({
    ...generatedContentsQueryOptions(params),
    enabled: params.enabled ?? true,
  });
}

export function generatedContentQueryOptions(contentId: string) {
  return queryOptions({
    queryKey: queryKeys.contents.detail(contentId),
    queryFn: ({ signal }) => getGeneratedContent(contentId, { signal }),
    staleTime: 30_000,
  });
}

export function useGeneratedContentQuery(params: GeneratedContentQueryParams) {
  return useQuery({
    ...generatedContentQueryOptions(params.contentId ?? ""),
    enabled: (params.enabled ?? true) && Boolean(params.contentId),
  });
}

export function useContentGenerateMutation() {
  const queryClient = useQueryClient();
  const trendHistoryRootKey = trendHistoryQueryOptions().queryKey.slice(0, 2);
  const generatedContentsRootKey =
    generatedContentsQueryOptions().queryKey.slice(0, 2);

  return useMutation({
    mutationKey: ["contents", "generate"],
    mutationFn: (payload: ContentGenerateRequest) => generateContent(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: generatedContentsRootKey }),
        queryClient.invalidateQueries({ queryKey: trendHistoryRootKey }),
      ]);
    },
  });
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.users.list,
    queryFn: ({ signal }) => getUsers({ signal }),
    staleTime: 60_000,
  });
}

export function useUsersQuery(enabled = true) {
  return useQuery({
    ...usersQueryOptions(),
    enabled,
  });
}

export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.users.detail(userId),
    queryFn: ({ signal }) => getUser(userId, { signal }),
    staleTime: 60_000,
  });
}

export function useUserQuery(userId?: string, enabled = true) {
  return useQuery({
    ...userQueryOptions(userId ?? ""),
    enabled: enabled && Boolean(userId),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users", "create"],
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.list });
    },
  });
}

export function userProfileQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.users.profile(userId),
    queryFn: ({ signal }) => getUserProfile(userId, { signal }),
    staleTime: 60_000,
  });
}

export function useUserProfileQuery(params: UserProfileQueryParams) {
  return useQuery({
    ...userProfileQueryOptions(params.userId ?? ""),
    enabled: (params.enabled ?? true) && Boolean(params.userId),
  });
}

export function useUpdateUserProfileMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users", "profile", "update", userId ?? "unknown"],
    mutationFn: (payload: UserProfileUpdateRequest) => {
      if (!userId) {
        throw new Error("User ID is required for profile update.");
      }

      return updateUserProfile(userId, payload);
    },
    onSuccess: async () => {
      if (!userId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(userId),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.list });
    },
  });
}

export function uploadPostPublishJobsQueryOptions(
  params: PublishJobsQueryParams = {},
) {
  const limit = params.limit ?? 20;

  return queryOptions({
    queryKey: queryKeys.uploadPost.publishJobs(
      params.userId,
      params.generatedContentId,
      limit,
    ),
    queryFn: ({ signal }) =>
      getUploadPostPublishJobs(
        {
          userId: params.userId,
          generatedContentId: params.generatedContentId,
          limit,
        },
        { signal },
      ),
    staleTime: 30_000,
  });
}

export function useUploadPostPublishJobsQuery(
  params: PublishJobsQueryParams = {},
) {
  return useQuery({
    ...uploadPostPublishJobsQueryOptions(params),
    enabled: params.enabled ?? true,
  });
}

export function uploadPostPublishJobQueryOptions(publishJobId: string) {
  return queryOptions({
    queryKey: queryKeys.uploadPost.publishJob(publishJobId),
    queryFn: ({ signal }) => getUploadPostPublishJob(publishJobId, { signal }),
    staleTime: 30_000,
  });
}

export function useUploadPostPublishJobQuery(params: PublishJobQueryParams) {
  return useQuery({
    ...uploadPostPublishJobQueryOptions(params.publishJobId ?? ""),
    enabled: (params.enabled ?? true) && Boolean(params.publishJobId),
  });
}

export function useUploadPostPublishMutation() {
  const queryClient = useQueryClient();
  const publishJobsRootKey = uploadPostPublishJobsQueryOptions().queryKey.slice(
    0,
    2,
  );

  return useMutation({
    mutationKey: queryKeys.uploadPost.publish,
    mutationFn: publishUploadPostContent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: publishJobsRootKey });
    },
  });
}
