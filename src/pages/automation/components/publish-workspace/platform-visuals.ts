import type { UploadPostPublishPlatform } from "@/api";

export type PublishingPlatformVisual = {
  label: string;
  icon: string;
  chipClassName: string;
};

export const PUBLISHING_PLATFORM_VISUALS: Record<
  UploadPostPublishPlatform,
  PublishingPlatformVisual
> = {
  tiktok: {
    label: "TikTok",
    icon: "simple-icons:tiktok",
    chipClassName:
      "border-[#25F4EE]/45 bg-[#25F4EE]/12 text-[#0e7490] dark:text-[#67e8f9]",
  },
  instagram: {
    label: "Instagram",
    icon: "simple-icons:instagram",
    chipClassName:
      "border-[#E4405F]/35 bg-[#E4405F]/10 text-[#be123c] dark:text-[#fda4af]",
  },
  youtube: {
    label: "YouTube",
    icon: "simple-icons:youtube",
    chipClassName:
      "border-[#FF0000]/35 bg-[#FF0000]/10 text-[#b91c1c] dark:text-[#fda4af]",
  },
  facebook: {
    label: "Facebook",
    icon: "simple-icons:facebook",
    chipClassName:
      "border-[#1877F2]/35 bg-[#1877F2]/10 text-[#1d4ed8] dark:text-[#93c5fd]",
  },
  x: {
    label: "X",
    icon: "simple-icons:x",
    chipClassName:
      "border-border/70 bg-background/85 text-foreground dark:bg-background/65",
  },
  threads: {
    label: "Threads",
    icon: "simple-icons:threads",
    chipClassName:
      "border-border/70 bg-background/85 text-foreground dark:bg-background/65",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "simple-icons:linkedin",
    chipClassName:
      "border-[#0A66C2]/35 bg-[#0A66C2]/10 text-[#1d4ed8] dark:text-[#93c5fd]",
  },
  bluesky: {
    label: "Bluesky",
    icon: "simple-icons:bluesky",
    chipClassName:
      "border-[#0285FF]/35 bg-[#0285FF]/10 text-[#0369a1] dark:text-[#7dd3fc]",
  },
  reddit: {
    label: "Reddit",
    icon: "simple-icons:reddit",
    chipClassName:
      "border-[#FF4500]/35 bg-[#FF4500]/10 text-[#c2410c] dark:text-[#fdba74]",
  },
  pinterest: {
    label: "Pinterest",
    icon: "simple-icons:pinterest",
    chipClassName:
      "border-[#E60023]/35 bg-[#E60023]/10 text-[#be123c] dark:text-[#fda4af]",
  },
  google_business: {
    label: "Google Business",
    icon: "simple-icons:googlebusinessprofile",
    chipClassName:
      "border-[#34A853]/35 bg-[#34A853]/10 text-[#15803d] dark:text-[#86efac]",
  },
};

export function getPublishingPlatformVisual(
  platform: UploadPostPublishPlatform,
) {
  return PUBLISHING_PLATFORM_VISUALS[platform];
}
