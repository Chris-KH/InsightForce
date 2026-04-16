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
  useUploadPostProfilesQuery,
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
    return Number.isNaN(rightTime) || Number.isNaN(leftTime)
      ? 0
      : rightTime - leftTime;
  });
}

export function PublishOpsPage() {
  const copy = useBilingual();

  const profilesQuery = useUploadPostProfilesQuery();
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
    if (!user && profilesQuery.data?.profiles[0]?.username) {
      setUser(profilesQuery.data.profiles[0].username);
    }
  }, [profilesQuery.data, user]);

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
          en: "Plan, schedule, and monitor your posts from one creator-friendly workspace.",
          vi: "Lập kế hoạch, lên lịch và theo dõi bài đăng trong một không gian thân thiện cho creator.",
        }}
        badge={{ en: "Publishing Workspace", vi: "Không gian đăng bài" }}
        icon={Workflow}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PanelCard
          title={copy("Post Planner", "Lên kế hoạch bài đăng")}
          description={copy(
            "Prepare one posting task with title, channels, timing, and supporting assets.",
            "Chuẩn bị một tác vụ đăng bài với tiêu đề, kênh đăng, thời gian và tài nguyên hỗ trợ.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-user">
                  {copy("Publishing Profile", "Hồ sơ đăng bài")}
                </Label>
                <Input
                  id="publish-ops-user"
                  value={user}
                  list="publish-ops-users"
                  onChange={(event) => setUser(event.target.value)}
                  placeholder="Tên tài khoản đăng bài"
                />
                <datalist id="publish-ops-users">
                  {(profilesQuery.data?.profiles ?? []).map((profile) => (
                    <option key={profile.username} value={profile.username} />
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
                  placeholder={copy("Ex: 3 tips to boost reach", "Ví dụ: 3 cách tăng độ phủ")}
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
                <Label htmlFor="publish-ops-tags">
                  {copy("Tags", "Tags")}
                </Label>
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
                  placeholder={copy("Optional starter comment", "Bình luận mở đầu tùy chọn")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-asset-urls">Asset URLs</Label>
                <Input
                  id="publish-ops-asset-urls"
                  value={assetUrls}
                  onChange={(event) => setAssetUrls(event.target.value)}
                  placeholder="https://site/a.jpg,https://site/b.jpg"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-link">Link URL</Label>
                <Input
                  id="publish-ops-link"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="https://example.com/article"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-subreddit">Subreddit</Label>
                <Input
                  id="publish-ops-subreddit"
                  value={subreddit}
                  onChange={(event) => setSubreddit(event.target.value)}
                  placeholder="r/technology"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="publish-ops-files">{copy("Media Files", "Tệp media")}</Label>
              <Input
                id="publish-ops-files"
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced((value) => !value)}
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              {showAdvanced
                ? copy("Hide advanced linking", "Ẩn liên kết nâng cao")
                : copy("Show advanced linking", "Hiện liên kết nâng cao")}
            </button>

            {showAdvanced ? (
              <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/55 p-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="publish-ops-user-id">
                    {copy("Campaign Owner", "Tài khoản chiến dịch")}
                  </Label>
                  <select
                    id="publish-ops-user-id"
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                  >
                    <option value="">{copy("No link", "Không liên kết")}</option>
                    {(usersQuery.data?.users ?? []).map((appUser) => (
                      <option key={appUser.id} value={appUser.id}>
                        {appUser.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="publish-ops-generated-content">
                    {copy("Attach Content Draft", "Gắn bản nháp nội dung")}
                  </Label>
                  <select
                    id="publish-ops-generated-content"
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                    value={generatedContentId}
                    onChange={(event) => setGeneratedContentId(event.target.value)}
                  >
                    <option value="">{copy("No link", "Không liên kết")}</option>
                    {(generatedContentsQuery.data?.items ?? []).map((item) => (
                      <option key={item.id} value={item.id}>
                        {getDisplayTitle(item)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {files.length > 0 ? (
              <div className="rounded-2xl border border-border/55 bg-background/55 p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">
                  {copy("Selected files", "Tệp đã chọn")}: {files.length}
                </p>
                <div className="space-y-1">
                  {files.map((file) => (
                    <p key={`${file.name}-${file.size}`}>{file.name}</p>
                  ))}
                </div>
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full"
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
                ? copy("Scheduling...", "Đang lên lịch...")
                : copy("Create Publishing Task", "Tạo tác vụ đăng bài")}
            </Button>

            {publishMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  publishMutation.error,
                  "Unable to create publishing task.",
                )}
              />
            ) : null}

            {publishMutation.data ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {copy(
                    "Publishing task created successfully",
                    "Đã tạo tác vụ đăng bài thành công",
                  )}
                </p>
                <p className="mt-2">
                  {copy("Current status", "Trạng thái hiện tại")}: {publishMutation.data.publish_job.status}
                </p>
                <p>
                  {copy("Channels", "Kênh đăng")}: {publishMutation.data.publish_job.platforms.join(", ")}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Publishing Queue", "Hàng đợi đăng bài")}
          description={copy(
            "Track every publishing task and open one item for detail view.",
            "Theo dõi toàn bộ tác vụ đăng bài và mở từng mục để xem chi tiết.",
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
            <PanelRowsSkeleton rows={6} />
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-3">
              {filteredJobs.slice(0, 10).map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "w-full rounded-2xl border border-border/65 bg-background/65 p-4 text-left transition",
                    selectedJobId === job.id &&
                      "border-primary/45 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{job.title}</p>
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
                    {job.profile_username} • {job.platforms.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <Clock3 className="mr-1 inline size-3" />
                    {formatDateTime(job.created_at)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No tasks found for current filter.",
                "Không có tác vụ phù hợp với bộ lọc hiện tại.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Selected Task Detail", "Chi tiết tác vụ đã chọn")}
          description={copy(
            "A clear summary of timing, channels, and media readiness.",
            "Tóm tắt rõ ràng về thời gian, kênh đăng và mức sẵn sàng media.",
          )}
        >
          {selectedJobQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : selectedJobQuery.data ? (
            <div className="space-y-3 rounded-2xl border border-border/65 bg-background/65 p-4 text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Status", "Trạng thái")}
                </span>
                : {selectedJobQuery.data.status}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Created time", "Thời điểm tạo")}
                </span>
                : {formatDateTime(selectedJobQuery.data.created_at)}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Scheduled time", "Thời gian lên lịch")}
                </span>
                : {selectedJobQuery.data.schedule_post ? formatDateTime(selectedJobQuery.data.schedule_post) : "--"}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Channels", "Kênh đăng")}
                </span>
                : {selectedJobQuery.data.platforms.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Attached media links", "Liên kết media đính kèm")}
                </span>
                : {selectedJobQuery.data.asset_urls.length}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  {copy("Uploaded files", "Số tệp tải lên")}
                </span>
                : {selectedJobQuery.data.uploaded_files.length}
              </p>
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "Choose one task from the queue to inspect details.",
                "Hãy chọn một tác vụ trong hàng đợi để xem chi tiết.",
              )}
            />
          )}

          {selectedJobQuery.error ? (
            <InlineQueryState
              className="mt-3"
              state="error"
              message={getQueryErrorMessage(
                selectedJobQuery.error,
                "Unable to load selected task detail.",
              )}
            />
          ) : null}
        </PanelCard>

        <PanelCard
          title={copy("Content Draft Picker", "Bộ chọn bản nháp nội dung")}
          description={copy(
            "Pick one draft to prefill title and context for faster publishing.",
            "Chọn một bản nháp để điền nhanh tiêu đề và nội dung khi đăng bài.",
          )}
        >
          {generatedContentsQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : generatedContentsQuery.data?.items.length ? (
            <div className="space-y-3">
              {generatedContentsQuery.data.items.slice(0, 8).map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {getDisplayTitle(record)}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => applyGeneratedContent(record)}
                    >
                      <FileStack data-icon="inline-start" />
                      {copy("Use", "Dùng")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {copy("Created", "Tạo lúc")}: {formatDateTime(record.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No content drafts available.",
                "Chưa có bản nháp nội dung khả dụng.",
              )}
            />
          )}
        </PanelCard>
      </div>
    </div>
  );
}
