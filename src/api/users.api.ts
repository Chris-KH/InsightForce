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
const PROFILE_STORAGE_KEY_PREFIX = "insightforce.mock.user-profile";

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
  const seedEmail = userSummary?.email ?? "creator@insightforce.local";
  const nameParts = splitDisplayName(userSummary?.name ?? null);

  const roleByPlan =
    userSummary?.plan === "enterprise"
      ? "Head of Content"
      : userSummary?.plan === "pro"
        ? "Creator Strategist"
        : "Content Operator";

  return {
    source: "mock",
    profile: {
      user_id: userId,
      email: seedEmail,
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      display_name: nameParts.fullName,
      role: roleByPlan,
      department: "Growth Studio",
      phone: "+84 912 345 678",
      website: "https://insightforce.app",
      location: "Ho Chi Minh City, Vietnam",
      bio: "Helping brands turn trend data into repeatable social content systems.",
      avatar_url:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
      content_direction: {
        categories: ["wellness", "education"],
        preferred_formats: ["short_video", "carousel", "thread"],
        primary_topic: "Practical wellness for busy professionals",
        audience_persona:
          "Founders and working adults who want actionable health habits.",
        strategic_goal:
          "Build an expert brand and convert organic attention into booked consultations.",
        target_keywords: [
          "daily wellness",
          "healthy routines",
          "creator productivity",
        ],
        notes:
          "Prioritize educational value first, then add conversion CTA at the end.",
      },
      settings: {
        timezone: "Asia/Ho_Chi_Minh",
        language: "vi",
        posting_cadence: "5 posts/week",
        voice_tone: "mentor",
        content_review_mode: "balanced",
      },
      updated_at: createdAt,
    },
  };
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

    return {
      ...parsed,
      source: "mock",
    };
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
    () =>
      httpClient.get<UserProfileResponse>(
        `${USERS_BASE_PATH}/${encodeURIComponent(userId)}/profile`,
        {
          signal: options.signal,
        },
      ),
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
    () =>
      httpClient.put<UserProfileResponse>(
        `${USERS_BASE_PATH}/${encodeURIComponent(userId)}/profile`,
        payload,
      ),
    () => {
      const current = readMockProfile(userId);
      const next: UserProfileResponse = {
        source: "mock",
        profile: {
          ...current.profile,
          ...payload,
          content_direction: {
            ...current.profile.content_direction,
            ...(payload.content_direction ?? {}),
          },
          settings: {
            ...current.profile.settings,
            ...(payload.settings ?? {}),
          },
          updated_at: new Date().toISOString(),
        },
      };

      writeMockProfile(next);
      syncMockUserSummaryFromProfile(next.profile);
      return next;
    },
  );
}
