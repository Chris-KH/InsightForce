import { useTranslation } from "react-i18next";

export type SupportedLocale = "en" | "vi";

function normalizeLocale(language: string | undefined): SupportedLocale {
  if (!language) {
    return "en";
  }

  return language.startsWith("vi") ? "vi" : "en";
}

export function useLocale() {
  const { i18n } = useTranslation();
  const locale = normalizeLocale(i18n.resolvedLanguage || i18n.language);

  return {
    locale,
    isVietnamese: locale === "vi",
  };
}
