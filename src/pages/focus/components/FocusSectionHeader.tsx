import type { LucideIcon } from "lucide-react";

import { SectionHeader } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { useBilingual } from "@/hooks/use-bilingual";

type LocalizedText = {
  en: string;
  vi: string;
};

type FocusSectionHeaderProps = {
  title: LocalizedText;
  description: LocalizedText;
  badge: LocalizedText;
  icon: LucideIcon;
  eyebrow?: LocalizedText;
  badgeClassName?: string;
};

export function FocusSectionHeader({
  title,
  description,
  badge,
  icon: Icon,
  eyebrow = { en: "Deep-Dive Workspace", vi: "Không gian chuyên sâu" },
  badgeClassName = "rounded-full border-primary/30 text-primary",
}: FocusSectionHeaderProps) {
  const copy = useBilingual();

  return (
    <SectionHeader
      eyebrow={copy(eyebrow.en, eyebrow.vi)}
      title={copy(title.en, title.vi)}
      description={copy(description.en, description.vi)}
      action={
        <Badge variant="outline" className={badgeClassName}>
          <Icon className="mr-1.5 size-3.5" />
          {copy(badge.en, badge.vi)}
        </Badge>
      }
    />
  );
}
