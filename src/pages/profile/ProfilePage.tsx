import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Save, UserCircle2 } from "lucide-react";

import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
  useUsersQuery,
} from "@/api";
import type {
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "@/api/types";
import { InlineQueryState, QueryStateCard } from "@/components/app-query-state";
import { PanelCard, SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatDateTime } from "@/lib/insight-formatters";
import { getQueryErrorMessage } from "@/lib/query-error";
import { ProfileContentDirectionTab } from "@/pages/profile/components/ProfileContentDirectionTab";
import { ProfileHRDashboardPanel } from "@/pages/profile/components/ProfileHRDashboardPanel";
import { ProfileIdentityPanel } from "@/pages/profile/components/ProfileIdentityPanel";
import { ProfilePersonalTab } from "@/pages/profile/components/ProfilePersonalTab";
import { ProfilePreferencesTab } from "@/pages/profile/components/ProfilePreferencesTab";
import { ProfileUnsavedChangesDialog } from "@/pages/profile/components/ProfileUnsavedChangesDialog";
import { useProfileTimeline } from "@/pages/profile/hooks/use-profile-timeline";
import { useUnsavedChangesGuard } from "@/pages/profile/hooks/use-unsaved-changes-guard";

type UserProfile = UserProfileResponse["profile"];

function toUpdatePayload(profile: UserProfile): UserProfileUpdateRequest {
  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    display_name: profile.display_name,
    role: profile.role,
    department: profile.department,
    phone: profile.phone,
    website: profile.website,
    location: profile.location,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    content_direction: profile.content_direction,
    settings: profile.settings,
  };
}

