import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import {
  useGeneratedContentsQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import { PanelCard } from "@/components/app-section";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBilingual } from "@/hooks/use-bilingual";

import { PublishWorkspaceAiComposer } from "./publish-workspace/PublishWorkspaceAiComposer";
import { PublishWorkspaceComposer } from "./publish-workspace/PublishWorkspaceComposer";
import { PublishWorkspaceStateSnapshot } from "./publish-workspace/PublishWorkspaceStateSnapshot";
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
    <div className="grid gap-8">
      <PanelCard
        title={copy("Publishing Workspace", "Không gian xuất bản")}
        description={copy(
          "Merged from Publish Ops to keep automation and publishing in one execution flow.",
          "Đã gộp từ Publish Ops để giữ tự động hóa và xuất bản trong một luồng thực thi.",
        )}
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
        className="gap-0"
      >
        <div className="mb-4 rounded-2xl border border-border/60 bg-background/70 p-3">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {copy("Publishing mode", "Chế độ xuất bản")}
          </p>
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
              {copy("AI Auto (Prompt only)", "AI tự động (chỉ prompt)")}
            </ToggleGroupItem>
            <ToggleGroupItem value="manual" className="rounded-full">
              {copy("Manual Form", "Form nhập tay")}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {publishingMode === "ai-auto" ? (
            <PublishWorkspaceAiComposer
              users={users}
              generatedContents={generatedContents}
              onJobCreated={setSelectedJobId}
            />
          ) : (
            <PublishWorkspaceComposer
              users={users}
              generatedContents={generatedContents}
              onJobCreated={setSelectedJobId}
            />
          )}

          <PublishWorkspaceTimeline
            jobs={publishJobs}
            isLoading={publishJobsQuery.isLoading}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
          />
        </div>
      </PanelCard>

      <PublishWorkspaceStateSnapshot jobs={publishJobs} />

      <PanelCard
        title={copy("Operator Suggestions", "Gợi ý vận hành")}
        description={copy(
          "UX enhancements to keep publishing flows fast and low-risk.",
          "Gợi ý UX để giữ luồng xuất bản nhanh và giảm rủi ro thao tác.",
        )}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border/65 bg-background/70 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {copy("Use AI mode first", "Ưu tiên AI mode trước")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {copy(
                "Start with prompt-only publishing, then switch to manual mode only for sensitive metadata edits.",
                "Bắt đầu với chế độ prompt-only, sau đó mới chuyển sang manual khi cần chỉnh metadata nhạy cảm.",
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-border/65 bg-background/70 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {copy("Validate by timeline", "Kiểm tra bằng timeline")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {copy(
                "Confirm status transitions in Publishing Timeline before creating follow-up jobs.",
                "Xác nhận trạng thái trong Publishing Timeline trước khi tạo thêm job tiếp theo.",
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-border/65 bg-background/70 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {copy("Keep reusable drafts", "Giữ draft dùng lại")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {copy(
                "Use Generated Content Shortcuts to reduce repetitive form filling and keep campaigns consistent.",
                "Dùng Generated Content Shortcuts để giảm nhập lặp và giữ chiến dịch nhất quán.",
              )}
            </p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
