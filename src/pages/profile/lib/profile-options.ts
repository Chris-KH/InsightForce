import type {
  UserContentCategory,
  UserContentFormat,
  UserVoiceTone,
} from "@/api/types";

type LocalizedOption<T extends string> = {
  value: T;
  label: {
    en: string;
    vi: string;
  };
};

export const CONTENT_CATEGORY_OPTIONS: LocalizedOption<UserContentCategory>[] =
  [
    { value: "wellness", label: { en: "Wellness", vi: "Sức khỏe" } },
    { value: "education", label: { en: "Education", vi: "Giáo dục" } },
    { value: "finance", label: { en: "Finance", vi: "Tài chính" } },
    { value: "lifestyle", label: { en: "Lifestyle", vi: "Phong cách sống" } },
    { value: "technology", label: { en: "Technology", vi: "Công nghệ" } },
    { value: "business", label: { en: "Business", vi: "Kinh doanh" } },
  ];

export const CONTENT_FORMAT_OPTIONS: LocalizedOption<UserContentFormat>[] = [
  {
    value: "short_video",
    label: { en: "Short Video", vi: "Video ngắn" },
  },
  {
    value: "long_video",
    label: { en: "Long Video", vi: "Video dài" },
  },
  {
    value: "carousel",
    label: { en: "Carousel", vi: "Bài nhiều ảnh" },
  },
  {
    value: "single_image",
    label: { en: "Single Image", vi: "Ảnh đơn" },
  },
  { value: "thread", label: { en: "Thread", vi: "Chuỗi bài viết" } },
  {
    value: "live_stream",
    label: { en: "Live Stream", vi: "Phát trực tiếp" },
  },
];

export const VOICE_TONE_OPTIONS: LocalizedOption<UserVoiceTone>[] = [
  { value: "mentor", label: { en: "Mentor", vi: "Định hướng" } },
  { value: "expert", label: { en: "Expert", vi: "Chuyên gia" } },
  { value: "friendly", label: { en: "Friendly", vi: "Thân thiện" } },
  { value: "playful", label: { en: "Playful", vi: "Sinh động" } },
  {
    value: "data_driven",
    label: { en: "Data-driven", vi: "Dựa trên dữ liệu" },
  },
];

export const CONTENT_REVIEW_MODE_OPTIONS: LocalizedOption<
  "balanced" | "strict" | "fast"
>[] = [
  { value: "balanced", label: { en: "Balanced", vi: "Cân bằng" } },
  { value: "strict", label: { en: "Strict", vi: "Chặt chẽ" } },
  { value: "fast", label: { en: "Fast", vi: "Nhanh" } },
];

export const LANGUAGE_OPTIONS: LocalizedOption<string>[] = [
  { value: "vi", label: { en: "Vietnamese", vi: "Tiếng Việt" } },
  { value: "en", label: { en: "English", vi: "Tiếng Anh" } },
  { value: "vi-en", label: { en: "Vietnamese + English", vi: "Việt + Anh" } },
];

export const TIMEZONE_OPTIONS: LocalizedOption<string>[] = [
  {
    value: "Asia/Ho_Chi_Minh",
    label: { en: "GMT+7 (Ho Chi Minh)", vi: "GMT+7 (TP.HCM)" },
  },
  {
    value: "Asia/Bangkok",
    label: { en: "GMT+7 (Bangkok)", vi: "GMT+7 (Bangkok)" },
  },
  {
    value: "Asia/Singapore",
    label: { en: "GMT+8 (Singapore)", vi: "GMT+8 (Singapore)" },
  },
  {
    value: "America/Los_Angeles",
    label: { en: "PST (Los Angeles)", vi: "PST (Los Angeles)" },
  },
];

export const POSTING_CADENCE_OPTIONS: LocalizedOption<string>[] = [
  { value: "3 posts/week", label: { en: "3 posts/week", vi: "3 bài/tuần" } },
  { value: "5 posts/week", label: { en: "5 posts/week", vi: "5 bài/tuần" } },
  { value: "daily", label: { en: "Daily", vi: "Hằng ngày" } },
  {
    value: "campaign-based",
    label: { en: "Campaign-based", vi: "Theo chiến dịch" },
  },
];

export function localizeOptionLabel<T extends string>(
  option: LocalizedOption<T>,
  copy: (en: string, vi: string) => string,
) {
  return copy(option.label.en, option.label.vi);
}
