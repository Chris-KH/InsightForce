export type PostAgentPreview = {
  user: string;
  platform: string;
  caption: string;
  images: string[];
  question: string;
};

export type ParsedPostAgentMarkdown = {
  text: string;
  threadId: string | null;
  preview: PostAgentPreview | null;
};

const THREAD_ID_PATTERN = /\[THREAD_ID:\s*([^\]\s]+)\s*\]/i;
const QUESTION_PATTERN =
  /Do you want to post this\??|Bạn có muốn đăng bài này không\??/i;

function normalizeText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
}

function collapseEmptyLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .reduce<string[]>((acc, line) => {
      if (!line) {
        if (acc[acc.length - 1] !== "") {
          acc.push("");
        }
        return acc;
      }

      acc.push(line);
      return acc;
    }, [])
    .join("\n")
    .trim();
}

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  return trimmed.replace(/^[\"'“”]+|[\"'“”]+$/g, "").trim();
}

export function parsePostAgentMarkdown(
  markdown: string,
): ParsedPostAgentMarkdown {
  const normalized = normalizeText(markdown ?? "").trim();

  if (!normalized) {
    return {
      text: "",
      threadId: null,
      preview: null,
    };
  }

  const threadMatch = normalized.match(THREAD_ID_PATTERN);
  const threadId = threadMatch?.[1] ?? null;

  let workingText = normalized;
  if (threadMatch?.[0]) {
    workingText = workingText.replace(threadMatch[0], "").trim();
  }

  const userMatch = workingText.match(/^\s*User:\s*(.+)$/im);
  const platformMatch = workingText.match(/^\s*Platform:\s*(.+)$/im);
  const captionMatch = workingText.match(/^\s*Caption:\s*(.+)$/im);
  const questionMatch = workingText.match(QUESTION_PATTERN);

  const images = Array.from(
    workingText.matchAll(/^\s*-\s*(https?:\/\/\S+)\s*$/gim),
  ).map((match) => match[1]);

  const hasPreviewHeader = /^\s*Preview:\s*$/im.test(workingText);
  const hasPreviewFields =
    Boolean(userMatch?.[1]) &&
    Boolean(platformMatch?.[1]) &&
    Boolean(captionMatch?.[1]);

  let preview: PostAgentPreview | null = null;

  if (hasPreviewHeader && hasPreviewFields) {
    preview = {
      user: userMatch?.[1]?.trim() ?? "",
      platform: platformMatch?.[1]?.trim() ?? "",
      caption: stripWrappingQuotes(captionMatch?.[1] ?? ""),
      images,
      question: questionMatch?.[0] ?? "Do you want to post this?",
    };

    workingText = workingText
      .replace(/^\s*Preview:\s*$/gim, "")
      .replace(/^\s*User:\s*.+$/gim, "")
      .replace(/^\s*Platform:\s*.+$/gim, "")
      .replace(/^\s*Caption:\s*.+$/gim, "")
      .replace(/^\s*Images:\s*$/gim, "")
      .replace(/^\s*-\s*https?:\/\/\S+\s*$/gim, "")
      .replace(QUESTION_PATTERN, "")
      .trim();
  }

  return {
    text: collapseEmptyLines(workingText),
    threadId,
    preview,
  };
}
