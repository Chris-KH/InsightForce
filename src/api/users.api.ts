import { httpClient } from "@/api/http-client";
import type {
  UserCreateRequest,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserResponse,
  UsersListResponse,
} from "@/api/types";

const USERS_BASE_PATH = "/api/v1/users";
const PROFILE_STORAGE_KEY_PREFIX = "insightforce.local.user-profile.v3";

type RequestOptions = {
  signal?: AbortSignal;
};

type UserProfile = UserProfileResponse["profile"];

const LEGACY_CATEGORY_TO_CONTENT_GROUP: Record<string, string> = {
  wellness: "Thói quen cá nhân",
  education: "Câu chuyện giáo dục",
  finance: "Mẹo vặt cuộc sống",
  lifestyle: "Lifehack gia đình",
  technology: "Kỹ năng sống",
  business: "Tổ chức nhà cửa",
};

const CONTENT_GROUP_TO_LEGACY_CATEGORY: Record<string, string> = {
  "Thói quen cá nhân": "wellness",
  "Câu chuyện giáo dục": "education",
  "Mẹo vặt cuộc sống": "finance",
  "Lifehack gia đình": "lifestyle",
  "Kỹ năng sống": "technology",
  "Tổ chức nhà cửa": "business",
};

const LEGACY_FORMAT_TO_PRIORITY_FORMAT: Record<string, string> = {
  short_video: "Video ngắn",
  long_video: "Video dài",
  carousel: "Bài post nhiều ảnh",
  single_image: "Ảnh đơn",
  thread: "Chuỗi bài viết",
  live_stream: "Phát trực tiếp",
};

const PRIORITY_FORMAT_TO_LEGACY_FORMAT: Record<string, string> = {
  "Video ngắn": "short_video",
  "Video dài": "long_video",
  "Bài post nhiều ảnh": "carousel",
  "Ảnh đơn": "single_image",
  "Chuỗi bài viết": "thread",
  "Phát trực tiếp": "live_stream",
};

const DEFAULT_LINKED_PLATFORMS = ["facebook", "instagram", "tiktok"];

const DEFAULT_POST_TIMES: UserProfile["options"]["default_post_times"] = {
  facebook: "20:00",
  instagram: "21:00",
  tiktok: "19:30",
};

const VOICE_TONES = new Set([
  "mentor",
  "expert",
  "friendly",
  "playful",
  "data_driven",
]);
const REVIEW_MODES = new Set(["balanced", "strict", "fast"]);
const VISIBILITY_MODES = new Set(["public", "private", "friends"]);

function sanitizeNullableText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const seen = new Set<string>();
  const items: string[] = [];

  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }

    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    items.push(trimmed);
  }

  return items;
}

function splitDisplayName(displayName: string | null | undefined) {
  const normalizedName = (displayName ?? "").trim();
  if (!normalizedName) {
    return {
      firstName: "Insight",
      lastName: "Creator",
      fullName: "Insight Creator",
    };
  }

  const parts = normalizedName.split(/\s+/);
  const firstName = parts[0] ?? "Insight";
  const lastName = parts.slice(1).join(" ") || "Creator";

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
  };
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "creator";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (segment) => segment.toUpperCase())
    .trim();
}

function mapValues(values: string[], dictionary: Record<string, string>) {
  return values.map((item) => dictionary[item] ?? item);
}

function toWeeklyFrequency(value: unknown, fallback = 5) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return fallback;
}

function normalizeDefaultPostTimes(value: unknown) {
  if (!value || typeof value !== "object") {
    return {
      ...DEFAULT_POST_TIMES,
    };
  }

  const raw = value as Record<string, unknown>;
  const next: UserProfile["options"]["default_post_times"] = {
    ...DEFAULT_POST_TIMES,
  };

  for (const [platform, time] of Object.entries(raw)) {
    const normalizedTime = sanitizeNullableText(time);
    if (!normalizedTime) {
      continue;
    }

    next[platform] = normalizedTime;
  }

  return next;
}

