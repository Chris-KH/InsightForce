import { useState, type FormEvent } from "react";
import {
  BarChart3,
  Coins,
  Eye,
  History,
  Link2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserSearch,
  Wallet,
} from "lucide-react";

import {
  type ContentPlatform,
  useCreateUploadPostProfileMutation,
  useDeleteUploadPostProfileMutation,
  useGenerateUploadPostJwtMutation,
  useUploadPostAccountQuery,
  useUploadPostHistoryQuery,
  useUploadPostPostAnalyticsQuery,
  useUploadPostProfileQuery,
  useUploadPostProfileAnalyticsQuery,
  useUploadPostProfilesQuery,
  useUploadPostTotalImpressionsQuery,
  useValidateUploadPostJwtMutation,
} from "@/api";
import {
  BarTrendChart,
  DoughnutTrendChart,
  HeatMatrix,
  LineTrendChart,
} from "@/components/app-data-viz";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
  QueryStateCard,
} from "@/components/app-query-state";
import { PlatformBadge } from "@/components/platform-badge";
import { MetricCard, PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  formatCompactNumber,
  formatDateTime,
  formatNumber,
  formatPercentFromRatio,
} from "@/lib/insight-formatters";
import { getPlatformSurfaceClassName } from "@/lib/platform-theme";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

