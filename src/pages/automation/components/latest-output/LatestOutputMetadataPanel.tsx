import type { OrchestratorResponse } from "@/api";
import { PanelCard } from "@/components/app-section";
import { localizeStatus } from "@/lib/localized-status";
import type { NormalizedGeneratedContent } from "@/lib/orchestrator-intelligence";

type CopyFn = (en: string, vi: string) => string;

type LatestOutputMetadataPanelProps = {
  copy: CopyFn;
  latestOrchestrationResponse: OrchestratorResponse;
  latestGeneratedContent: NormalizedGeneratedContent;
};

export function LatestOutputMetadataPanel({
  copy,
  latestOrchestrationResponse,
  latestGeneratedContent,
}: LatestOutputMetadataPanelProps) {
  return (
    <PanelCard
      title={copy("Run Metadata", "Metadata phiên chạy")}
      description={copy(
        "Operational identifiers and artifact pointers returned by backend orchestrator.",
        "Định danh vận hành và đường dẫn artifact được trả về từ backend orchestrator.",
      )}
      contentClassName="pb-4"
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
          <p>
            {copy("Status", "Trạng thái")}:{" "}
            {localizeStatus(latestOrchestrationResponse.status, copy)}
          </p>
          <p className="mt-1">
            {copy("Trend Analysis ID", "ID phân tích xu hướng")}:{" "}
            {latestOrchestrationResponse.trend_analysis_id ?? "--"}
          </p>
          <p className="mt-1">
            {copy("Generated Content ID", "ID nội dung đã tạo")}:{" "}
            {latestOrchestrationResponse.generated_content_id ?? "--"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
          <p>
            {copy("Raw response file", "Tệp phản hồi thô")}:{" "}
            {latestOrchestrationResponse.raw_response_file ?? "--"}
          </p>
          <p className="mt-1">
            {copy("Output file", "Tệp đầu ra")}:{" "}
            {latestOrchestrationResponse.output_file ?? "--"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
          <p>
            {copy("Run duration profile", "Hồ sơ thời lượng")}:{" "}
            {latestGeneratedContent.durationEstimate || "60s"}
          </p>
          <p className="mt-1">
            {copy("Music mood", "Sắc thái nhạc")}:{" "}
            {latestGeneratedContent.musicMood ||
              latestGeneratedContent.musicBackground ||
              "--"}
          </p>
          <p className="mt-1">
            {copy("Captions style", "Phong cách phụ đề")}:{" "}
            {latestGeneratedContent.captionsStyle || "--"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            {copy("Quality signal", "Tín hiệu chất lượng")}
          </p>
          <p className="mt-1">
            {latestGeneratedContent.hasError
              ? copy(
                  "Generated content includes an error marker. Review output before publishing.",
                  "Nội dung được tạo có cờ lỗi. Hãy kiểm tra đầu ra trước khi xuất bản.",
                )
              : copy(
                  "No error marker detected in generated content block.",
                  "Không phát hiện cờ lỗi trong khối nội dung đã tạo.",
                )}
          </p>
        </div>
      </div>
    </PanelCard>
  );
}
