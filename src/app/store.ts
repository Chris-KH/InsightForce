import { configureStore } from "@reduxjs/toolkit";

import {
  aiAutopilotChatInitialState,
  aiAutopilotChatReducer,
  type AiAutopilotChatState,
} from "@/app/slices/ai-autopilot-chat.slice";
import {
  activityFeedInitialState,
  activityFeedReducer,
  type ActivityFeedState,
} from "@/app/slices/activity-feed.slice";
import {
  runtimeTasksInitialState,
  runtimeTasksReducer,
  type RuntimeTasksState,
} from "@/app/slices/runtime-tasks.slice";

const RUNTIME_STATE_STORAGE_KEY = "insightforce.runtime.state.v1";
const ACTIVITY_FEED_STORAGE_KEY = "insightforce.activity.feed.v1";
const AI_AUTOPILOT_CHAT_STORAGE_KEY = "insightforce.ai-autopilot.chat.v1";

function sanitizeHydratedRuntimeState(
  state: RuntimeTasksState,
): RuntimeTasksState {
  const interruptedMessage =
    "Previous request was interrupted because the app reloaded.";

  const sanitizeTask = <
    T extends {
      status: string;
      completedAt: number | null;
      requestId: string | null;
      errorMessage: string | null;
    },
  >(
    task: T,
  ): T => {
    if (task.status !== "pending") {
      return task;
    }

    return {
      ...task,
      status: "failed",
      completedAt: Date.now(),
      requestId: null,
      errorMessage: task.errorMessage ?? interruptedMessage,
    };
  };

  return {
    ...state,
    automation: {
      ...state.automation,
      orchestration: sanitizeTask(state.automation.orchestration),
    },
    strategy: {
      ...state.strategy,
      trendAnalyze: sanitizeTask(state.strategy.trendAnalyze),
    },
  };
}

function loadRuntimeState(): RuntimeTasksState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(RUNTIME_STATE_STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as RuntimeTasksState;
    return sanitizeHydratedRuntimeState(parsed);
  } catch {
    return undefined;
  }
}

function sanitizeHydratedActivityFeed(
  state: ActivityFeedState,
): ActivityFeedState {
  return {
    notifications: Array.isArray(state.notifications)
      ? state.notifications.slice(0, 40)
      : [],
    toasts: [],
  };
}

function loadActivityFeedState(): ActivityFeedState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(ACTIVITY_FEED_STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as ActivityFeedState;
    return sanitizeHydratedActivityFeed(parsed);
  } catch {
    return undefined;
  }
}

function sanitizeHydratedAiAutopilotChat(
  state: AiAutopilotChatState,
): AiAutopilotChatState {
  return {
    ...aiAutopilotChatInitialState,
    ...state,
    messages: Array.isArray(state.messages) ? state.messages.slice(-120) : [],
    status: state.status === "pending" ? "failed" : state.status,
    requestId: null,
    errorMessage:
      state.status === "pending"
        ? "Previous request was interrupted because the app reloaded."
        : state.errorMessage,
  };
}

function loadAiAutopilotChatState(): AiAutopilotChatState | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(AI_AUTOPILOT_CHAT_STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as AiAutopilotChatState;
    return sanitizeHydratedAiAutopilotChat(parsed);
  } catch {
    return undefined;
  }
}

const preloadedRuntimeState = loadRuntimeState();
const preloadedActivityFeedState = loadActivityFeedState();
const preloadedAiAutopilotChatState = loadAiAutopilotChatState();

export const store = configureStore({
  reducer: {
    aiAutopilotChat: aiAutopilotChatReducer,
    activityFeed: activityFeedReducer,
    runtimeTasks: runtimeTasksReducer,
  },
  preloadedState: {
    aiAutopilotChat:
      preloadedAiAutopilotChatState ?? aiAutopilotChatInitialState,
    activityFeed: preloadedActivityFeedState ?? activityFeedInitialState,
    runtimeTasks: preloadedRuntimeState ?? runtimeTasksInitialState,
  },
});

if (typeof window !== "undefined") {
  let previousAiAutopilotSerialized = "";
  let previousRuntimeSerialized = "";
  let previousActivitySerialized = "";

  store.subscribe(() => {
    try {
      const aiAutopilotSerialized = JSON.stringify(
        store.getState().aiAutopilotChat,
      );
      if (aiAutopilotSerialized !== previousAiAutopilotSerialized) {
        previousAiAutopilotSerialized = aiAutopilotSerialized;
        window.localStorage.setItem(
          AI_AUTOPILOT_CHAT_STORAGE_KEY,
          aiAutopilotSerialized,
        );
      }

      const runtimeSerialized = JSON.stringify(store.getState().runtimeTasks);
      if (runtimeSerialized !== previousRuntimeSerialized) {
        previousRuntimeSerialized = runtimeSerialized;
        window.localStorage.setItem(
          RUNTIME_STATE_STORAGE_KEY,
          runtimeSerialized,
        );
      }

      const notifications = store.getState().activityFeed.notifications;
      const activitySerialized = JSON.stringify(notifications);

      if (activitySerialized !== previousActivitySerialized) {
        previousActivitySerialized = activitySerialized;
        window.localStorage.setItem(
          ACTIVITY_FEED_STORAGE_KEY,
          JSON.stringify({
            notifications,
            toasts: [],
          } satisfies ActivityFeedState),
        );
      }
    } catch {
      // Ignore local storage persistence errors.
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
