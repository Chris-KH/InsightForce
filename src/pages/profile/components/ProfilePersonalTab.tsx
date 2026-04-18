import type { UserProfileResponse } from "@/api/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";

type UserProfile = UserProfileResponse["profile"];

type ProfilePersonalTabProps = {
  profile: UserProfile;
  onUpdate: (patch: Partial<UserProfile>) => void;
};

export function ProfilePersonalTab({
  profile,
  onUpdate,
}: ProfilePersonalTabProps) {
  const copy = useBilingual();

  return (
    <FieldGroup>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="profile-first-name">
            {copy("First Name", "Tên")}
          </FieldLabel>
          <Input
            id="profile-first-name"
            value={profile.first_name}
            onChange={(event) => onUpdate({ first_name: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-last-name">
            {copy("Last Name", "Họ")}
          </FieldLabel>
          <Input
            id="profile-last-name"
            value={profile.last_name}
            onChange={(event) => onUpdate({ last_name: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-display-name">
            {copy("Display Name", "Tên hiển thị")}
          </FieldLabel>
          <Input
            id="profile-display-name"
            value={profile.display_name}
            onChange={(event) => onUpdate({ display_name: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-role">
            {copy("Role", "Vai trò")}
          </FieldLabel>
          <Input
            id="profile-role"
            value={profile.role}
            onChange={(event) => onUpdate({ role: event.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-department">
            {copy("Department", "Bộ phận")}
          </FieldLabel>
          <Input
            id="profile-department"
            value={profile.department ?? ""}
            onChange={(event) =>
              onUpdate({ department: event.target.value || null })
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-phone-number">
            {copy("Phone Number", "Số điện thoại")}
          </FieldLabel>
          <Input
            id="profile-phone-number"
            value={profile.phone_number ?? ""}
            onChange={(event) =>
              onUpdate({ phone_number: event.target.value || null })
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-website">
            {copy("Website", "Website")}
          </FieldLabel>
          <Input
            id="profile-website"
            value={profile.website ?? ""}
            onChange={(event) =>
              onUpdate({ website: event.target.value || null })
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-location">
            {copy("Location", "Địa điểm")}
          </FieldLabel>
          <Input
            id="profile-location"
            value={profile.location ?? ""}
            onChange={(event) =>
              onUpdate({ location: event.target.value || null })
            }
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="profile-about-me">
          {copy("About Me", "Giới thiệu bản thân")}
        </FieldLabel>
        <Textarea
          id="profile-about-me"
          value={profile.about_me ?? ""}
          onChange={(event) =>
            onUpdate({ about_me: event.target.value || null })
          }
          rows={5}
          placeholder={copy(
            "Tell your audience who you help and what unique point of view you bring.",
            "Giới thiệu bạn giúp ai và góc nhìn riêng bạn mang lại.",
          )}
        />
      </Field>
    </FieldGroup>
  );
}
