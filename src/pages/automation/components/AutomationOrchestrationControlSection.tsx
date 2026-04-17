import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Loader2, PlayCircle, SendHorizontal } from "lucide-react";

import {
  runAutomationOrchestration,
  setAutomationPrompt,
  setAutomationSaveFiles,
  setAutomationUserId,
} from "@/app/slices/runtime-tasks.slice";
import { InlineQueryState } from "@/components/app-query-state";
import { PanelCard } from "@/components/app-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useBilingual } from "@/hooks/use-bilingual";
import { ReasoningTimeline } from "@/pages/strategy/components/ReasoningTimeline";

type AutomationOrchestrationControlSectionProps = {
  onOpenPublishing?: () => void;
};

export function AutomationOrchestrationControlSection({
  onOpenPublishing,
}: AutomationOrchestrationControlSectionProps) {
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
          title={copy("Run Orchestration", "Chạy điều phối")}
          description={copy(
            "Kick off one end-to-end run from prompt to trend and content outputs.",
            "Khởi chạy một phiên end-to-end từ yêu cầu đến đầu ra xu hướng và nội dung.",
          )}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <div className="space-y-1.5">
              <Label htmlFor="automation-prompt">
                {copy("Prompt", "Yêu cầu")}
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
                    "Người dùng workspace (tùy chọn)",
                  )}
                </Label>
                <Input
                  id="automation-user-id"
                  value={userId}
                  onChange={(event) =>
                    dispatch(setAutomationUserId(event.target.value))
                  }
                  placeholder={copy("User id", "Mã người dùng")}
                />
              </div>

              <Field
                orientation="horizontal"
                className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3"
              >
                <Checkbox
                  id="automation-save-files"
                  checked={saveFiles}
                  onCheckedChange={(checked) =>
                    dispatch(setAutomationSaveFiles(checked === true))
                  }
                />
                <FieldContent>
                  <FieldLabel
                    htmlFor="automation-save-files"
                    className="font-normal text-foreground"
                  >
                    {copy("Save run files", "Lưu file kết quả")}
                  </FieldLabel>
                  <FieldDescription className="text-xs">
                    {copy(
                      "Keep artifacts for later review by the operations team.",
                      "Giữ lại tệp đầu ra để đội vận hành xem lại sau.",
                    )}
                  </FieldDescription>
                </FieldContent>
              </Field>
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
              <Alert className="border-emerald-500/35 bg-emerald-500/10">
                <AlertTitle>
                  {copy(
                    "Automation run completed",
                    "Phiên tự động hóa đã hoàn tất",
                  )}
                </AlertTitle>
                <AlertDescription>
                  {copy(
                    "Trend and content outputs were generated successfully.",
                    "Trend và nội dung đã được tạo thành công.",
                  )}
                </AlertDescription>
                {onOpenPublishing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={onOpenPublishing}
                  >
                    <SendHorizontal data-icon="inline-start" />
                    {copy("Continue to Publishing", "Chuyển sang Xuất bản")}
                  </Button>
                ) : null}
              </Alert>
            ) : null}
          </form>
        </PanelCard>
      </div>

      <PanelCard
        title={copy("Orchestration Reasoning", "Suy luận điều phối")}
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
