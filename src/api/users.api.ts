import { httpClient } from "@/api/http-client";
import { withApiMockFallback } from "@/api/mock-fallback";
import type {
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserCreateRequest,
  UserResponse,
  UserSummaryResponse,
  UsersListResponse,
} from "@/api/types";

const USERS_BASE_PATH = "/api/v1/users";
const USERS_STORAGE_KEY = "insightforce.mock.users-list.v1";
const PROFILE_STORAGE_KEY_PREFIX = "insightforce.mock.user-profile.v2";

type RequestOptions = {
  signal?: AbortSignal;
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function buildDefaultMockUsersList(): UsersListResponse {
  return {
    users: [
      {
        id: "user-minh-nguyen",
        email: "creator@insightforce.local",
        name: "Minh Nguyen",
        plan: "pro",
        created_at: daysAgo(42),
        trend_analysis_count: 14,
        generated_content_count: 31,
        publish_job_count: 18,
      },
      {
        id: "user-linh-tran",
        email: "linh.tran@insightforce.local",
        name: "Linh Tran",
        plan: "starter",
        created_at: daysAgo(28),
        trend_analysis_count: 9,
        generated_content_count: 17,
        publish_job_count: 11,
      },
      {
        id: "user-khanh-le",
        email: "khanh.le@insightforce.local",
        name: "Khanh Le",
        plan: "enterprise",
        created_at: daysAgo(11),
        trend_analysis_count: 22,
        generated_content_count: 44,
        publish_job_count: 27,
      },
    ],
  };
}

function readMockUsersList(): UsersListResponse {
  if (typeof window === "undefined") {
    return buildDefaultMockUsersList();
  }

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return buildDefaultMockUsersList();
    }

    const parsed = JSON.parse(raw) as UsersListResponse;
    if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
      return buildDefaultMockUsersList();
    }

    return {
      users: parsed.users,
    };
  } catch {
    return buildDefaultMockUsersList();
  }
}

function writeMockUsersList(payload: UsersListResponse) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore localStorage write failures.
  }
}

function toSafeUserId(email: string) {
  const safePart = email
    .toLowerCase()
    .split("@")[0]
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `user-${safePart || "creator"}`;
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "creator";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (segment) => segment.toUpperCase())
    .trim();
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

function ensureMockUserSummary(userId: string): UserSummaryResponse {
  const currentList = readMockUsersList();
  const existing = currentList.users.find((user) => user.id === userId);
  if (existing) {
    return existing;
  }

  const synthetic: UserSummaryResponse = {
    id: userId,
    email: `${userId}@insightforce.local`,
    name: deriveNameFromEmail(userId),
    plan: "starter",
    created_at: new Date().toISOString(),
    trend_analysis_count: 0,
    generated_content_count: 0,
    publish_job_count: 0,
  };

  writeMockUsersList({ users: [synthetic, ...currentList.users] });
  return synthetic;
}

function syncMockUserSummaryFromProfile(
  profile: UserProfileResponse["profile"],
) {
  const currentList = readMockUsersList();
  const existingIndex = currentList.users.findIndex(
    (user) => user.id === profile.user_id,
  );
  const existing = existingIndex >= 0 ? currentList.users[existingIndex] : null;

  const nextSummary: UserSummaryResponse = {
    id: profile.user_id,
    email: profile.email,
    name: profile.display_name,
    plan: existing?.plan ?? "starter",
    created_at: existing?.created_at ?? new Date().toISOString(),
    trend_analysis_count: existing?.trend_analysis_count ?? 0,
    generated_content_count: existing?.generated_content_count ?? 0,
    publish_job_count: existing?.publish_job_count ?? 0,
  };

  if (existingIndex >= 0) {
    const nextUsers = [...currentList.users];
    nextUsers[existingIndex] = nextSummary;
    writeMockUsersList({ users: nextUsers });
    return;
  }

  writeMockUsersList({ users: [nextSummary, ...currentList.users] });
}

function getProfileStorageKey(userId: string) {
  return `${PROFILE_STORAGE_KEY_PREFIX}.${userId}`;
}

function buildDefaultMockUserProfile(
  userId: string,
  userSummary?: UserSummaryResponse,
): UserProfileResponse {
  const createdAt = new Date().toISOString();
  const nameParts = splitDisplayName("Góc Nhỏ Thông Minh");

  const roleByPlan =
    userSummary?.plan === "enterprise"
      ? "Head of Content"
      : userSummary?.plan === "pro"
        ? "Creator Strategist"
        : "Content Operator";

  return normalizeUserProfileResponse({
    source: "mock",
    profile: {
      user_id: userId,
      email: "lifehack.creator@example.com",
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      display_name: "Góc Nhỏ Thông Minh",
      role: roleByPlan,
      department: "Growth Studio",
      phone_number: "+84 912 345 678",
      website: "https://insightforce.app",
      location: "Ho Chi Minh City, Vietnam",
      about_me:
        "Tôi xây dựng nội dung giúp người xem sống gọn gàng, thông minh và bình tĩnh hơn mỗi ngày. Phong cách của tôi là gần gũi, thực tế, có tính giáo dục nhưng không lên lớp. Tôi thích biến những vấn đề nhỏ trong đời sống thành các mẹo dễ làm, các câu chuyện ngắn có bài học, và những góc nhìn giúp người xem cải thiện thói quen sống.",
      avatar_url:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
      content_preferences: {
        content_groups: [
          "Mẹo vặt cuộc sống",
          "Lifehack gia đình",
          "Tổ chức nhà cửa",
          "Thói quen cá nhân",
          "Câu chuyện giáo dục",
          "Kỹ năng sống",
        ],
        priority_formats: ["Bài post nhiều ảnh", "Chuỗi bài viết"],
        primary_topic: "Mẹo sống gọn gàng và thông minh mỗi ngày",
        audience_persona:
          "Người Việt từ 22-40 tuổi, bận rộn với công việc và gia đình, muốn học các mẹo đơn giản để sống ngăn nắp hơn, tiết kiệm thời gian hơn và cải thiện bản thân qua những câu chuyện dễ hiểu, thực tế.",
        focus_content_goal:
          "Xây dựng một kênh nội dung đáng tin cậy về mẹo vặt đời sống và giáo dục thói quen, giúp người xem lưu bài, chia sẻ cho bạn bè và quay lại mỗi ngày để học thêm một điều nhỏ nhưng hữu ích.",
        keyword_hashtags: [
          "meovatcuocsong",
          "lifehack",
          "songthongminh",
          "thoiquentot",
          "nhacuasachgon",
          "ky nang song",
          "meohaymoingay",
          "cauchuyengiaoduc",
        ],
        notes:
          "Ưu tiên nội dung thực tế, áp dụng được ngay và luôn có điểm rút ra cuối bài.",
      },
      options: {
        timezone: "Asia/Saigon",
        linked_platforms: [...DEFAULT_LINKED_PLATFORMS],
        default_visibility: "public",
        default_post_times: {
          ...DEFAULT_POST_TIMES,
        },
        weekly_content_frequency: 5,
        language: "vi",
        voice_tone: "friendly",
        content_review_mode: "balanced",
      },
      updated_at: createdAt,
    },
  });
}

