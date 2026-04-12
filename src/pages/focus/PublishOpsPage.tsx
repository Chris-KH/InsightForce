import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Upload, Workflow } from "lucide-react";

import {
  type UploadPostPublishPlatform,
  useUploadPostHistoryQuery,
  useUploadPostProfilesQuery,
  useUploadPostPublishMutation,
} from "@/api";
import {
  InlineQueryState,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";
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

export function PublishOpsPage() {
  const copy = useBilingual();

  const profilesQuery = useUploadPostProfilesQuery();
  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 12 });
  const publishMutation = useUploadPostPublishMutation();

  const [user, setUser] = useState("");
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

  useEffect(() => {
    if (!user && profilesQuery.data?.profiles[0]?.username) {
      setUser(profilesQuery.data.profiles[0].username);
    }
  }, [profilesQuery.data, user]);

  const togglePlatform = (platform: UploadPostPublishPlatform) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []));
  };

  const normalizeCsv = (rawValue: string) =>
    rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

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
    });
  };

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Publish Ops", vi: "Vận hành publish" }}
        description={{
          en: "Focused execution page for Upload-Post publish contract with clear validation and response tracing.",
          vi: "Trang thực thi chuyên biệt cho contract publish Upload-Post với validation rõ ràng và theo dõi phản hồi.",
        }}
        badge={{ en: "Contract Mode", vi: "Chế độ contract" }}
        icon={Workflow}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PanelCard
          title={copy("Publish Request", "Yêu cầu publish")}
          description={copy(
            "Required fields are user, platforms, and title. Other fields are optional.",
            "Các trường bắt buộc là user, platforms và title. Các trường còn lại là tùy chọn.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="publish-ops-user">
                  {copy("Profile Username", "Profile username")}
                </Label>
                <Input
                  id="publish-ops-user"
                  value={user}
                  list="publish-ops-users"
                  onChange={(event) => setUser(event.target.value)}
                  placeholder="blhoang23"
                />
                <datalist id="publish-ops-users">
                  {(profilesQuery.data?.profiles ?? []).map((profile) => (
                    <option key={profile.username} value={profile.username} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1">
                <Label htmlFor="publish-ops-title">
                  {copy("Title", "Tiêu đề")}
                </Label>
                <Input
                  id="publish-ops-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="AI workflow in 3 steps"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>{copy("Platforms", "Nền tảng")}</Label>
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
                {copy("Description", "Mô tả")}
              </Label>
              <Textarea
                id="publish-ops-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={copy(
                  "Short context for post payload",
                  "Ngữ cảnh ngắn cho payload bài đăng",
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
                  placeholder="demo,automation,launch"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publish-ops-schedule">
                  {copy("Schedule", "Lịch đăng")}
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
                  placeholder="Tell me what you think"
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
              <Label htmlFor="publish-ops-files">{copy("Files", "Tệp")}</Label>
              <Input
                id="publish-ops-files"
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileChange}
              />
            </div>

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
              <Upload data-icon="inline-start" />
              {publishMutation.isPending
                ? copy("Publishing...", "Đang publish...")
                : copy("Send Publish Request", "Gửi yêu cầu publish")}
            </Button>

            {publishMutation.error ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  publishMutation.error,
                  "Unable to publish content.",
                )}
              />
            ) : null}

            {publishMutation.data ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {copy(
                    "Publish response received",
                    "Đã nhận phản hồi publish",
                  )}
                </p>
                <p className="mt-2">
                  {copy("Request ID", "Request ID")}:{" "}
                  {publishMutation.data.payload.payload.request_id ?? "--"}
                </p>
                <p>
                  {copy("Job ID", "Job ID")}:{" "}
                  {publishMutation.data.payload.payload.job_id ?? "--"}
                </p>
                <p>
                  {copy("Platforms", "Nền tảng")}:{" "}
                  {publishMutation.data.payload.platforms.join(", ")}
                </p>
                <p className="mt-2 text-foreground">
                  {publishMutation.data.payload.payload.message ??
                    copy("Publish accepted.", "Yêu cầu publish đã được nhận.")}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>

        <PanelCard
          title={copy("Recent Publish Trace", "Dấu vết publish gần đây")}
          description={copy(
            "Review request flow and outcomes from upload-post history.",
            "Theo dõi luồng request và kết quả từ upload-post history.",
          )}
        >
          {historyQuery.isLoading ? (
            <PanelRowsSkeleton rows={5} />
          ) : (
            <div className="space-y-3">
              {(historyQuery.data?.payload.history ?? [])
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={`${item.request_id}-${item.platform}`}
                    className="rounded-2xl border border-border/65 bg-background/65 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {item.post_title || "--"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.platform} • {item.profile_username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {copy("Uploaded", "Tải lên")}:{" "}
                      {formatDateTime(item.upload_timestamp)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy("Request", "Yêu cầu")}: {item.request_id}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {profilesQuery.error ? (
            <InlineQueryState
              state="error"
              className="mt-3"
              message={getQueryErrorMessage(
                profilesQuery.error,
                "Unable to load publish profiles.",
              )}
            />
          ) : null}
        </PanelCard>
      </div>
    </div>
  );
}
