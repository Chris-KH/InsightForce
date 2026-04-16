import { useEffect, useRef } from "react";

import { publishActivityEvent } from "@/app/slices/activity-feed.slice";
import {
  runAutomationOrchestration,
  runStrategyTrendAnalyze,
} from "@/app/slices/runtime-tasks.slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";

const INTERRUPTED_MESSAGE =
  "Previous request was interrupted because the app reloaded.";
const AUTO_RESUME_THROTTLE_MS = 45_000;

function allowAutoResume(key: string) {
  if (typeof window === "undefined") {
    return true;
  }

  const now = Date.now();
  const raw = window.sessionStorage.getItem(key);
  const lastAttempt = raw ? Number(raw) : 0;

  if (
    Number.isFinite(lastAttempt) &&
    now - lastAttempt < AUTO_RESUME_THROTTLE_MS
  ) {
    return false;
  }

  window.sessionStorage.setItem(key, String(now));
  return true;
}

export function AppTaskAutoResume() {
  const dispatch = useAppDispatch();
  const copy = useBilingual();

  const automationForm = useAppSelector(
    (state) => state.runtimeTasks.automation.form,
  );
  const orchestrationTask = useAppSelector(
    (state) => state.runtimeTasks.automation.orchestration,
  );
  const trendAnalyzeTask = useAppSelector(
    (state) => state.runtimeTasks.strategy.trendAnalyze,
  );

  const resumedAutomationRef = useRef(false);
  const resumedStrategyRef = useRef(false);

  useEffect(() => {
    if (
      resumedAutomationRef.current ||
      orchestrationTask.status !== "failed" ||
      orchestrationTask.errorMessage !== INTERRUPTED_MESSAGE
    ) {
      return;
    }

    const prompt = (orchestrationTask.prompt || automationForm.prompt).trim();
    if (!prompt) {
      return;
    }

    if (!allowAutoResume("insightforce.auto-resume.automation")) {
      return;
    }

    resumedAutomationRef.current = true;

    dispatch(
      publishActivityEvent({
        domain: "automation",
        status: "success",
        title: copy(
          "Restoring interrupted automation run",
          "Đang khôi phục phiên automation bị gián đoạn",
        ),
        description: copy(
          "A reload was detected. The request is being retried automatically.",
          "Phát hiện reload. Hệ thống đang tự động chạy lại request.",
        ),
        route: "/app/automation#run-orchestration",
        toastDurationMs: 4_800,
      }),
    );

    void dispatch(
      runAutomationOrchestration({
        prompt,
        saveFiles: automationForm.saveFiles,
        userId: automationForm.userId.trim() || undefined,
      }),
    );
  }, [
    automationForm.prompt,
    automationForm.saveFiles,
    automationForm.userId,
    copy,
    dispatch,
    orchestrationTask.errorMessage,
    orchestrationTask.prompt,
    orchestrationTask.status,
  ]);

  useEffect(() => {
    if (
      resumedStrategyRef.current ||
      trendAnalyzeTask.status !== "failed" ||
      trendAnalyzeTask.errorMessage !== INTERRUPTED_MESSAGE
    ) {
      return;
    }

    const query = trendAnalyzeTask.prompt.trim();
    if (!query) {
      return;
    }

    if (!allowAutoResume("insightforce.auto-resume.strategy")) {
      return;
    }

    resumedStrategyRef.current = true;

    dispatch(
      publishActivityEvent({
        domain: "strategy",
        status: "success",
        title: copy(
          "Restoring interrupted trend analysis",
          "Đang khôi phục phiên phân tích trend bị gián đoạn",
        ),
        description: copy(
          "A reload was detected. The request is being retried automatically.",
          "Phát hiện reload. Hệ thống đang tự động chạy lại request.",
        ),
        route: "/app/strategy#prompt-trend-studio",
        toastDurationMs: 4_800,
      }),
    );

    void dispatch(
      runStrategyTrendAnalyze({
        query,
        limit: 5,
      }),
    );
  }, [
    copy,
    dispatch,
    trendAnalyzeTask.errorMessage,
    trendAnalyzeTask.prompt,
    trendAnalyzeTask.status,
  ]);

  return null;
}
