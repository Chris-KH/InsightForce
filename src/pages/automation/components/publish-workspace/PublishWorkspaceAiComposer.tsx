import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Bot, Loader2, SendHorizontal, Sparkles } from "lucide-react";

import {
  type GeneratedContentResponse,
  type UploadPostPublishPlatform,
  type UserSummaryResponse,
  useUploadPostPublishMutation,
} from "@/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { getQueryErrorMessage } from "@/lib/query-error";
import { cn } from "@/lib/utils";

type PublishWorkspaceAiComposerProps = {
  users: UserSummaryResponse[];
  generatedContents: GeneratedContentResponse[];
  onJobCreated?: (jobId: string) => void;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tone?: "default" | "success" | "error";
};

const PLATFORM_KEYWORDS: Array<{
  platform: UploadPostPublishPlatform;
  keywords: string[];
}> = [
  { platform: "tiktok", keywords: ["tiktok", "tik tok"] },
  { platform: "instagram", keywords: ["instagram", "insta", "reel"] },
  { platform: "youtube", keywords: ["youtube", "yt", "shorts"] },
  { platform: "facebook", keywords: ["facebook", "fb"] },
  { platform: "x", keywords: ["twitter", "x ", "x/"] },
  { platform: "threads", keywords: ["threads"] },
  { platform: "linkedin", keywords: ["linkedin"] },
  { platform: "bluesky", keywords: ["bluesky", "blue sky"] },
  { platform: "reddit", keywords: ["reddit", "subreddit"] },
  { platform: "pinterest", keywords: ["pinterest", "pin"] },
  { platform: "google_business", keywords: ["google business", "gmb"] },
];

