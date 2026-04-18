import { RefreshCw, Search, Sparkles } from "lucide-react";

import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { BilingualCopy } from "./strategy-workspace.types";

type StrategyScoutComposerPanelProps = {
  copy: BilingualCopy;
  promptInput: string;
  isPending: boolean;
  aiStatus: string;
  suggestions: string[];
  onPromptInputChange: (value: string) => void;
  onPromptSubmit: () => void;
  onSuggestionSelect: (suggestion: string) => void;
};

export function StrategyScoutComposerPanel({
  copy,
  promptInput,
  isPending,
  aiStatus,
  suggestions,
  onPromptInputChange,
  onPromptSubmit,
  onSuggestionSelect,
}: StrategyScoutComposerPanelProps) {
  return (
    <PanelCard
      title={copy("AI Trend Scout", "AI Trend Scout")}
      description={copy(
        "Ask for a trend direction in plain language. Insight Forge will scout and rank opportunities for you.",
        "Hãy nhập yêu cầu theo ngôn ngữ tự nhiên. Insight Forge sẽ quét và xếp hạng cơ hội cho bạn.",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={promptInput}
                onChange={(event) => {
                  onPromptInputChange(event.target.value);
                }}
                placeholder={copy(
                  "Find health trends in Vietnam",
                  "Tìm xu hướng sức khỏe tại Việt Nam",
                )}
                className="h-11 rounded-xl pl-9"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onPromptSubmit();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              className="h-11 rounded-xl"
              onClick={onPromptSubmit}
              disabled={isPending || promptInput.trim().length === 0}
            >
              <Sparkles data-icon="inline-start" />
              {copy("Scout Trends", "Quét xu hướng")}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
          <Badge variant="outline" className="rounded-full border-primary/25">
            {isPending ? (
              <RefreshCw className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 size-3.5" />
            )}
            {copy("AI Status", "Trạng thái AI")}
          </Badge>
          <p className="text-sm text-muted-foreground">{aiStatus}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={isPending}
              onClick={() => {
                onSuggestionSelect(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
