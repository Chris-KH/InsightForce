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
import { Badge } from "@/components/ui/badge";
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
  const runStatusLabel = isOrchestrationPending
    ? copy("Running", "Đang chạy")
    : latestOrchestrationResponse
      ? copy("Completed", "Hoàn tất")
      : copy("Idle", "Sẵn sàng");

  const runStatusClassName = isOrchestrationPending
    ? "border-primary/35 bg-primary/10 text-primary"
    : latestOrchestrationResponse
      ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700"
      : "border-border/60 bg-background/70 text-muted-foreground";

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
    <section id="run-orchestration" className="relative scroll-mt-28">
      <PanelCard
        title={copy("Orchestration Workspace", "Không gian điều phối")}
        description={copy(
          "Plan, run, and monitor one full orchestration flow in a single unified workspace.",
          "Lập kế hoạch, chạy và theo dõi toàn bộ phiên orchestration trong một không gian thống nhất.",
        )}
        action={
          <Badge
            variant="outline"
            className={`rounded-full ${runStatusClassName}`}
          >
            {runStatusLabel}
          </Badge>
        }
      >
        <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {copy("Run setup", "Thiết lập chạy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {copy(
                  "Provide prompt context, optional workspace user, and choose whether to save artifacts.",
                  "Nhập bối cảnh prompt, người dùng workspace (tùy chọn) và chọn lưu hay không lưu artifacts.",
                )}
              </p>
            </div>

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
                  className="max-h-72 min-h-32 overflow-y-auto"
                  onChange={(event) =>
                    dispatch(setAutomationPrompt(event.target.value))
                  }
                  placeholder="Write a prompt to run your automation orchestration. For example: 'Analyze the past 30 days of trends for the #gaming niche on TikTok, identify the top 3 emerging trends, and create a content plan for each trend with 3 video ideas.'"
                  rows={10}
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
                  className="rounded-2xl border border-border/60 bg-background/65 px-3 py-3"
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
          </div>

          <div className="space-y-3 rounded-2xl border border-border/60 bg-background/65 p-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {copy("Live reasoning", "Suy luận thời gian thực")}
              </p>
              <p className="text-sm text-muted-foreground">
                {copy(
                  "Track planning, trend synthesis, and content assembly while orchestration is running.",
                  "Theo dõi quá trình lập kế hoạch, tổng hợp trend và dựng nội dung trong lúc orchestration đang chạy.",
                )}
              </p>
            </div>

            <ReasoningTimeline
              isPending={isOrchestrationPending}
              elapsedMs={reasoningElapsedMs}
              mode="orchestrator"
              variant="compact"
              promptPreview={prompt}
              copy={copy}
            />
          </div>
        </div>
      </PanelCard>
    </section>
  );
}
