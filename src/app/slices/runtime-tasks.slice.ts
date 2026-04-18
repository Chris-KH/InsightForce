import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { queryClient } from "@/app/query-client";
import { orchestrateAgentsPipeline } from "@/api/agents.api";
import { ApiError } from "@/api/http-client";
import { analyzeTrend } from "@/api/trends.api";
import type { OrchestratorResponse, TrendAnalyzeResponse } from "@/api/types";

type StrategyTrendPromptRequest = {
  query: string;
  limit?: number;
  user_id?: string | null;
};

type AsyncTaskStatus = "idle" | "pending" | "succeeded" | "failed";

type AsyncTaskState<TData> = {
  status: AsyncTaskStatus;
  startedAt: number | null;
  completedAt: number | null;
  requestId: string | null;
  data: TData | null;
  errorMessage: string | null;
  prompt: string;
};

export type AutomationFormState = {
  prompt: string;
  userId: string;
  saveFiles: boolean;
};

export type RuntimeTasksState = {
  automation: {
    form: AutomationFormState;
    orchestration: AsyncTaskState<OrchestratorResponse>;
  };
  strategy: {
    trendAnalyze: AsyncTaskState<TrendAnalyzeResponse>;
  };
};

const DEFAULT_AUTOMATION_PROMPT =
  import.meta.env.VITE_DEFAULT_ORCHESTRATION_PROMPT?.trim() ||
  "Chủ đề cụ thể đang trend trong ngày hôm nay về mẹo vặt sức khỏe là gì và tôi nên tạo nội dung như thế nào?";

const DEFAULT_AUTOMATION_USER_ID =
  import.meta.env.VITE_INSIGHTFORGE_DEFAULT_USER_ID?.trim() ||
  "eb892952-0f26-45e1-860b-1dc7d572c553";

const DEFAULT_AUTOMATION_SAVE_FILES =
  import.meta.env.VITE_DEFAULT_ORCHESTRATION_SAVE_FILES === "true";

const initialAsyncTaskState = <TData>(): AsyncTaskState<TData> => ({
  status: "idle",
  startedAt: null,
  completedAt: null,
  requestId: null,
  data: null,
  errorMessage: null,
  prompt: "",
});

export const runtimeTasksInitialState: RuntimeTasksState = {
  automation: {
    form: {
      prompt: DEFAULT_AUTOMATION_PROMPT,
      userId: DEFAULT_AUTOMATION_USER_ID,
      saveFiles: DEFAULT_AUTOMATION_SAVE_FILES,
    },
    orchestration: initialAsyncTaskState<OrchestratorResponse>(),
  },
  strategy: {
    trendAnalyze: initialAsyncTaskState<TrendAnalyzeResponse>(),
  },
};

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const runAutomationOrchestration = createAsyncThunk<
  OrchestratorResponse,
  {
    prompt: string;
    saveFiles: boolean;
    userId?: string;
  },
  {
    rejectValue: string;
  }
>(
  "runtimeTasks/runAutomationOrchestration",
  async ({ prompt, saveFiles, userId }, { rejectWithValue }) => {
    try {
      const response = await orchestrateAgentsPipeline({
        prompt,
        save_files: saveFiles,
        user_id: userId,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trend", "history"] }),
        queryClient.invalidateQueries({ queryKey: ["contents", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["upload-post", "publish-jobs"],
        }),
      ]);

      return response;
    } catch (error) {
      return rejectWithValue(
        toErrorMessage(error, "Unable to complete orchestration run."),
      );
    }
  },
);

export const runStrategyTrendAnalyze = createAsyncThunk<
  TrendAnalyzeResponse,
  StrategyTrendPromptRequest,
  {
    rejectValue: string;
  }
>(
  "runtimeTasks/runStrategyTrendAnalyze",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await analyzeTrend({
        query: payload.query,
        limit: payload.limit ?? 5,
        user_id: payload.user_id ?? null,
      });

      if (response.error || response.results.length === 0) {
        return rejectWithValue(
          "Trend analysis did not return any keyword results.",
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["trend", "history"] });

      return response;
    } catch (error) {
      return rejectWithValue(
        toErrorMessage(error, "Unable to analyze trends."),
      );
    }
  },
);

