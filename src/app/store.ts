import { configureStore } from "@reduxjs/toolkit";

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

const preloadedRuntimeState = loadRuntimeState();
const preloadedActivityFeedState = loadActivityFeedState();

export const store = configureStore({
  reducer: {
    activityFeed: activityFeedReducer,
    runtimeTasks: runtimeTasksReducer,
  },
  preloadedState: {
    activityFeed: preloadedActivityFeedState ?? activityFeedInitialState,
    runtimeTasks: preloadedRuntimeState ?? runtimeTasksInitialState,
  },
});

if (typeof window !== "undefined") {
  let previousRuntimeSerialized = "";
  let previousActivitySerialized = "";

  store.subscribe(() => {
    try {
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
