import { useEffect, useMemo, useState } from "react";

import {
  type TrendAnalysisRecordResponse,
  useTrendHistoryQuery,
  useUsersQuery,
} from "@/api";
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

  const usersQuery = useUsersQuery();
  const trendUserId = usersQuery.data?.users[0]?.id;

  const trendHistoryQuery = useTrendHistoryQuery({
    userId: trendUserId,
    limit: 16,
    enabled: Boolean(trendUserId),
  });

  const isTrendAnalyzePending = trendAnalyzeTask.status === "pending";
  const promptResponse = trendAnalyzeTask.data;

  const historyRecords = useMemo(
    () =>
      [...(trendHistoryQuery.data?.items ?? [])].sort(
        (left, right) =>
          Date.parse(right.created_at) - Date.parse(left.created_at),
      ),
    [trendHistoryQuery.data?.items],
  );

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
    const fromState = trendTopics.find(
      (topic) => topic.keyword === selectedKeyword,
    );
    return fromState ?? trendTopics[0];
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
    if (!selectedKeyword && trendTopics[0]) {
      setSelectedKeyword(trendTopics[0].keyword);
      return;
    }

    if (
      selectedKeyword &&
      !trendTopics.some((topic) => topic.keyword === selectedKeyword)
    ) {
      setSelectedKeyword(trendTopics[0]?.keyword);
    }
  }, [selectedKeyword, trendTopics]);

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
    }
  };

  const submitPrompt = async () => {
    await runTrendScout(promptInput);
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
    setPromptInput,
    submitPrompt,
    runSuggestion: runTrendScout,
    selectKeyword: setSelectedKeyword,
    refreshGeneralTrends: async () => {
      await trendHistoryQuery.refetch();
    },
  };
}
