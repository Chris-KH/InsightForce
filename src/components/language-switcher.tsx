import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type SupportedLocale, useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
  triggerVariant?: "ghost" | "outline";
};

const LANGUAGE_OPTIONS: Array<{
  code: SupportedLocale;
  labelKey: "common.english" | "common.vietnamese";
}> = [
  { code: "en", labelKey: "common.english" },
  { code: "vi", labelKey: "common.vietnamese" },
];

export function LanguageSwitcher({
  className,
  compact = false,
  triggerVariant = "outline",
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const { locale } = useLocale();

  const changeLanguage = (nextLocale: SupportedLocale) => {
    void i18n.changeLanguage(nextLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={compact ? "icon-sm" : "sm"}
          className={cn(!compact && "rounded-full px-3.5", className)}
          aria-label={t("common.language")}
        >
          <Languages className="size-4" />
          {!compact ? (
            <span className="text-xs font-semibold">
              {locale.toUpperCase()}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            className={cn(
              "cursor-pointer",
              locale === option.code && "text-primary",
            )}
            onClick={() => changeLanguage(option.code)}
          >
            <span>{t(option.labelKey)}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {option.code.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
