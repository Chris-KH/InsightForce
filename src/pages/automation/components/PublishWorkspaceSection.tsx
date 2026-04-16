import { useState } from "react";

import {
  useGeneratedContentsQuery,
  useUploadPostPublishJobsQuery,
  useUsersQuery,
} from "@/api";
import { PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";

import { PublishWorkspaceComposer } from "./publish-workspace/PublishWorkspaceComposer";
import { PublishWorkspaceStateSnapshot } from "./publish-workspace/PublishWorkspaceStateSnapshot";
import { PublishWorkspaceTimeline } from "./publish-workspace/PublishWorkspaceTimeline";

export function PublishWorkspaceSection() {
  const copy = useBilingual();

  const usersQuery = useUsersQuery();
  const generatedContentsQuery = useGeneratedContentsQuery({ limit: 20 });
  const publishJobsQuery = useUploadPostPublishJobsQuery({ limit: 30 });

  const [selectedJobId, setSelectedJobId] = useState<string>();

  const users = usersQuery.data?.users ?? [];
  const generatedContents = generatedContentsQuery.data?.items ?? [];
  const publishJobs = publishJobsQuery.data?.items ?? [];

  return (
    <div className="grid gap-8">
      <PanelCard
        title={copy("Publishing Workspace", "Không gian xuất bản")}
        description={copy(
          "Merged from Publish Ops to keep automation and publishing in one execution flow.",
          "Đã gộp từ Publish Ops để giữ tự động hóa và xuất bản trong một luồng thực thi.",
        )}
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
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
      </PanelCard>

      <PublishWorkspaceStateSnapshot jobs={publishJobs} />
    </div>
  );
}
