import { useMemo, useState, type KeyboardEvent } from "react";

import type {
  UserContentCategory,
  UserContentFormat,
  UserProfileResponse,
} from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBilingual } from "@/hooks/use-bilingual";
import {
  CONTENT_CATEGORY_OPTIONS,
  CONTENT_FORMAT_OPTIONS,
  localizeOptionLabel,
} from "@/pages/profile/lib/profile-options";

type UserProfile = UserProfileResponse["profile"];

type ProfileContentDirectionTabProps = {
  profile: UserProfile;
  onUpdateContentDirection: (
    patch: Partial<UserProfile["content_direction"]>,
  ) => void;
};

export function ProfileContentDirectionTab({
  profile,
  onUpdateContentDirection,
}: ProfileContentDirectionTabProps) {
  const copy = useBilingual();
  const [keywordDraft, setKeywordDraft] = useState("");

  const keywordCount = useMemo(
    () => profile.content_direction.target_keywords.length,
    [profile.content_direction.target_keywords.length],
  );

  const handleAddKeywords = () => {
    const incomingKeywords = keywordDraft
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (incomingKeywords.length === 0) {
      return;
    }

    const nextKeywords = Array.from(
      new Set([
        ...profile.content_direction.target_keywords,
        ...incomingKeywords,
      ]),
    ).slice(0, 16);

    onUpdateContentDirection({ target_keywords: nextKeywords });
    setKeywordDraft("");
  };

  const handleKeywordKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddKeywords();
    }
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>{copy("Content Categories", "Nhóm nội dung")}</FieldLabel>
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={profile.content_direction.categories}
          className="w-full flex-wrap justify-start gap-2"
          onValueChange={(value) =>
            onUpdateContentDirection({
              categories: value as UserContentCategory[],
            })
          }
        >
          {CONTENT_CATEGORY_OPTIONS.map((option) => (
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

      <Field>
        <FieldLabel>
          {copy("Preferred Formats", "Định dạng ưu tiên")}
        </FieldLabel>
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={profile.content_direction.preferred_formats}
          className="w-full flex-wrap justify-start gap-2"
          onValueChange={(value) =>
            onUpdateContentDirection({
              preferred_formats: value as UserContentFormat[],
            })
          }
        >
          {CONTENT_FORMAT_OPTIONS.map((option) => (
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

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="profile-primary-topic">
            {copy("Primary Topic", "Chủ đề trọng tâm")}
          </FieldLabel>
          <Input
            id="profile-primary-topic"
            value={profile.content_direction.primary_topic}
            onChange={(event) =>
              onUpdateContentDirection({ primary_topic: event.target.value })
            }
            placeholder={copy(
              "Ex: Practical wellness for office workers",
              "Ví dụ: Sức khỏe thực hành cho dân văn phòng",
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-audience-persona">
            {copy("Audience Persona", "Chân dung khán giả")}
          </FieldLabel>
          <Input
            id="profile-audience-persona"
            value={profile.content_direction.audience_persona}
            onChange={(event) =>
              onUpdateContentDirection({ audience_persona: event.target.value })
            }
            placeholder={copy(
              "Ex: Busy founders who need concise playbooks",
              "Ví dụ: Founder bận rộn cần playbook ngắn gọn",
            )}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="profile-strategic-goal">
          {copy("Strategic Goal", "Mục tiêu chiến lược")}
        </FieldLabel>
        <Textarea
          id="profile-strategic-goal"
          rows={3}
          value={profile.content_direction.strategic_goal}
          onChange={(event) =>
            onUpdateContentDirection({ strategic_goal: event.target.value })
          }
          placeholder={copy(
            "Describe what your content should achieve in the next 30-90 days.",
            "Mô tả kết quả nội dung cần đạt trong 30-90 ngày tới.",
          )}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="profile-keywords">
          {copy("Target Keywords", "Từ khóa mục tiêu")}
        </FieldLabel>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id="profile-keywords"
              value={keywordDraft}
              onChange={(event) => setKeywordDraft(event.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder={copy(
                "Add keywords, separated by comma",
                "Thêm từ khóa, cách nhau bằng dấu phẩy",
              )}
              className="min-w-56 flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddKeywords}>
              {copy("Add", "Thêm")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.content_direction.target_keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="rounded-full border-border/70 bg-muted/50"
              >
                {keyword}
                <button
                  type="button"
                  className="ml-2 text-muted-foreground transition hover:text-foreground"
                  onClick={() =>
                    onUpdateContentDirection({
                      target_keywords:
                        profile.content_direction.target_keywords.filter(
                          (item) => item !== keyword,
                        ),
                    })
                  }
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {copy("Active keywords", "Số từ khóa đang dùng")}: {keywordCount}
          </p>
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="profile-content-notes">
          {copy("Direction Notes", "Ghi chú định hướng")}
        </FieldLabel>
        <Textarea
          id="profile-content-notes"
          rows={3}
          value={profile.content_direction.notes ?? ""}
          onChange={(event) =>
            onUpdateContentDirection({ notes: event.target.value || null })
          }
          placeholder={copy(
            "Any constraints, forbidden topics, or strategic reminders.",
            "Các giới hạn, chủ đề cần tránh, hoặc nhắc nhở chiến lược.",
          )}
        />
      </Field>
    </FieldGroup>
  );
}
