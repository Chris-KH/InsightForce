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
  TIMEZONE_OPTIONS,
  VOICE_TONE_OPTIONS,
  WEEKLY_CONTENT_FREQUENCY_OPTIONS,
} from "@/pages/profile/lib/profile-options";

type UserProfile = UserProfileResponse["profile"];

type ProfilePreferencesTabProps = {
  profile: UserProfile;
  onUpdateOptions: (patch: Partial<UserProfile["options"]>) => void;
};

const TOGGLE_ITEM_ACTIVE_CLASS =
  "rounded-full border-border/80 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

export function ProfilePreferencesTab({
  profile,
  onUpdateOptions,
}: ProfilePreferencesTabProps) {
  const copy = useBilingual();

  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>{copy("Language", "Ngôn ngữ")}</FieldLabel>
          <Select
            value={profile.options.language}
            onValueChange={(value) => onUpdateOptions({ language: value })}
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
            value={profile.options.timezone}
            onValueChange={(value) => onUpdateOptions({ timezone: value })}
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
          <FieldLabel>
            {copy("Weekly Content Frequency", "Tần suất nội dung theo tuần")}
          </FieldLabel>
          <Select
            value={profile.options.weekly_content_frequency.toString()}
            onValueChange={(value) =>
              onUpdateOptions({
                weekly_content_frequency: Number.parseInt(value, 10) || 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={copy("Select frequency", "Chọn tần suất")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {WEEKLY_CONTENT_FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
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
            value={profile.options.voice_tone}
            onValueChange={(value) =>
              onUpdateOptions({
                voice_tone: value as UserProfile["options"]["voice_tone"],
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
          value={profile.options.content_review_mode}
          className="w-full flex-wrap justify-start gap-2"
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            onUpdateOptions({
              content_review_mode:
                value as UserProfile["options"]["content_review_mode"],
            });
          }}
        >
          {CONTENT_REVIEW_MODE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={TOGGLE_ITEM_ACTIVE_CLASS}
            >
              {localizeOptionLabel(option, copy)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </FieldGroup>
  );
}
