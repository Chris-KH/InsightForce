import { ApiError, httpClient } from "@/api/http-client";
import type {
  AgentsStatusResponse,
  OrchestratedOutput,
  OrchestratorRequest,
  OrchestratorResponse,
} from "@/api/types";

const AGENTS_BASE_PATH = "/api/v1/agents";
const ORCHESTRATE_TIMEOUT_MS = 420_000;

type UnknownRecord = Record<string, unknown>;
type RequestOptions = {
  signal?: AbortSignal;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function extractStatusText(status: UnknownRecord | undefined): string {
  if (!status) {
    return "";
  }

  const statusMessage = isRecord(status.message) ? status.message : undefined;
  if (!statusMessage) {
    return "";
  }

  const parts = Array.isArray(statusMessage.parts) ? statusMessage.parts : [];
  for (const part of parts) {
    if (isRecord(part)) {
      const text = toText(part.text);
      if (text) {
        return text;
      }
    }
  }

  return "";
}

function extractRawTaskStateAndMessage(rawResponse: unknown): {
  state: string;
  message: string;
} {
  const fallback = { state: "", message: "" };
  if (!isRecord(rawResponse)) {
    return fallback;
  }

  const result = isRecord(rawResponse.result) ? rawResponse.result : undefined;
  if (!result) {
    return fallback;
  }

  const directStatus = isRecord(result.status) ? result.status : undefined;
  const task = isRecord(result.task) ? result.task : undefined;
  const taskStatus = task && isRecord(task.status) ? task.status : undefined;
  const status = directStatus ?? taskStatus;

  if (!status) {
    return fallback;
  }

  return {
    state: toText(status.state).toLowerCase(),
    message: extractStatusText(status),
  };
}

function hasMeaningfulGeneratedContent(output: OrchestratedOutput): boolean {
  const generated = output.generated_content;

  if ((generated.selected_keyword ?? "").trim()) {
    return true;
  }

  if ((generated.main_title ?? "").trim()) {
    return true;
  }

  const postContent = generated.post_content;
  if (
    (postContent.title ?? "").trim() ||
    (postContent.hook ?? "").trim() ||
    (postContent.caption ?? "").trim() ||
    (postContent.description ?? "").trim() ||
    (postContent.body ?? "").trim() ||
    (postContent.call_to_action ?? "").trim() ||
    (postContent.hashtags ?? []).length > 0 ||
    (postContent.personalization_notes ?? []).length > 0
  ) {
    return true;
  }

  if ((generated.image_set ?? []).length > 0) {
    return true;
  }

  const posts = Object.values(generated.platform_posts ?? {});
  return posts.some((post) => {
    if (!post) {
      return false;
    }

    return (
      (post.caption ?? "").trim() ||
      (post.cta ?? "").trim() ||
      (post.best_post_time ?? "").trim() ||
      (post.hashtags ?? []).length > 0
    );
  });
}

function getBackendErrorText(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (isRecord(value)) {
    const detail =
      toText(value.message) ||
      toText(value.detail) ||
      toText(value.reason) ||
      toText(value.type);
    if (detail) {
      return detail;
    }
  }

  return "";
}

function resolveOrchestrationFailureReason(
  response: OrchestratorResponse,
): string {
  const rawStatus = extractRawTaskStateAndMessage(response.raw_response);
  const trendError = getBackendErrorText(response.output.trend_analysis.error);
  const generatedError = getBackendErrorText(
    response.output.generated_content.error,
  );
  const persistenceSkipped = getBackendErrorText(
    response.output.persistence_skipped,
  );

  if (response.status.trim().toLowerCase() === "failed") {
    return (
      generatedError ||
      trendError ||
      persistenceSkipped ||
      rawStatus.message ||
      "Backend orchestration failed to produce a valid result."
    );
  }

  if (rawStatus.state === "failed") {
    return (
      rawStatus.message ||
      "Backend orchestration task failed before producing usable output."
    );
  }

  if (trendError || generatedError) {
    return trendError || generatedError;
  }

  const hasTrendResults = response.output.trend_analysis.results.length > 0;
  const hasGeneratedContent = hasMeaningfulGeneratedContent(response.output);

  if (!hasTrendResults && !hasGeneratedContent) {
    return (
      rawStatus.message ||
      "Backend returned an empty orchestration output (no trend results and no generated content)."
    );
  }

  return "";
}

export function getAgentsStatus(options: RequestOptions = {}) {
  return httpClient.get<AgentsStatusResponse>(`${AGENTS_BASE_PATH}/status`, {
    signal: options.signal,
  });
}

export async function orchestrateAgentsPipeline(payload: OrchestratorRequest) {
  const normalizedPrompt = payload.prompt.trim();
  const normalizedUserId = payload.user_id?.trim() || null;
  const saveFiles = payload.save_files ?? false;

  const query = {
    include_raw_response: payload.include_raw_response ?? false,
    save_files: saveFiles,
  };

  const requestBody = {
    prompt: normalizedPrompt,
    user_id: normalizedUserId,
    save_files: saveFiles,
  };

  const response = await httpClient.post<OrchestratorResponse>(
    `${AGENTS_BASE_PATH}/orchestrate`,
    requestBody,
    {
      query,
      timeoutMs: ORCHESTRATE_TIMEOUT_MS,
    },
  );

  const failureReason = resolveOrchestrationFailureReason(response);
  if (failureReason) {
    throw new ApiError(failureReason, 502, response);
  }

  return response;
}
