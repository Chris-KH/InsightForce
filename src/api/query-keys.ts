export const queryKeys = {
  health: ["health"] as const,
  trend: {
    general: (query: string, limit: number) =>
      ["trend", "general", query, limit] as const,
    history: (userId?: string, limit = 20) =>
      ["trend", "history", userId ?? "all", limit] as const,
    detail: (analysisId: string) => ["trend", "detail", analysisId] as const,
  },
  agents: {
    status: ["agents", "status"] as const,
    orchestrate: ["agents", "orchestrate"] as const,
  },
  contents: {
    list: (userId?: string, limit = 20) =>
      ["contents", "list", userId ?? "all", limit] as const,
    detail: (contentId: string) => ["contents", "detail", contentId] as const,
  },
  users: {
    list: ["users", "list"] as const,
    detail: (userId: string) => ["users", "detail", userId] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
  },
  uploadPost: {
    publish: ["upload-post", "publish"] as const,
    publishJobs: (userId?: string, generatedContentId?: string, limit = 20) =>
      [
        "upload-post",
        "publish-jobs",
        userId ?? "all",
        generatedContentId ?? "all",
        limit,
      ] as const,
    publishJob: (publishJobId: string) =>
      ["upload-post", "publish-job", publishJobId] as const,
  },
};