function normalizeContentPreferences(profile: Partial<UserProfile>) {
  const direct = profile.content_preferences;
  const legacy = profile.content_direction;

  const contentGroups = sanitizeStringArray(direct?.content_groups);
  const fallbackGroups = mapValues(
    sanitizeStringArray(legacy?.categories),
    LEGACY_CATEGORY_TO_CONTENT_GROUP,
  );

  const priorityFormats = sanitizeStringArray(direct?.priority_formats);
  const fallbackFormats = mapValues(
    sanitizeStringArray(legacy?.preferred_formats),
    LEGACY_FORMAT_TO_PRIORITY_FORMAT,
  );

  const keywordHashtags = sanitizeStringArray(direct?.keyword_hashtags);
  const fallbackKeywords = sanitizeStringArray(legacy?.target_keywords);

  return {
    content_groups: contentGroups.length > 0 ? contentGroups : fallbackGroups,
    priority_formats:
      priorityFormats.length > 0 ? priorityFormats : fallbackFormats,
    keyword_hashtags:
      keywordHashtags.length > 0 ? keywordHashtags : fallbackKeywords,
    audience_persona:
      sanitizeNullableText(direct?.audience_persona) ??
      sanitizeNullableText(legacy?.audience_persona) ??
      "",
    focus_content_goal:
      sanitizeNullableText(direct?.focus_content_goal) ??
      sanitizeNullableText(legacy?.strategic_goal) ??
      "",
    primary_topic:
      sanitizeNullableText(direct?.primary_topic) ??
      sanitizeNullableText(legacy?.primary_topic) ??
      "",
    notes:
      sanitizeNullableText(direct?.notes) ??
      sanitizeNullableText(legacy?.notes),
  } satisfies UserProfile["content_preferences"];
}

function normalizeOptions(profile: Partial<UserProfile>) {
  const direct = profile.options;
  const legacy = profile.settings;

  const defaultPostTimes = normalizeDefaultPostTimes(
    direct?.default_post_times,
  );
  const linkedPlatforms = sanitizeStringArray(direct?.linked_platforms);

  const timezone =
    sanitizeNullableText(direct?.timezone) ??
    sanitizeNullableText(legacy?.timezone) ??
    "Asia/Saigon";

  const voiceToneCandidate =
    sanitizeNullableText(direct?.voice_tone) ??
    sanitizeNullableText(legacy?.voice_tone) ??
    "friendly";

  const reviewModeCandidate =
    sanitizeNullableText(direct?.content_review_mode) ??
    sanitizeNullableText(legacy?.content_review_mode) ??
    "balanced";

  const visibilityCandidate =
    sanitizeNullableText(direct?.default_visibility) ?? "public";

  return {
    timezone,
    linked_platforms:
      linkedPlatforms.length > 0
        ? linkedPlatforms
        : [...DEFAULT_LINKED_PLATFORMS],
    default_visibility: VISIBILITY_MODES.has(visibilityCandidate)
      ? (visibilityCandidate as UserProfile["options"]["default_visibility"])
      : "public",
    default_post_times: defaultPostTimes,
    weekly_content_frequency: toWeeklyFrequency(
      direct?.weekly_content_frequency ?? legacy?.posting_cadence,
      5,
    ),
    language:
      sanitizeNullableText(direct?.language) ??
      sanitizeNullableText(legacy?.language) ??
      "vi",
    voice_tone: VOICE_TONES.has(voiceToneCandidate)
      ? (voiceToneCandidate as UserProfile["options"]["voice_tone"])
      : "friendly",
    content_review_mode: REVIEW_MODES.has(reviewModeCandidate)
      ? (reviewModeCandidate as UserProfile["options"]["content_review_mode"])
      : "balanced",
  } satisfies UserProfile["options"];
}

