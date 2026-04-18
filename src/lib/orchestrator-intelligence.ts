import type {
  GeneratedContentImageItem,
  GeneratedContentPostContent,
  OrchestratorGeneratedContent,
} from "@/api/types";

type UnknownRecord = Record<string, unknown>;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

export type StoryboardFrame = {
  id: string;
  index: number;
  timestamp: string;
  label: string;
  narration: string;
  notes: string;
  imagePrompt: string;
  imageOutputPath: string;
  imageUrl: string;
  localPath: string;
  imageStoreError: string;
};

export type NormalizedPlatformPost = {
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  bestPostTime: string;
  imageNotes: string;
};

export type NormalizedPublishing = {
  defaultVisibility: string;
  recommendedPlatforms: string[];
  timezone: string;
  weeklyContentFrequency: number;
};

export type NormalizedGeneratedContent = {
  selectedKeyword: string;
  mainTitle: string;
  hook: string;
  caption: string;
  description: string;
  body: string;
  callToAction: string;
  tone: string;
  hashtags: string[];
  personalizationNotes: string[];
  sections: StoryboardFrame[];
  platformPosts: NormalizedPlatformPost[];
  publishing: NormalizedPublishing;
  hasError: boolean;
  // Compatibility fields for legacy UI blocks that still render these labels.
  videoScriptTitle: string;
  durationEstimate: string;
  captionsStyle: string;
  musicMood: string;
  musicBackground: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toText(item)).filter((item) => item.length > 0);
}

function toInt(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function isPublicImageUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function toSlugSeed(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function buildMockImageUrl(seed: string) {
  const normalizedSeed = toSlugSeed(seed) || "insightforce-preview";
  return `https://picsum.photos/seed/${encodeURIComponent(normalizedSeed)}/1280/720`;
}

function toTimestamp(index: number) {
  const totalSeconds = Math.max(0, (index - 1) * 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function toRelativeImageUrl(pathValue: string) {
  const normalized = pathValue.replace(/^\/+/, "");
  if (!normalized) {
    return "";
  }

  if (!API_BASE_URL) {
    return "";
  }

  return `${API_BASE_URL}/${normalized}`;
}

function normalizePostContent(value: unknown): GeneratedContentPostContent {
  const source = isRecord(value) ? value : {};

  return {
    post_type: toText(source.post_type, "multi_image_post"),
    title: toText(source.title),
    hook: toText(source.hook),
    caption: toText(source.caption),
    description: toText(source.description),
    body: toText(source.body),
    call_to_action: toText(source.call_to_action),
    hashtags: toStringArray(source.hashtags),
    tone: toText(source.tone),
    personalization_notes: toStringArray(source.personalization_notes),
  };
}

function normalizeImageItem(
  value: unknown,
  position: number,
  keyword: string,
): StoryboardFrame {
  const source = isRecord(value)
    ? (value as Partial<GeneratedContentImageItem>)
    : {};

  const index = Math.max(1, toInt(source.index, position + 1));
  const label = toText(source.title, `Image ${index}`);
  const description = toText(source.description);
  const prompt = toText(source.prompt);
  const imageStoreError = toText(source.image_store_error);
  const publicImageUrl = toText(source.image_url);
  const localPath = toText(source.local_path);
  const outputPath = toText(source.output_path) || localPath;

  const imageUrl =
    !imageStoreError && isPublicImageUrl(publicImageUrl)
      ? publicImageUrl
      : !imageStoreError && localPath
        ? toRelativeImageUrl(localPath)
        : "";

  return {
    id: `${toSlugSeed(keyword || label) || "frame"}-${index}-${position}`,
    index,
    timestamp: toTimestamp(index),
    label,
    narration: description || prompt,
    notes: [toText(source.style), toText(source.size)]
      .filter(Boolean)
      .join(" | "),
    imagePrompt: prompt,
    imageOutputPath: outputPath,
    imageUrl:
      imageUrl ||
      buildMockImageUrl(
        `${keyword}-${label}-${position}-${prompt || description}`,
      ),
    localPath,
    imageStoreError,
  };
}

function normalizePlatformPost(
  platform: string,
  value: unknown,
): NormalizedPlatformPost {
  const source = isRecord(value) ? value : {};

  return {
    platform,
    caption: toText(source.caption),
    hashtags: toStringArray(source.hashtags),
    cta: toText(source.cta),
    bestPostTime: toText(source.best_post_time),
    imageNotes:
      toText(source.image_notes) || toText(source.thumbnail_description),
  };
}

function normalizePublishing(value: unknown): NormalizedPublishing {
  const source = isRecord(value) ? value : {};

  return {
    defaultVisibility: toText(source.default_visibility, "public"),
    recommendedPlatforms: toStringArray(source.recommended_platforms),
    timezone: toText(source.timezone, "Asia/Saigon"),
    weeklyContentFrequency: Math.max(
      0,
      toInt(source.weekly_content_frequency, 0),
    ),
  };
}

function hasContent(post: NormalizedPlatformPost) {
  return (
    post.caption.length > 0 ||
    post.hashtags.length > 0 ||
    post.cta.length > 0 ||
    post.bestPostTime.length > 0 ||
    post.imageNotes.length > 0
  );
}

export function normalizeGeneratedContent(
  input: OrchestratorGeneratedContent | UnknownRecord | null | undefined,
): NormalizedGeneratedContent {
  const source = isRecord(input) ? input : {};

  const selectedKeyword = toText(source.selected_keyword);
  const postContent = normalizePostContent(source.post_content);
  const imageSetRaw = Array.isArray(source.image_set) ? source.image_set : [];
  const sections = imageSetRaw.map((item, index) =>
    normalizeImageItem(
      item,
      index,
      selectedKeyword || postContent.title || "image-story",
    ),
  );

  const platformPostsRaw = isRecord(source.platform_posts)
    ? source.platform_posts
    : {};
  const normalizedPosts = Object.entries(platformPostsRaw)
    .map(([platform, post]) => normalizePlatformPost(platform, post))
    .filter(hasContent);

  const publishing = normalizePublishing(source.publishing);
  const estimatedDurationSeconds = Math.max(sections.length, 1) * 10;

  return {
    selectedKeyword,
    mainTitle: toText(source.main_title, postContent.title),
    hook: postContent.hook,
    caption: postContent.caption,
    description: postContent.description,
    body: postContent.body,
    callToAction: postContent.call_to_action,
    tone: postContent.tone,
    hashtags: postContent.hashtags,
    personalizationNotes: postContent.personalization_notes,
    sections,
    platformPosts: normalizedPosts,
    publishing,
    hasError:
      Boolean(source.error) ||
      sections.some((section) => section.imageStoreError.length > 0),
    videoScriptTitle: postContent.title,
    durationEstimate: `${estimatedDurationSeconds}s`,
    captionsStyle: postContent.tone,
    musicMood: "",
    musicBackground: "",
  };
}

export function formatPlatformLabel(platform: string) {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "tiktok") {
    return "TikTok";
  }

  if (normalized === "facebook") {
    return "Facebook";
  }

  if (normalized === "instagram") {
    return "Instagram";
  }

  if (normalized === "youtube") {
    return "YouTube";
  }

  return platform;
}

export function toPublishingWindowTokens(value: string): string[] {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/[,&]|\sand\s/gi)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

export function summarizeCaptionLength(caption: string) {
  return caption.trim().length;
}
