import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Bot, Check, Loader2, SendHorizontal, Sparkles, X } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

import type { UploadPostPublishPlatform } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useBilingual } from "@/hooks/use-bilingual";
import { cn } from "@/lib/utils";
import { useAiAutopilotChat } from "@/pages/automation/hooks/use-ai-autopilot-chat";

import { getPublishingPlatformVisual } from "./platform-visuals";

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

export function PublishWorkspaceAiComposer() {
  const copy = useBilingual();
  const {
    canDecide,
    clearConversation,
    configId,
    draftPrompt,
    isPending,
    messages,
    setDraftPrompt,
    submitPrompt: submitAutopilotPrompt,
    approvePosting,
    rejectPosting,
    status,
  } = useAiAutopilotChat();

  const [hasInteracted, setHasInteracted] = useState(false);
  const chatScrollRootRef = useRef<HTMLDivElement | null>(null);
  const prompt = draftPrompt;

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
  }, [messages, isPending]);

  const handleSubmitPrompt = async () => {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt || isPending) {
      return;
    }
    setHasInteracted(true);
    await submitAutopilotPrompt(normalizedPrompt);
  };

  const handlePromptKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmitPrompt();
    }
  };

  const handleApprove = async () => {
    if (isPending) {
      return;
    }

    setHasInteracted(true);
    await approvePosting();
  };

  const handleReject = async () => {
    if (isPending) {
      return;
    }

    setHasInteracted(true);
    await rejectPosting();
  };

  const statusLabel =
    status === "pending"
      ? copy("Reasoning in progress", "Đang reasoning")
      : status === "awaiting-approval"
        ? copy("Awaiting approval", "Chờ xác nhận")
        : status === "completed"
          ? copy("Completed", "Hoàn tất")
          : status === "failed"
            ? copy("Error", "Lỗi")
            : copy("Ready", "Sẵn sàng");

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
              status === "failed"
                ? "border-rose-500/40 bg-rose-500/15 text-rose-700"
                : status === "pending"
                  ? "border-amber-500/40 bg-amber-500/16 text-amber-700"
                  : "border-emerald-500/40 bg-emerald-500/15 text-emerald-700",
            )}
          >
            {statusLabel}
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearConversation}
            className="border-border/60 bg-background/78 shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <X data-icon="inline-start" />
            {copy("Reset", "Đặt lại")}
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
              onClick={() => setDraftPrompt(sample)}
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
                canDecide && "border-primary/45 bg-primary/15 text-primary",
              )}
            >
              {canDecide
                ? copy("Decision Required", "Cần quyết định")
                : copy("Autopilot Chat", "Autopilot Chat")}
            </Badge>
          </div>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <motion.div
                key="assistant-initial"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="mr-auto max-w-[92%] rounded-2xl border border-border/65 bg-card/88 px-3 py-2 text-sm text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.1)]"
              >
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
                  <Bot className="size-3.5" />
                  {copy("AI Publisher", "AI Publisher")}
                </p>
                <p>
                  {copy(
                    "Describe your publishing goal. The assistant will call the post API and return preview details before asking for approval.",
                    "Mô tả mục tiêu đăng bài. Assistant sẽ gọi API post và trả preview trước khi yêu cầu phê duyệt.",
                  )}
                </p>
              </motion.div>
            ) : (
              messages.map((message) => (
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
                    message.kind === "error" &&
                      "border-rose-500/35 bg-rose-500/10 text-rose-700",
                    message.kind === "thread" &&
                      "border-primary/45 bg-primary/10 text-primary",
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

                  {message.kind === "preview" && message.preview ? (
                    <div className="flex flex-col gap-1.5">
                      <p>
                        <span className="font-semibold">User:</span>{" "}
                        {message.preview.user}
                      </p>
                      <p>
                        <span className="font-semibold">Platform:</span>{" "}
                        {message.preview.platform}
                      </p>
                      <p>
                        <span className="font-semibold">Caption:</span>{" "}
                        {message.preview.caption}
                      </p>
                      {message.preview.images.length > 0 ? (
                        <div>
                          <p className="font-semibold">Images:</p>
                          <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
                            {message.preview.images.map((imageUrl) => (
                              <li key={imageUrl}>
                                <a
                                  href={imageUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary underline decoration-primary/40 underline-offset-2"
                                >
                                  {imageUrl}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <p className="font-semibold">
                        {message.preview.question}
                      </p>
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </motion.div>
              ))
            )}

            {isPending ? (
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
                  "Reasoning with post API...",
                  "Đang reasoning với post API...",
                )}
              </motion.div>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      {canDecide ? (
        <div className="mt-3 rounded-2xl border border-primary/28 bg-primary/8 p-3">
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            {copy("Posting confirmation", "Xác nhận đăng bài")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void handleApprove()}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Check data-icon="inline-start" />
              )}
              {copy("Approve", "Approve")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleReject()}
              disabled={isPending}
            >
              <X data-icon="inline-start" />
              {copy("Reject", "Reject")}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex gap-2 rounded-2xl border border-border/60 bg-background/75 p-2">
        <Textarea
          value={prompt}
          onChange={(event) => setDraftPrompt(event.target.value)}
          onKeyDown={handlePromptKeyDown}
          rows={2}
          className="min-h-14 border-none bg-transparent shadow-none"
          disabled={isPending}
          placeholder={copy(
            "Tell AI what to publish and where. Shift+Enter for a new line.",
            "Nói cho AI biết bạn muốn đăng gì và đăng ở đâu. Shift+Enter để xuống dòng.",
          )}
        />

        <Button
          type="button"
          onClick={() => void handleSubmitPrompt()}
          disabled={!prompt.trim() || isPending}
          className="self-end"
        >
          {isPending ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <SendHorizontal data-icon="inline-start" />
          )}
          {copy("Send", "Gửi")}
        </Button>
      </div>

      {hasInteracted ? (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {copy("Config ID", "Config ID")}: {configId}
        </p>
      ) : null}
    </div>
  );
}