function toLegacyContentDirection(
  preferences: UserProfile["content_preferences"],
): NonNullable<UserProfile["content_direction"]> {
  return {
    categories: mapValues(
      preferences.content_groups,
      CONTENT_GROUP_TO_LEGACY_CATEGORY,
    ) as NonNullable<UserProfile["content_direction"]>["categories"],
    preferred_formats: mapValues(
      preferences.priority_formats,
      PRIORITY_FORMAT_TO_LEGACY_FORMAT,
    ) as NonNullable<UserProfile["content_direction"]>["preferred_formats"],
    primary_topic: preferences.primary_topic,
    audience_persona: preferences.audience_persona,
    strategic_goal: preferences.focus_content_goal,
    target_keywords: preferences.keyword_hashtags,
    notes: preferences.notes,
  };
}

function toLegacySettings(
  options: UserProfile["options"],
): NonNullable<UserProfile["settings"]> {
  return {
    timezone: options.timezone,
    language: options.language,
    posting_cadence: `${options.weekly_content_frequency} posts/week`,
    voice_tone: options.voice_tone,
    content_review_mode: options.content_review_mode,
  };
}

function normalizeProfile(profile: Partial<UserProfile>): UserProfile {
  const fallbackName = splitDisplayName(
    sanitizeNullableText(profile.display_name) ??
      `${sanitizeNullableText(profile.first_name) ?? ""} ${sanitizeNullableText(profile.last_name) ?? ""}`,
  );

  const contentPreferences = normalizeContentPreferences(profile);
  const options = normalizeOptions(profile);

  const phoneNumber =
    sanitizeNullableText(profile.phone_number) ??
    sanitizeNullableText(profile.phone);

  const aboutMe =
    sanitizeNullableText(profile.about_me) ?? sanitizeNullableText(profile.bio);

  return {
    user_id: profile.user_id ?? "",
    email: profile.email ?? "",
    first_name:
      sanitizeNullableText(profile.first_name) ?? fallbackName.firstName,
    last_name: sanitizeNullableText(profile.last_name) ?? fallbackName.lastName,
    display_name:
      sanitizeNullableText(profile.display_name) ?? fallbackName.fullName,
    role: sanitizeNullableText(profile.role) ?? "Content Creator",
    department: sanitizeNullableText(profile.department),
    phone_number: phoneNumber,
    phone: phoneNumber,
    website: sanitizeNullableText(profile.website),
    location: sanitizeNullableText(profile.location),
    about_me: aboutMe,
    bio: aboutMe,
    avatar_url: sanitizeNullableText(profile.avatar_url),
    content_preferences: contentPreferences,
    options,
    content_direction: toLegacyContentDirection(contentPreferences),
    settings: toLegacySettings(options),
    updated_at:
      sanitizeNullableText(profile.updated_at) ?? new Date().toISOString(),
  };
}

function normalizeUserProfileResponse(response: UserProfileResponse) {
  return {
    ...response,
    profile: normalizeProfile(response.profile),
  } satisfies UserProfileResponse;
}

function getProfileStorageKey(userId: string) {
  return `${PROFILE_STORAGE_KEY_PREFIX}.${userId}`;
}

function readStoredProfile(userId: string): UserProfileResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getProfileStorageKey(userId));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as UserProfileResponse;
    if (!parsed?.profile?.user_id) {
      return null;
    }

    return normalizeUserProfileResponse(parsed);
  } catch {
    return null;
  }
}

function writeStoredProfile(profile: UserProfileResponse) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      getProfileStorageKey(profile.profile.user_id),
      JSON.stringify(profile),
    );
  } catch {
    // Ignore localStorage write failures.
  }
}

