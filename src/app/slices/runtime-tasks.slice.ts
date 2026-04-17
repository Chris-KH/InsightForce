import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { queryClient } from "@/app/query-client";
import { orchestrateAgentsPipeline } from "@/api/agents.api";
import { ApiError } from "@/api/http-client";
import { analyzeTrend } from "@/api/trends.api";
import type {
  OrchestratorResponse,
  TrendAnalyzeRequest,
  TrendAnalyzeResponse,
} from "@/api/types";

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
  "Suggest a 7-day content plan to increase organic engagement for a lifestyle creator.";

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
      userId: "",
      saveFiles: true,
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
  TrendAnalyzeRequest,
  {
    rejectValue: string;
  }
>(
  "runtimeTasks/runStrategyTrendAnalyze",
  async (payload, { rejectWithValue }) => {
    try {
      return await analyzeTrend(payload);
    } catch (error) {
      return rejectWithValue(
        toErrorMessage(error, "Unable to analyze trend prompt."),
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
          action.payload ?? "Unable to analyze trend prompt.";
      });
  },
});

export const {
  clearAutomationError,
  clearStrategyTrendError,
  setAutomationPrompt,
  setAutomationSaveFiles,
  setAutomationUserId,
} = runtimeTasksSlice.actions;

export const runtimeTasksReducer = runtimeTasksSlice.reducer;
