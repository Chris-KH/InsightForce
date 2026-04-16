import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, PlayCircle } from "lucide-react";

import {
  runAutomationOrchestration,
  setAutomationPrompt,
  setAutomationSaveFiles,
  setAutomationUserId,
} from "@/app/slices/runtime-tasks.slice";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import { ReasoningTimeline } from "@/pages/strategy/components/ReasoningTimeline";

export function AutomationOrchestrationControlSection() {
  const copy = useBilingual();
  const dispatch = useAppDispatch();

  const automationForm = useAppSelector(
    (state) => state.runtimeTasks.automation.form,
  );
  const orchestrationTask = useAppSelector(
    (state) => state.runtimeTasks.automation.orchestration,
  );

  const [reasoningTick, setReasoningTick] = useState(() => Date.now());

  const isOrchestrationPending = orchestrationTask.status === "pending";
  const latestOrchestrationResponse = orchestrationTask.data;

  const prompt = automationForm.prompt;
  const userId = automationForm.userId;
  const saveFiles = automationForm.saveFiles;

  const reasoningElapsedMs = useMemo(() => {
    if (!orchestrationTask.startedAt) {
      return 0;
    }

    if (isOrchestrationPending) {
      return Math.max(0, reasoningTick - orchestrationTask.startedAt);
    }

    const completedAt = orchestrationTask.completedAt ?? reasoningTick;
    return Math.max(0, completedAt - orchestrationTask.startedAt);
  }, [
    isOrchestrationPending,
    orchestrationTask.completedAt,
    orchestrationTask.startedAt,
    reasoningTick,
  ]);

  useEffect(() => {
    if (!isOrchestrationPending || !orchestrationTask.startedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setReasoningTick(Date.now());
    }, 180);

    return () => window.clearInterval(timer);
  }, [isOrchestrationPending, orchestrationTask.startedAt]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || isOrchestrationPending) {
      return;
    }

    await dispatch(
      runAutomationOrchestration({
        prompt: normalizedPrompt,
        saveFiles,
        userId: userId.trim() || undefined,
      }),
    );
  };

  return (
    <section
      id="run-orchestration"
      className="relative grid scroll-mt-28 gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start"
    >
      <div className="xl:sticky xl:top-24">
        <PanelCard
          title={copy("Run Orchestration", "Chạy orchestration")}
          description={copy(
            "Kick off one end-to-end run from prompt to trend and content outputs.",
            "Khởi chạy một phiên end-to-end từ prompt đến đầu ra trend và nội dung.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="automation-prompt">
                {copy("Prompt", "Prompt")}
              </Label>
              <Textarea
                id="automation-prompt"
                value={prompt}
                onChange={(event) =>
                  dispatch(setAutomationPrompt(event.target.value))
                }
                rows={4}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="automation-user-id">
                  {copy(
                    "Workspace User (optional)",
                    "User workspace (tùy chọn)",
                  )}
                </Label>
                <Input
                  id="automation-user-id"
                  value={userId}
                  onChange={(event) =>
                    dispatch(setAutomationUserId(event.target.value))
                  }
                  placeholder={copy("User id", "Mã user")}
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={saveFiles}
                    onChange={(event) =>
                      dispatch(setAutomationSaveFiles(event.target.checked))
                    }
                    className="size-4 rounded border-border"
                  />
                  {copy("Save run files", "Lưu file kết quả")}
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy(
                    "Keep artifacts for later review by the operations team.",
                    "Giữ lại artifacts để đội vận hành xem lại sau.",
                  )}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isOrchestrationPending || !prompt.trim()}
            >
              {isOrchestrationPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <PlayCircle data-icon="inline-start" />
              )}
              {isOrchestrationPending
                ? copy("Running...", "Đang chạy...")
                : copy("Run Automation", "Chạy tự động hóa")}
            </Button>

            {orchestrationTask.errorMessage ? (
              <InlineQueryState
                state="error"
                message={orchestrationTask.errorMessage}
              />
            ) : null}

            {latestOrchestrationResponse ? (
              <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {copy(
                    "Automation run completed",
                    "Phiên tự động hóa đã hoàn tất",
                  )}
                </p>
                <p className="mt-1.5">
                  {copy(
                    "Trend and content outputs were generated successfully.",
                    "Trend và nội dung đã được tạo thành công.",
                  )}
                </p>
              </div>
            ) : null}
          </form>
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Orchestration Reasoning", "Reasoning orchestration")}
        description={copy(
          "Live simulation of planning, trend synthesis, and content assembly while the run is processing.",
          "Mô phỏng trực tiếp quá trình lập kế hoạch, tổng hợp trend và dựng nội dung trong lúc phiên chạy đang xử lý.",
        )}
      >
        <ReasoningTimeline
          isPending={isOrchestrationPending}
          elapsedMs={reasoningElapsedMs}
          mode="orchestrator"
          promptPreview={prompt}
          copy={copy}
        />
      </PanelCard>
    </section>
  );
}
