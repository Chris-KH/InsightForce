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
} from "@/api/types";
import {
  getUploadPostPublishJob,
  getUploadPostPublishJobs,
  publishUploadPostContent,
  type GetPublishJobsParams,
} from "@/api/upload-post.api";
import { createUser, getUser, getUsers } from "@/api/users.api";

export type TrendGeneralQueryParams = {
  query?: string;
  limit?: number;
  enabled?: boolean;
  refetchIntervalMs?: number;
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

export function trendGeneralQueryOptions(params: TrendGeneralQueryParams = {}) {
  const normalizedQuery = params.query?.trim();
  const query =
    normalizedQuery && normalizedQuery.length >= 2
      ? normalizedQuery
      : "xu huong trend tong quat hom nay";
  const limit = Math.max(1, Math.min(5, params.limit ?? 5));

  return queryOptions({
    queryKey: queryKeys.trend.general(query, limit),
    queryFn: () => analyzeTrend({ query, limit }),
    staleTime: 30_000,
    refetchInterval: params.refetchIntervalMs ?? 180_000,
  });
}

export function useTrendGeneralQuery(params: TrendGeneralQueryParams = {}) {
  return useQuery({
    ...trendGeneralQueryOptions(params),
    enabled: params.enabled ?? true,
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
    queryFn: () => getTrendHistory({ userId: params.userId, limit }),
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
    queryFn: () => getTrendAnalysisDetail(analysisId),
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
    queryFn: getAgentsStatus,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useAgentsStatusQuery() {
  return useQuery(agentsStatusQueryOptions());
}

export function useAgentsOrchestrateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.agents.orchestrate,
    mutationFn: (payload: OrchestratorRequest) =>
      orchestrateAgentsPipeline(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trend", "history"] }),
        queryClient.invalidateQueries({ queryKey: ["contents", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["upload-post", "publish-jobs"],
        }),
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
    queryFn: () => getGeneratedContents({ userId: params.userId, limit }),
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
    queryFn: () => getGeneratedContent(contentId),
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

  return useMutation({
    mutationKey: ["contents", "generate"],
    mutationFn: (payload: ContentGenerateRequest) => generateContent(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contents", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["trend", "history"] }),
      ]);
    },
  });
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.users.list,
    queryFn: getUsers,
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
    queryFn: () => getUser(userId),
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
    queryFn: () =>
      getUploadPostPublishJobs({
        userId: params.userId,
        generatedContentId: params.generatedContentId,
        limit,
      }),
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
    queryFn: () => getUploadPostPublishJob(publishJobId),
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

  return useMutation({
    mutationKey: queryKeys.uploadPost.publish,
    mutationFn: publishUploadPostContent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["upload-post", "publish-jobs"],
      });
    },
  });
}