function readMockProfile(
  userId: string,
  userSummary?: UserSummaryResponse,
): UserProfileResponse {
  if (typeof window === "undefined") {
    return buildDefaultMockUserProfile(userId, userSummary);
  }

  try {
    const raw = window.localStorage.getItem(getProfileStorageKey(userId));
    if (!raw) {
      return buildDefaultMockUserProfile(userId, userSummary);
    }

    const parsed = JSON.parse(raw) as UserProfileResponse;
    if (!parsed.profile?.user_id) {
      return buildDefaultMockUserProfile(userId, userSummary);
    }

    return normalizeUserProfileResponse({
      ...parsed,
      source: "mock",
    });
  } catch {
    return buildDefaultMockUserProfile(userId, userSummary);
  }
}

function writeMockProfile(profile: UserProfileResponse) {
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

export function createUser(payload: UserCreateRequest) {
  return withApiMockFallback(
    "users.create",
    () => httpClient.post<UserResponse>(USERS_BASE_PATH, payload),
    () => {
      const email = payload.email.trim().toLowerCase();
      const currentList = readMockUsersList();
      const existing = currentList.users.find(
        (user) => user.email.toLowerCase() === email,
      );

      if (existing) {
        return {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          plan: existing.plan,
          created_at: existing.created_at,
        };
      }

      const now = new Date().toISOString();
      const baseUserId = toSafeUserId(email);
      const usedIds = new Set(currentList.users.map((user) => user.id));
      let uniqueUserId = baseUserId;
      let suffix = 1;

      while (usedIds.has(uniqueUserId)) {
        uniqueUserId = `${baseUserId}-${suffix}`;
        suffix += 1;
      }

      const createdUser: UserSummaryResponse = {
        id: uniqueUserId,
        email,
        name: payload.name ?? deriveNameFromEmail(email),
        plan: payload.plan ?? "starter",
        created_at: now,
        trend_analysis_count: 0,
        generated_content_count: 0,
        publish_job_count: 0,
      };

      writeMockUsersList({ users: [createdUser, ...currentList.users] });

      return {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        plan: createdUser.plan,
        created_at: createdUser.created_at,
      };
    },
  );
}

export function getUsers(options: RequestOptions = {}) {
  return withApiMockFallback(
    "users.list",
    () =>
      httpClient.get<UsersListResponse>(USERS_BASE_PATH, {
        signal: options.signal,
      }),
    () => {
      const users = readMockUsersList();
      writeMockUsersList(users);
      return users;
    },
  );
}

export function getUser(userId: string, options: RequestOptions = {}) {
  return withApiMockFallback(
    `users.detail.${userId}`,
    () =>
      httpClient.get<UserResponse>(
        `${USERS_BASE_PATH}/${encodeURIComponent(userId)}`,
        {
          signal: options.signal,
        },
      ),
    () => {
      const user = ensureMockUserSummary(userId);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        created_at: user.created_at,
      };
    },
  );
}

export function getUserProfile(userId: string, options: RequestOptions = {}) {
  return withApiMockFallback(
    `users.profile.${userId}`,
    async () => {
      const response = await httpClient.get<UserProfileResponse>(
        `${USERS_BASE_PATH}/${encodeURIComponent(userId)}/profile`,
        {
          signal: options.signal,
        },
      );

      return normalizeUserProfileResponse(response);
    },
    () => {
      const userSummary = ensureMockUserSummary(userId);
      const profile = readMockProfile(userId, userSummary);
      writeMockProfile(profile);
      syncMockUserSummaryFromProfile(profile.profile);
      return profile;
    },
  );
}

export function updateUserProfile(
  userId: string,
  payload: UserProfileUpdateRequest,
) {
  return withApiMockFallback(
    `users.profile.update.${userId}`,
    async () => {
      const response = await httpClient.put<UserProfileResponse>(
        `${USERS_BASE_PATH}/${encodeURIComponent(userId)}/profile`,
        payload,
      );

      return normalizeUserProfileResponse(response);
    },
    () => {
      const current = readMockProfile(userId);
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

      writeMockProfile(next);
      syncMockUserSummaryFromProfile(next.profile);
      return next;
    },
  );
}
