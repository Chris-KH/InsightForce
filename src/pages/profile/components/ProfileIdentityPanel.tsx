import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PanelCard } from "@/components/app-section";
import type { UserProfileResponse } from "@/api/types";
import { useBilingual } from "@/hooks/use-bilingual";
import { Upload } from "lucide-react";
import { ProfileAvatarUploadDialog } from "@/pages/profile/components/ProfileAvatarUploadDialog";

type UserProfile = UserProfileResponse["profile"];

type ProfileIdentityPanelProps = {
  profile: UserProfile;
  onUpdate: (patch: Partial<UserProfile>) => void;
  onAvatarApplied?: () => void;
};

export function ProfileIdentityPanel({
  profile,
  onUpdate,
  onAvatarApplied,
}: ProfileIdentityPanelProps) {
  const copy = useBilingual();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const latestObjectUrlRef = useRef<string | null>(null);

  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);
  const [avatarEditorSource, setAvatarEditorSource] = useState<string | null>(
    null,
  );

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`
      .trim()
      .toUpperCase();

  useEffect(() => {
    return () => {
      if (latestObjectUrlRef.current) {
        URL.revokeObjectURL(latestObjectUrlRef.current);
      }
    };
  }, []);

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    if (latestObjectUrlRef.current) {
      URL.revokeObjectURL(latestObjectUrlRef.current);
      latestObjectUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    latestObjectUrlRef.current = objectUrl;
    setAvatarEditorSource(objectUrl);
    setAvatarEditorOpen(true);

    event.target.value = "";
  };

  const handleAvatarEditorOpenChange = (open: boolean) => {
    setAvatarEditorOpen(open);

    if (open) {
      return;
    }

    setAvatarEditorSource(null);
    if (latestObjectUrlRef.current) {
      URL.revokeObjectURL(latestObjectUrlRef.current);
      latestObjectUrlRef.current = null;
    }
  };

  return (
    <PanelCard
      title={copy("Identity Snapshot", "Tổng quan hồ sơ")}
      description={copy(
        "Profile identity and positioning details shown across the app.",
        "Thông tin nhận diện và định vị hiển thị trong toàn hệ thống.",
      )}
      className="h-full"
      contentClassName="pt-3"
    >
      <div className="grid gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-border/65 bg-muted/35 p-3">
          <div className="flex items-center gap-3">
            <div className="size-20 overflow-hidden rounded-2xl border border-border/70 bg-background">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                  {initials || "IF"}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-xl font-semibold text-foreground">
                {profile.display_name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
              <p className="mt-1 text-sm text-foreground/90">{profile.role}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.content_preferences.content_groups.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="rounded-full border-primary/25 bg-primary/10 text-primary"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileChange}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload data-icon="inline-start" />
            {copy("Upload & Crop Avatar", "Tải lên và cắt ảnh")}
          </Button>

          <p className="text-xs text-muted-foreground">
            {copy(
              "Simulated editor: adjusts preview and stores cropped result locally.",
              "Trình giả lập: căn chỉnh xem trước và lưu ảnh cắt trong local.",
            )}
          </p>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="profile-avatar-url">
              {copy("Avatar URL", "Đường dẫn ảnh đại diện")}
            </FieldLabel>
            <Input
              id="profile-avatar-url"
              value={profile.avatar_url ?? ""}
              onChange={(event) =>
                onUpdate({ avatar_url: event.target.value || null })
              }
              placeholder="https://..."
            />
          </Field>
        </FieldGroup>
      </div>

      <ProfileAvatarUploadDialog
        open={avatarEditorOpen}
        sourceImage={avatarEditorSource}
        onOpenChange={handleAvatarEditorOpenChange}
        onApply={(avatarDataUrl) => {
          onUpdate({ avatar_url: avatarDataUrl });
          onAvatarApplied?.();
        }}
      />
    </PanelCard>
  );
}
