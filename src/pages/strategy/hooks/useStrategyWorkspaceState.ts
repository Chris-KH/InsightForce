import { useEffect, useMemo, useState } from "react";

import {
  type TrendAnalysisRecordResponse,
  useTrendHistoryQuery,
  useUsersQuery,
} from "@/api";
import { searchTrendHistory } from "@/api/trends.api";
import {
  resetStrategyTrendTask,
  runStrategyTrendAnalyze,
} from "@/app/slices/runtime-tasks.slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  buildSessionSuggestions,
  sanitizeTrendResults,
} from "@/lib/trend-intelligence";

import {
  aiStatusText,
  getDefaultTrendPromptSuggestions,
  loadTrendSessionState,
  toGrowthPercent,
  toSparklineValues,
} from "../components/strategy-workspace.helpers";
import type {
  BilingualCopy,
  TrendSessionState,
  TrendTopic,
} from "../components/strategy-workspace.types";

const TREND_SESSION_STORAGE_KEY_PREFIX = "insightforce.trend.session.v3";
const STRATEGY_STALE_PENDING_MS = 30_000;

type StrategyWorkspaceState = {
  promptInput: string;
  isTrendAnalyzePending: boolean;
  aiStatus: string;
  sessionSuggestions: string[];
  historyRecords: TrendAnalysisRecordResponse[];
  trendTopics: TrendTopic[];
  selectedTopic?: TrendTopic;
  firstError: unknown;
  isGeneralRefreshFetching: boolean;
  isHistorySearchPending: boolean;
  historySearchError: string | null;
  trendSearchError: string | null;
  setPromptInput: (value: string) => void;
  submitPrompt: () => Promise<void>;
  runSuggestion: (suggestion: string) => Promise<void>;
  selectKeyword: (keyword: string) => void;
  refreshGeneralTrends: () => Promise<void>;
};