function toUserProfileResponse(user: UserResponse): UserProfileResponse {
  const derivedDisplayName =
    user.display_name ?? deriveNameFromEmail(user.email);
  const nameParts = splitDisplayName(derivedDisplayName);

  return normalizeUserProfileResponse({
    source: "api",
    profile: {
      user_id: user.id,
      email: user.email,
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      display_name: derivedDisplayName,
      role: "Content Creator",
      department: null,
      phone_number: user.phone_number ?? null,
      website: null,
      location: user.location ?? null,
      about_me: user.about_me ?? null,
      avatar_url: user.avatar_url ?? null,
      content_preferences: {
        content_groups: sanitizeStringArray(
          user.content_preferences?.content_groups,
        ),
        priority_formats: sanitizeStringArray(
          user.content_preferences?.priority_formats,
        ),
        keyword_hashtags: sanitizeStringArray(
          user.content_preferences?.keyword_hashtags,
        ),
        audience_persona: user.content_preferences?.audience_persona ?? "",
        focus_content_goal: user.content_preferences?.focus_content_goal ?? "",
        primary_topic: "",
        notes: null,
      },
      options: {
        timezone: user.options?.timezone ?? "Asia/Saigon",
        linked_platforms: sanitizeStringArray(user.options?.linked_platforms),
        default_visibility:
          user.options?.default_visibility === "private" ||
          user.options?.default_visibility === "friends"
            ? user.options.default_visibility
            : "public",
        default_post_times: normalizeDefaultPostTimes(
          user.options?.default_post_times,
        ),
        weekly_content_frequency: toWeeklyFrequency(
          user.options?.weekly_content_frequency,
          5,
        ),
        language: "vi",
        voice_tone: "friendly",
        content_review_mode: "balanced",
      },
      updated_at: user.created_at,
    },
  });
}

function mergeLocalProfile(
  apiProfile: UserProfileResponse,
  localProfile: UserProfileResponse,
): UserProfileResponse {
  if (apiProfile.profile.user_id !== localProfile.profile.user_id) {
    return apiProfile;
  }

  return normalizeUserProfileResponse({
    source: "api",
    profile: {
      ...apiProfile.profile,
      ...localProfile.profile,
      content_preferences: {
        ...apiProfile.profile.content_preferences,
        ...localProfile.profile.content_preferences,
      },
      options: {
        ...apiProfile.profile.options,
        ...localProfile.profile.options,
        default_post_times: {
          ...apiProfile.profile.options.default_post_times,
          ...localProfile.profile.options.default_post_times,
        },
      },
      updated_at:
        localProfile.profile.updated_at ?? apiProfile.profile.updated_at,
    },
  });
}

export function createUser(payload: UserCreateRequest) {
  return httpClient.post<UserResponse>(USERS_BASE_PATH, payload);
}

export function getUsers(options: RequestOptions = {}) {
  return httpClient.get<UsersListResponse>(USERS_BASE_PATH, {
    signal: options.signal,
  });
}

export function getUser(userId: string, options: RequestOptions = {}) {
  return httpClient.get<UserResponse>(
    `${USERS_BASE_PATH}/${encodeURIComponent(userId)}`,
    {
      signal: options.signal,
    },
  );
}

export async function getUserProfile(
  userId: string,
  options: RequestOptions = {},
) {
  const user = await getUser(userId, options);
  const apiProfile = toUserProfileResponse(user);
  const localProfile = readStoredProfile(userId);

  if (!localProfile) {
    return apiProfile;
  }

  return mergeLocalProfile(apiProfile, localProfile);
}

export async function updateUserProfile(
  userId: string,
  payload: UserProfileUpdateRequest,
) {
  // Backend currently exposes read-only user profile endpoints for UI.
  // Keep local profile persistence until backend update endpoint is available.
  const current = readStoredProfile(userId) ?? (await getUserProfile(userId));

  const mergedProfile = {
    ...current.profile,
    ...payload,
    content_preferences: {
      ...current.profile.content_preferences,
      ...(payload.content_preferences ?? {}),
    },
    options: {
      ...current.profile.options,
      ...(payload.options ?? {}),
      default_post_times: {
        ...current.profile.options.default_post_times,
        ...(payload.options?.default_post_times ?? {}),
      },
    },
  } as Partial<UserProfile>;

  const next: UserProfileResponse = {
    source: "mock",
    profile: {
      ...normalizeProfile(mergedProfile),
      updated_at: new Date().toISOString(),
    },
  };

  writeStoredProfile(next);
  return next;
}
