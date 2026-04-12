type PlatformVisualTone = {
  label: string;
  icon: string;
  badgeClassName: string;
  surfaceClassName: string;
};

const platformVisualTones = {
  tiktok: {
    label: "TikTok",
    icon: "simple-icons:tiktok",
    badgeClassName:
      "border-[#25F4EE]/55 bg-linear-to-r from-[#25F4EE]/22 via-[#EE1D52]/14 to-[#25F4EE]/10 text-[#0f172a] shadow-[0_0_0_1px_rgba(37,244,238,0.18)_inset] dark:border-[#25F4EE]/42 dark:from-[#25F4EE]/18 dark:via-[#0f172a]/45 dark:to-[#EE1D52]/16 dark:text-[#d9fbff]",
    surfaceClassName:
      "border-[#25F4EE]/30 bg-linear-to-br from-[#25F4EE]/14 via-background/80 to-[#EE1D52]/10 dark:border-[#25F4EE]/28 dark:from-[#25F4EE]/12 dark:via-background/85 dark:to-[#EE1D52]/10",
  },
  youtube: {
    label: "YouTube",
    icon: "simple-icons:youtube",
    badgeClassName:
      "border-[#FF0033]/55 bg-linear-to-r from-[#FF0033]/20 via-[#ff4d6d]/14 to-[#ff0033]/10 text-[#8f1236] shadow-[0_0_0_1px_rgba(255,0,51,0.14)_inset] dark:border-[#FF0033]/42 dark:from-[#FF0033]/18 dark:via-[#0f172a]/45 dark:to-[#ff4d6d]/14 dark:text-[#ff9eb2]",
    surfaceClassName:
      "border-[#FF0033]/28 bg-linear-to-br from-[#FF0033]/14 via-background/80 to-[#ff8aa3]/10 dark:border-[#FF0033]/25 dark:from-[#FF0033]/12 dark:via-background/85 dark:to-[#ff5f82]/10",
  },
} as const satisfies Record<string, PlatformVisualTone>;

const fallbackTone: PlatformVisualTone = {
  label: "Platform",
  icon: "solar:widget-bold",
  badgeClassName:
    "border-primary/35 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/12",
  surfaceClassName:
    "border-primary/20 bg-linear-to-br from-primary/8 via-background/84 to-primary/5 dark:from-primary/10 dark:via-background/86 dark:to-primary/8",
};

function normalizePlatform(
  platform: string,
): keyof typeof platformVisualTones | null {
  const value = platform.trim().toLowerCase();

  if (value === "tiktok" || value === "youtube") {
    return value;
  }

  return null;
}

export function getPlatformTone(platform: string): PlatformVisualTone {
  const normalized = normalizePlatform(platform);
  return normalized ? platformVisualTones[normalized] : fallbackTone;
}

export function getPlatformLabel(platform: string): string {
  const normalized = normalizePlatform(platform);
  if (!normalized) {
    return platform.trim() || fallbackTone.label;
  }

  return platformVisualTones[normalized].label;
}

export function getPlatformBadgeClassName(platform: string): string {
  return getPlatformTone(platform).badgeClassName;
}

export function getPlatformSurfaceClassName(platform: string): string {
  return getPlatformTone(platform).surfaceClassName;
}

export function getPlatformIcon(platform: string): string {
  return getPlatformTone(platform).icon;
}
