import { useCallback } from "react";

import {
  clearAiAutopilotConversation,
  setAiAutopilotDraftPrompt,
  submitAiAutopilotPrompt,
} from "@/app/slices/ai-autopilot-chat.slice";
import { useAppDispatch, useAppSelector } from "@/hooks";

export function useAiAutopilotChat() {
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.aiAutopilotChat);

  const setDraftPrompt = useCallback(
    (value: string) => {
      dispatch(setAiAutopilotDraftPrompt(value));
    },
    [dispatch],
  );

  const submitPrompt = useCallback(
    (prompt: string) => {
      return dispatch(
        submitAiAutopilotPrompt({
          prompt,
          decision: "asking",
        }),
      );
    },
    [dispatch],
  );

  const approvePosting = useCallback(() => {
    return dispatch(
      submitAiAutopilotPrompt({
        prompt: "",
        decision: "approve",
      }),
    );
  }, [dispatch]);

  const rejectPosting = useCallback(() => {
    return dispatch(
      submitAiAutopilotPrompt({
        prompt: "",
        decision: "reject",
      }),
    );
  }, [dispatch]);

  const clearConversation = useCallback(() => {
    dispatch(clearAiAutopilotConversation());
  }, [dispatch]);

  return {
    ...chat,
    isPending: chat.status === "pending",
    canDecide:
      chat.status === "awaiting-approval" || Boolean(chat.activeThreadId),
    setDraftPrompt,
    submitPrompt,
    approvePosting,
    rejectPosting,
    clearConversation,
  };
}