function extractHashtags(prompt: string) {
  return Array.from(prompt.matchAll(/#([\p{L}\p{N}_-]+)/gu))
    .map((match) => match[1])
    .filter(Boolean)
    .slice(0, 8);
}

function inferPlatforms(prompt: string): UploadPostPublishPlatform[] {
  const lowered = prompt.toLowerCase();
  const matches = PLATFORM_KEYWORDS.filter((entry) =>
    entry.keywords.some((keyword) => lowered.includes(keyword)),
  ).map((entry) => entry.platform);

  if (matches.length > 0) {
    return Array.from(new Set(matches));
  }

  return ["tiktok", "instagram", "youtube"];
}

function buildTitle(prompt: string) {
  const normalized = prompt
    .replace(/#([\p{L}\p{N}_-]+)/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "AI Generated Post";
  }

  const firstSentence = normalized.split(/[.!?\n]/)[0]?.trim() ?? normalized;
  return firstSentence.slice(0, 96);
}

export function PublishWorkspaceAiComposer({
  users,
  generatedContents,
  onJobCreated,
}: PublishWorkspaceAiComposerProps) {
  const copy = useBilingual();
  const publishMutation = useUploadPostPublishMutation();

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: copy(
        "Describe your publishing goal and press Enter. I will auto-build a publish request from your prompt.",
        "Mô tả mục tiêu xuất bản của bạn và nhấn Enter. Mình sẽ tự tạo publish request từ prompt.",
      ),
    },
  ]);

  const resolvedUser = users[0]?.email ?? "";
  const resolvedUserId = users[0]?.id ?? "";
  const resolvedGeneratedContentId = generatedContents[0]?.id ?? "";

  useEffect(() => {
    const createdId = publishMutation.data?.publish_job.id;
    if (!createdId) {
      return;
    }

    onJobCreated?.(createdId);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-success-${createdId}`,
        role: "assistant",
        tone: "success",
        text: copy(
          `Publish request created successfully. Job ID: ${createdId}`,
          `Đã tạo yêu cầu xuất bản thành công. Mã job: ${createdId}`,
        ),
      },
    ]);
  }, [copy, onJobCreated, publishMutation.data?.publish_job.id]);

  const promptHint = useMemo(
    () =>
      copy(
        "Examples: Publish this as a 3-post Instagram + Threads launch sequence for a fitness creator.",
        "Ví dụ: Đăng nội dung này thành chuỗi 3 bài Instagram + Threads cho creator về fitness.",
      ),
    [copy],
  );

  const submitPrompt = async () => {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt || publishMutation.isPending) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: normalizedPrompt,
      },
    ]);

    setPrompt("");

    if (!resolvedUser) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-missing-user-${Date.now()}`,
          role: "assistant",
          tone: "error",
          text: copy(
            "No publisher account found. Please create or sync at least one user profile first.",
            "Không tìm thấy tài khoản publisher. Vui lòng tạo hoặc đồng bộ ít nhất một user profile trước.",
          ),
        },
      ]);
      return;
    }

    try {
      await publishMutation.mutateAsync({
        user: resolvedUser,
        user_id: resolvedUserId || undefined,
        generated_content_id: resolvedGeneratedContentId || undefined,
        title: buildTitle(normalizedPrompt),
        description: normalizedPrompt,
        tags: extractHashtags(normalizedPrompt),
        platforms: inferPlatforms(normalizedPrompt),
      });
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          tone: "error",
          text: getQueryErrorMessage(error, "Publishing request failed."),
        },
      ]);
    }
  };

  const handlePromptKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitPrompt();
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-linear-to-br from-card/95 via-card/92 to-primary/6 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("AI Autopilot", "AI tự động")}
          </p>
          <p className="text-sm text-muted-foreground">{promptHint}</p>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/8 text-primary"
        >
          <Sparkles className="mr-1 size-3.5" />
          {copy("Press Enter to send", "Nhấn Enter để gửi")}
        </Badge>
      </div>

      <ScrollArea className="h-64 rounded-2xl border border-border/60 bg-background/75 p-3 pr-2">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[92%] rounded-2xl border px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto border-primary/35 bg-primary/10 text-foreground"
                  : "mr-auto border-border/65 bg-background/80 text-foreground",
                message.tone === "success" &&
                  "border-emerald-500/35 bg-emerald-500/10 text-emerald-700",
                message.tone === "error" &&
                  "border-rose-500/35 bg-rose-500/10 text-rose-700",
              )}
            >
              <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
                {message.role === "user" ? (
                  copy("You", "Bạn")
                ) : (
                  <>
                    <Bot className="size-3.5" />
                    {copy("AI Publisher", "AI Publisher")}
                  </>
                )}
              </p>
              <p>{message.text}</p>
            </div>
          ))}

          {publishMutation.isPending ? (
            <div className="mr-auto flex max-w-[92%] items-center gap-2 rounded-2xl border border-primary/30 bg-primary/8 px-3 py-2 text-sm text-primary">
              <Loader2 className="size-4 animate-spin" />
              {copy(
                "Building publish request...",
                "Đang tạo yêu cầu xuất bản...",
              )}
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <div className="mt-3 flex gap-2">
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handlePromptKeyDown}
          rows={2}
          className="min-h-14"
          placeholder={copy(
            "Tell AI what to publish and where. Shift+Enter for a new line.",
            "Nói cho AI biết bạn muốn đăng gì và đăng ở đâu. Shift+Enter để xuống dòng.",
          )}
        />

        <Button
          type="button"
          onClick={() => void submitPrompt()}
          disabled={!prompt.trim() || publishMutation.isPending}
          className="self-end"
        >
          {publishMutation.isPending ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <SendHorizontal data-icon="inline-start" />
          )}
          {copy("Send", "Gửi")}
        </Button>
      </div>

      {!resolvedUser ? (
        <Alert className="mt-3 border-amber-500/35 bg-amber-500/10">
          <AlertTitle>
            {copy("Publisher profile required", "Cần hồ sơ publisher")}
          </AlertTitle>
          <AlertDescription>
            {copy(
              "AI mode needs at least one user profile to submit publish requests.",
              "Chế độ AI cần ít nhất một user profile để gửi publish request.",
            )}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
