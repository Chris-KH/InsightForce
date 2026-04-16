import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  CheckCircle2,
  Clock3,
  FileStack,
  Loader2,
  Upload,
  Workflow,
} from "lucide-react";

import {
  type GeneratedContentResponse,
  type PublishJobResponse,
  type UploadPostPublishPlatform,
  useGeneratedContentsQuery,
  useUploadPostPublishJobQuery,
  useUploadPostPublishJobsQuery,
  useUploadPostPublishMutation,
  useUsersQuery,
} from "@/api";
import {
  InlineQueryState,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";

const PUBLISH_PLATFORM_OPTIONS: UploadPostPublishPlatform[] = [
  "tiktok",
  "instagram",
  "youtube",
  "facebook",
  "x",
  "threads",
  "linkedin",
  "bluesky",
  "reddit",
  "pinterest",
  "google_business",
];

type PublishStatusFilter = "all" | "pending" | "published" | "failed";

function getDisplayTitle(record: GeneratedContentResponse) {
  return record.main_title || record.selected_keyword || record.id;
}

function statusBadgeClass(status: string) {
  const lowered = status.toLowerCase();

  if (lowered === "published") {
    return "border-emerald-500/45 text-emerald-700 bg-emerald-500/10";
  }

  if (lowered === "failed") {
    return "border-rose-500/45 text-rose-700 bg-rose-500/10";
  }

  if (lowered === "pending") {
    return "border-amber-500/45 text-amber-700 bg-amber-500/10";
  }

  return "border-border/70 text-muted-foreground";
}

function sortJobsByCreatedAt(items: PublishJobResponse[]) {
  return [...items].sort((left, right) => {
    const leftTime = Date.parse(left.created_at);
    const rightTime = Date.parse(right.created_at);

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return 0;
    }

    return rightTime - leftTime;
  });
}

