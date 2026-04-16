import { useEffect, useRef } from "react";

import { publishActivityEvent } from "@/app/slices/activity-feed.slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";

const HANDLED_ACTIVITY_PREFIX = "insightforce.activity.handled";
const INTERRUPTED_MESSAGE =
  "Previous request was interrupted because the app reloaded.";

function getPromptPreview(value: string | undefined, fallback: string) {
  const normalized = (value ?? "").trim();
  if (!normalized) {
    return fallback;
  }

  if (normalized.length <= 84) {
    return normalized;
  }

  return `${normalized.slice(0, 81)}...`;
}

function hasHandledKey(key: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(key) === "1";
}

function markHandledKey(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, "1");
}

export function AppRuntimeActivityBridge() {
  const copy = useBilingual();
  const dispatch = useAppDispatch();

  const orchestrationTask = useAppSelector(
    (state) => state.runtimeTasks.automation.orchestration,
  );
  const trendAnalyzeTask = useAppSelector(
    (state) => state.runtimeTasks.strategy.trendAnalyze,
  );

  const lastAutomationEventKeyRef = useRef<string | null>(null);
  const lastStrategyEventKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !orchestrationTask.requestId ||
      !orchestrationTask.completedAt ||
      (orchestrationTask.status !== "succeeded" &&
        orchestrationTask.status !== "failed")
    ) {
      return;
    }

    const eventKey = `${HANDLED_ACTIVITY_PREFIX}:automation:${orchestrationTask.requestId}:${orchestrationTask.status}`;

    if (
      lastAutomationEventKeyRef.current === eventKey ||
      hasHandledKey(eventKey)
    ) {
      return;
    }

    lastAutomationEventKeyRef.current = eventKey;
    markHandledKey(eventKey);

    if (orchestrationTask.status === "succeeded") {
      const topKeyword =
        orchestrationTask.data?.output?.generated_content?.selected_keyword ??
        orchestrationTask.data?.output?.trend_analysis?.results?.[0]
          ?.main_keyword ??
        null;

      dispatch(
        publishActivityEvent({
          domain: "automation",
          status: "success",
          title: copy(
            "Automation run completed",
            "Phiên orchestration đã hoàn tất",
          ),
          description: topKeyword
            ? copy(
                `Result is ready. Top keyword: ${topKeyword}`,
                `Kết quả đã sẵn sàng. Keyword nổi bật: ${topKeyword}`,
              )
            : copy(
                "Result package is ready to review.",
                "Gói kết quả đã sẵn sàng để xem.",
              ),
          route: "/app/automation#latest-orchestration-output",
          requestId: orchestrationTask.requestId,
          prompt: orchestrationTask.prompt,
          createdAt: orchestrationTask.completedAt,
        }),
      );

      return;
    }

    if (orchestrationTask.errorMessage === INTERRUPTED_MESSAGE) {
      return;
    }

    const promptPreview = getPromptPreview(
      orchestrationTask.prompt,
      copy("No prompt", "Không có prompt"),
    );

    dispatch(
      publishActivityEvent({
        domain: "automation",
        status: "error",
        title: copy("Automation run failed", "Phiên orchestration thất bại"),
        description: copy(
          `Prompt: ${promptPreview}`,
          `Prompt: ${promptPreview}`,
        ),
        route: "/app/automation#run-orchestration",
        requestId: orchestrationTask.requestId,
        prompt: orchestrationTask.prompt,
        createdAt: orchestrationTask.completedAt,
      }),
    );
  }, [
    copy,
    dispatch,
    orchestrationTask.completedAt,
    orchestrationTask.data,
    orchestrationTask.errorMessage,
    orchestrationTask.prompt,
    orchestrationTask.requestId,
    orchestrationTask.status,
  ]);

  useEffect(() => {
    if (
      !trendAnalyzeTask.requestId ||
      !trendAnalyzeTask.completedAt ||
      (trendAnalyzeTask.status !== "succeeded" &&
        trendAnalyzeTask.status !== "failed")
    ) {
      return;
    }

    const eventKey = `${HANDLED_ACTIVITY_PREFIX}:strategy:${trendAnalyzeTask.requestId}:${trendAnalyzeTask.status}`;

    if (
      lastStrategyEventKeyRef.current === eventKey ||
      hasHandledKey(eventKey)
    ) {
      return;
    }

    lastStrategyEventKeyRef.current = eventKey;
    markHandledKey(eventKey);

    if (trendAnalyzeTask.status === "succeeded") {
      const topKeyword = trendAnalyzeTask.data?.results?.[0]?.main_keyword;

      dispatch(
        publishActivityEvent({
          domain: "strategy",
          status: "success",
          title: copy(
            "Trend analysis completed",
            "Phân tích trend đã hoàn tất",
          ),
          description: topKeyword
            ? copy(
                `Result is ready. Top trend: ${topKeyword}`,
                `Kết quả đã sẵn sàng. Trend nổi bật: ${topKeyword}`,
              )
            : copy(
                "Prompt result is ready for review.",
                "Kết quả prompt đã sẵn sàng để xem.",
              ),
          route: "/app/strategy#prompt-trend-results",
          requestId: trendAnalyzeTask.requestId,
          prompt: trendAnalyzeTask.prompt,
          createdAt: trendAnalyzeTask.completedAt,
        }),
      );

      return;
    }

    if (trendAnalyzeTask.errorMessage === INTERRUPTED_MESSAGE) {
      return;
    }

    const promptPreview = getPromptPreview(
      trendAnalyzeTask.prompt,
      copy("No prompt", "Không có prompt"),
    );

    dispatch(
      publishActivityEvent({
        domain: "strategy",
        status: "error",
        title: copy("Trend analysis failed", "Phân tích trend thất bại"),
        description: copy(
          `Prompt: ${promptPreview}`,
          `Prompt: ${promptPreview}`,
        ),
        route: "/app/strategy#prompt-trend-studio",
        requestId: trendAnalyzeTask.requestId,
        prompt: trendAnalyzeTask.prompt,
        createdAt: trendAnalyzeTask.completedAt,
      }),
    );
  }, [
    copy,
    dispatch,
    trendAnalyzeTask.completedAt,
    trendAnalyzeTask.data,
    trendAnalyzeTask.errorMessage,
    trendAnalyzeTask.prompt,
    trendAnalyzeTask.requestId,
    trendAnalyzeTask.status,
  ]);

  return null;
}
