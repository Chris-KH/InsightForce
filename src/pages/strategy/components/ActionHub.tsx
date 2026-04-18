import { useEffect, useMemo, useState } from "react";
import { BookmarkPlus, Check, Loader2, PenTool, Send } from "lucide-react";
import { Toaster, toast } from "sonner";

import {
  type GeneratedContentResponse,
  useContentGenerateMutation,
} from "@/api";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formatPercentValue } from "@/lib/insight-formatters";

import type { BilingualCopy, TrendTopic } from "./strategy-workspace.types";

type ActionHubProps = {
  copy: BilingualCopy;
  selectedTopic?: TrendTopic;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function buildScriptPrompt(topic: TrendTopic) {
  return [
    `Create a Vietnamese multi-image social post about: ${topic.keyword}.`,
    `Goal: maximize retention and conversion while keeping the message practical.`,
    `Trend score: ${topic.trendScore}.`,
    `Growth momentum: ${topic.growthPercent.toFixed(1)}%.`,
    `Return post_content with hook, caption, body, call_to_action, hashtags, and personalization_notes.`,
  ].join(" ");
}

function formatGeneratedScript(
  response: GeneratedContentResponse,
  topic: TrendTopic,
  copy: BilingualCopy,
) {
  const postContent = response.post_content;

  if (isRecord(postContent)) {
    const title =
      toText(postContent.title) ||
      toText(response.main_title) ||
      copy(`Post draft for ${topic.keyword}`, `Bản nháp cho ${topic.keyword}`);
    const hook = toText(postContent.hook);
    const caption = toText(postContent.caption);
    const body = toText(postContent.body);
    const callToAction = toText(postContent.call_to_action);
    const hashtags = Array.isArray(postContent.hashtags)
      ? postContent.hashtags
          .map((tag) => toText(tag))
          .filter(Boolean)
          .join(" ")
      : "";
    const personalizationNotes = Array.isArray(
      postContent.personalization_notes,
    )
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

  return copy(
    `Generated post package is missing structured post_content fields for ${topic.keyword}.`,
    `Gói nội dung tạo ra đang thiếu cấu trúc post_content cho ${topic.keyword}.`,
  );
}

export function ActionHub({ copy, selectedTopic }: ActionHubProps) {
  const [isScriptSheetOpen, setIsScriptSheetOpen] = useState(false);
  const [isEditorDialogOpen, setIsEditorDialogOpen] = useState(false);
  const [editorEmail, setEditorEmail] = useState("");
  const [scriptPreview, setScriptPreview] = useState("");
  const [isSavingBacklog, setIsSavingBacklog] = useState(false);
  const [isBacklogSaved, setIsBacklogSaved] = useState(false);

  const contentGenerateMutation = useContentGenerateMutation();

  useEffect(() => {
    if (!isBacklogSaved) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsBacklogSaved(false);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isBacklogSaved]);

  const editorBrief = useMemo(() => {
    if (!selectedTopic) {
      return "Topic: --\nGoal: High retention\nHook: --\nCTA: --";
    }

    const topHashtags = selectedTopic.hashtags.slice(0, 3).join(" ");

    return [
      `Topic: ${selectedTopic.keyword}`,
      `Goal: High retention + conversion intent`,
      `Hook: Start with a high-friction question about ${selectedTopic.keyword}.`,
      `Content Angle: ${selectedTopic.why || "Turn trend insight into a practical action."}`,
      `CTA: Ask viewers to save and comment for part 2.`,
      `Hashtags: ${topHashtags || "#trend #creator #insight"}`,
    ].join("\n");
  }, [selectedTopic]);

  const handleGenerateScript = async () => {
    setIsScriptSheetOpen(true);

    if (!selectedTopic) {
      return;
    }

    setScriptPreview("");

    try {
      // Uses the real backend endpoint: POST /api/v1/contents/generate.
      const generated = await contentGenerateMutation.mutateAsync({
        selected_keyword: selectedTopic.keyword,
        prompt: buildScriptPrompt(selectedTopic),
      });

      setScriptPreview(formatGeneratedScript(generated, selectedTopic, copy));
    } catch {
      setScriptPreview("");
      toast.error(
        copy(
          "Unable to generate script right now",
          "Chưa thể tạo kịch bản lúc này",
        ),
      );
    }
  };

  const handleSendToEditor = () => {
    if (!selectedTopic) {
      return;
    }

    if (!editorEmail.trim()) {
      toast.error(
        copy("Please enter editor email", "Vui lòng nhập email biên tập"),
      );
      return;
    }

    // TODO: Backend has no dedicated "send editor brief" endpoint yet.
    // Replace this local success flow with a real API call when endpoint is available.
    setIsEditorDialogOpen(false);
    setEditorEmail("");
    toast.success(copy("Brief sent to editor", "Đã gửi brief cho biên tập"));
  };

  const handleSaveToBacklog = async () => {
    if (!selectedTopic || isSavingBacklog) {
      return;
    }

    setIsSavingBacklog(true);
    setIsBacklogSaved(false);

    // TODO: Replace with real backlog endpoint once backend supports trend backlog persistence.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    setIsSavingBacklog(false);
    setIsBacklogSaved(true);
    toast.success("Trend saved to your backlog");
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <PanelCard
        title={copy("Action Hub", "Trung tâm hành động")}
        description={copy(
          "Focused insight and one-click next steps for your selected trend.",
          "Insight trọng tâm và hành động 1 chạm cho xu hướng bạn đã chọn.",
        )}
      >
        {selectedTopic ? (
          <div className="flex flex-col gap-4">
            <Card className="border-primary/22 bg-primary/8" size="sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{selectedTopic.keyword}</CardTitle>
                    <CardDescription>
                      {copy("Deep dive insight", "Insight chuyên sâu")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30"
                  >
                    {formatPercentValue(selectedTopic.trendScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>
                  {selectedTopic.why ||
                    copy(
                      `${selectedTopic.keyword} is gaining audience attention and creator demand.`,
                      `${selectedTopic.keyword} đang thu hút mạnh sự chú ý của khán giả và nhu cầu nội dung từ creator.`,
                    )}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => {
                  void handleGenerateScript();
                }}
              >
                <PenTool data-icon="inline-start" />
                {copy("Generate Video Script", "Tạo kịch bản video")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setIsEditorDialogOpen(true);
                }}
              >
                <Send data-icon="inline-start" />
                {copy("Send to Editor", "Gửi cho biên tập")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  void handleSaveToBacklog();
                }}
                disabled={isSavingBacklog}
              >
                {isSavingBacklog ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : isBacklogSaved ? (
                  <Check data-icon="inline-start" className="text-green-500" />
                ) : (
                  <BookmarkPlus data-icon="inline-start" />
                )}
                {isSavingBacklog
                  ? copy("Saving...", "Đang lưu...")
                  : copy("Save to Backlog", "Lưu vào backlog")}
              </Button>
            </div>
          </div>
        ) : (
          <InlineQueryState
            state="empty"
            message={copy(
              "Select a trend card to open insight and action controls.",
              "Chọn một thẻ xu hướng để mở insight và các hành động.",
            )}
          />
        )}
      </PanelCard>

      <Sheet open={isScriptSheetOpen} onOpenChange={setIsScriptSheetOpen}>
        <SheetContent side="right" className="w-full max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {copy("Content Architect Agent", "Content Architect Agent")}
            </SheetTitle>
            <SheetDescription>
              {copy(
                "AI is drafting your script based on audience insights...",
                "AI đang soạn kịch bản dựa trên insight khán giả...",
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
                      "Your generated script preview will appear here.",
                      "Bản xem trước kịch bản sẽ hiển thị tại đây.",
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

      <Dialog open={isEditorDialogOpen} onOpenChange={setIsEditorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {copy("Draft Editor Brief", "Bản nháp brief cho biên tập")}
            </DialogTitle>
            <DialogDescription>
              {copy(
                "Share a concise production brief with your editor.",
                "Gửi brief sản xuất ngắn gọn cho biên tập viên.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Textarea value={editorBrief} disabled className="min-h-40" />
            <Input
              type="email"
              value={editorEmail}
              placeholder="Enter editor's email"
              onChange={(event) => {
                setEditorEmail(event.target.value);
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSendToEditor}>
              <Send data-icon="inline-start" />
              {copy("Send Brief", "Gửi brief")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
