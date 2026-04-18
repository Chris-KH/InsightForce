import { useEffect, useState } from "react";

import {
  useGeneratedContentsQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBilingual } from "@/hooks/use-bilingual";
import { AutomationHintTooltip } from "@/pages/automation/components/AutomationHintTooltip";
import {
  AutomationPriorityGrid,
  AutomationPriorityItem,
} from "@/pages/automation/components/AutomationPriorityGrid";

import { PublishWorkspaceAiComposer } from "./publish-workspace/PublishWorkspaceAiComposer";
import { PublishWorkspaceComposer } from "./publish-workspace/PublishWorkspaceComposer";
import { PublishWorkspaceTimeline } from "./publish-workspace/PublishWorkspaceTimeline";

type PublishingMode = "ai-auto" | "manual";

const PUBLISHING_MODE_STORAGE_KEY = "insightforce.automation.publishing-mode";

function isPublishingMode(value: string): value is PublishingMode {
  return value === "ai-auto" || value === "manual";
}

function readPersistedPublishingMode(): PublishingMode {
  if (typeof window === "undefined") {
    return "ai-auto";
  }

  const stored = window.localStorage.getItem(PUBLISHING_MODE_STORAGE_KEY);
  return stored && isPublishingMode(stored) ? stored : "ai-auto";
}

export function PublishWorkspaceSection() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });

  const [selectedJobId, setSelectedJobId] = useState<string>();
  const [publishingMode, setPublishingMode] = useState<PublishingMode>(() =>
    readPersistedPublishingMode(),
  );

  const users = usersQuery.data?.users ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];
  const publishJobs = publishJobsQuery.data?.items ?? [];

  useEffect(() => {
    window.localStorage.setItem(PUBLISHING_MODE_STORAGE_KEY, publishingMode);
  }, [publishingMode]);

  return (
    <AutomationPriorityGrid>
      <AutomationPriorityItem priority="high">
        <PanelCard
          title={copy("Publishing Workspace", "Không gian xuất bản")}
          description={copy(
            "Merged from Publish Ops to keep automation and publishing in one execution flow.",
            "Được gộp từ Publish Ops để giữ cho tự động hóa và xuất bản trong một luồng thực thi.",
          )}
          contentClassName="pb-4"
          action={
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/8 text-primary"
            >
              {publishingMode === "ai-auto"
                ? copy("AI Autopilot", "AI tự động")
                : copy("Manual Composer", "Nhập tay")}
            </Badge>
          }
        >
          <div className="mb-3 rounded-2xl border border-border/60 bg-linear-to-r from-primary/8 via-background/80 to-chart-2/10 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {copy("Publishing mode", "Chế độ xuất bản")}
              </p>
              <AutomationHintTooltip
                label={copy(
                  "Choose mode by control level.",
                  "Chọn mode theo mức độ kiểm soát.",
                )}
                hint={copy(
                  "AI mode is faster for campaign drafts. Manual mode is safer when you must fine-tune metadata, schedule, links, and platform mix.",
                  "AI mode phù hợp khi cần tạo draft nhanh. Manual mode an toàn hơn khi phải tinh chỉnh metadata, lịch đăng, liên kết và phối trộn nền tảng.",
                )}
              />
            </div>

            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={publishingMode}
              className="flex-wrap"
              onValueChange={(value) => {
                if (isPublishingMode(value)) {
                  setPublishingMode(value);
                }
              }}
            >
              <ToggleGroupItem value="ai-auto" className="rounded-full">
                {copy(
                  "AI Auto (Prompt only)",
                  "AI tự động (chỉ prompt)",
                )}
              </ToggleGroupItem>
              <ToggleGroupItem value="manual" className="rounded-full">
                {copy("Manual Form", "Form nhập tay")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {publishingMode === "ai-auto" ? (
            <div className="overflow-hidden pt-1">
              <PublishWorkspaceAiComposer />
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] 2xl:grid-cols-[minmax(0,1.34fr)_minmax(0,0.66fr)]">
              <PublishWorkspaceComposer
                users={users}
                generatedContents={generatedContents}
                onJobCreated={setSelectedJobId}
              />

              <PublishWorkspaceTimeline
                jobs={publishJobs}
                isLoading={publishJobsQuery.isLoading}
                selectedJobId={selectedJobId}
                onSelectJob={setSelectedJobId}
              />
            </div>
          )}
        </PanelCard>
      </AutomationPriorityItem>
    </AutomationPriorityGrid>
  );
}
