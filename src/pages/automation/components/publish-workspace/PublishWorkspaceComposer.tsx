import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FileStack, Loader2, Upload } from "lucide-react";

import {
  type GeneratedContentResponse,
  type UploadPostPublishPlatform,
  type UserSummaryResponse,
  useUploadPostPublishMutation,
} from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

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

type PublishWorkspaceComposerProps = {
  users: UserSummaryResponse[];
  generatedContents: GeneratedContentResponse[];
  onJobCreated?: (jobId: string) => void;
};

function getDisplayTitle(record: GeneratedContentResponse) {
  return record.main_title || record.selected_keyword || record.id;
}

export function PublishWorkspaceComposer({
  users,
  generatedContents,
  onJobCreated,
}: PublishWorkspaceComposerProps) {
  const copy = useBilingual();
  const publishMutation = useUploadPostPublishMutation();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userInput, setUserInput] = useState<string | null>(null);
  const [userIdInput, setUserIdInput] = useState<string | null>(null);
  const [generatedContentIdInput, setGeneratedContentIdInput] = useState<
    string | null
  >(null);
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

  const resolvedUser = userInput ?? users[0]?.email ?? "";
  const resolvedUserId = userIdInput ?? users[0]?.id ?? "";
  const resolvedGeneratedContentId =
    generatedContentIdInput ?? generatedContents[0]?.id ?? "";

  useEffect(() => {
    const createdId = publishMutation.data?.publish_job.id;
    if (createdId) {
      onJobCreated?.(createdId);
    }
  }, [onJobCreated, publishMutation.data?.publish_job.id]);

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
    setGeneratedContentIdInput(record.id);

    if (!title.trim()) {
      setTitle(record.main_title ?? record.selected_keyword ?? "");
    }

    if (!description.trim()) {
      setDescription(record.selected_keyword ?? "");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUser = resolvedUser.trim();
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
      user_id: resolvedUserId.trim() || undefined,
      generated_content_id: resolvedGeneratedContentId.trim() || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="automation-publish-user">
            {copy("Publisher", "Tài khoản đăng")}
          </Label>
          <Input
            id="automation-publish-user"
            value={resolvedUser}
            list="automation-publish-users"
            onChange={(event) => setUserInput(event.target.value)}
            placeholder={copy("Email or username", "Email hoặc username")}
          />
          <datalist id="automation-publish-users">
            {users.map((item) => (
              <option key={item.id} value={item.email} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1">
          <Label htmlFor="automation-publish-title">
            {copy("Post Title", "Tiêu đề bài đăng")}
          </Label>
          <Input
            id="automation-publish-title"
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
        <Label htmlFor="automation-publish-description">
          {copy("Caption / Context", "Nội dung mô tả")}
        </Label>
        <Textarea
          id="automation-publish-description"
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
          <Label htmlFor="automation-publish-tags">{copy("Tags", "Thẻ")}</Label>
          <Input
            id="automation-publish-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder={copy("tag1,tag2,tag3", "the1,the2,the3")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="automation-publish-schedule">
            {copy("Schedule Time", "Thời gian đăng")}
          </Label>
          <Input
            id="automation-publish-schedule"
            type="datetime-local"
            value={schedulePost}
            onChange={(event) => setSchedulePost(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="automation-publish-comment">
            {copy("First Comment", "Bình luận đầu tiên")}
          </Label>
          <Input
            id="automation-publish-comment"
            value={firstComment}
            onChange={(event) => setFirstComment(event.target.value)}
            placeholder={copy("Optional", "Tùy chọn")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="automation-publish-asset-urls">
            {copy("Asset URLs", "Liên kết tài nguyên")}
          </Label>
          <Input
            id="automation-publish-asset-urls"
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
          <Label htmlFor="automation-publish-link-url">
            {copy("Reference Link", "Liên kết tham chiếu")}
          </Label>
          <Input
            id="automation-publish-link-url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="automation-publish-subreddit">
            {copy("Subreddit", "Subreddit (Reddit)")}
          </Label>
          <Input
            id="automation-publish-subreddit"
            value={subreddit}
            onChange={(event) => setSubreddit(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="automation-publish-user-id">
            {copy("Workspace User ID", "ID người dùng workspace")}
          </Label>
          <Input
            id="automation-publish-user-id"
            value={resolvedUserId}
            onChange={(event) => setUserIdInput(event.target.value)}
            list="automation-publish-user-ids"
          />
          <datalist id="automation-publish-user-ids">
            {users.map((item) => (
              <option key={item.id} value={item.id} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1">
          <Label htmlFor="automation-publish-generated-content-id">
            {copy("Generated Content ID", "ID nội dung đã tạo")}
          </Label>
          <Input
            id="automation-publish-generated-content-id"
            value={resolvedGeneratedContentId}
            onChange={(event) => setGeneratedContentIdInput(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="automation-publish-files">
          {copy("Upload Media Files", "Tải tệp media lên")}
        </Label>
        <Input
          id="automation-publish-files"
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
            !resolvedUser.trim() ||
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
            {copy("Job ID", "Mã job")}: {publishMutation.data.publish_job.id}
          </p>
        </div>
      ) : null}

      {showAdvanced ? (
        <div className="space-y-2 rounded-2xl border border-border/65 bg-background/60 p-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {copy("Generated Content Shortcuts", "Lối tắt nội dung đã tạo")}
          </p>
          {generatedContents.slice(0, 6).map((record) => (
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
  );
}
