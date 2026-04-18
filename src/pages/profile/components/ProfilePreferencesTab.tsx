import type { UserProfileResponse } from "@/api/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  CONTENT_REVIEW_MODE_OPTIONS,
  LANGUAGE_OPTIONS,
  localizeOptionLabel,
  POSTING_CADENCE_OPTIONS,
  TIMEZONE_OPTIONS,
  VOICE_TONE_OPTIONS,
} from "@/pages/profile/lib/profile-options";

type UserProfile = UserProfileResponse["profile"];

type ProfilePreferencesTabProps = {
  profile: UserProfile;
  onUpdateSettings: (patch: Partial<UserProfile["settings"]>) => void;
};

export function ProfilePreferencesTab({
  profile,
  onUpdateSettings,
}: ProfilePreferencesTabProps) {
  const copy = useBilingual();

  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{copy("Language", "Ngôn ngữ")}</FieldLabel>
          <Select
            value={profile.settings.language}
            onValueChange={(value) => onUpdateSettings({ language: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={copy("Select language", "Chọn ngôn ngữ")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {localizeOptionLabel(option, copy)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{copy("Timezone", "Múi giờ")}</FieldLabel>
          <Select
            value={profile.settings.timezone}
            onValueChange={(value) => onUpdateSettings({ timezone: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={copy("Select timezone", "Chọn múi giờ")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TIMEZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {localizeOptionLabel(option, copy)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{copy("Posting Cadence", "Tần suất đăng")}</FieldLabel>
          <Select
            value={profile.settings.posting_cadence}
            onValueChange={(value) =>
              onUpdateSettings({ posting_cadence: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={copy("Select cadence", "Chọn tần suất")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {POSTING_CADENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {localizeOptionLabel(option, copy)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{copy("Voice Tone", "Giọng điệu")}</FieldLabel>
          <Select
            value={profile.settings.voice_tone}
            onValueChange={(value) =>
              onUpdateSettings({
                voice_tone: value as UserProfile["settings"]["voice_tone"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={copy("Select voice tone", "Chọn giọng điệu")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {VOICE_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {localizeOptionLabel(option, copy)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel>
          {copy("Content Review Mode", "Chế độ duyệt nội dung")}
        </FieldLabel>
        <ToggleGroup
          type="single"
          variant="outline"
          value={profile.settings.content_review_mode}
          className="w-full flex-wrap justify-start gap-2"
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            onUpdateSettings({
              content_review_mode:
                value as UserProfile["settings"]["content_review_mode"],
            });
          }}
        >
          {CONTENT_REVIEW_MODE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="rounded-full"
            >
              {localizeOptionLabel(option, copy)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </FieldGroup>
  );
}
