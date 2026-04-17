import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FileStack, Loader2, Upload } from "lucide-react";
import { Icon } from "@iconify-icon/react";

import {
  type GeneratedContentResponse,
  type UploadPostPublishPlatform,
  type UserSummaryResponse,
  useUploadPostPublishMutation,
} from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

import { getPublishingPlatformVisual } from "./platform-visuals";

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

type PublishPreset = "short-video" | "multichannel";

function isPublishPlatform(value: string): value is UploadPostPublishPlatform {
  return PUBLISH_PLATFORM_OPTIONS.includes(value as UploadPostPublishPlatform);
}

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
  const [selectedPreset, setSelectedPreset] = useState<PublishPreset | "">("");
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

  const applyPreset = (preset: PublishPreset) => {
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
    <form
      className="space-y-4 rounded-2xl border border-border/60 bg-linear-to-br from-card/95 via-card/92 to-primary/6 p-4"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("Manual Composer", "Bộ soạn thủ công")}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy(
              "Craft publish payload manually with full control over channels and metadata.",
              "Soạn payload xuất bản thủ công với toàn quyền kiểm soát kênh đăng và metadata.",
            )}
          </p>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/8 text-primary"
        >
          {copy("Advanced Control", "Toàn quyền kiểm soát")}
        </Badge>
      </div>

      <div className="space-y-4 rounded-2xl border border-border/60 bg-background/75 p-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {copy("Core content", "Nội dung chính")}
        </p>

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
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={selectedPreset}
            className="mb-2 flex-wrap"
            onValueChange={(value) => {
              if (value === "short-video" || value === "multichannel") {
                setSelectedPreset(value);
                applyPreset(value);
              }
            }}
          >
            <ToggleGroupItem
              value="short-video"
              aria-label={copy("Preset: Short-video", "Preset: Video ngắn")}
            >
              {copy("Preset: Short-video", "Preset: Video ngắn")}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="multichannel"
              aria-label={copy("Preset: Multi-channel", "Preset: Đa kênh")}
            >
              {copy("Preset: Multi-channel", "Preset: Đa kênh")}
            </ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            type="multiple"
            variant="outline"
            size="sm"
            value={platforms}
            className="flex-wrap"
            onValueChange={(value) => {
              const nextPlatforms = value.filter(isPublishPlatform);
              setPlatforms(nextPlatforms);
              setSelectedPreset("");
            }}
          >
            {PUBLISH_PLATFORM_OPTIONS.map((platform) => {
              const visual = getPublishingPlatformVisual(platform);

              return (
                <ToggleGroupItem
                  key={platform}
                  value={platform}
                  aria-label={platform}
                  className={cn(
                    "rounded-full border-border/60 bg-background/70 data-[state=on]:border-primary/35 data-[state=on]:bg-primary/8",
                    visual.chipClassName,
                  )}
                >
                  <Icon icon={visual.icon} className="mr-1 size-3.5" />
                  {visual.label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          <div className="mt-2 flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const visual = getPublishingPlatformVisual(platform);

              return (
                <Badge
                  key={`selected-${platform}`}
                  variant="outline"
                  className={cn("rounded-full", visual.chipClassName)}
                >
                  <Icon icon={visual.icon} className="mr-1 size-3.5" />
                  {visual.label}
                </Badge>
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
      </div>

      <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {copy("Metadata and scheduling", "Metadata và lịch đăng")}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="automation-publish-tags">
              {copy("Tags", "Thẻ")}
            </Label>
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
              onChange={(event) =>
                setGeneratedContentIdInput(event.target.value)
              }
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
        <Alert className="border-emerald-500/35 bg-emerald-500/10">
          <AlertTitle>
            {copy("Publish request created", "Đã tạo yêu cầu xuất bản")}
          </AlertTitle>
          <AlertDescription>
            {copy("Job ID", "Mã job")}: {publishMutation.data.publish_job.id}
          </AlertDescription>
        </Alert>
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
