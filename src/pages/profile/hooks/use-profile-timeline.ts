import { useCallback, useState } from "react";

import type { ProfileTimelineEvent } from "@/pages/profile/types";

function buildTimelineEvent(
  kind: ProfileTimelineEvent["kind"],
  title: string,
  detail: string,
  timestamp = new Date().toISOString(),
): ProfileTimelineEvent {
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    title,
    detail,
    timestamp,
  };
}

export function useProfileTimeline(maxEvents = 24) {
  const [timelineEvents, setTimelineEvents] = useState<ProfileTimelineEvent[]>(
    [],
  );

  const resetTimeline = useCallback(() => {
    setTimelineEvents([]);
  }, []);

  const initializeTimeline = useCallback(
    (
      kind: ProfileTimelineEvent["kind"],
      title: string,
      detail: string,
      timestamp?: string,
    ) => {
      setTimelineEvents([buildTimelineEvent(kind, title, detail, timestamp)]);
    },
    [],
  );

  const pushTimelineEvent = useCallback(
    (
      kind: ProfileTimelineEvent["kind"],
      title: string,
      detail: string,
      timestamp?: string,
    ) => {
      setTimelineEvents((current) =>
        [buildTimelineEvent(kind, title, detail, timestamp), ...current].slice(
          0,
          maxEvents,
        ),
      );
    },
    [maxEvents],
  );

  return {
    timelineEvents,
    resetTimeline,
    initializeTimeline,
    pushTimelineEvent,
  };
}