export const runtimeTasksSlice = createSlice({
  name: "runtimeTasks",
  initialState: runtimeTasksInitialState,
  reducers: {
    setAutomationPrompt(state, action: PayloadAction<string>) {
      state.automation.form.prompt = action.payload;
    },
    setAutomationUserId(state, action: PayloadAction<string>) {
      state.automation.form.userId = action.payload;
    },
    setAutomationSaveFiles(state, action: PayloadAction<boolean>) {
      state.automation.form.saveFiles = action.payload;
    },
    clearAutomationError(state) {
      state.automation.orchestration.errorMessage = null;
      if (state.automation.orchestration.status === "failed") {
        state.automation.orchestration.status = "idle";
      }
    },
    clearStrategyTrendError(state) {
      state.strategy.trendAnalyze.errorMessage = null;
      if (state.strategy.trendAnalyze.status === "failed") {
        state.strategy.trendAnalyze.status = "idle";
      }
    },
    resetStrategyTrendTask(state) {
      state.strategy.trendAnalyze =
        initialAsyncTaskState<TrendAnalyzeResponse>();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runAutomationOrchestration.pending, (state, action) => {
        state.automation.orchestration.status = "pending";
        state.automation.orchestration.startedAt = Date.now();
        state.automation.orchestration.completedAt = null;
        state.automation.orchestration.requestId = action.meta.requestId;
        state.automation.orchestration.data = null;
        state.automation.orchestration.errorMessage = null;
        state.automation.orchestration.prompt = action.meta.arg.prompt;
      })
      .addCase(runAutomationOrchestration.fulfilled, (state, action) => {
        if (
          state.automation.orchestration.requestId !== action.meta.requestId
        ) {
          return;
        }

        state.automation.orchestration.status = "succeeded";
        state.automation.orchestration.completedAt = Date.now();
        state.automation.orchestration.data = action.payload;
        state.automation.orchestration.errorMessage = null;
      })
      .addCase(runAutomationOrchestration.rejected, (state, action) => {
        if (
          state.automation.orchestration.requestId !== action.meta.requestId
        ) {
          return;
        }

        state.automation.orchestration.status = "failed";
        state.automation.orchestration.completedAt = Date.now();
        state.automation.orchestration.errorMessage =
          action.payload ?? "Unable to complete orchestration run.";
      })
      .addCase(runStrategyTrendAnalyze.pending, (state, action) => {
        state.strategy.trendAnalyze.status = "pending";
        state.strategy.trendAnalyze.startedAt = Date.now();
        state.strategy.trendAnalyze.completedAt = null;
        state.strategy.trendAnalyze.requestId = action.meta.requestId;
        state.strategy.trendAnalyze.data = null;
        state.strategy.trendAnalyze.errorMessage = null;
        state.strategy.trendAnalyze.prompt = action.meta.arg.query;
      })
      .addCase(runStrategyTrendAnalyze.fulfilled, (state, action) => {
        if (state.strategy.trendAnalyze.requestId !== action.meta.requestId) {
          return;
        }

        state.strategy.trendAnalyze.status = "succeeded";
        state.strategy.trendAnalyze.completedAt = Date.now();
        state.strategy.trendAnalyze.data = action.payload;
        state.strategy.trendAnalyze.errorMessage = null;
      })
      .addCase(runStrategyTrendAnalyze.rejected, (state, action) => {
        if (state.strategy.trendAnalyze.requestId !== action.meta.requestId) {
          return;
        }

        state.strategy.trendAnalyze.status = "failed";
        state.strategy.trendAnalyze.completedAt = Date.now();
        state.strategy.trendAnalyze.errorMessage =
          action.payload ?? "Unable to load trend history.";
      });
  },
});

export const {
  clearAutomationError,
  clearStrategyTrendError,
  resetStrategyTrendTask,
  setAutomationPrompt,
  setAutomationSaveFiles,
  setAutomationUserId,
} = runtimeTasksSlice.actions;

export const runtimeTasksReducer = runtimeTasksSlice.reducer;