export function ProfilePage() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const users = usersQuery.data?.users ?? [];

  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<UserProfile | null>(null);
  const wasDirtyRef = useRef(false);

  const {
    timelineEvents,
    resetTimeline,
    initializeTimeline,
    pushTimelineEvent,
  } = useProfileTimeline();

  useEffect(() => {
    if (users.length === 0) {
      if (selectedUserId) {
        setSelectedUserId(undefined);
      }
      return;
    }

    const hasSelectedUser = users.some((user) => user.id === selectedUserId);
    if (!selectedUserId || !hasSelectedUser) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  const activeUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [selectedUserId, users],
  );

  const profileQuery = useUserProfileQuery({
    userId: activeUser?.id,
    enabled: Boolean(activeUser?.id),
  });

  const updateProfileMutation = useUpdateUserProfileMutation(activeUser?.id);

  useEffect(() => {
    setSavedProfile(null);
    setDraftProfile(null);
    resetTimeline();
    wasDirtyRef.current = false;
  }, [activeUser?.id, resetTimeline]);

  useEffect(() => {
    if (!profileQuery.data?.profile) {
      return;
    }

    const incomingProfile = profileQuery.data.profile;
    const shouldHydrateDraft =
      !draftProfile ||
      draftProfile.user_id !== incomingProfile.user_id ||
      !wasDirtyRef.current;

    setSavedProfile(incomingProfile);

    if (!shouldHydrateDraft) {
      return;
    }

    setDraftProfile(incomingProfile);

    const sourceLabel =
      profileQuery.data.source === "mock"
        ? copy("Mock source", "Nguồn mock")
        : copy("API source", "Nguồn API");

    initializeTimeline(
      "system",
      copy("Profile loaded", "Đã tải hồ sơ"),
      `${copy("Data source", "Nguồn dữ liệu")}: ${sourceLabel}`,
      incomingProfile.updated_at,
    );

    wasDirtyRef.current = false;
  }, [
    activeUser?.id,
    copy,
    draftProfile,
    initializeTimeline,
    profileQuery.data,
  ]);

  const isProfileLoading = profileQuery.isLoading && !profileQuery.data;
  const baseProfile = savedProfile;

  const isDirty = useMemo(() => {
    if (!baseProfile || !draftProfile) {
      return false;
    }

    return JSON.stringify(baseProfile) !== JSON.stringify(draftProfile);
  }, [baseProfile, draftProfile]);

  const {
    dialogOpen: leaveDialogOpen,
    onDialogOpenChange: handleLeaveDialogOpenChange,
    stayOnPage,
    leaveWithoutSaving,
  } = useUnsavedChangesGuard(isDirty && !updateProfileMutation.isPending);

  useEffect(() => {
    if (isDirty && !wasDirtyRef.current) {
      pushTimelineEvent(
        "edit",
        copy("Draft started", "Bắt đầu chỉnh sửa"),
        copy(
          "Detected pending profile changes that are not saved yet.",
          "Đã phát hiện thay đổi hồ sơ chưa được lưu.",
        ),
      );
    }

    wasDirtyRef.current = isDirty;
  }, [copy, isDirty, pushTimelineEvent]);

  const handleUpdateProfile = (patch: Partial<UserProfile>) => {
    setDraftProfile((current) =>
      current
        ? {
            ...current,
            ...patch,
          }
        : current,
    );
  };

  const handleUpdateContentDirection = (
    patch: Partial<UserProfile["content_direction"]>,
  ) => {
    setDraftProfile((current) =>
      current
        ? {
            ...current,
            content_direction: {
              ...current.content_direction,
              ...patch,
            },
          }
        : current,
    );
  };

  const handleUpdateSettings = (patch: Partial<UserProfile["settings"]>) => {
    setDraftProfile((current) =>
      current
        ? {
            ...current,
            settings: {
              ...current.settings,
              ...patch,
            },
          }
        : current,
    );
  };

  const handleSaveProfile = async () => {
    if (!draftProfile || !activeUser) {
      return;
    }

    try {
      const result = await updateProfileMutation.mutateAsync(
        toUpdatePayload(draftProfile),
      );

      setSavedProfile(result.profile);
      setDraftProfile(result.profile);
      pushTimelineEvent(
        "save",
        copy("Profile saved", "Đã lưu hồ sơ"),
        copy(
          "All pending profile updates were synchronized successfully.",
          "Toàn bộ thay đổi hồ sơ đã được đồng bộ thành công.",
        ),
      );
    } catch {
      // Mutation error state is surfaced through updateProfileMutation.error.
    }
  };

  const handleResetProfile = () => {
    if (!baseProfile) {
      return;
    }

    setDraftProfile(baseProfile);

    if (isDirty) {
      pushTimelineEvent(
        "reset",
        copy("Draft reset", "Đã đặt lại bản nháp"),
        copy(
          "Unsaved edits were discarded and reverted to the latest saved version.",
          "Các thay đổi chưa lưu đã bị hủy và quay về phiên bản đã lưu gần nhất.",
        ),
      );
    }
  };

  return (
    <div className="grid gap-8">
      <SectionHeader
        eyebrow={copy("Profile Workspace", "Không gian hồ sơ")}
        title={copy(
          "Creator Profile & Preferences",
          "Hồ sơ và tùy chọn creator",
        )}
        description={copy(
          "Manage identity, content direction, and publishing preferences for your automation workflows.",
          "Quản lý nhận diện, định hướng nội dung và tùy chọn xuất bản cho các workflow tự động hóa.",
        )}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={users.length === 0}
            >
              <SelectTrigger className="w-56">
                <SelectValue
                  placeholder={copy("Select user", "Chọn người dùng")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={handleResetProfile}
              disabled={!isDirty || updateProfileMutation.isPending}
            >
              <RefreshCw data-icon="inline-start" />
              {copy("Reset", "Đặt lại")}
            </Button>

            <Button
              type="button"
              onClick={() => {
                void handleSaveProfile();
              }}
              disabled={!isDirty || updateProfileMutation.isPending}
            >
              <Save data-icon="inline-start" />
              {copy("Save Changes", "Lưu thay đổi")}
            </Button>
          </div>
        }
      />

      {usersQuery.isLoading ? (
        <QueryStateCard
          state="loading"
          title={copy("Loading Users", "Đang tải người dùng")}
          description={copy(
            "Preparing account roster for profile selection.",
            "Đang chuẩn bị danh sách tài khoản để chọn hồ sơ.",
          )}
        />
      ) : users.length === 0 ? (
        <QueryStateCard
          state="empty"
          title={copy("No Users Found", "Chưa có người dùng")}
          description={copy(
            "Create at least one user account to manage profile settings.",
            "Hãy tạo ít nhất một tài khoản để quản lý hồ sơ.",
          )}
        />
      ) : profileQuery.error && !draftProfile ? (
        <QueryStateCard
          state="error"
          title={copy("Unable To Load Profile", "Không thể tải hồ sơ")}
          description={getQueryErrorMessage(
            profileQuery.error,
            "Unable to load profile data right now.",
          )}
        />
      ) : isProfileLoading || !draftProfile ? (
        <QueryStateCard
          state="loading"
          title={copy("Loading Profile", "Đang tải hồ sơ")}
          description={copy(
            "Fetching profile details and content preferences.",
            "Đang lấy thông tin hồ sơ và tùy chọn nội dung.",
          )}
        />
      ) : (
        <>
          <ProfileHRDashboardPanel
            profile={draftProfile}
            isDirty={isDirty}
            timeline={timelineEvents}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <ProfileIdentityPanel
              profile={draftProfile}
              onUpdate={handleUpdateProfile}
              onAvatarApplied={() => {
                pushTimelineEvent(
                  "avatar",
                  copy("Avatar updated", "Đã cập nhật avatar"),
                  copy(
                    "A new avatar was uploaded and applied using crop preview mode.",
                    "Một ảnh đại diện mới đã được tải lên và áp dụng từ chế độ xem trước cắt ảnh.",
                  ),
                );
              }}
            />

            <PanelCard
              title={copy("Profile Detail", "Chi tiết hồ sơ")}
              description={copy(
                "Structured tabs to manage personal data, content direction, and operational preferences.",
                "Các tab được cấu trúc để quản lý thông tin cá nhân, định hướng nội dung và tùy chọn vận hành.",
              )}
              action={
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/25 bg-primary/10 text-primary"
                >
                  <UserCircle2 className="mr-1" />
                  {copy("Updated", "Cập nhật")}:{" "}
                  {formatDateTime(draftProfile.updated_at)}
                </Badge>
              }
            >
              <Tabs defaultValue="personal" className="gap-5">
                <TabsList
                  variant="line"
                  className="w-full justify-start overflow-x-auto"
                >
                  <TabsTrigger value="personal">
                    {copy("Personal Info", "Thông tin cá nhân")}
                  </TabsTrigger>
                  <TabsTrigger value="direction">
                    {copy("Content Direction", "Định hướng nội dung")}
                  </TabsTrigger>
                  <TabsTrigger value="preferences">
                    {copy("Preferences", "Tùy chọn")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="pt-1">
                  <ProfilePersonalTab
                    profile={draftProfile}
                    onUpdate={handleUpdateProfile}
                  />
                </TabsContent>

                <TabsContent value="direction" className="pt-1">
                  <ProfileContentDirectionTab
                    profile={draftProfile}
                    onUpdateContentDirection={handleUpdateContentDirection}
                  />
                </TabsContent>

                <TabsContent value="preferences" className="pt-1">
                  <ProfilePreferencesTab
                    profile={draftProfile}
                    onUpdateSettings={handleUpdateSettings}
                  />
                </TabsContent>
              </Tabs>
            </PanelCard>
          </div>
        </>
      )}

      <ProfileUnsavedChangesDialog
        open={leaveDialogOpen}
        onOpenChange={handleLeaveDialogOpenChange}
        onStayOnPage={stayOnPage}
        onLeaveWithoutSaving={leaveWithoutSaving}
      />

      {updateProfileMutation.error ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            updateProfileMutation.error,
            "Unable to save profile updates.",
          )}
        />
      ) : null}
    </div>
  );
}
