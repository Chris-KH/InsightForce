import { useState } from "react";
import {
  CalendarClock,
  Hash,
  Loader2,
  PenTool,
  RefreshCw,
  Search,
} from "lucide-react";
import { Toaster, toast } from "sonner";

import {
  type GeneratedContentResponse,
  type TrendAnalysisRecordResponse,
  type TrendAnalyzeResultItem,
  useContentGenerateMutation,
} from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatPercentValue } from "@/lib/insight-formatters";
import { extractInterestValues } from "@/lib/trend-intelligence";
import { cn } from "@/lib/utils";

import type { BilingualCopy } from "./strategy-workspace.types";

type StrategySavedTrendHistoryPanelProps = {
  copy: BilingualCopy;
  records: TrendAnalysisRecordResponse[];
  selectedKeyword?: string;
  searchInput: string;
  isFetching: boolean;
  isSearchPending: boolean;
  searchError: string | null;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSelectKeyword: (keyword: string) => void;
};

function normalizeStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "completed") {
    return "completed";
  }

  if (normalized === "failed") {
    return "failed";
  }

  return "pending";
}

function statusBadgeClass(status: string) {
  const tone = normalizeStatus(status);

  if (tone === "completed") {
    return "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (tone === "failed") {
    return "border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  }

  return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function toInterestPreview(values: number[]) {
  if (values.length === 0) {
    return "--";
  }

  return values
    .slice(0, 6)
    .map((value) => value.toFixed(2))
    .join(" • ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function buildPostScriptPrompt(result: TrendAnalyzeResultItem) {
  return [
    `Tạo kịch bản bài post tiếng Việt cho keyword: ${result.main_keyword}.`,
    `Trend score: ${result.trend_score}.`,
    `Lý do trend: ${result.why_the_trend_happens || "khán giả đang quan tâm chủ đề này"}.`,
    `Hành động đề xuất: ${result.recommended_action || "biến insight thành nội dung dễ lưu và dễ chia sẻ"}.`,
    `Hashtags: ${result.top_hashtags.slice(0, 6).join(" ") || "#trend #creator"}.`,
    "Trả về post_content gồm hook, caption, body, call_to_action, hashtags và personalization_notes.",
  ].join(" ");
}

function formatGeneratedPostScript(
  response: GeneratedContentResponse,
  keyword: string,
  copy: BilingualCopy,
) {
  const postContent = response.post_content;

  if (!isRecord(postContent)) {
    return copy(
      `Generated post package is missing structured post_content fields for ${keyword}.`,
      `Gói nội dung tạo ra đang thiếu cấu trúc post_content cho ${keyword}.`,
    );
  }

  const title =
    toText(postContent.title) ||
    toText(response.main_title) ||
    copy(`Post draft for ${keyword}`, `Bản nháp cho ${keyword}`);
  const hook = toText(postContent.hook);
  const caption = toText(postContent.caption);
  const body = toText(postContent.body) || toText(postContent.description);
  const callToAction = toText(postContent.call_to_action);
  const hashtags = Array.isArray(postContent.hashtags)
    ? postContent.hashtags
        .map((tag) => toText(tag))
        .filter(Boolean)
        .join(" ")
    : "";
  const personalizationNotes = Array.isArray(postContent.personalization_notes)
    ? postContent.personalization_notes
        .map((note) => toText(note))
        .filter(Boolean)
        .join("\n- ")
    : "";

  return [
    title,
    hook,
    caption,
    body,
    callToAction,
    hashtags ? `Hashtags: ${hashtags}` : "",
    personalizationNotes
      ? `Personalization notes:\n- ${personalizationNotes}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function StrategySavedTrendHistoryPanel({
  copy,
  records,
  selectedKeyword,
  searchInput,
  isFetching,
  isSearchPending,
  searchError,
  onSearchInputChange,
  onSearchSubmit,
  onSelectKeyword,
}: StrategySavedTrendHistoryPanelProps) {
  const [isScriptSheetOpen, setIsScriptSheetOpen] = useState(false);
  const [scriptPreview, setScriptPreview] = useState("");
  const [scriptKeyword, setScriptKeyword] = useState("");
  const [activeScriptKey, setActiveScriptKey] = useState<string | null>(null);
  const contentGenerateMutation = useContentGenerateMutation();

  const handleGeneratePostScript = async (
    record: TrendAnalysisRecordResponse,
    result: TrendAnalyzeResultItem,
    resultIndex: number,
  ) => {
    const keyword = result.main_keyword.trim();
    if (!keyword) {
      return;
    }

    const key = `${record.analysis_id ?? record.created_at}-${keyword}-${resultIndex}`;
    setActiveScriptKey(key);
    setScriptKeyword(keyword);
    setScriptPreview("");
    setIsScriptSheetOpen(true);

    try {
      const generated = await contentGenerateMutation.mutateAsync({
        selected_keyword: keyword,
        trend_analysis_id: record.analysis_id ?? null,
        prompt: buildPostScriptPrompt(result),
      });

      setScriptPreview(formatGeneratedPostScript(generated, keyword, copy));
      toast.success(copy("Post script generated", "Đã tạo kịch bản bài post"));
    } catch {
      setScriptPreview("");
      toast.error(
        copy(
          "Unable to generate post script right now",
          "Chưa thể tạo kịch bản bài post lúc này",
        ),
      );
    } finally {
      setActiveScriptKey(null);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <PanelCard
        title={copy("Saved Trend Sessions", "Lịch sử phân tích xu hướng")}
        description={copy(
          "Rendered directly from GET /api/v1/trends/history with all key item fields.",
          "Render trực tiếp từ GET /api/v1/trends/history với đầy đủ các trường chính của item.",
        )}
      >
        <div className="mb-4 rounded-2xl border border-border/70 bg-background/70 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => {
                  onSearchInputChange(event.target.value);
                }}
                placeholder={copy(
                  "Search saved trend history",
                  "Tìm trong lịch sử xu hướng đã lưu",
                )}
                className="h-11 rounded-xl pl-9"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onSearchSubmit();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              className="h-11 rounded-xl"
              disabled={isSearchPending || searchInput.trim().length === 0}
              onClick={onSearchSubmit}
            >
              {isSearchPending ? (
                <RefreshCw data-icon="inline-start" className="animate-spin" />
              ) : (
                <Search data-icon="inline-start" />
              )}
              {isSearchPending
                ? copy("Searching", "Đang tìm")
                : copy("Search history", "Tìm lịch sử")}
            </Button>
          </div>

          {searchError ? (
            <p className="mt-2 text-sm text-destructive">{searchError}</p>
          ) : null}
        </div>

        {records.length === 0 ? (
          <InlineQueryState
            state={isFetching ? "loading" : "empty"}
            message={
              isFetching
                ? copy(
                    "Loading saved trend history...",
                    "Đang tải lịch sử phân tích xu hướng...",
                  )
                : copy(
                    "No saved trend analysis yet for this user.",
                    "Chưa có dữ liệu trend đã lưu cho user này.",
                  )
            }
          />
        ) : (
          <ScrollArea className="h-[32rem] pr-2">
            <div className="grid gap-3">
              {records.map((record, index) => {
                const isSelected = record.results.some(
                  (result) => result.main_keyword === selectedKeyword,
                );

                return (
                  <article
                    key={record.analysis_id ?? `${record.created_at}-${index}`}
                    className={cn(
                      "rounded-2xl border border-border/65 bg-background/60 p-4 text-sm transition-colors",
                      isSelected &&
                        "border-primary/35 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.15)_inset]",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Hash className="size-3" />
                        {record.analysis_id ?? "--"}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full",
                            statusBadgeClass(record.status),
                          )}
                        >
                          {record.status}
                        </Badge>
                        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarClock className="size-3" />
                          {formatDateTime(record.created_at)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-base font-semibold text-foreground">
                      {record.query || "--"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {record.markdown_summary ||
                        copy(
                          "No markdown summary provided for this analysis.",
                          "Phân tích này chưa có markdown summary.",
                        )}
                    </p>

                    <div className="mt-3 grid gap-2">
                      {record.results.map((result, resultIndex) => {
                        const keyword = result.main_keyword;
                        const interestPreview = toInterestPreview(
                          extractInterestValues(result),
                        );
                        const hashTags = result.top_hashtags?.join(" ") || "--";
                        const scriptKey = `${record.analysis_id ?? record.created_at}-${keyword}-${resultIndex}`;
                        const isGenerating = activeScriptKey === scriptKey;
                        const isKeywordSelected = selectedKeyword === keyword;

                        return (
                          <div
                            key={scriptKey}
                            className={cn(
                              "rounded-xl border border-border/55 bg-background/55 p-3 text-xs transition-colors",
                              isKeywordSelected &&
                                "border-primary/35 bg-primary/5",
                            )}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <button
                                type="button"
                                className="min-w-0 text-left"
                                onClick={() => {
                                  onSelectKeyword(keyword);
                                }}
                              >
                                <span className="block text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
                                  {copy("Topic", "Chủ đề")}
                                </span>
                                <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
                                  {keyword}
                                </span>
                              </button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="shrink-0 rounded-xl"
                                disabled={contentGenerateMutation.isPending}
                                onClick={() => {
                                  void handleGeneratePostScript(
                                    record,
                                    result,
                                    resultIndex,
                                  );
                                }}
                              >
                                {isGenerating ? (
                                  <Loader2
                                    data-icon="inline-start"
                                    className="animate-spin"
                                  />
                                ) : (
                                  <PenTool data-icon="inline-start" />
                                )}
                                {copy(
                                  "Create post script",
                                  "Tạo kịch bản bài post",
                                )}
                              </Button>
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              <p>
                                <span className="font-semibold text-foreground">
                                  {copy("trend_score", "trend_score")}
                                </span>
                                : {formatPercentValue(result.trend_score)}
                              </p>
                              <p>
                                <span className="font-semibold text-foreground">
                                  {copy("views/hour", "views/hour")}
                                </span>
                                : {Math.round(result.avg_views_per_hour)}
                              </p>
                              <p className="sm:col-span-2">
                                <span className="font-semibold text-foreground">
                                  {copy(
                                    "interest_over_day",
                                    "interest_over_day",
                                  )}
                                </span>
                                : {interestPreview}
                              </p>
                              <p className="sm:col-span-2">
                                <span className="font-semibold text-foreground">
                                  {copy(
                                    "recommended_action",
                                    "recommended_action",
                                  )}
                                </span>
                                : {result.recommended_action || "--"}
                              </p>
                              <p className="sm:col-span-2">
                                <span className="font-semibold text-foreground">
                                  {copy("top_hashtags", "top_hashtags")}
                                </span>
                                : {hashTags}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PanelCard>

      <Sheet open={isScriptSheetOpen} onOpenChange={setIsScriptSheetOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {copy("Post Script Draft", "Bản nháp kịch bản bài post")}
            </SheetTitle>
            <SheetDescription>
              {scriptKeyword
                ? copy(
                    `Generated from trend keyword: ${scriptKeyword}`,
                    `Tạo từ keyword xu hướng: ${scriptKeyword}`,
                  )
                : copy(
                    "Generated from the selected trend keyword.",
                    "Tạo từ keyword xu hướng đã chọn.",
                  )}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              {contentGenerateMutation.isPending ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                  <Skeleton className="h-4 w-9/12" />
                </div>
              ) : (
                <div className="max-h-[55vh] overflow-auto text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {scriptPreview ||
                    copy(
                      "Your generated post script will appear here.",
                      "Kịch bản bài post được tạo sẽ hiển thị tại đây.",
                    )}
                </div>
              )}
            </div>

            <SheetFooter className="px-0 pb-0">
              <Button
                type="button"
                className="w-full rounded-xl"
                disabled={!scriptPreview}
              >
                {copy("Edit Full Script", "Chỉnh sửa kịch bản đầy đủ")}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
