import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ActivityStatus = "success" | "error";
export type ActivityDomain = "automation" | "strategy";

export type ActivityNotification = {
  id: string;
  domain: ActivityDomain;
  status: ActivityStatus;
  title: string;
  description: string;
  route: string;
  createdAt: number;
  read: boolean;
  requestId?: string | null;
  prompt?: string;
};

export type ActivityToast = {
  id: string;
  notificationId: string;
  status: ActivityStatus;
  title: string;
  description: string;
  route: string;
  createdAt: number;
  durationMs: number;
};

export type PublishActivityEventPayload = {
  domain: ActivityDomain;
  status: ActivityStatus;
  title: string;
  description: string;
  route: string;
  requestId?: string | null;
  prompt?: string;
  createdAt?: number;
  emitToast?: boolean;
  toastDurationMs?: number;
};

export type ActivityFeedState = {
  notifications: ActivityNotification[];
  toasts: ActivityToast[];
};

const MAX_ACTIVITY_NOTIFICATIONS = 40;
const MAX_ACTIVITY_TOASTS = 4;
const DEFAULT_TOAST_DURATION_MS = 5600;

function createActivityId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const activityFeedInitialState: ActivityFeedState = {
  notifications: [],
  toasts: [],
};

export const activityFeedSlice = createSlice({
  name: "activityFeed",
  initialState: activityFeedInitialState,
  reducers: {
    publishActivityEvent(
      state,
      action: PayloadAction<PublishActivityEventPayload>,
    ) {
      const createdAt = action.payload.createdAt ?? Date.now();

      const notification: ActivityNotification = {
        id: createActivityId("ntf"),
        domain: action.payload.domain,
        status: action.payload.status,
        title: action.payload.title,
        description: action.payload.description,
        route: action.payload.route,
        createdAt,
        read: false,
        requestId: action.payload.requestId,
        prompt: action.payload.prompt,
      };

      state.notifications.unshift(notification);
      if (state.notifications.length > MAX_ACTIVITY_NOTIFICATIONS) {
        state.notifications.length = MAX_ACTIVITY_NOTIFICATIONS;
      }

      if (action.payload.emitToast === false) {
        return;
      }

      const durationMs =
        action.payload.toastDurationMs ??
        (notification.status === "error"
          ? Math.max(DEFAULT_TOAST_DURATION_MS, 8_200)
          : DEFAULT_TOAST_DURATION_MS);

      const toast: ActivityToast = {
        id: createActivityId("toast"),
        notificationId: notification.id,
        status: notification.status,
        title: notification.title,
        description: notification.description,
        route: notification.route,
        createdAt,
        durationMs,
      };

      state.toasts.unshift(toast);
      if (state.toasts.length > MAX_ACTIVITY_TOASTS) {
        state.toasts.length = MAX_ACTIVITY_TOASTS;
      }
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload,
      );
    },
    clearToasts(state) {
      state.toasts = [];
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const found = state.notifications.find(
        (notification) => notification.id === action.payload,
      );

      if (found) {
        found.read = true;
      }
    },
    markAllNotificationsRead(state) {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    },
    clearActivityFeed(state) {
      state.notifications = [];
      state.toasts = [];
    },
  },
});

export const {
  clearActivityFeed,
  clearToasts,
  dismissToast,
  markAllNotificationsRead,
  markNotificationRead,
  publishActivityEvent,
} = activityFeedSlice.actions;

export const activityFeedReducer = activityFeedSlice.reducer;
