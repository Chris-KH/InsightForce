import { WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type PromptSuggestionBarProps = {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  copy?: (en: string, vi: string) => string;
};

export function PromptSuggestionBar({
  suggestions,
  onSelect,
  copy,
}: PromptSuggestionBarProps) {
  const t = copy ?? ((en: string) => en);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {t("Prompt Suggestions", "Gợi ý prompt")}
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="max-w-full truncate"
            onClick={() => onSelect(suggestion)}
          >
            <WandSparkles data-icon="inline-start" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
