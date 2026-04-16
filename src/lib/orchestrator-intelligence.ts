import type {
  GeneratedContentThumbnail,
  OrchestratorGeneratedContent,
} from "@/api/types";

type UnknownRecord = Record<string, unknown>;

export type StoryboardFrame = {
  id: string;
  timestamp: string;
  label: string;
  narration: string;
  notes: string;
  thumbnailPrompt: string;
  thumbnailOutputPath: string;
  imageUrl: string;
};

export type NormalizedPlatformPost = {
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  bestPostTime: string;
  thumbnailDescription: string;
};

export type NormalizedGeneratedContent = {
  selectedKeyword: string;
  mainTitle: string;
  videoScriptTitle: string;
  durationEstimate: string;
  hook: string;
  callToAction: string;
  captionsStyle: string;
  musicMood: string;
  musicBackground: string;
  sections: StoryboardFrame[];
  platformPosts: NormalizedPlatformPost[];
  thumbnail: GeneratedContentThumbnail | null;
  hasError: boolean;
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

function normalizeThumbnail(value: unknown): GeneratedContentThumbnail | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    prompt: toText(value.prompt),
    style: toText(value.style, "vivid"),
    size: toText(value.size, "1792x1024"),
    output_path: toText(value.output_path),
  };
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
    thumbnailDescription: toText(source.thumbnail_description),
  };
}

function normalizeSection(
  value: unknown,
  index: number,
  keyword: string,
): StoryboardFrame {
  const source = isRecord(value) ? value : {};
  const sectionThumbnail = normalizeThumbnail(source.thumbnail);

  const label = toText(source.label, `Section ${index + 1}`);
  const timestamp = toText(
    source.timestamp,
    `0:${String(index * 10).padStart(2, "0")}`,
  );
  const narration = toText(source.narration);
  const notes = toText(source.notes);
  const thumbnailOutputPath = sectionThumbnail?.output_path ?? "";

  return {
    id: `${toSlugSeed(keyword) || "story"}-${index}`,
    timestamp,
    label,
    narration,
    notes,
    thumbnailPrompt: sectionThumbnail?.prompt ?? "",
    thumbnailOutputPath,
    imageUrl: isPublicImageUrl(thumbnailOutputPath)
      ? thumbnailOutputPath
      : buildMockImageUrl(`${keyword}-${label}-${timestamp}-${index}`),
  };
}

function hasContent(post: NormalizedPlatformPost) {
  return (
    post.caption.length > 0 ||
    post.hashtags.length > 0 ||
    post.cta.length > 0 ||
    post.bestPostTime.length > 0
  );
}

export function normalizeGeneratedContent(
  input: OrchestratorGeneratedContent | UnknownRecord | null | undefined,
): NormalizedGeneratedContent {
  const source = isRecord(input) ? input : {};
  const videoScript = isRecord(source.video_script) ? source.video_script : {};
  const platformPosts = isRecord(source.platform_posts)
    ? source.platform_posts
    : {};

  const selectedKeyword = toText(source.selected_keyword);
  const sectionsRaw = Array.isArray(videoScript.sections)
    ? videoScript.sections
    : [];

  const sections = sectionsRaw.map((section, index) =>
    normalizeSection(section, index, selectedKeyword || "content-story"),
  );

  const normalizedPosts = Object.entries(platformPosts)
    .map(([platform, post]) => normalizePlatformPost(platform, post))
    .filter(hasContent);

  return {
    selectedKeyword,
    mainTitle: toText(source.main_title, toText(videoScript.title)),
    videoScriptTitle: toText(videoScript.title),
    durationEstimate: toText(videoScript.duration_estimate, "60s"),
    hook: toText(videoScript.hook),
    callToAction: toText(videoScript.call_to_action),
    captionsStyle: toText(videoScript.captions_style),
    musicMood: toText(videoScript.music_mood),
    musicBackground: toText(source.music_background),
    sections,
    platformPosts: normalizedPosts,
    thumbnail: normalizeThumbnail(source.thumbnail),
    hasError: Boolean(source.error),
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
