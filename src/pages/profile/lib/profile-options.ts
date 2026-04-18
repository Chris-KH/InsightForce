import type { UserVoiceTone } from "@/api/types";

type LocalizedOption<T extends string | number> = {
  value: T;
  label: {
    en: string;
    vi: string;
  };
};

export const CONTENT_GROUP_OPTIONS: LocalizedOption<string>[] = [
  {
    value: "Mẹo vặt cuộc sống",
    label: { en: "Daily Life Hacks", vi: "Mẹo vặt cuộc sống" },
  },
  {
    value: "Lifehack gia đình",
    label: { en: "Family Life Hacks", vi: "Lifehack gia đình" },
  },
  {
    value: "Tổ chức nhà cửa",
    label: { en: "Home Organization", vi: "Tổ chức nhà cửa" },
  },
  {
    value: "Thói quen cá nhân",
    label: { en: "Personal Habits", vi: "Thói quen cá nhân" },
  },
  {
    value: "Câu chuyện giáo dục",
    label: { en: "Educational Stories", vi: "Câu chuyện giáo dục" },
  },
  {
    value: "Kỹ năng sống",
    label: { en: "Life Skills", vi: "Kỹ năng sống" },
  },
];

export const PRIORITY_FORMAT_OPTIONS: LocalizedOption<string>[] = [
  {
    value: "Bài post nhiều ảnh",
    label: { en: "Carousel Post", vi: "Bài post nhiều ảnh" },
  },
  {
    value: "Chuỗi bài viết",
    label: { en: "Thread", vi: "Chuỗi bài viết" },
  },
  {
    value: "Video ngắn",
    label: { en: "Short Video", vi: "Video ngắn" },
  },
  {
    value: "Video dài",
    label: { en: "Long Video", vi: "Video dài" },
  },
  {
    value: "Ảnh đơn",
    label: { en: "Single Image", vi: "Ảnh đơn" },
  },
  {
    value: "Phát trực tiếp",
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
    value: "Asia/Saigon",
    label: { en: "GMT+7 (Saigon)", vi: "GMT+7 (Sài Gòn)" },
  },
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

export const WEEKLY_CONTENT_FREQUENCY_OPTIONS: LocalizedOption<number>[] = [
  { value: 3, label: { en: "3 posts/week", vi: "3 bài/tuần" } },
  { value: 4, label: { en: "4 posts/week", vi: "4 bài/tuần" } },
  { value: 5, label: { en: "5 posts/week", vi: "5 bài/tuần" } },
  { value: 6, label: { en: "6 posts/week", vi: "6 bài/tuần" } },
  { value: 7, label: { en: "7 posts/week", vi: "7 bài/tuần" } },
  {
    value: 14,
    label: { en: "2 posts/day", vi: "2 bài/ngày" },
  },
];

export function localizeOptionLabel<T extends string | number>(
  option: LocalizedOption<T>,
  copy: (en: string, vi: string) => string,
) {
  return copy(option.label.en, option.label.vi);
}
