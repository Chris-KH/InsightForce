import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Bot, Eraser, Loader2, SendHorizontal, Sparkles } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

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

import { getPublishingPlatformVisual } from "./platform-visuals";

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

const SUGGESTED_PROMPTS = [
  "Launch a 5-day Instagram + TikTok teaser sequence for a wellness challenge.",
  "Create a repost package for YouTube Shorts and Threads with CTA to newsletter.",
  "Publish a Reddit + X announcement for a new product drop with link tracking.",
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
  const chatScrollRootRef = useRef<HTMLDivElement | null>(null);
  const hasPublisherProfile = Boolean(resolvedUser.trim());

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

  const previewPlatforms = useMemo(() => {
    const source = prompt.trim();
    return inferPlatforms(source);
  }, [prompt]);

  useEffect(() => {
    const viewport = chatScrollRootRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );

    if (!viewport) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [messages, publishMutation.isPending]);

  const clearConversation = () => {
    setMessages([
      {
        id: `assistant-reset-${Date.now()}`,
        role: "assistant",
        text: copy(
          "Conversation reset. Describe your publishing goal and I will draft a publish request.",
          "Đã đặt lại hội thoại. Hãy mô tả mục tiêu xuất bản và mình sẽ tạo bản nháp publish request.",
        ),
      },
    ]);
  };

  const submitPrompt = async () => {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt || publishMutation.isPending) {
      return;
    }

    const inferredPlatforms = inferPlatforms(normalizedPrompt);
    const resolvedTitle = buildTitle(normalizedPrompt);
    const resolvedTags = extractHashtags(normalizedPrompt);

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: normalizedPrompt,
      },
    ]);

    setPrompt("");

    if (!hasPublisherProfile) {
      const platformLabel = inferredPlatforms
        .map((platform) => getPublishingPlatformVisual(platform).label)
        .join(", ");
      const hashtagsLabel =
        resolvedTags.length > 0
          ? ` #${resolvedTags.join(" #")}`
          : copy(" none", " không có");

      setMessages((current) => [
        ...current,
        {
          id: `assistant-draft-${Date.now()}`,
          role: "assistant",
          text: copy(
            `Draft prepared (not submitted yet). Title: ${resolvedTitle}. Channels: ${platformLabel}. Hashtags:${hashtagsLabel}. Create one publisher profile to send this live.`,
            `Mình đã tạo draft (chưa gửi). Tiêu đề: ${resolvedTitle}. Kênh: ${platformLabel}. Hashtag:${hashtagsLabel}. Hãy tạo 1 publisher profile để gửi thật.`,
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
        title: resolvedTitle,
        description: normalizedPrompt,
        tags: resolvedTags,
        platforms: inferredPlatforms,
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
    <div className="relative isolate mt-1 overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-chart-2/12 via-card/94 to-chart-1/10 p-4 pt-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 size-36 rounded-full bg-chart-1/16 blur-3xl" />
        <div className="absolute right-0 bottom-0 size-44 rounded-full bg-chart-2/16 blur-3xl" />
      </div>

      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("AI Autopilot", "AI tự động")}
          </p>
          <p className="text-sm text-muted-foreground">{promptHint}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-chart-2/45 bg-chart-2/16 text-chart-2 shadow-[0_8px_22px_rgba(14,165,233,0.2)] backdrop-blur"
          >
            <Sparkles className="mr-1 size-3.5" />
            {copy("Press Enter to send", "Nhấn Enter để gửi")}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full shadow-[0_8px_22px_rgba(15,23,42,0.14)] backdrop-blur",
              hasPublisherProfile
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700"
                : "border-amber-500/40 bg-amber-500/16 text-amber-700",
            )}
          >
            {hasPublisherProfile
              ? copy("Profile Ready", "Profile sẵn sàng")
              : copy("Profile Missing", "Thiếu profile")}
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearConversation}
            className="border-border/60 bg-background/78 shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <Eraser data-icon="inline-start" />
            {copy("Clear", "Xóa")}
          </Button>
        </div>
      </div>

      <div className="relative mb-3 rounded-2xl border border-border/60 bg-background/75 p-3">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {copy("Detected channels", "Kênh được nhận diện")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {previewPlatforms.map((platform) => {
            const visual = getPublishingPlatformVisual(platform);

            return (
              <Badge
                key={`ai-preview-${platform}`}
                variant="outline"
                className={cn("rounded-full", visual.chipClassName)}
              >
                <Icon icon={visual.icon} className="mr-1 size-3.5" />
                {visual.label}
              </Badge>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setPrompt(sample)}
              className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      <div ref={chatScrollRootRef}>
        <ScrollArea className="relative h-80 rounded-2xl border border-primary/22 bg-linear-to-b from-background/90 via-muted/36 to-background/80 p-3 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_18px_36px_rgba(15,23,42,0.08)]">
          <div className="pointer-events-none absolute top-3 right-3 z-10">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full border-border/60 bg-background/85 text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.14)] backdrop-blur",
                !hasPublisherProfile &&
                  "border-amber-500/35 bg-amber-500/14 text-amber-700",
              )}
            >
              {hasPublisherProfile
                ? copy("Live Publisher", "Publisher trực tiếp")
                : copy("Draft Chat Mode", "Chế độ chat nháp")}
            </Badge>
          </div>
          <div className="space-y-2">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "max-w-[92%] rounded-2xl border px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto border-chart-1/45 bg-linear-to-r from-chart-1/18 via-primary/15 to-chart-2/14 text-foreground shadow-[0_10px_24px_rgba(59,130,246,0.16)]"
                    : "mr-auto border-border/65 bg-card/88 text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.1)]",
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
              </motion.div>
            ))}

            {publishMutation.isPending ? (
              <motion.div
                className="mr-auto flex max-w-[92%] items-center gap-2 rounded-2xl border border-primary/30 bg-primary/8 px-3 py-2 text-sm text-primary"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Loader2 className="size-4 animate-spin" />
                {copy(
                  "Building publish request...",
                  "Đang tạo yêu cầu xuất bản...",
                )}
              </motion.div>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-3 flex gap-2 rounded-2xl border border-border/60 bg-background/75 p-2">
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handlePromptKeyDown}
          rows={2}
          className="min-h-14 border-none bg-transparent shadow-none"
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
            {copy("Draft-only mode active", "Đang ở chế độ chat nháp")}
          </AlertTitle>
          <AlertDescription>
            {copy(
              "You can still chat and build drafts. Add a publisher profile to send real publish requests.",
              "Bạn vẫn có thể chat và tạo draft. Hãy thêm publisher profile để gửi publish request thật.",
            )}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