export function useStrategyWorkspaceState(
  copy: BilingualCopy,
  locale: string,
): StrategyWorkspaceState {
  const dispatch = useAppDispatch();
  const trendAnalyzeTask = useAppSelector(
    (state) => state.runtimeTasks.strategy.trendAnalyze,
  );

  const trendSessionStorageKey = `${TREND_SESSION_STORAGE_KEY_PREFIX}.${locale}`;
  const defaultSuggestions = useMemo(
    () => getDefaultTrendPromptSuggestions(copy),
    [copy],
  );
  const [initialSessionState] = useState<TrendSessionState>(() =>
    loadTrendSessionState(trendSessionStorageKey, defaultSuggestions),
  );

  const [promptInput, setPromptInput] = useState("");
  const [reasoningTick, setReasoningTick] = useState(() => Date.now());
  const [sessionPrompts, setSessionPrompts] = useState<string[]>(
    initialSessionState.prompts,
  );
  const [sessionSuggestions, setSessionSuggestions] = useState<string[]>(
    initialSessionState.suggestions,
  );
  const [selectedKeyword, setSelectedKeyword] = useState<string | undefined>();
  const [historySearchRecords, setHistorySearchRecords] = useState<
    TrendAnalysisRecordResponse[] | null
  >(null);
  const [isHistorySearchPending, setIsHistorySearchPending] = useState(false);
  const [historySearchError, setHistorySearchError] = useState<string | null>(
    null,
  );

  const usersQuery = useUsersQuery();
  const trendUserId = usersQuery.data?.users[0]?.id;

  const trendHistoryQuery = useTrendHistoryQuery({
    userId: trendUserId,
    limit: 16,
    enabled: Boolean(trendUserId),
  });

  const isTrendAnalyzePending = trendAnalyzeTask.status === "pending";
  const promptResponse = trendAnalyzeTask.data;

  const historyRecords = useMemo(() => {
    const records = [
      ...(historySearchRecords ?? trendHistoryQuery.data?.items ?? []),
    ];

    if (promptResponse?.results?.length) {
      const promptAnalysisId = promptResponse.analysis_id ?? null;
      const alreadyIncluded =
        promptAnalysisId &&
        records.some((record) => record.analysis_id === promptAnalysisId);

      if (!alreadyIncluded) {
        const completedAt = trendAnalyzeTask.completedAt;

        if (completedAt) {
          records.unshift({
            ...promptResponse,
            status: "completed",
            user_id: trendUserId ?? null,
            created_at: new Date(completedAt).toISOString(),
          });
        }
      }
    }

    return records.sort(
      (left, right) =>
        Date.parse(right.created_at) - Date.parse(left.created_at),
    );
  }, [
    promptResponse,
    historySearchRecords,
    trendAnalyzeTask.completedAt,
    trendHistoryQuery.data?.items,
    trendUserId,
  ]);

  const latestGeneralTrendRecord = useMemo(
    () => historyRecords.find((record) => record.results.length > 0),
    [historyRecords],
  );

  const sourceResults = useMemo(() => {
    const promptResults = sanitizeTrendResults(promptResponse?.results);
    if (promptResults.length > 0) {
      return promptResults;
    }

    return sanitizeTrendResults(latestGeneralTrendRecord?.results);
  }, [latestGeneralTrendRecord, promptResponse?.results]);

  const trendTopics = useMemo<TrendTopic[]>(() => {
    return sourceResults.slice(0, 8).map((result) => ({
      keyword: result.main_keyword,
      trendScore: result.trend_score,
      growthPercent: toGrowthPercent(result),
      avgViewsPerHour: result.avg_views_per_hour,
      why: result.why_the_trend_happens,
      action: result.recommended_action,
      hashtags: result.top_hashtags,
      sparkline: toSparklineValues(result),
    }));
  }, [sourceResults]);

  const selectedTopic = useMemo(() => {
    return trendTopics.find((topic) => topic.keyword === selectedKeyword);
  }, [selectedKeyword, trendTopics]);

  const reasoningElapsedMs = useMemo(() => {
    if (!trendAnalyzeTask.startedAt) {
      return 0;
    }

    if (isTrendAnalyzePending) {
      return Math.max(0, reasoningTick - trendAnalyzeTask.startedAt);
    }

    const completedAt = trendAnalyzeTask.completedAt ?? reasoningTick;
    return Math.max(0, completedAt - trendAnalyzeTask.startedAt);
  }, [
    isTrendAnalyzePending,
    reasoningTick,
    trendAnalyzeTask.completedAt,
    trendAnalyzeTask.startedAt,
  ]);

  const aiStatus = aiStatusText(
    isTrendAnalyzePending,
    reasoningElapsedMs,
    trendTopics.length,
    Boolean(trendAnalyzeTask.startedAt),
    copy,
  );

  useEffect(() => {
    if (!isTrendAnalyzePending || !trendAnalyzeTask.startedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setReasoningTick(Date.now());
    }, 200);

    return () => window.clearInterval(timer);
  }, [isTrendAnalyzePending, trendAnalyzeTask.startedAt]);

  useEffect(() => {
    if (!isTrendAnalyzePending || !trendAnalyzeTask.startedAt) {
      return;
    }

    const elapsed = Date.now() - trendAnalyzeTask.startedAt;
    if (elapsed < STRATEGY_STALE_PENDING_MS) {
      return;
    }

    dispatch(resetStrategyTrendTask());
  }, [
    dispatch,
    isTrendAnalyzePending,
    reasoningTick,
    trendAnalyzeTask.startedAt,
    trendAnalyzeTask.status,
  ]);

  useEffect(() => {
    const payload: TrendSessionState = {
      sessionId: initialSessionState.sessionId,
      prompts: sessionPrompts,
      suggestions: sessionSuggestions,
    };

    window.localStorage.setItem(
      trendSessionStorageKey,
      JSON.stringify(payload),
    );
  }, [
    initialSessionState.sessionId,
    sessionPrompts,
    sessionSuggestions,
    trendSessionStorageKey,
  ]);

  const runTrendScout = async (rawPrompt: string) => {
    const normalizedPrompt = rawPrompt.trim();
    if (!normalizedPrompt || isTrendAnalyzePending || !trendUserId) {
      return;
    }

    setPromptInput(normalizedPrompt);

    let nextPrompts: string[] = [];
    setSessionPrompts((current) => {
      nextPrompts = [...current, normalizedPrompt].slice(-20);
      return nextPrompts;
    });

    const action = await dispatch(
      runStrategyTrendAnalyze({
        query: normalizedPrompt,
        limit: 5,
        user_id: trendUserId,
      }),
    );

    if (runStrategyTrendAnalyze.fulfilled.match(action)) {
      const normalizedResults = sanitizeTrendResults(action.payload.results);
      setPromptInput("");
      setSessionSuggestions((currentSuggestions) =>
        buildSessionSuggestions(
          nextPrompts,
          normalizedResults,
          currentSuggestions,
          copy,
        ),
      );

      if (normalizedResults[0]) {
        setSelectedKeyword(normalizedResults[0].main_keyword);
      }

      await trendHistoryQuery.refetch();
    }
  };

  const submitPrompt = async () => {
    const normalizedPrompt = promptInput.trim();

    if (!normalizedPrompt || isHistorySearchPending) {
      if (!normalizedPrompt) {
        setHistorySearchRecords(null);
        setHistorySearchError(null);
      }
      return;
    }

    setIsHistorySearchPending(true);
    setHistorySearchError(null);

    try {
      const response = await searchTrendHistory({
        text: normalizedPrompt,
        user_id: trendUserId ?? null,
        limit: 20,
      });

      setHistorySearchRecords(response.items);
    } catch (error) {
      setHistorySearchError(
        error instanceof Error
          ? error.message
          : "Unable to search trend history.",
      );
    } finally {
      setIsHistorySearchPending(false);
    }
  };

  return {
    promptInput,
    isTrendAnalyzePending,
    aiStatus,
    sessionSuggestions,
    historyRecords,
    trendTopics,
    selectedTopic,
    firstError: usersQuery.error ?? trendHistoryQuery.error,
    isGeneralRefreshFetching: trendHistoryQuery.isFetching,
    isHistorySearchPending,
    historySearchError,
    trendSearchError: trendAnalyzeTask.errorMessage,
    setPromptInput,
    submitPrompt,
    runSuggestion: runTrendScout,
    selectKeyword: setSelectedKeyword,
    refreshGeneralTrends: async () => {
      await trendHistoryQuery.refetch();
    },
  };
}