export function PublishOpsPage() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });
  const publishMutation = useUploadPostPublishMutation();

  const [selectedJobId, setSelectedJobId] = useState<string>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedJobQuery = useUploadPostPublishJobQuery({
    publishJobId: selectedJobId,
    enabled: Boolean(selectedJobId),
  });

  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [generatedContentId, setGeneratedContentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [firstComment, setFirstComment] = useState("");
  const [schedulePost, setSchedulePost] = useState("");
  const [assetUrls, setAssetUrls] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [platforms, setPlatforms] = useState<UploadPostPublishPlatform[]>([
    "tiktok",
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [statusFilter, setStatusFilter] = useState<PublishStatusFilter>("all");

  const publishJobs = useMemo(
    () => sortJobsByCreatedAt(publishJobsQuery.data?.items ?? []),
    [publishJobsQuery.data?.items],
  );

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") {
      return publishJobs;
    }

    return publishJobs.filter(
      (job) => job.status.toLowerCase() === statusFilter,
    );
  }, [publishJobs, statusFilter]);

  useEffect(() => {
    if (!user && usersQuery.data?.users[0]) {
      setUser(usersQuery.data.users[0].email);
    }
  }, [usersQuery.data, user]);

  useEffect(() => {
    if (!userId && usersQuery.data?.users[0]?.id) {
      setUserId(usersQuery.data.users[0].id);
    }
  }, [usersQuery.data, userId]);

  useEffect(() => {
    if (!generatedContentId && generatedContentsQuery.data?.items[0]?.id) {
      setGeneratedContentId(generatedContentsQuery.data.items[0].id);
    }
  }, [generatedContentId, generatedContentsQuery.data]);

  useEffect(() => {
    if (publishMutation.data?.publish_job.id) {
      setSelectedJobId(publishMutation.data.publish_job.id);
    }
  }, [publishMutation.data?.publish_job.id]);

  const togglePlatform = (platform: UploadPostPublishPlatform) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  };

  const applyPreset = (preset: "short-video" | "multichannel") => {
    if (preset === "short-video") {
      setPlatforms(["tiktok", "instagram", "youtube"]);
      return;
    }

    setPlatforms(["tiktok", "instagram", "youtube", "facebook", "threads"]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
  };

  const normalizeCsv = (rawValue: string) =>
    rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const applyGeneratedContent = (record: GeneratedContentResponse) => {
    setGeneratedContentId(record.id);

    if (!title.trim()) {
      setTitle(record.main_title ?? record.selected_keyword ?? "");
    }

    if (!description.trim()) {
      setDescription(record.selected_keyword ?? "");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUser = user.trim();
    const normalizedTitle = title.trim();

    if (!normalizedUser || !normalizedTitle || platforms.length === 0) {
      return;
    }

    await publishMutation.mutateAsync({
      user: normalizedUser,
      platforms,
      title: normalizedTitle,
      description: description.trim() || undefined,
      tags: normalizeCsv(tags),
      first_comment: firstComment.trim() || undefined,
      schedule_post: schedulePost
        ? new Date(schedulePost).toISOString()
        : undefined,
      asset_urls: normalizeCsv(assetUrls),
      link_url: linkUrl.trim() || undefined,
      subreddit: subreddit.trim() || undefined,
      files,
      user_id: userId.trim() || undefined,
      generated_content_id: generatedContentId.trim() || undefined,
    });
  };

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Publish Ops", vi: "Vận hành đăng bài" }}
        description={{
          en: "Plan, schedule, and monitor your posts from one docs-aligned workspace.",
          vi: "Lập kế hoạch, lên lịch và theo dõi bài đăng từ một workspace bám sát docs API.",
        }}
        badge={{ en: "Publishing Workspace", vi: "Không gian đăng bài" }}
        icon={Workflow}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PanelCard
          title={copy("Post Planner", "Lên kế hoạch bài đăng")}
          description={copy(
            "Prepare one posting task with title, channels, timing, and assets.",
            "Chuẩn bị một tác vụ đăng bài với tiêu đề, kênh, thời gian và tài nguyên.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-user">
                  {copy("Publisher", "Tài khoản đăng")}
                </Label>
                <Input
                  id="publish-ops-user"
                  value={user}
                  list="publish-ops-users"
                  onChange={(event) => setUser(event.target.value)}
                  placeholder={copy("Email or username", "Email hoặc username")}
                />
                <datalist id="publish-ops-users">
                  {(usersQuery.data?.users ?? []).map((item) => (
                    <option key={item.id} value={item.email} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1">
                <Label htmlFor="publish-ops-title">
                  {copy("Post Title", "Tiêu đề bài đăng")}
                </Label>
                <Input
                  id="publish-ops-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={copy(
                    "Ex: 3 tips to boost reach",
                    "Ví dụ: 3 cách tăng độ phủ",
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>{copy("Channels", "Kênh đăng")}</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("short-video")}
                  className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/45 hover:text-primary"
                >
                  {copy("Preset: Short-video", "Preset: Video ngắn")}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("multichannel")}
                  className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/45 hover:text-primary"
                >
                  {copy("Preset: Multi-channel", "Preset: Đa kênh")}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {PUBLISH_PLATFORM_OPTIONS.map((platform) => {
                  const active = platforms.includes(platform);

                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        active
                          ? "border-primary/45 bg-primary/10 text-primary"
                          : "border-border/70 bg-background/70 text-muted-foreground",
                      )}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="publish-ops-description">
                {copy("Caption / Context", "Nội dung mô tả")}
              </Label>
              <Textarea
                id="publish-ops-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={copy(
                  "Write the core context for this post.",
                  "Viết nội dung cốt lõi cho bài đăng này.",
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-tags">{copy("Tags", "Tags")}</Label>
                <Input
                  id="publish-ops-tags"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder={copy("tag1,tag2,tag3", "tag1,tag2,tag3")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-schedule">
                  {copy("Schedule Time", "Thời gian đăng")}
                </Label>
                <Input
                  id="publish-ops-schedule"
                  type="datetime-local"
                  value={schedulePost}
                  onChange={(event) => setSchedulePost(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-comment">
                  {copy("First Comment", "Bình luận đầu tiên")}
                </Label>
                <Input
                  id="publish-ops-comment"
                  value={firstComment}
                  onChange={(event) => setFirstComment(event.target.value)}
                  placeholder={copy("Optional", "Tùy chọn")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-asset-urls">
                  {copy("Asset URLs", "Đường dẫn asset")}
                </Label>
                <Input
                  id="publish-ops-asset-urls"
                  value={assetUrls}
                  onChange={(event) => setAssetUrls(event.target.value)}
                  placeholder={copy(
                    "https://... , https://...",
                    "https://... , https://...",
                  )}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-link-url">
                  {copy("Reference Link", "Liên kết tham chiếu")}
                </Label>
                <Input
                  id="publish-ops-link-url"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-subreddit">
                  {copy("Subreddit", "Subreddit")}
                </Label>
                <Input
                  id="publish-ops-subreddit"
                  value={subreddit}
                  onChange={(event) => setSubreddit(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-user-id">
                  {copy("Workspace User ID", "ID user workspace")}
                </Label>
                <Input
                  id="publish-ops-user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  list="publish-ops-user-ids"
                />
                <datalist id="publish-ops-user-ids">
                  {(usersQuery.data?.users ?? []).map((item) => (
                    <option key={item.id} value={item.id} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1">
                <Label htmlFor="publish-ops-generated-content-id">
                  {copy("Generated Content ID", "ID nội dung đã tạo")}
                </Label>
                <Input
                  id="publish-ops-generated-content-id"
                  value={generatedContentId}
                  onChange={(event) =>
                    setGeneratedContentId(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="publish-ops-files">
                {copy("Upload Media Files", "Tải tệp media")}
              </Label>
              <Input
                id="publish-ops-files"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced((current) => !current)}
              >
                <FileStack data-icon="inline-start" />
                {showAdvanced
                  ? copy("Hide Draft Picker", "Ẩn bộ chọn bản nháp")
                  : copy("Show Draft Picker", "Hiện bộ chọn bản nháp")}
              </Button>

              <Button
                type="submit"
                className="ml-auto"
                disabled={
                  publishMutation.isPending ||
                  !user.trim() ||
                  !title.trim() ||
                  platforms.length === 0
                }
              >
                {publishMutation.isPending ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Upload data-icon="inline-start" />
                )}
                {publishMutation.isPending
                  ? copy("Publishing...", "Đang đăng...")
                  : copy("Publish", "Xuất bản")}
              </Button>
            </div>

            {publishMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  publishMutation.error,
                  "Publishing request failed.",
                )}
              />
            ) : null}

            {publishMutation.data ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {copy("Publish request created", "Đã tạo yêu cầu xuất bản")}
                </p>
                <p className="mt-1.5">
                  {copy("Job ID", "Mã job")}:{" "}
                  {publishMutation.data.publish_job.id}
                </p>
              </div>
            ) : null}

            {showAdvanced ? (
              <div className="space-y-2 rounded-2xl border border-border/65 bg-background/60 p-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {copy(
                    "Generated Content Shortcuts",
                    "Lối tắt nội dung đã tạo",
                  )}
                </p>
                {generatedContentsQuery.data?.items
                  .slice(0, 6)
                  .map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => applyGeneratedContent(record)}
                      className="block w-full rounded-xl border border-border/65 bg-background/70 px-3 py-2 text-left text-xs transition hover:border-primary/35"
                    >
                      <p className="font-medium text-foreground">
                        {getDisplayTitle(record)}
                      </p>
                      <p className="mt-1 text-muted-foreground">{record.id}</p>
                    </button>
                  ))}
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Publishing Timeline", "Dòng thời gian xuất bản")}
          description={copy(
            "Track recently created jobs and inspect one job in detail.",
            "Theo dõi các job mới tạo và xem chi tiết từng job.",
          )}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {(["all", "pending", "published", "failed"] as const).map(
              (status) => {
                const active = statusFilter === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/45 bg-primary/10 text-primary"
                        : "border-border/70 bg-background/70 text-muted-foreground",
                    )}
                  >
                    {status}
                  </button>
                );
              },
            )}
          </div>

          {publishJobsQuery.isLoading ? (
            <PanelRowsSkeleton rows={7} />
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.slice(0, 10).map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "w-full rounded-2xl border border-border/65 bg-background/65 p-4 text-left transition-colors hover:border-primary/35",
                    selectedJobId === job.id ? "border-primary/45" : undefined,
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {job.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full capitalize",
                        statusBadgeClass(job.status),
                      )}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Platforms", "Nền tảng")}: {job.platforms.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Tạo lúc")}:{" "}
                    {formatDateTime(job.created_at)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No jobs for this filter.",
                "Không có job nào cho bộ lọc này.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Selected Job Detail", "Chi tiết job đã chọn")}
        description={copy(
          "Detail endpoint view for one publish job.",
          "Góc nhìn endpoint chi tiết cho một publish job.",
        )}
      >
        {!selectedJobId ? (
          <InlineQueryState
            state="empty"
            message={copy(
              "Select one publish job from the timeline.",
              "Hãy chọn một publish job từ dòng thời gian.",
            )}
          />
        ) : selectedJobQuery.isLoading ? (
          <PanelRowsSkeleton rows={4} />
        ) : selectedJobQuery.error ? (
          <InlineQueryState
            state="error"
            message={getQueryErrorMessage(
              selectedJobQuery.error,
              "Unable to load selected publish job.",
            )}
          />
        ) : selectedJobQuery.data ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Title", "Tiêu đề")}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {selectedJobQuery.data.title}
              </p>
            </div>
            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Status", "Trạng thái")}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {selectedJobQuery.data.status}
              </p>
            </div>
            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Platforms", "Nền tảng")}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {selectedJobQuery.data.platforms.join(", ")}
              </p>
            </div>
            <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Created", "Tạo lúc")}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDateTime(selectedJobQuery.data.created_at)}
              </p>
            </div>
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "No detail data found for selected job.",
              "Không tìm thấy dữ liệu chi tiết cho job đã chọn.",
            )}
          />
        )}
      </PanelCard>

      <PanelCard
        title={copy("Publish State Snapshot", "Ảnh chụp trạng thái xuất bản")}
        description={copy(
          "Quick summary to inspect queue state at a glance.",
          "Tóm tắt nhanh để kiểm tra trạng thái hàng đợi.",
        )}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Pending", "Đang chờ")}
            </p>
            <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-foreground">
              <Clock3 className="size-4 text-amber-600" />
              {
                publishJobs.filter(
                  (job) => job.status.toLowerCase() === "pending",
                ).length
              }
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Published", "Đã đăng")}
            </p>
            <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {
                publishJobs.filter(
                  (job) => job.status.toLowerCase() === "published",
                ).length
              }
            </p>
          </div>
          <div className="rounded-2xl border border-border/65 bg-background/65 p-4">
            <p className="text-xs text-muted-foreground">
              {copy("Total", "Tổng")}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {publishJobs.length}
            </p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
