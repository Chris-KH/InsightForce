import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { submitPostAgentRequest } from "@/api/post-agent.api";
import { ApiError } from "@/api/http-client";
import type { PostAgentDecision, PostAgentResponse } from "@/api/types";
import {
  parsePostAgentMarkdown,
  type PostAgentPreview,
} from "@/lib/post-agent-markdown";
import type { RootState } from "@/app/store";

type AiAutopilotChatStatus =
  | "idle"
  | "pending"
  | "awaiting-approval"
  | "completed"
  | "failed";

export type AiAutopilotChatMessage = {
  id: string;
  role: "user" | "assistant";
  createdAt: number;
  kind: "text" | "preview" | "thread" | "error";
  text: string;
  preview?: PostAgentPreview | null;
  threadId?: string | null;
};

export type AiAutopilotChatState = {
  configId: string;
  draftPrompt: string;
  messages: AiAutopilotChatMessage[];
  status: AiAutopilotChatStatus;
  requestId: string | null;
  errorMessage: string | null;
  activeThreadId: string | null;
  lastResponse: PostAgentResponse | null;
};

type SubmitAutopilotPayload = {
  prompt: string;
  decision: PostAgentDecision;
};

type SubmitAutopilotResult = {
  response: PostAgentResponse;
  parsed: ReturnType<typeof parsePostAgentMarkdown>;
  decision: PostAgentDecision;
};

const MAX_CHAT_MESSAGES = 120;
export const DEMO_AUTOPILOT_CONFIG_ID = "550e8400-e29b-41d4-a716-446655440000";

function createMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultConfigId() {
  const envConfigId = import.meta.env.VITE_AUTOPILOT_CONFIG_ID;
  if (typeof envConfigId === "string" && envConfigId.trim()) {
    return envConfigId.trim();
  }

  return DEMO_AUTOPILOT_CONFIG_ID;
}

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

function appendMessage(
  state: AiAutopilotChatState,
  message: AiAutopilotChatMessage,
) {
  state.messages.push(message);
  if (state.messages.length > MAX_CHAT_MESSAGES) {
    state.messages = state.messages.slice(-MAX_CHAT_MESSAGES);
  }
}

export const aiAutopilotChatInitialState: AiAutopilotChatState = {
  configId: createDefaultConfigId(),
  draftPrompt: "",
  messages: [],
  status: "idle",
  requestId: null,
  errorMessage: null,
  activeThreadId: null,
  lastResponse: null,
};

export const submitAiAutopilotPrompt = createAsyncThunk<
  SubmitAutopilotResult,
  SubmitAutopilotPayload,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "aiAutopilotChat/submitPrompt",
  async ({ prompt, decision }, { getState, rejectWithValue }) => {
    const state = getState().aiAutopilotChat;
    const normalizedPrompt = prompt.trim();

    if (decision === "asking" && !normalizedPrompt) {
      return rejectWithValue("Prompt is empty.");
    }

    try {
      const response = await submitPostAgentRequest({
        prompt: normalizedPrompt,
        config_id: state.configId,
        decision,
      });

      return {
        response,
        parsed: parsePostAgentMarkdown(response.result_markdown),
        decision,
      };
    } catch (error) {
      return rejectWithValue(
        toErrorMessage(error, "Unable to submit AI Autopilot request."),
      );
    }
  },
);

export const aiAutopilotChatSlice = createSlice({
  name: "aiAutopilotChat",
  initialState: aiAutopilotChatInitialState,
  reducers: {
    setAiAutopilotDraftPrompt(state, action: PayloadAction<string>) {
      state.draftPrompt = action.payload;
    },
    clearAiAutopilotConversation(state) {
      state.configId = createDefaultConfigId();
      state.messages = [];
      state.status = "idle";
      state.requestId = null;
      state.errorMessage = null;
      state.activeThreadId = null;
      state.lastResponse = null;
      state.draftPrompt = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAiAutopilotPrompt.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        state.errorMessage = null;

        const decision = action.meta.arg.decision;
        const prompt = action.meta.arg.prompt.trim();

        if (decision === "asking" && prompt) {
          appendMessage(state, {
            id: createMessageId("user"),
            role: "user",
            createdAt: Date.now(),
            kind: "text",
            text: prompt,
          });
          state.draftPrompt = "";
        }

        if (decision === "approve") {
          appendMessage(state, {
            id: createMessageId("user"),
            role: "user",
            createdAt: Date.now(),
            kind: "text",
            text: "Approve",
          });
        }

        if (decision === "deny") {
          appendMessage(state, {
            id: createMessageId("user"),
            role: "user",
            createdAt: Date.now(),
            kind: "text",
            text: "Deny",
          });
        }
      })
      .addCase(submitAiAutopilotPrompt.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.requestId = null;
        state.errorMessage = null;
        state.lastResponse = action.payload.response;

        const { parsed, decision } = action.payload;

        if (parsed.preview) {
          appendMessage(state, {
            id: createMessageId("assistant-preview"),
            role: "assistant",
            createdAt: Date.now(),
            kind: "preview",
            text: parsed.preview.question,
            preview: parsed.preview,
          });
        }

        if (parsed.threadId) {
          state.activeThreadId = parsed.threadId;
          appendMessage(state, {
            id: createMessageId("assistant-thread"),
            role: "assistant",
            createdAt: Date.now(),
            kind: "thread",
            text: `Thread ID: ${parsed.threadId}`,
            threadId: parsed.threadId,
          });
        }

        if (parsed.text) {
          appendMessage(state, {
            id: createMessageId("assistant"),
            role: "assistant",
            createdAt: Date.now(),
            kind: "text",
            text: parsed.text,
          });
        }

        if (decision === "approve") {
          state.status = "completed";
          state.activeThreadId = null;

          if (!parsed.text) {
            appendMessage(state, {
              id: createMessageId("assistant"),
              role: "assistant",
              createdAt: Date.now(),
              kind: "text",
              text: "Đăng bài đã được bắt đầu.",
            });
          }

          return;
        }

        if (decision === "deny") {
          state.status = "completed";
          state.activeThreadId = null;
          if (!parsed.text) {
            appendMessage(state, {
              id: createMessageId("assistant"),
              role: "assistant",
              createdAt: Date.now(),
              kind: "text",
              text: "Đã từ chối yêu cầu đăng bài.",
            });
          }
          return;
        }

        state.status = parsed.threadId ? "awaiting-approval" : "idle";
      })
      .addCase(submitAiAutopilotPrompt.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.requestId = null;
        state.status = "failed";
        state.errorMessage =
          action.payload ?? "Unable to submit AI Autopilot request.";

        appendMessage(state, {
          id: createMessageId("assistant-error"),
          role: "assistant",
          createdAt: Date.now(),
          kind: "error",
          text: state.errorMessage,
        });
      });
  },
});

export const { setAiAutopilotDraftPrompt, clearAiAutopilotConversation } =
  aiAutopilotChatSlice.actions;

export const aiAutopilotChatReducer = aiAutopilotChatSlice.reducer;