export function FinancePage() {
  const copy = useBilingual();

  const [profileDraftUsername, setProfileDraftUsername] = useState("blhoang23");
  const [profileLookupInput, setProfileLookupInput] = useState("blhoang23");
  const [profileLookupRequested, setProfileLookupRequested] =
    useState<string>();
  const [deletingProfile, setDeletingProfile] = useState<string>();

  const [jwtUsername, setJwtUsername] = useState("blhoang23");
  const [jwtPlatforms, setJwtPlatforms] = useState<ContentPlatform[]>([
    "youtube",
    "tiktok",
  ]);
  const [jwtTokenInput, setJwtTokenInput] = useState("");
  const [generatedAccessUrl, setGeneratedAccessUrl] = useState("");

  const createProfileMutation = useCreateUploadPostProfileMutation();
  const deleteProfileMutation = useDeleteUploadPostProfileMutation();
  const generateJwtMutation = useGenerateUploadPostJwtMutation();
  const validateJwtMutation = useValidateUploadPostJwtMutation();

  const accountQuery = useUploadPostAccountQuery();
  const profilesQuery = useUploadPostProfilesQuery();
  const profileLookupQuery = useUploadPostProfileQuery({
    profileUsername: profileLookupRequested,
    enabled: Boolean(profileLookupRequested),
  });
  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });

  const historyItems = historyQuery.data?.payload.history ?? [];
  const profileUsername = historyItems[0]?.profile_username;
  const latestRequestId = historyItems[0]?.request_id;

  const profileAnalyticsQuery = useUploadPostProfileAnalyticsQuery({
    profileUsername,
    platforms: ["youtube", "tiktok"],
    enabled: Boolean(profileUsername),
  });

  const totalImpressionsQuery = useUploadPostTotalImpressionsQuery({
    profileUsername,
    period: "last_week",
    platforms: ["youtube", "tiktok"],
    metrics: ["impressions", "likes", "comments", "shares"],
    breakdown: true,
    enabled: Boolean(profileUsername),
  });

  const latestPostAnalyticsQuery = useUploadPostPostAnalyticsQuery({
    requestId: latestRequestId,
    enabled: Boolean(latestRequestId),
  });

  const allQueries = [
    historyQuery,
    profileAnalyticsQuery,
    totalImpressionsQuery,
    latestPostAnalyticsQuery,
  ];

  const isLoading = allQueries.some((query) => query.isLoading);
  const isInitialLoading = allQueries.some(
    (query) => query.isLoading && !query.data,
  );
  const firstError = allQueries.find((query) => query.error)?.error;
  const firstErrorMessage = firstError
    ? getQueryErrorMessage(firstError, "Unable to load finance analytics.")
    : null;

  const summary = profileAnalyticsQuery.data?.payload.summary;
  const totals = totalImpressionsQuery.data?.payload.metrics;
  const breakdown = totalImpressionsQuery.data?.payload.breakdown;

  const successfulUploads = historyItems.filter((item) => item.success).length;
  const uploadSuccessRate = historyItems.length
    ? successfulUploads / historyItems.length
    : 0;

  const uploadPostProfiles = profilesQuery.data?.profiles ?? [];
  const accountStateError = accountQuery.error ?? profilesQuery.error;
  const accountStateMessage = accountStateError
    ? getQueryErrorMessage(
        accountStateError,
        copy(
          "Account connection is unstable right now. You can still continue with available actions below.",
          "Kết nối tài khoản hiện chưa ổn định. Bạn vẫn có thể tiếp tục với các thao tác khả dụng bên dưới.",
        ),
      )
    : null;
  const isUploadPostApiKeyMissing =
    accountStateMessage?.includes("UPLOAD_POST_API_KEY") ?? false;
  const isUploadPostApiKeyMissingInAnalytics =
    firstErrorMessage?.includes("UPLOAD_POST_API_KEY") ?? false;

  const mutationError =
    createProfileMutation.error ??
    deleteProfileMutation.error ??
    generateJwtMutation.error ??
    validateJwtMutation.error;

  const handleCreateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = profileDraftUsername.trim();

    if (!username) {
      return;
    }

    const result = await createProfileMutation.mutateAsync({ username });
    setProfileLookupInput(result.profile.username);
    setProfileLookupRequested(result.profile.username);
  };

  const handleLookupProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = profileLookupInput.trim();

    if (!username) {
      return;
    }

    setProfileLookupRequested(username);
  };

  const handleDeleteProfile = async (username: string) => {
    setDeletingProfile(username);

    try {
      await deleteProfileMutation.mutateAsync(username);
      if (profileLookupRequested === username) {
        setProfileLookupRequested(undefined);
      }
    } finally {
      setDeletingProfile(undefined);
    }
  };

  const toggleJwtPlatform = (platform: ContentPlatform) => {
    setJwtPlatforms((current) => {
      if (current.includes(platform)) {
        return current.filter((item) => item !== platform);
      }

      return [...current, platform];
    });
  };

  const handleGenerateJwt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = jwtUsername.trim();

    if (!username || jwtPlatforms.length === 0) {
      return;
    }

    const result = await generateJwtMutation.mutateAsync({
      username,
      platforms: jwtPlatforms,
    });
    setGeneratedAccessUrl(result.access_url);

    try {
      const jwtFromUrl = new URL(result.access_url).searchParams.get(
        "jwt_token",
      );
      if (jwtFromUrl) {
        setJwtTokenInput(jwtFromUrl);
      }
    } catch {
      // Keep manual token flow for providers that return non-URL text payloads.
    }
  };

  const handleValidateJwt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = jwtTokenInput.trim();

    if (!token) {
      return;
    }

    await validateJwtMutation.mutateAsync({ jwt_token: token });
  };

  const impressionsTimeline = Object.entries(
    totalImpressionsQuery.data?.payload.per_day.impressions ?? {},
  ).sort(([left], [right]) => left.localeCompare(right));

  const impressionsLineData = {
    labels: impressionsTimeline.map(([date]) => date.slice(5)),
    datasets: [
      {
        label: copy("Impressions", "Impressions"),
        data: impressionsTimeline.map(([, value]) => value),
        borderColor: "rgba(5, 150, 105, 0.92)",
        backgroundColor: "rgba(5, 150, 105, 0.2)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const successDonutData = {
    labels: [copy("Success", "Thành công"), copy("Failed", "Thất bại")],
    datasets: [
      {
        data: [
          successfulUploads,
          Math.max(historyItems.length - successfulUploads, 0),
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.82)",
          "rgba(234, 179, 8, 0.75)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const platformPerformanceBarData = {
    labels: Object.keys(profileAnalyticsQuery.data?.payload.platforms ?? {}),
    datasets: [
      {
        label: copy("Views", "Lượt xem"),
        data: Object.values(
          profileAnalyticsQuery.data?.payload.platforms ?? {},
        ).map((metrics) => metrics.views),
        backgroundColor: "rgba(245, 158, 11, 0.78)",
        borderRadius: 10,
      },
      {
        label: copy("Impressions", "Impressions"),
        data: Object.values(
          profileAnalyticsQuery.data?.payload.platforms ?? {},
        ).map((metrics) => metrics.impressions),
        backgroundColor: "rgba(6, 182, 212, 0.78)",
        borderRadius: 10,
      },
    ],
  };

  const latestRequestHeatMap = (() => {
    const platformEntries = Object.entries(
      latestPostAnalyticsQuery.data?.payload?.platforms ?? {},
    );

    const rows = platformEntries.map(([platform]) => platform);
    const columns = [
      copy("Views", "Lượt xem"),
      copy("Likes", "Lượt thích"),
      copy("Comments", "Bình luận"),
      copy("Shares", "Chia sẻ"),
    ];

    const values = platformEntries.map(([, payload]) => [
      payload.post_metrics.views,
      payload.post_metrics.likes,
      payload.post_metrics.comments,
      payload.post_metrics.shares,
    ]);

    return { rows, columns, values };
  })();

  const financeRhythm = impressionsTimeline.slice(-7);

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Monetization Ops", "Vận hành kiếm tiền")}
        title={copy(
          "Creator Revenue Analytics",
          "Trung tâm phân tích doanh thu creator",
        )}
        description={copy(
          "Track account growth, impressions, and post-level performance in one financial overview.",
          "Theo dõi tăng trưởng tài khoản, impressions và hiệu suất từng bài đăng trong một màn hình tài chính tổng quan.",
        )}
        action={
          <Badge
            variant="outline"
            className="rounded-full border-primary/25 bg-background/80 px-3 py-1.5 text-primary"
          >
            <Sparkles className="mr-2 size-3.5" />
            {profileUsername
              ? `${copy("Profile", "Hồ sơ")}: ${profileUsername}`
              : copy("Profile loading", "Đang tải hồ sơ")}
          </Badge>
        }
      />

      {firstError ? (
        <QueryStateCard
          state="error"
          title={copy("Data Load Error", "Lỗi tải dữ liệu")}
          description={
            isUploadPostApiKeyMissingInAnalytics
              ? copy(
                  "A required integration key is missing, so analytics data is temporarily unavailable.",
                  "Thiếu khóa tích hợp cần thiết nên dữ liệu phân tích tạm thời chưa thể tải.",
                )
              : (firstErrorMessage ?? "Unable to load finance analytics.")
          }
          hint={copy(
            "Data sources are syncing. Please refresh shortly.",
            "Nguồn dữ liệu đang đồng bộ. Vui lòng làm mới sau ít phút.",
          )}
        />
      ) : null}

      <PanelCard
        title={copy("Revenue Rhythm", "Nhip dieu doanh thu")}
        description={copy(
          "A weekly visual stripe of impressions momentum and conversion quality.",
          "Dai hien thi nhip impressions theo tuan va chat luong chuyen doi.",
        )}
        className="border-emerald-500/28 bg-linear-to-br from-emerald-100/45 via-card to-lime-100/40 dark:from-emerald-500/10 dark:via-card/92 dark:to-lime-500/10"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-emerald-500/25 bg-background/70 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
              {copy("7-Day Impression Pulse", "Xung impressions 7 ngay")}
            </p>
            {financeRhythm.length > 0 ? (
              <div className="mt-4 flex items-end gap-2">
                {financeRhythm.map(([day, value]) => {
                  const maxValue = Math.max(
                    ...financeRhythm.map(([, itemValue]) => itemValue),
                    1,
                  );
                  const ratio = Math.max(value / maxValue, 0.08);

                  return (
                    <div key={day} className="flex-1">
                      <div
                        className="rounded-md bg-linear-to-t from-emerald-600 via-emerald-400 to-lime-300"
                        style={{ height: `${Math.round(120 * ratio)}px` }}
                      />
                      <p className="mt-2 text-center text-[11px] text-muted-foreground">
                        {day.slice(5)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No 7-day impression rhythm yet.",
                  "Chua co nhip impressions 7 ngay.",
                )}
              />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-emerald-500/20 bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Weekly Impressions", "Impressions tuan")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatCompactNumber(totals?.impressions ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-lime-500/22 bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Engagement Yield", "Hieu suat tuong tac")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatPercentFromRatio(uploadSuccessRate)}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/24 bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">
                {copy("Active Profiles", "Profile dang hoat dong")}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {uploadPostProfiles.length}
              </p>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title={copy("Account Control Plane", "Bảng điều khiển tài khoản")}
        description={copy(
          "Manage connected profiles, invite access, and verify account links in one place.",
          "Quản lý hồ sơ liên kết, tạo quyền truy cập và xác thực liên kết tài khoản tại một nơi.",
        )}
      >
        {accountQuery.isLoading || profilesQuery.isLoading ? (
          <PanelRowsSkeleton rows={4} />
        ) : (
          <div className="space-y-5">
            {accountStateError ? (
              <InlineQueryState
                state="error"
                message={
                  isUploadPostApiKeyMissing
                    ? copy(
                        "A required integration key is missing, so account controls are temporarily unavailable.",
                        "Thiếu khóa tích hợp cần thiết nên các thao tác tài khoản đang tạm thời chưa khả dụng.",
                      )
                    : (accountStateMessage ??
                      copy(
                        "Account connection is unstable right now. You can still continue with available actions below.",
                        "Kết nối tài khoản hiện chưa ổn định. Bạn vẫn có thể tiếp tục với các thao tác khả dụng bên dưới.",
                      ))
                }
              />
            ) : null}

            {mutationError ? (
              <InlineQueryState
                state="error"
                message={getQueryErrorMessage(
                  mutationError,
                  copy(
                    "One of the account operations failed.",
                    "Một thao tác tài khoản đã thất bại.",
                  ),
                )}
              />
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Current Account", "Tài khoản hiện tại")}
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {accountQuery.data?.email ?? "--"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Plan", "Gói")}: {accountQuery.data?.plan ?? "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {copy("Managed Profiles", "Hồ sơ đang quản lý")}
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {uploadPostProfiles.length} {copy("profiles", "hồ sơ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy("Profile limit", "Giới hạn hồ sơ")}: {" "}
                  {profilesQuery.data?.limit ?? "--"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <form
                className="space-y-3 rounded-2xl border border-border/55 bg-background/55 p-4"
                onSubmit={(event) => {
                  void handleCreateProfile(event);
                }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <Plus className="size-3.5" />
                  {copy("Create Profile", "Tạo profile")}
                </div>
                <Label htmlFor="create-profile-username">
                  {copy("Username", "Tên người dùng")}
                </Label>
                <Input
                  id="create-profile-username"
                  value={profileDraftUsername}
                  onChange={(event) =>
                    setProfileDraftUsername(event.target.value)
                  }
                  placeholder="blhoang23"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    createProfileMutation.isPending || isUploadPostApiKeyMissing
                  }
                >
                  {createProfileMutation.isPending
                    ? copy("Creating...", "Đang tạo...")
                    : copy("Create Profile", "Tạo profile")}
                </Button>
                {createProfileMutation.data ? (
                  <p className="text-xs text-emerald-600">
                    {copy("Created", "Đã tạo")}:{" "}
                    {createProfileMutation.data.profile.username}
                  </p>
                ) : null}
              </form>

              <form
                className="space-y-3 rounded-2xl border border-border/55 bg-background/55 p-4"
                onSubmit={handleLookupProfile}
              >
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <UserSearch className="size-3.5" />
                  {copy("Profile Lookup", "Tra cứu profile")}
                </div>
                <Label htmlFor="lookup-profile-username">
                  {copy("Username", "Tên người dùng")}
                </Label>
                <Input
                  id="lookup-profile-username"
                  value={profileLookupInput}
                  onChange={(event) =>
                    setProfileLookupInput(event.target.value)
                  }
                  placeholder="blhoang23"
                />
                <Button
                  type="submit"
                  className="w-full"
                  variant="outline"
                  disabled={isUploadPostApiKeyMissing}
                >
                  {copy("Get Profile Detail", "Lấy chi tiết profile")}
                </Button>
                {profileLookupQuery.isFetching ? (
                  <p className="text-xs text-muted-foreground">
                    {copy(
                      "Loading profile detail...",
                      "Đang tải chi tiết profile...",
                    )}
                  </p>
                ) : null}
                {profileLookupQuery.data?.profile ? (
                  <div className="rounded-xl border border-border/55 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                    <p>
                      {copy("Profile", "Profile")}:{" "}
                      {profileLookupQuery.data.profile.username}
                    </p>
                    <p>
                      {copy("Created at", "Thời điểm tạo")}:{" "}
                      {profileLookupQuery.data.profile.created_at ?? "--"}
                    </p>
                  </div>
                ) : null}
              </form>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/55 bg-background/55 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {copy("Managed Profiles", "Profile đang quản lý")}
              </p>
              {uploadPostProfiles.length > 0 ? (
                uploadPostProfiles.map((profile) => (
                  <div
                    key={profile.username}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/55 bg-background/75 px-3 py-2"
                  >
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/25 bg-background/75"
                    >
                      {profile.username}
                    </Badge>
                    <Button
                      type="button"
                      size="xs"
                      variant="destructive"
                      disabled={
                        isUploadPostApiKeyMissing ||
                        (deleteProfileMutation.isPending &&
                          deletingProfile === profile.username)
                      }
                      onClick={() => {
                        void handleDeleteProfile(profile.username);
                      }}
                    >
                      <Trash2 data-icon="inline-start" />
                      {deleteProfileMutation.isPending &&
                      deletingProfile === profile.username
                        ? copy("Deleting...", "Đang xóa...")
                        : copy("Delete", "Xóa")}
                    </Button>
                  </div>
                ))
              ) : (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No managed profiles available yet.",
                    "Chưa có hồ sơ nào đang được quản lý.",
                  )}
                />
              )}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <form
                className="space-y-3 rounded-2xl border border-border/55 bg-background/55 p-4"
                onSubmit={(event) => {
                  void handleGenerateJwt(event);
                }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <Link2 className="size-3.5" />
                  {copy("Generate JWT Link", "Tạo link JWT")}
                </div>
                <Label htmlFor="jwt-username">
                  {copy("Username", "Tên người dùng")}
                </Label>
                <Input
                  id="jwt-username"
                  value={jwtUsername}
                  onChange={(event) => setJwtUsername(event.target.value)}
                  placeholder="blhoang23"
                />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {copy("Platforms", "Nền tảng")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["youtube", "tiktok"] as const).map((platform) => {
                      const active = jwtPlatforms.includes(platform);

                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => toggleJwtPlatform(platform)}
                          className={cn(
                            "rounded-full border px-1.5 py-1 transition-colors",
                            active
                              ? "border-primary/40 bg-primary/10"
                              : "border-border/70 bg-background/70",
                          )}
                        >
                          <PlatformBadge platform={platform} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    generateJwtMutation.isPending ||
                    jwtPlatforms.length === 0 ||
                    isUploadPostApiKeyMissing
                  }
                >
                  {generateJwtMutation.isPending
                    ? copy("Generating...", "Đang tạo...")
                    : copy("Create Access Link", "Tạo liên kết truy cập")}
                </Button>
                {generatedAccessUrl ? (
                  <a
                    href={generatedAccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-xs text-primary underline-offset-4 hover:underline"
                  >
                    {generatedAccessUrl}
                  </a>
                ) : null}
              </form>

              <form
                className="space-y-3 rounded-2xl border border-border/55 bg-background/55 p-4"
                onSubmit={(event) => {
                  void handleValidateJwt(event);
                }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  <ShieldCheck className="size-3.5" />
                  {copy("Validate JWT", "Xác thực JWT")}
                </div>
                <Label htmlFor="jwt-token">JWT Token</Label>
                <Input
                  id="jwt-token"
                  value={jwtTokenInput}
                  onChange={(event) => setJwtTokenInput(event.target.value)}
                  placeholder={copy(
                    "Paste token from your access link",
                    "Dán token từ liên kết truy cập",
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  variant="outline"
                  disabled={
                    validateJwtMutation.isPending || isUploadPostApiKeyMissing
                  }
                >
                  {validateJwtMutation.isPending
                    ? copy("Validating...", "Đang xác thực...")
                    : copy("Validate Token", "Xác thực token")}
                </Button>
                {validateJwtMutation.data ? (
                  <div className="rounded-xl border border-border/55 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                    <p>
                      {copy("Valid", "Hợp lệ")}:{" "}
                      {String(
                        validateJwtMutation.data.isValid ??
                          validateJwtMutation.data.success ??
                          false,
                      )}
                    </p>
                    <p>
                      {copy("Reason", "Lý do")}:{" "}
                      {validateJwtMutation.data.reason ?? "--"}
                    </p>
                    <p>
                      {copy("Profile", "Profile")}:{" "}
                      {validateJwtMutation.data.profile?.username ?? "--"}
                    </p>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        )}
      </PanelCard>

      {isInitialLoading ? (
        <MetricCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Total Impressions", "Tổng impressions")}
            value={
              isLoading
                ? "--"
                : formatCompactNumber(
                    totals?.impressions ?? summary?.impressions ?? 0,
                  )
            }
            detail={copy(
              "From your selected reporting period",
              "Từ khoảng thời gian báo cáo đã chọn",
            )}
            icon={<Eye className="size-5" />}
          />
          <MetricCard
            label={copy("Total Engagement", "Tổng tương tác")}
            value={
              isLoading
                ? "--"
                : formatCompactNumber(
                    (totals?.likes ?? 0) +
                      (totals?.comments ?? 0) +
                      (totals?.shares ?? 0),
                  )
            }
            detail={copy(
              "Likes + comments + shares",
              "Likes + comments + shares",
            )}
            icon={<Coins className="size-5" />}
          />
          <MetricCard
            label={copy("Cross-Platform Followers", "Follower đa nền tảng")}
            value={
              isLoading ? "--" : formatCompactNumber(summary?.followers ?? 0)
            }
            detail={copy(
              "Summed from selected platforms",
              "Tổng hợp từ các nền tảng đã chọn",
            )}
            icon={<Wallet className="size-5" />}
          />
          <MetricCard
            label={copy("Upload Success Rate", "Tỷ lệ upload thành công")}
            value={isLoading ? "--" : formatPercentFromRatio(uploadSuccessRate)}
            detail={copy(
              "Calculated from upload history",
              "Tính từ lịch sử upload",
            )}
            icon={<BarChart3 className="size-5" />}
          />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Impressions Flow", "Luồng impressions")}
          description={copy(
            "Daily impression trajectory from the selected period.",
            "Đường impressions theo ngày trong khoảng thời gian đã chọn.",
          )}
        >
          {impressionsTimeline.length > 0 ? (
            <LineTrendChart
              data={impressionsLineData}
              className="bg-linear-to-br from-emerald-100/60 via-card to-lime-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-lime-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No impression timeline available.",
                "Chưa có timeline impressions.",
              )}
            />
          )}
        </PanelCard>

        <PanelCard
          title={copy("Upload Outcome Mix", "Tỷ trọng kết quả upload")}
          description={copy(
            "Share of successful and failed uploads from history.",
            "Tỷ lệ upload thành công và thất bại từ lịch sử.",
          )}
        >
          {historyItems.length > 0 ? (
            <DoughnutTrendChart
              data={successDonutData}
              className="bg-linear-to-br from-lime-100/55 via-card to-amber-100/45 dark:from-lime-500/12 dark:via-card/90 dark:to-amber-500/10"
            />
          ) : (
            <InlineQueryState
              state="empty"
              message={copy(
                "No upload history available for charting.",
                "Chưa có lịch sử upload để dựng biểu đồ.",
              )}
            />
          )}
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Platform Breakdown", "Phân rã theo nền tảng")}
          description={copy(
            "Per-platform performance from profile analytics and total impressions.",
            "Hiệu suất theo nền tảng từ profile analytics và total impressions.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : Object.entries(
                profileAnalyticsQuery.data?.payload.platforms ?? {},
              ).length > 0 ? (
              <>
                <BarTrendChart
                  data={platformPerformanceBarData}
                  className="bg-linear-to-br from-amber-100/55 via-card to-cyan-100/45 dark:from-amber-500/12 dark:via-card/90 dark:to-cyan-500/10"
                />
                {Object.entries(
                  profileAnalyticsQuery.data?.payload.platforms ?? {},
                ).map(([platform, metrics]) => {
                  const platformImpressions =
                    breakdown?.[platform]?.impressions ?? metrics.impressions;

                  return (
                    <div
                      key={platform}
                      className={cn(
                        "rounded-2xl border border-border/55 bg-background/55 p-4",
                        getPlatformSurfaceClassName(platform),
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <PlatformBadge platform={platform} />
                        <p className="text-xs text-muted-foreground">
                          {copy("Followers", "Follower")}:{" "}
                          {formatNumber(metrics.followers)}
                        </p>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                        <p>
                          {copy("Reach", "Độ phủ")}:{" "}
                          {formatCompactNumber(metrics.reach)}
                        </p>
                        <p>
                          {copy("Views", "Lượt xem")}:{" "}
                          {formatCompactNumber(metrics.views)}
                        </p>
                        <p>
                          {copy("Impressions", "Impressions")}:{" "}
                          {formatCompactNumber(platformImpressions)}
                        </p>
                        <p>
                          {copy("Comments", "Bình luận")}:{" "}
                          {formatCompactNumber(metrics.comments)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No platform breakdown available.",
                  "Chưa có dữ liệu phân rã theo nền tảng.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Impressions Timeline", "Dòng thời gian impressions")}
          description={copy(
            "Daily totals from /total-impressions per_day.impressions.",
            "Tổng theo ngày từ /total-impressions per_day.impressions.",
          )}
        >
          <div className="space-y-2">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : impressionsTimeline.length > 0 ? (
              impressionsTimeline.map(([date, value]) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{date}</span>
                  <span className="font-medium text-foreground">
                    {formatCompactNumber(value)}
                  </span>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No timeline values available.",
                  "Chưa có giá trị dòng thời gian.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelCard
          title={copy("Latest Post Performance", "Hiệu suất bài đăng mới nhất")}
          description={copy(
            "Detailed performance snapshot for the most recent published post.",
            "Ảnh chụp chi tiết hiệu suất của bài đăng gần nhất.",
          )}
        >
          <div className="space-y-3">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={4} />
            ) : latestPostAnalyticsQuery.data?.payload ? (
              <>
                {latestRequestHeatMap.rows.length > 0 ? (
                  <HeatMatrix
                    rows={latestRequestHeatMap.rows}
                    columns={latestRequestHeatMap.columns}
                    values={latestRequestHeatMap.values}
                    valueFormatter={(value) => formatCompactNumber(value)}
                    className="bg-linear-to-br from-emerald-100/55 via-card to-teal-100/45 dark:from-emerald-500/12 dark:via-card/90 dark:to-teal-500/10"
                  />
                ) : null}
                <div className="rounded-2xl border border-border/55 bg-background/55 p-4">
                  <p className="text-xs text-muted-foreground">
                    {copy("Channels measured", "Số kênh được đo")}: {" "}
                    {Object.keys(latestPostAnalyticsQuery.data.payload.platforms).length}
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {latestPostAnalyticsQuery.data.payload.post.post_title}
                  </p>
                </div>

                {Object.entries(
                  latestPostAnalyticsQuery.data.payload.platforms,
                ).map(([platform, payload]) => (
                  <div
                    key={platform}
                    className={cn(
                      "rounded-2xl border border-border/55 bg-background/55 p-4",
                      getPlatformSurfaceClassName(platform),
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <PlatformBadge platform={platform} />
                      <p className="text-xs text-muted-foreground">
                        {payload.success
                          ? copy("Success", "Thành công")
                          : copy("Failed", "Thất bại")}
                      </p>
                    </div>
                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <p>
                        {copy("Views", "Lượt xem")}:{" "}
                        {formatCompactNumber(payload.post_metrics.views)}
                      </p>
                      <p>
                        {copy("Likes", "Lượt thích")}:{" "}
                        {formatCompactNumber(payload.post_metrics.likes)}
                      </p>
                      <p>
                        {copy("Comments", "Bình luận")}:{" "}
                        {formatCompactNumber(payload.post_metrics.comments)}
                      </p>
                      <p>
                        {copy("Shares", "Chia sẻ")}:{" "}
                        {formatCompactNumber(payload.post_metrics.shares)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No post performance data available for the latest campaign.",
                  "Chưa có dữ liệu hiệu suất bài đăng cho chiến dịch gần nhất.",
                )}
              />
            )}
          </div>
        </PanelCard>

        <PanelCard
          title={copy("Upload History", "Lịch sử upload")}
          description={copy(
            "Timeline of publishing activity across connected channels.",
            "Dòng thời gian hoạt động đăng bài trên các kênh đã kết nối.",
          )}
          action={
            <Badge variant="outline" className="rounded-full">
              <History className="mr-2 size-3.5" />
              {historyItems.length} {copy("entries", "bản ghi")}
            </Badge>
          }
        >
          <div className="space-y-2">
            {isInitialLoading ? (
              <PanelRowsSkeleton rows={5} />
            ) : historyItems.length > 0 ? (
              historyItems.slice(0, 10).map((item) => (
                <div
                  key={`${item.request_id}-${item.platform}`}
                  className={cn(
                    "grid gap-2 rounded-xl border border-border/55 bg-background/55 px-4 py-3 text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center",
                    getPlatformSurfaceClassName(item.platform),
                  )}
                >
                  <PlatformBadge
                    platform={item.platform}
                    className="justify-self-start"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {item.post_title}
                    </p>
                    <p className="text-muted-foreground">
                      {formatDateTime(item.upload_timestamp)}
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    {formatCompactNumber(item.media_size_bytes)}{" "}
                    {copy("bytes", "bytes")}
                  </p>
                  <p
                    className={
                      item.success ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {item.success
                      ? copy("Success", "Thành công")
                      : copy("Failed", "Thất bại")}
                  </p>
                </div>
              ))
            ) : (
              <InlineQueryState
                state="empty"
                message={copy(
                  "No upload history available.",
                  "Chưa có lịch sử upload.",
                )}
              />
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
